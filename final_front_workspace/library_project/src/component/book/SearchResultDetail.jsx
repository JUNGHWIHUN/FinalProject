import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import BookComment from "./BookComment";
import MyLibraryModal from "./MyLibraryModal";


export default function SearchResultDetail (){

    const param = useParams(); //주소값에서 파라미터 추출
    const callNo = param.callNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER; //백엔드 서버 URL
    const axiosInstance = createInstance();

    // 현재 경로를 가져오기 위해 useLocation 사용 : 예약/서평 작성 경우에 로그인 후 다시 돌아오는 데에 사용하기 위해
    const location = useLocation(); 

    //보여줄 책의 초기값 (빈 객체)
    const [book , setBook] = useState({}); 

    //새로고침용 변수
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    //이 분야 신착도서 / 인기도서 저장할 변수
    const [popularBooks, setPopularBooks] = useState([]); 
    const [newArrivalBooks, setNewArrivalBooks] = useState([]);

    //로그인 회원 정보 (예약, 내 서재 버튼을 위해)
    const {isLogined, loginMember} = useUserStore();

    //페이지 이동을 위한 네비게이트
    const navigate = useNavigate();


    //이하, '내 서재에 등록' 버튼을 눌렀을 때 팝업창 (Modal) 을 띄우기 위해 필요한 변수와 함수들
    //모달 표시 여부 상태 (부모 컴포넌트에서 관리)
    const [isVisible, setIsVisible] = useState(false);

    //'내 서재에 등록' 버튼 클릭 핸들러 (모달을 띄우는 함수)
    const openMyLibraryModal = () => {
        // 로그인 체크
        isLoginedCheck();
        
        setIsVisible(true); // 모달을 띄우는 상태를 true로 설정
    };

    //모달을 닫는 함수
    const closeMyLibraryModal = () => {
        setIsVisible(false); // 모달 닫는 상태로 변경
    };

    //모달 내에서 '확인' 버튼 클릭 시 호출될 함수 : 실제 내 서재에 해당 도서를 등록하는 로직
    const addToMyLibrary = (selectedMyLibrary, callNo) => {

        const postData = { 
            myLibraryNo : selectedMyLibrary, 
            myLibraryCallNo : callNo
        }

        axiosInstance.post(serverUrl + `/myLibrary/addToMyLibrary`, postData)
            .then(function(res){
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg, 
                    icon: res.data.alertIcon, 
                    confirmButtonText: '확인'
                })
            })
            .catch(function(err){

            });

        // 등록 성공/실패 알림 (Swal) 후 모달 닫기
        closeMyLibraryModal(); 
    };


    //화면 렌더링 : 처음, 서평이 업데이트되었을 때, 예약되었을 때
    useEffect(() =>{

        window.scrollTo(0, 0);

        //별도로 분리한 장르 코드 추출 함수
        const genreCode = extractGenreCode(callNo);

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

    //유사 장르 도서 불러오기를 위한 청구기호 첫 2자리 숫자 추출
    function extractGenreCode(callNo) {
        if (!callNo || typeof callNo !== 'string') {
            return ""; //입력값이 없거나 문자열이 아니면 빈 문자열 반환
        }

        //정규표현식: 문자열에서 처음 나오는 2자리 숫자(\d{2})
        //\d는 숫자를 의미하고, {2}는 두 번 반복을 의미
        const match = callNo.match(/\d{2}/); 

        if (match) {
            return match[0]; //매칭된 첫 번째 문자열(두 자리 숫자) 반환
        } else {
            return ""; //2자리 숫자가 발견되지 않으면 빈 문자열 반환
        }
    }

    //로그인 체크 함수
    function isLoginedCheck(){
        if(!isLogined){
            Swal.fire({
                title : '알림',
                text : '로그인이 필요합니다',
                icon : 'warning',
                confirmButtonText : '확인'
                
            })
            navigate('/login', { state: { from: location.pathname } });
        }
    }

    //도서 예약 함수
    function reservation(){

        if(!isLogined){
            Swal.fire({
                title : '알림',
                text : '로그인이 필요합니다',
                icon : 'warning',
                confirmButtonText : '확인'
                
            })
            navigate('/login', { state: { from: location.pathname } });
        }else
            
        Swal.fire({
            title : '알림',
            text : '도서를 예약하시겠습니까?',
            icon : 'warning',
            showCancelButton: true,
            confirmButtonText : '확인',
            cancelButtonText : '취소'
        })
        .then(function(result){
            if (result.isConfirmed) {
                axiosInstance.post(serverUrl + '/reservation/reservateBook', { 
                    reservationMemberNo : loginMember.memberNo,
                    reservationCallNo : callNo
                })
                .then(res => {
                    Swal.fire({
                        title: '알림',
                        text: res.data.clientMsg, 
                        icon: res.data.alertIcon,
                    })
                    setRefreshTrigger();    //화면 새로고침
                })
                .catch(function(err){

                });
            }
        });
    }

    return (
        <section className="section detail-page"> {/* section 태그로 변경 */}
            <div className="detail-page-container"> {/* 전체 컨테이너 추가 */}
                <div className="page-title-area"> {/* 제목 영역 */}
                    <h1 className="page-title">상세정보</h1>
                    <div className="page-title-underline"></div>
                </div>

                {/* 메인 도서 정보 섹션 */}
                <div className="detail-section main-book-info-section"> {/* 새로운 클래스 추가 */}
                    {/* 도서 표지 이미지 */}
                    <div className="book-cover-area"> {/* 이미지 영역 감싸는 div */}
                        <img src={book.imageUrl} className="book-cover-image" alt={book.titleInfo} />
                    </div>
                    
                    {/* 기본 서지 정보 */}
                    <div className="book-meta-info">
                        <h2 className="book-title">{book.titleInfo}</h2>
                        <p className="book-author">저자: {book.authorInfo || '정보 없음'}</p>
                        <p className="book-isbn">ISBN: {book.isbn || '정보 없음'}</p>
                        <p className="book-publisher">발행처: {book.pubInfo || '정보 없음'}</p>
                        <p className="book-pubyear">발행년도: {book.pubYear || '정보 없음'}</p>
                        <p className="book-callno">청구기호: {book.callNo || '정보 없음'}</p> 
                        <p className="book-placeinfo">자료실: {book.placeInfo || '정보 없음'}</p> {/* 자료실 추가 */}

                        {/* '내 서재에 등록' 버튼 : 팝업창 (모달) 띄우기 (SearchResultDetail 컴포넌트 내) */}
                        <button onClick={() => openMyLibraryModal()} className="btn btn-add-mylibrary-detail">내 서재에 등록</button>

                        {/* isVisible 상태가 true일 때만 모달을 렌더링 */}
                        {isVisible && (
                            <MyLibraryModal
                                isVisible={isVisible}        // 모달 표시 여부
                                closeMyLibraryModal={closeMyLibraryModal} // 모달 닫기 함수
                                callNo={book.callNo}         // 모달에 전달할 책 정보
                                addToMyLibrary={addToMyLibrary}    // 모달에서 '등록' 완료 시 호출될 콜백
                            />
                        )}
                    </div>
                </div>

                {/* 소장 정보 섹션 */}
                <div className="detail-section holding-info-section">
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
                                <td className="return-date-cell">
                                    {book.returnDate} {/* 대출중일 때만 반납예정일 표시 */}
                                    {console.log("반납예정일" + book.returnDate)}
                                </td> 
                                <td className="reservation-cell">
                                    {book.canLend === 'L' ? 
                                        <button onClick={reservation} className="btn-reserve">예약하기</button>
                                        : ""
                                    }    
                                </td> 
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* 예약/신청 안내 섹션 */}
                <div className="detail-section guide-section"> {/* 새로운 클래스 추가 */}
                    <h3 className="section-title">예약/신청 안내</h3>
                    <p>도서가 [대출중] 도서이고 도서상태가 [신청가능]일 경우, 예약/신청 [신청하기]로 신청하시기 바랍니다.</p>
                    <p>부득이하게 취소해야 할 경우는 [홈페이지&gt;마이페이지&gt;내서재&gt;신청]에서 취소 가능합니다.</p>
                    <p>※ 미대출로 인한 자동취소가 3회 발생 시, 30일간 도서 예약이 불가합니다.</p>
                </div>

                {/* 보존서고 이용안내 섹션 */}
                <div className="detail-section guide-section"> {/* 새로운 클래스 추가 */}
                    <h3 className="section-title">보존서고 이용안내</h3>
                    <p>소장처가 [보존서고]이고 도서상태가 [신청가능]일 경우, 예약/신청의 [신청하기]로 신청하시기 바랍니다.</p>
                    <p>※ 일반자료실은 평일 18시, 주말 16시까지 이용 가능합니다.</p>
                    <p>※ 보존서고 자료는 대출이 불가하며, 방문하셔서 열람하실 수 있습니다.</p>
                </div>

                {/* 서평란 섹션 : 별도의 컴포넌트로 분리 */}
                <BookComment callNo={callNo} axiosInstance={axiosInstance} serverUrl={serverUrl}/>

                {/* 이 분야의 인기 도서 섹션 */}
                <div className="detail-section related-books-section popular-books">
                    <h3 className="section-title">이 분야의 인기 도서</h3>
                    <div className="book-carousel">
                        {popularBooks.length > 0 ? (
                            popularBooks.map((bookItem, index) => (
                                <SameGenreBooks key={index} book={bookItem} navigate={navigate} /> 
                            ))
                        ) : (
                            <p className="no-related-books">인기 도서 정보가 없습니다.</p>
                        )}
                    </div>
                </div>

                {/* 이 분야의 신착 도서 섹션 */}
                <div className="detail-section related-books-section new-arrivals">
                    <h3 className="section-title">이 분야의 신착 도서</h3>
                    <div className="book-carousel">
                        {newArrivalBooks.length > 0 ? (
                            newArrivalBooks.map((bookItem, index) => (
                                <SameGenreBooks key={index} book={bookItem} navigate={navigate} /> 
                            ))
                        ) : (
                            <p className="no-related-books">신착 도서 정보가 없습니다.</p>
                        )}
                    </div>
                </div>
            </div>
        </section> 
    );
}

//인기도서/신규도서를 출력할 컴포넌트 (변경 없음)
function SameGenreBooks({ book, navigate }) {
    
    //책 표지를 클릭하면 해당 책의 상세 페이지로 이동
    const clickImg = () => {
        navigate('/book/searchResultDetail/' + book.callNo);
    };

    return (
        <div className="book-small-item" onClick={clickImg}>
            <img src={book.imageUrl} className="book-small-cover" alt={book.titleInfo} />
            <div className="book-small-title">
                {book?.titleInfo}
            </div>
        </div>
    );
}