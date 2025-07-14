// src/component/board/BoardMain.jsx
import { Route, Routes, useLocation } from "react-router-dom"; // useLocation 임포트 추가
import { useState, useEffect } from "react"; // useState, useEffect 임포트 추가
import LeftMenu from "../common/LeftMenu"; // LeftMenu 임포트 추가

import "./board.css"; // board.css 임포트 (이 파일에 LeftMenu 스타일 추가 예정)

// Notice 관련 컴포넌트
import NoticeList from "./NoticeList";
import NoticeWrite from "./NoticeWrite";
import NoticeView from './NoticeView';
import NoticeUpdate from './NoticeUpdate';

// Suggestion 관련 컴포넌트
import SuggestionList from "./SuggestionList";
import SuggestionWrite from "./SuggestionWrite";
import SuggestionView from './SuggestionView';

// 게시판 메인
export default function BoardMain(){
    const location = useLocation(); // 현재 경로를 가져오기 위해 useLocation 사용
    const [activeMenu, setActiveMenu] = useState(""); // 활성 메뉴 상태 추가

    // 게시판 메뉴 목록 정의
    const [menuList, setMenuList] = useState([
        { url: '/board/notice/list', text: "공지사항" },
        { url: '/board/suggestion/list', text: "건의사항" }
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
    }, [location.pathname, menuList]); // menuList를 의존성 배열에 추가하여 변경 시 재실행

    return(
        <div className="board-wrapper"> {/* -- 변경 시작: 최상위 클래스 이름 변경 -- */}
            <div className="board-title-section">
                <h1>게시판</h1>
            </div>
            <div className="board-content-wrapper">
                <LeftMenu menuList={menuList} activeMenu={activeMenu}/>
                <div className="board-main-content">
                    <Routes>
                        <Route path="notice/list" element={<NoticeList />}/>
                        <Route path="notice/write" element={<NoticeWrite />}/>
                        <Route path='notice/view/:boardNo' element={<NoticeView />}/>
                        <Route path='notice/update/:boardNo' element={<NoticeUpdate />}/>

                        <Route path="suggestion/list" element={<SuggestionList />}/>
                        <Route path="suggestion/write" element={<SuggestionWrite />}/>
                        <Route path='suggestion/view/:boardNo' element={<SuggestionView />}/>
                    </Routes>
                </div>
            </div>
        </div>
    );
}