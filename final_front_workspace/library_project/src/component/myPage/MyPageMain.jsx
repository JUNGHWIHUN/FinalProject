import { Route, Routes } from "react-router-dom";
import StatisTics from "./StatisTics";
import Reservation from "./Reservation";
import LentBookList from "./lentBookList";
import LentHistory from "./LentHistory";
import RequestBookList from './RequestBookList';

import { useState } from "react";
import LeftMenu from "../common/LeftMenu";
import MyLibrary from "./MyLibrary";
import MyInfo from "./MyInfo";




export default function MyPageMain(){

    const [menuList, setMenuList] = useState([
        {url : '/mypage/lentBookList', text : "대출"},
        {url : '/mypage/reservation', text : "예약 현황"},
        {url : '/mypage/myLibrary', text : "내 서재"},
        {url : '/mypage/statistics', text : "독서 통계"},
        {url : '/mypage/requestBookList', text : "희망도서 신청내역"},
        {url : '/mypage/myInfo', text : "개인정보 수정"},
        {url : '/mypage/lentHistory', text : "대출 이력"}
        
    ]);
   

    return (

        <>
        <LeftMenu menuList = {menuList}/>
        <Routes>

            <Route path="statistics" element={<StatisTics/>}/>
            <Route path="reservation" element={<Reservation/>}/>
            <Route path="lentBookList" element={<LentBookList/>}/>
            <Route path="lentHistory" element={<LentHistory/>}/>
            <Route path="requestBookList" element={<RequestBookList/>}/>
            <Route path="myinfo" element={<MyInfo/>}/>
            <Route path="myLibrary" element={<MyLibrary />}/>

        </Routes>
        </> 
    )
}