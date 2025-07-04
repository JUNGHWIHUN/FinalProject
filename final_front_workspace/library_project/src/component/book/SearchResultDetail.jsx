import { use, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import BookComment from "./BookComment";

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

    //화면 렌더링 : 처음, 서평이 업데이트되었을 때, 예약되었을 때
    useEffect(() =>{

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

            {/* 서평란 섹션 : 별도의 컴포넌트로 분리 */}
            <BookComment callNo={callNo} axiosInstance={axiosInstance} serverUrl={serverUrl}/>

            {/* 이 분야의 인기 도서 섹션 */}
            <div className="related-books-section popular-books">
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
            <div className="related-books-section new-arrivals">
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
    );
}

//인기도서/신규도서를 출력할 컴포넌트
function SameGenreBooks({ book, navigate }) {
    
    //책 표지를 클릭하면 해당 책의 상세 페이지로 이동
    const clickImg = () => {
        navigate('/book/searchResultDetail/' + book.callNo);
    };

    return (
        <div className="book-small-item" onClick={clickImg}>
            <img src={book.imageUrl} className="book-small-cover" />
            <div className="book-small-title">
                {book?.titleInfo}
            </div>
            <div className="book-small-author">{book?.authorInfo}</div>
        </div>
    );
}