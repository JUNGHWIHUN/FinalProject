import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { Link } from "react-router-dom";
import './Common.css'; // 메인 컴포넌트에서도 Common.css를 사용

//메인(루트 접근 시) 컴포넌트
export default function Main () {
    const navigate = useNavigate(); // useNavigate를 사용하지 않더라도 선언은 유지

    // 추후 추천 도서 등의 상세 페이지로 이동할 때 사용될 수 있습니다.
    // function goToBookDetail(bookId) {
    //     navigate(`/book/detail/${bookId}`);
    // }

    return (
        <main className="main-content"> {/* 메인 콘텐츠의 최상위 래퍼 */}
            <div className="main-container"> {/* 콘텐츠 중앙 정렬을 위한 컨테이너 */}

                {/* 1. 추천 도서 섹션 */}
                <section className="recommended-books-section">
                    <h2 className="section-title">추천 도서</h2>
                    <div className="recommended-books-list">
                        {/* 실제 데이터로 맵핑하여 사용할 예정이지만, 일단 플레이스홀더 이미지로 대체 */}
                        <div className="book-card">
                            <img src="/images/book_placeholder_1.png" alt="추천도서 1" />
                            <p className="book-title">도서명 1</p>
                        </div>
                        <div className="book-card">
                            <img src="/images/book_placeholder_2.png" alt="추천도서 2" />
                            <p className="book-title">도서명 2</p>
                        </div>
                        <div className="book-card">
                            <img src="/images/book_placeholder_3.png" alt="추천도서 3" />
                            <p className="book-title">도서명 3</p>
                        </div>
                        <div className="book-card">
                            <img src="/images/book_placeholder_4.png" alt="추천도서 4" />
                            <p className="book-title">도서명 4</p>
                        </div>
                        <div className="book-card">
                            <img src="/images/book_placeholder_5.png" alt="추천도서 5" />
                            <p className="book-title">도서명 5</p>
                        </div>
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
                        <Link to="/news" className="menu-icon-item">
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
                        {/* 실제 데이터로 맵핑하여 사용할 예정이지만, 일단 플레이스홀더 이미지로 대체 */}
                        <div className="book-card">
                            <img src="/images/bestseller_1.png" alt="베스트셀러 1" />
                            {/* <p className="book-title">도서명 1</p> */} {/* 스크린샷에 제목이 없음 */}
                        </div>
                        <div className="book-card">
                            <img src="/images/bestseller_2.png" alt="베스트셀러 2" />
                        </div>
                        <div className="book-card">
                            <img src="/images/bestseller_3.png" alt="베스트셀러 3" />
                        </div>
                        <div className="book-card">
                            <img src="/images/bestseller_4.png" alt="베스트셀러 4" />
                        </div>
                    </div>
                </section>

                {/* 4. 공지사항 및 진행 중인 캠페인 섹션 */}
                <section className="notice-campaign-section">
                    <div className="notice-board">
                        <h2 className="section-title">공지사항</h2>
                        <ul>
                            <li><Link to="#">'Why?' 미지급자 및 '성' 도서를 포함한 정좌동 책바구니 도착.</Link></li>
                            <li><Link to="#">도서관 운영 및 학사일정 관련 지침 현행화 안내.</Link></li>
                            <li><Link to="#">도서관 이용 수칙 변경 안내.</Link></li>
                            <li><Link to="#">도서관 자원봉사자 모집 안내(상시)</Link></li>
                            <li><Link to="#">중앙광장 열람실 휴실 안내 (2025-07-22)</Link></li>
                        </ul>
                    </div>
                    <div className="campaign-ad">
                        <h2 className="section-title">진행중인 캠페인</h2>
                        {/* 캠페인 이미지, 실제 이미지 경로로 변경 */}
                        <img src="/images/campaign_bookwave.png" alt="진행중인 캠페인 북웨이브" />
                    </div>
                </section>

            </div>
        </main>
    );
}