// src/component/board/BoardMain.jsx
import { Route, Routes } from "react-router-dom";
import "./board.css"; 

// Notice 관련 컴포넌트 (이름 변경 및 수정 완료)
import NoticeList from "./NoticeList";
import NoticeWrite from "./NoticeWrite";
import NoticeView from './NoticeView';
import NoticeUpdate from './NoticeUpdate';

// Suggestion 관련 컴포넌트 (새로 생성 완료)
import SuggestionList from "./SuggestionList"; 
import SuggestionWrite from "./SuggestionWrite";
import SuggestionView from './SuggestionView';

// 게시판 메인
export default function BoardMain(){
    return(
        <Routes>
            {/* 공지사항 게시판 라우팅 (상대 경로로 변경) */}
            <Route path="notice/list" element={<NoticeList />}/>
            <Route path="notice/write" element={<NoticeWrite />}/>
            <Route path='notice/view/:boardNo' element={<NoticeView />}/>
            <Route path='notice/update/:boardNo' element={<NoticeUpdate />}/>

            {/* 건의사항 게시판 라우팅 (상대 경로로 변경) */}
            <Route path="suggestion/list" element={<SuggestionList />}/>
            <Route path="suggestion/write" element={<SuggestionWrite />}/>
            <Route path='suggestion/view/:boardNo' element={<SuggestionView />}/>
        </Routes>
    );
}