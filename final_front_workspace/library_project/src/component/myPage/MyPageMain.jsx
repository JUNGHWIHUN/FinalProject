import { Route, Routes, useLocation } from "react-router-dom"; // useLocation 임포트 추가
import StatisTics from "./StatisTics";
import Reservation from "./Reservation";
import LentBookList from "./lentBookList";
import LentHistory from "./LentHistory";
import RequestBookList from './RequestBookList';

import { useState, useEffect } from "react"; // useEffect 임포트 추가
import LeftMenu from "../common/LeftMenu";
import MyLibrary from "./MyLibrary";
import MyInfo from "./MyInfo";
import MemberPwChg from "./MemberPwChg";

import './MyPage.css'; // MyPageMain.css 임포트 추가

export default function MyPageMain(){

    const location = useLocation(); // 현재 경로를 가져오기 위해 useLocation 사용
    const [activeMenu, setActiveMenu] = useState(""); // 활성 메뉴 상태 추가

      const [menuList, setMenuList] = useState([
            {url : '/mypage/lentBookList', text : "대출 현황"},
            {url : '/mypage/lentHistory', text : "대출 이력"},
            {url : '/mypage/reservation', text : "예약 현황"},
            {url : '/mypage/myLibrary', text : "내 서재"},
            {url : '/mypage/statistics', text : "독서 통계"},
            {url : '/mypage/requestBookList', text : "희망도서 신청내역"},
            {url : '/mypage/myInfo', text : "개인정보 수정"}
      ]);
     
    // 현재 경로에 따라 활성 메뉴를 설정
    useEffect(() => {
        const currentPath = location.pathname;
        const foundMenu = menuList.find(menu => currentPath.startsWith(menu.url));
        if (foundMenu) {
            setActiveMenu(foundMenu.text);
        } else {
            setActiveMenu(""); // 일치하는 메뉴가 없으면 초기화
        }
    }, [location.pathname, menuList]);


      return (
            <div className="mypage-wrapper"> {/* 마이페이지 전체 컨테이너 */}
            {/* 마이페이지 제목 영역 (스크린샷에 있는 "마이페이지" 제목) */}
            <div className="mypage-title-section">
                <h1>마이페이지</h1>
            </div>
                  <div className="mypage-content-wrapper"> {/* LeftMenu와 Routes를 감싸는 컨테이너 */}
                        <LeftMenu menuList = {menuList} activeMenu={activeMenu}/> {/* activeMenu prop 전달 */}
                        <div className="mypage-main-content"> {/* Routes가 렌더링될 실제 콘텐츠 영역 */}
                              <Routes>
                                    <Route path="statistics" element={<StatisTics/>}/>
                                    <Route path="reservation" element={<Reservation/>}/>
                                    <Route path="lentBookList" element={<LentBookList/>}/>
                                    <Route path="lentHistory" element={<LentHistory/>}/>
                                    <Route path="requestBookList" element={<RequestBookList/>}/>
                                    <Route path="myinfo" element={<MyInfo/>}/>
                                    <Route path="myLibrary" element={<MyLibrary />}/>
                                    <Route path="pwChg" element={<MemberPwChg/>}/>
                              </Routes>
                        </div>
                  </div>
            </div> 
      )
}