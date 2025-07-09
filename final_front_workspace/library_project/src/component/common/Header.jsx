import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import useUserStore from "../../store/useUserStore";

import './Common.css'

export default function Header(){

    const {isLogined, setIsLogined, loginMember, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();

    const navigate = useNavigate();

    //로그아웃 Link 클릭 시 동작함수
    function logout(e){
        e.preventDefault();

        setLoginMember(null);
        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);
    }

    //검색도서 객체 초기값 : 이름만 전달
    const [book, setBook] = useState({
        titleInfo : ""
    });

    //검색정보 입력란 onChange 호출 함수
    function chgValue(e){
        setBook({ //단순검색 : 대부분의 정보를 입력값으로 대체함
            ...book,
            titleInfo : e.target.value
        });
    }

    //검색 정보 제출 함수 : navigate 로 이동하며 저장된 book 객체를 함께 전달
    function search (){
        navigate('/book/searchResultList', {state: {searchCriteria : book}}) //searchCriteria : 검색조건/키워드 전달 객체
    }

    return (
        <header>
            <div className="header-top-area">
                <div className="header-logo-search-wrap"> {/* 로고와 검색창을 묶는 새로운 div */}
                    <div className="header-logo">
                        <Link to="/">
                            {/* 실제 로고 이미지 경로로 변경해주세요. 스크린샷에 맞춰 책 아이콘으로 변경할 수도 있습니다. */}
                            <img src="/path/to/your/book-icon.png" alt="책 아이콘" className="book-icon-img" /> {/* 새로운 이미지 클래스 */}
                            <span>KH공감도서관</span>
                        </Link>
                    </div>

                    <div id="simple-search-form-wrap">
                        <form onSubmit={function(e){
                            e.preventDefault();
                            search();
                        }}>
                            {/* '도서 검색' 버튼 추가 */}
                            <button type="button" className="search-text-btn">도서 검색</button> {/* 버튼으로 변경 */}
                            <label htmlFor='simple-search-criteria-input' className="sr-only">검색할 도서정보 입력</label>
                            <input type='text' id='simple-search-criteria-input' value={book.titleInfo} onChange={chgValue} placeholder="검색할 도서정보를 입력하세요" />
                            <button type='submit' className="search-icon-btn">🔍</button>
                        </form>
                    </div>
                </div>

                <div id='login-menu'>
                    {!isLogined ?
                        <>
                            <Link to='/join' className="login-link">회원가입</Link>
                            <span className="divider"> / </span>
                            <Link to='/login' className="login-link">로그인</Link>
                        </>
                        : loginMember && loginMember.isAdmin === 'T' ?
                            <>
                                <p className="welcome-msg">관리자님, 환영합니다</p>
                                <Link to="/adminPage" className="admin-link">관리자페이지</Link>
                                <button onClick={logout} className="logout-btn">로그아웃</button>
                            </>
                            : loginMember ?
                                <>
                                    <p className="welcome-msg">{loginMember.memberName}님, 환영합니다</p>
                                    <button onClick={logout} className="logout-btn">로그아웃</button>
                                </>
                                : null
                    }
                </div>
            </div>

            <div id='main-menu-bar'>
                <Link to='/news' className="main-menu-item">도서관 소식</Link>
                <Link to='/book/searchDetail' className="main-menu-item">도서 검색</Link>
                <Link to='/requestBook/requestBookInfo' className="main-menu-item">희망도서 신청</Link>
                <Link to='/mypage' className="main-menu-item">마이페이지</Link>
                <Link to='/intro' className="main-menu-item">도서관 소개</Link>
            </div>
        </header>
    );
}