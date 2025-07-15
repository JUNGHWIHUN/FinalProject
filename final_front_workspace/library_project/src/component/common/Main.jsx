import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { Link } from "react-router-dom";
import './Common.css'; // 메인 컴포넌트에서도 Common.css를 사용
import axios from "axios";
import { useState, useEffect } from "react";
import createInstance from "../../axios/Interceptor";

//메인(루트 접근 시) 컴포넌트
export default function Main () {
    const navigate = useNavigate(); // useNavigate를 사용하지 않더라도 선언은 유지

    // 추후 추천 도서 등의 상세 페이지로 이동할 때 사용될 수 있습니다.
    function goToBookDetail(bookId) {
        navigate(`/book/searchResultDetail/${bookId}`);
    }

    //도서 추천용
    const [recommendedBooks, setRecommendedBooks] = useState([]);
    const [bestsellerBooks, setBestsellerBooks] = useState([]);

    //공지사항 리스트용 state변수
    const [noticeList, setNoticeList] = useState([]);
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/notice/noticeList"
        options.method = "get"

        axiosInstacne(options)
        .then(function(res){
            console.log(res.data.resData);
            setNoticeList(res.data.resData);
        })
        .catch(function(err){
            console.log(err);
        })
    },[])


    useEffect(function(){
        let option = {};
            option.url = 'http://localhost:9999/mainPage/recomendedBook';
            option.method = 'get';
            
        axios(option)
        .then(function(res){
            setRecommendedBooks(res.data.resData.recoList);
            setBestsellerBooks(res.data.resData.bestList);
        })
        .catch(function(err){
            console.log(err); 
        });

        

    },[])

    return (
        <main className="main-content"> {/* 메인 콘텐츠의 최상위 래퍼 */}
            <div className="main-container"> {/* 콘텐츠 중앙 정렬을 위한 컨테이너 */}

                {/* 1. 추천 도서 섹션 */}
                <section className="recommended-books-section">
                    <h2 className="section-title">추천 도서</h2>
                    <div className="recommended-books-list">
                        {recommendedBooks.map(function(book, index) {
                            return (
                            <div className="book-card" key={index} onClick={() => goToBookDetail(book.bookNo)}>
                                <img src={book.imageUrl} alt={book.title} />
                                <p className="book-title">{book.title}</p>
                            </div>
                             );
                        })}


                    
                    </div>
                </section>

                {/* 2. 메인 메뉴 아이콘 섹션 및 도서관 운영 시간 섹션 */}
                <section className="main-features-section">
                    <div className="main-menu-icons">
                        <Link to="/book/searchDetail" className="menu-icon-item">
                            <img src="/icons/icon_book_search.png" alt="도서 검색" />
                            <span>도서 검색</span>
                        </Link>
                        <Link to="/requestBook/requestBookInfo" className="menu-icon-item">
                            <img src="/icons/icon_request_book.png" alt="희망도서 신청" />
                            <span>희망도서 신청</span>
                        </Link>
                        <Link to="/board/notice/list" className="menu-icon-item">
                            <img src="/icons/icon_notice.png" alt="공지사항" />
                            <span>공지사항</span>
                        </Link>
                        <Link to="#" className="menu-icon-item"> {/* 임시 링크 */}
                            <img src="/icons/icon_faq.png" alt="묻고 답하기" />
                            <span>묻고 답하기</span>
                        </Link>
                        <Link to="#" className="menu-icon-item"> {/* 임시 링크 */}
                            <img src="/icons/icon_map.png" alt="찾아오시는 길" />
                            <span>찾아오시는 길</span>
                        </Link>
                    </div>

                    <div className="library-hours-card">
                        <p className="hours-title">도서관 운영시간</p>
                        <p className="hours-day">07월 21일 <span>(월)</span></p>
                        <p className="hours-time">도서관 운영시간 09:00 ~ 18:00</p>
                        <p className="hours-holiday">휴관일 : 07월 22일 <span>(화)</span></p>
                    </div>
                </section>

                {/* 3. 베스트 셀러 섹션 */}
                <section className="bestseller-section">
                    <h2 className="section-title">베스트 셀러</h2>
                    <div className="bestseller-books-list">
                        {bestsellerBooks.slice(0, 4).map(function(book, index) {
                            return (
                                <div className="book-card" key={index} onClick={() => goToBookDetail(book.bookNo)}>
                                <img src={book.imageUrl} alt={book.title} />
                                {/* 제목 출력 여부는 디자인에 따라 추가 가능 */}
                                {/* <p className="book-title">{book.title}</p> */}
                                </div>
                            );
                        })}



                    </div>
                </section>

                {/* 4. 공지사항 및 진행 중인 캠페인 섹션 */}
                <section className="notice-campaign-section">
                    <div className="notice-board">
                        <h2 className="section-title">공지사항</h2>
                        <ul>
                        {noticeList.slice(0, 5).map((notice) => (
                            <li key={notice.boardNo}>
                            <Link to={`/board/notice/view/${notice.boardNo}`}>
                                {notice.boardTitle}
                            </Link>
                            </li>
                        ))}
                        </ul>
                    </div>
                    
                    <div className="campaign-ad">
                        <h2 className="section-title">진행중인 캠페인</h2>
                        <img src="/images/campaign_bookwave.png" alt="진행중인 캠페인 북웨이브" />
                    </div>
                </section>
            </div>
        </main>
    );
}