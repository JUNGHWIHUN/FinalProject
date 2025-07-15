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

    // 게시판 메뉴 목록 정의 (정규 표현식 패턴 포함)
    const [menuList, setMenuList] = useState([
        // '공지사항' 메뉴: /board/notice/list 뿐만 아니라 /board/notice/view/1 등 모든 하위 경로 포함
        { url: '/board/notice/list', text: "공지사항", pattern: /^\/board\/notice(\/.*)?$/ },
        // '건의사항' 메뉴: /board/suggestion/list 뿐만 아니라 /board/suggestion/detail 등 모든 하위 경로 포함
        { url: '/board/suggestion/list', text: "건의사항", pattern: /^\/board\/suggestion(\/.*)?$/ }
    ]);

    // 현재 경로에 따라 활성 메뉴를 설정
    useEffect(() => {
        const currentPath = location.pathname;
        console.log("현재 경로:", currentPath); // 디버깅을 위해 현재 경로 출력

        // 각 메뉴의 pattern을 사용하여 현재 경로와 일치하는 메뉴를 찾음
        const foundMenu = menuList.find(menu => {
            // menu.pattern이 정규 표현식 객체인지 확인
            if (menu.pattern instanceof RegExp) {
                console.log(`메뉴 '${menu.text}'의 패턴:`, menu.pattern); // 패턴 확인
                return menu.pattern.test(currentPath); // 현재 경로가 패턴과 일치하는지 테스트
            } else {
                console.error(`오류: '${menu.text}' 메뉴의 패턴이 유효한 정규 표현식이 아닙니다. 타입: ${typeof menu.pattern}, 값:`, menu.pattern);
                return false; // 유효하지 않은 패턴이면 일치하지 않는 것으로 처리
            }
        });

        if (foundMenu) {
            setActiveMenu(foundMenu.text);
            console.log("활성 메뉴 설정됨:", foundMenu.text);
        } else {
            setActiveMenu(""); // 일치하는 메뉴가 없으면 초기화
            console.log("일치하는 메뉴 없음. 활성 메뉴 초기화.");
        }
    }, [location.pathname, menuList]); // location.pathname 또는 menuList가 변경될 때마다 실행

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