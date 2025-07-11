import { Route, Routes } from "react-router-dom";
import LeftMenu from "../common/LeftMenu";
import NoticeList from "./NoticeList";
import NoticeWrite from "./NoticeWrite";
import { useState } from "react";
import NoticeDetail from "./NoticeDetail";

export default function NoticeMain(){
    
        const [menuList, setMenuList] = useState([
        {url : '/notice/list', text : "공지사항"},
        {url : '/notice/write', text : "건의사항"},
        
        ]);

    return (
        <>
            <LeftMenu menuList = {menuList}/>

            <Routes>
                <Route path = "list/*" element={<NoticeList/>}/>
                <Route path = "write" element={<NoticeWrite/>}/>
                <Route path = "list/noticeDetail/:noticeNo" element={<NoticeDetail/>}/>

            </Routes>
        </>
    )
}