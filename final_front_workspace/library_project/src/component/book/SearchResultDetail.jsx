import { use, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import PageNavi from "../common/PageNavi";

export default function SearchResultDetail (){

    const param = useParams(); //주소값에서 파라미터 추출
    const callNo = param.callNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER; //백엔드 서버 URL
    const axiosInstance = createInstance();

    // 현재 경로를 가져오기 위해 useLocation 사용 : 예약/서평 작성 경우에 로그인 후 다시 돌아오는 데에 사용하기 위해
    const location = useLocation(); 

    //보여줄 책의 초기값 (빈 객체)
    const [book , setBook] = useState({}); 

    //서평 작성, 내 서재에 등록 시 새로고침할 변수
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    //한줄서평 작성값을 저장할 변수
    const [commentInputValues, setCommentInputValues] = useState({
        commentContent : "",
        memberId : "",
        callNo : callNo
    });

    //이 분야 신착도서 / 인기도서 저장할 변수
    const [popularBooks, setPopularBooks] = useState([]); 
    const [newArrivalBooks, setNewArrivalBooks] = useState([]);

    //로그인 회원 정보 (예약, 내 서재 버튼을 위해)
    const {isLogined, loginMember} = useUserStore();

    //페이지 이동을 위한 네비게이트
    const navigate = useNavigate();

    //화면 렌더링 : 처음, 서평이 업데이트되었을 때, 예약되었을 때
    useEffect(() =>{

        // 현재 책의 callNo에서 분야 코드 추출 (앞 2자리)
        // callNo가 '381.75-24-15' 라면 '38'을 추출
        const genreCode = callNo.substring(0, 2); 
        if (genreCode.length !== 2 || isNaN(parseInt(genreCode))) { // 유효한 2자리 숫자가 아니면
                console.warn("유효하지 않은 분야 코드:", genreCode);
                // 또는 적절히 처리 (예: 기본 분야 코드 사용 또는 관련 도서 로드 안함)
        }

        //Promise.all을 사용하여 모든 비동기 작업을 병렬로 처리
        Promise.all([
            axiosInstance.get(serverUrl + '/book/bookDetail/'+ callNo), //책 상세 정보
            axiosInstance.get(serverUrl + '/book/popular/' + genreCode), //인기 도서
            axiosInstance.get(serverUrl + '/book/newArrivals/' + genreCode) //신착 도서
        ])
        .then(function(allResponsesArray){  //모든 응답을 받을 배열 

            //배열에서 각각의 응답을 추출
            const bookRes = allResponsesArray[0];
            const popularRes = allResponsesArray[1];
            const newArrivalsRes = allResponsesArray[2];

            //select 한 도서 상세정보를 저장
            setBook(bookRes.data.resData);
            //인기도서 저장
            setPopularBooks(popularRes.data.resData);
            //신착도서 저장
            setNewArrivalBooks(newArrivalsRes.data.resData);
        })
        
    },[refreshTrigger])

    //서평 입력값 업데이트 함수
    function commentInput(e){
        commentInputValues[e.target.id] = e.target.value;
        commentInputValues.memberId = loginMember.memberId;
        setCommentInputValues({...commentInputValues});
    }

    //서평 작성 후 전송
    function commentSubmit(){

        //서평 입력칸이 비었을 때 (공백 포함)
        if (commentInputValues.commentContent.trim() === "") { 
            Swal.fire({
                title: '알림',
                text: '서평 내용을 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        //서평 내용 전송 후 결과값 받아오기
        axiosInstance.post(serverUrl + '/book/insertComment', commentInputValues)
        .then(function(res){
            console.log(res.data.resData);
            Swal.fire({
                title: '알림',
                text: res.data.clientMsg,
                icon: res.data.alertIcon,
                confirmButtonText: '확인'
            });

            setRefreshTrigger(prev => prev + 1); //화면 새로고침
            setCommentInputValues({commentContent : ""});   //입력값 초기화
        })
        .catch(function(err){

        })
    }

    //로그인 체크 함수
    function isLoginedCheck(){
        if(!isLogined){
            Swal.fire({
                tite : '알림',
                text : '로그인이 필요합니다',
                icon : 'warning',
                confirmButtonText : '확인'
            })
            navigate('/login', { state: { from: location.pathname } });
        }
    }


    return (
        <div className="detail-page-wrap">
            <h1 className="page-title">상세정보</h1>

            {/* 메인 도서 정보 섹션 */}
            <div className="main-book-info" style={{display : 'flex'}}>
                {/* 도서 표지 이미지 */}
                <div className="book-cover">
                    <img src={book.imageUrl} className="book-cover-image" />
                </div>
                
                {/* 기본 서지 정보 */}
                <div className="book-meta-info">
                    <h2 className="book-title">{book.titleInfo}</h2>
                    <p className="book-author">저자: {book.authorInfo || '정보 없음'}</p>
                    <p className="book-isbn">ISBN: {book.isbn || '정보 없음'}</p>
                    <p className="book-publisher">발행처: {book.pubInfo || '정보 없음'}</p>
                    <p className="book-pubyear">발행년도: {book.pubYear || '정보 없음'}</p>
                    <p className="book-callno">청구기호: {book.callNo || '정보 없음'}</p>                    
                    <div className="book-actions">
                        <button className="btn btn-add-mylibrary">내 서재에 등록</button>
                    </div>
                </div>
            </div>

            {/* 소장 정보 섹션 */}
            <div className="holding-info-section">
                <h3 className="section-title">소장정보</h3>
                <table className="holding-table">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>청구기호</th>
                            <th>도서상태</th>
                            <th>반납예정일</th>
                            <th>예약/신청</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1.</td>
                            <td>{book.callNo || '정보 없음'}</td>
                            <td>
                                {book.canLend === 'T' ? '대출가능'
                                : book.canLend === 'R' ? '예약중'
                                : book.canLend === 'L' ? '대출중'
                                : '대출불가'}
                            </td>
                            <td className="return-date-cell">-</td> 
                            <td className="reservation-cell">예약가능</td> 
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* 예약/신청 안내 섹션 */}
            <div className="reservation-guide-section">
                <h3 className="section-title">예약/신청 안내</h3>
                <p>도서가 [대출중] 도서이고 도서상태가 [신청가능]일 경우, 예약/신청 [신청하기]로 신청하시기 바랍니다.</p>
                <p>부득이하게 취소해야 할 경우는 [홈페이지&gt;마이페이지&gt;내서재&gt;신청]에서 취소 가능합니다.</p>
                <p>※ 미대출로 인한 자동취소가 3회 발생 시, 30일간 도서 예약이 불가합니다.</p>
            </div>

            {/* 보존서고 이용안내 섹션 */}
            <div className="reservation-guide-section">
                <h3 className="section-title">보존서고 이용안내</h3>
                <p>소장처가 [보존서고]이고 도서상태가 [신청가능]일 경우, 예약/신청의 [신청하기]로 신청하시기 바랍니다.</p>
                <p>※ 일반자료실은 평일 18시, 주말 16시까지 이용 가능합니다.</p>
                <p>※ 보존서고 자료는 대출이 불가하며, 방문하셔서 열람하실 수 있습니다.</p>
            </div>

            {/* 자유로운 한줄평 섹션 */}
            <div className="comment-section">
                <h3 className="section-title">한줄 서평</h3>
                <form onSubmit={function(e){
                  e.preventDefault(); //기본 submit 이벤트 제어 : 별도의 함수로 분리
                   commentSubmit();          //등록 함수 호출
                }}>
                    <div className="comment-input-area">
                        <textarea type="text" placeholder="비방, 욕설, 인신공격성 글은 삭제 처리될 수 있습니다." id='commentContent' className="comment-content" 
                        value={commentInputValues.commentContent} onFocus={isLoginedCheck} onChange={commentInput}
                        style={{width : '500px', height : '30px'}} maxLength={100}/>
                        <button type='submit'className="btn-comment-submit">등록</button>
                    </div>
                </form>

                {/* 서평 출력란을 별도의 컴포넌트로 분리 */}
                <CommentList 
                    callNo={callNo} 
                    refreshTrigger={refreshTrigger} 
                    setRefreshTrigger={setRefreshTrigger}
                    axiosInstance={axiosInstance} 
                    serverUrl={serverUrl}
                />

            </div>

            {/* 이 분야의 인기 도서 섹션 */}
            <div className="related-books-section popular-books">
                <h3 className="section-title">이 분야의 인기 도서</h3>
                <div className="book-carousel">
                    {popularBooks.length > 0 ? (
                        popularBooks.map((bookItem, index) => (
                            <BookSmallItem key={index} book={bookItem} navigate={navigate} serverUrl={serverUrl} /> 
                        ))
                    ) : (
                        <p className="no-related-books">인기 도서 정보가 없습니다.</p>
                    )}
                </div>
            </div>

            {/* 이 분야의 신착 도서 섹션 */}
            <div className="related-books-section new-arrivals">
                <h3 className="section-title">이 분야의 신착 도서</h3>
                <div className="book-carousel">
                    {newArrivalBooks.length > 0 ? (
                        newArrivalBooks.map((bookItem, index) => (
                            <BookSmallItem key={index} book={bookItem} navigate={navigate} serverUrl={serverUrl} /> 
                        ))
                    ) : (
                        <p className="no-related-books">신착 도서 정보가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

//commentList를 관리하는 컴포넌트 : 페이지네이션과 함께 출력
function CommentList({ callNo, refreshTrigger, setRefreshTrigger, axiosInstance, serverUrl }){
    const [comments, setComments] = useState([]); //이 컴포넌트에서 관리할 서평 목록
    const [reqPage, setReqPage] = useState(1); //서평 페이지네이션 현재 페이지
    const [pageInfo, setPageInfo] = useState({}); //서평 페이지네이션 정보

    //callNo, currentPage, refreshTrigger 변경 시 서평 목록 조회
    useEffect(() => {
        if (!callNo) {
            setComments([]);
            setPageInfo({});
            return;
        }

        //서평 목록을 가져오는 백엔드 API 호출 : callNo 와 reqPage 를 파라미터로 받고, 서평 목록과 페이지 정보를 반환
        axiosInstance.post(serverUrl + '/book/commentList', { callNo: callNo, reqPage: reqPage })
        .then(function(res){
            if (res.data && res.data.resData && Array.isArray(res.data.resData.commentList)) {
                setComments(res.data.resData.commentList);
                setPageInfo(res.data.resData.pageInfo);
            } else {
                console.warn("CommentList: 서평 목록 데이터가 배열이 아니거나 없음", res.data);
                setComments([]);
                setPageInfo({});
            }
        })
        .catch(function(err){
            console.error("CommentList: 서평 목록 가져오는 중 오류:", err);
            setComments([]);
            setPageInfo({});
        });

    }, [callNo, reqPage, refreshTrigger, axiosInstance, serverUrl]); // 의존성 배열

    return (
        <>
            <div className="comment-list">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div className="comment-item" key={'comment'+index}> 
                            <p className="comment-content">
                                {comment.commentContent}: <span className="comment-meta">{comment.memberId} 작성일: {comment.commentDate}</span>
                            </p>
                            <div className="comment-actions">
                                <button className="btn btn-update-comment">수정</button>
                                <button className="btn btn-report-comment">신고</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments-message">아직 등록된 서평이 없습니다.</p>
                )}
            </div>

            {/* 페이지네이션 (CommentList 내부에서 관리) */}
            <div className="comment-pagination">
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </>
    );
}

//인기도서/신규도서를 출력할 컴포넌트
function BookSmallItem({ book, navigate, serverUrl }) {
    const handleClick = () => {
        
        // 작은 카드를 클릭하면 해당 책의 상세 페이지로 이동
        if (book && book.callNo) {
            navigate('/book/searchResultDetail/' + book.callNo);
        } else {
            console.warn("이 책은 callNo가 없거나 book 객체가 유효하지 않습니다:", book);
            alert("이 책은 상세 정보가 없습니다.");
        }
    };

    return (
        <div className="book-small-item" onClick={handleClick}>
            <img 
                src={book && book.imageUrl ? `${serverUrl}${book.imageUrl}` : '/path/to/default/small_cover.png'} 
                alt={book && book.titleInfo ? book.titleInfo : '책 표지'} 
                className="book-small-cover"
            />
            <div className="book-small-title">
                {book?.titleInfo}
            </div>
            <div className="book-small-author">{book?.authorInfo}</div>
        </div>
    );
}