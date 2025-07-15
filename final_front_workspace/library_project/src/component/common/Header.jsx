import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import useUserStore from "../../store/useUserStore";

import './Common.css'

import Swal from "sweetalert2";

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

        navigate("/");      //로그아웃 후 메인페이지로 이동
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
        if(book.titleInfo == ""){
            Swal.fire({
                title: '알림',
                text: '검색어를 입력하세요', 
                icon: 'warning', 
                confirmButtonText: '확인'
            })
        }else{
            navigate('/book/searchResultList', {state: {searchCriteria : book}}) //searchCriteria : 검색조건/키워드 전달 객체
        }
    }

    return (
        <header>
            <div className="header-top-area">
                <div className="header-logo-search-wrap">
                    <div className="header-logo">
                        <Link to="/">
                            <img src="src/image/final_logo.png" alt="책 아이콘" className="book-icon-img" />
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
                            <button type='submit' className="search-icon-btn">
                                <i className="material-icons">search</i>
                            </button>
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
                <Link to='/board/notice/list' className="main-menu-item">도서관 소식</Link>
                <Link to='/book/searchDetail' className="main-menu-item">도서 검색</Link>
                <Link to='/requestBook/requestBookInfo' className="main-menu-item">희망도서 신청</Link>
                <Link 
                    to={isLogined ? '/mypage/lentBookList' : '#'} 
                    onClick={(e) => {
                        if (!isLogined) {
                            e.preventDefault(); // 기본 이동 막기
                            Swal.fire({
                                title : '알림',
                                text : '로그인이 필요합니다',
                                icon : 'warning',
                                confirmButtonText : '확인'
                            })
                            navigate("/login");
                        }
                    }} 
                    className="main-menu-item"
                    >
                    마이페이지
                    </Link>
                <Link to='/libInfo/introduce' className="main-menu-item">도서관 소개</Link>
            </div>
        </header>
    );
}