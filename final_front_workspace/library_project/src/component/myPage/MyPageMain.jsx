import { Route, Routes, useLocation } from "react-router-dom"; // useLocation 임포트 추가
import StatisTics from "./StatisTics";
import Reservation from "./Reservation";
import LentBookList from "./LentBookList";
import LentHistory from "./LentHistory";
import RequestBookList from './RequestBookList';

import { useState, useEffect } from "react"; // useEffect 임포트 추가
import LeftMenu from "../common/LeftMenu";
import MyLibrary from "./MyLibrary";
import MyInfo from "./MyInfo";
import MemberPwChg from "./MemberPwChg";

import './MyPage.css'; // MyPageMain.css 임포트 추가

export default function MyPageMain(){
      const location = useLocation(); // 현재 경로에 접근하기 위해 useLocation 훅 사용
    const [activeMenu, setActiveMenu] = useState("");

    // mypage 메뉴 목록 정의 (정규 표현식 패턴 포함)
    const [menuList, setMenuList] = useState([
        { url: '/mypage/lentBookList', text: "대출 현황", pattern: /^\/mypage\/lentBookList(\/.*)?$/ },
        { url: '/mypage/lentHistory', text: "대출 이력", pattern: /^\/mypage\/lentHistory(\/.*)?$/ },
        { url: '/mypage/reservation', text: "예약 현황", pattern: /^\/mypage\/reservation(\/.*)?$/ },
        { url: '/mypage/myLibrary', text: "내 서재", pattern: /^\/mypage\/myLibrary(\/.*)?$/ },
        { url: '/mypage/statistics', text: "독서 통계", pattern: /^\/mypage\/statistics(\/.*)?$/ },
        { url: '/mypage/requestBookList', text: "희망도서 신청내역", pattern: /^\/mypage\/requestBookList(\/.*)?$/ },
        // '개인정보 수정' 메뉴: mypage/myInfo와 mypage/pwChg 경로 모두에 대해 활성화
        // '|' (OR 연산자)를 사용하여 두 경로 중 하나라도 일치하면 활성화되도록 설정합니다.
        { url: '/mypage/myInfo', text: "개인정보 수정", pattern: /^\/mypage\/(myInfo|pwChg)(\/.*)?$/ }
    ]);

    // 현재 경로에 따라 활성 메뉴를 설정
    useEffect(() => {
        const currentPath = location.pathname;
        console.log("현재 경로:", currentPath);

        // 각 메뉴의 pattern을 사용하여 현재 경로와 일치하는 메뉴를 찾음
        const foundMenu = menuList.find(menu => {
            if (menu.pattern instanceof RegExp) {
                console.log(`메뉴 '${menu.text}'의 패턴:`, menu.pattern);
                return menu.pattern.test(currentPath);
            } else {
                console.error(`오류: '${menu.text}' 메뉴의 패턴이 유효한 정규 표현식이 아닙니다. 타입: ${typeof menu.pattern}, 값:`, menu.pattern);
                return false;
            }
        });

        if (foundMenu) {
            setActiveMenu(foundMenu.text);
            console.log("활성 메뉴 설정됨:", foundMenu.text);
        } else {
            setActiveMenu("");
            console.log("일치하는 메뉴 없음. 활성 메뉴 초기화.");
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