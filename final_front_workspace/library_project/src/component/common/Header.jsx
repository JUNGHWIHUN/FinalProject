import { use, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import useUserStore from "../../store/useUserStore";

import './header.css'

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
        <>
            <header>
                
                    <div id="simple-search-form-wrap">
                        <form onSubmit={function(e){
                            e.preventDefault(); //기본 submit 이벤트 제어 : 별도의 함수로 분리
                            search();          //검색 함수 호출
                        }}>
                            <label htmlFor='simple-search-criteria'>도서 검색</label>
                            <input type='text' id='simple-search-criteria-input' value={book.titleInfo} onChange={chgValue} placeholder="검색할 도서정보를 입력하세요" />
                            <button type='submit'>🔍</button>
                        </form>
                    </div>
                    
                    <div id='login-menu'>
                        {!isLogined ?
                            <>
                                <Link to='/join'>회원가입</Link> / 
                                <Link to='/login'> 로그인</Link>
                            </>

                            : loginMember.isAdmin === 'T' ?

                                <>
                                    <p>관리자님, 환영합니다</p>
                                    <Link to="/adminPage">관리자페이지</Link>
                                    <button onClick={logout}>로그아웃</button>

                                </>
                                :
                                <>
                                    <p>{loginMember.memberName}님, 환영합니다</p>
                                    <button onClick={logout}>로그아웃</button>
                                </>
                        }
                    </div>

                    <div id='menu-bar'>
                        <Link to='/#'>도서관 소식</Link> // 
                        <Link to='/book/searchDetail'>도서 검색</Link> // 
                        <Link to='/requestBook/requestBookInfo'>희망도서 신청</Link> // 
                        <Link to='/mypage'>마이페이지</Link> // 
                        <Link to='/#'>도서관 소개</Link> // 
                    </div>

                
            </header>
        </>
    )
}