import { Route, Routes } from "react-router-dom";
import StatisTics from "./StatisTics";
import Reservation from "./Reservation";
import LentBookList from "./lentBookList";
import LentHistory from "./LentHistory";
import RequestBook from "./RequestBook";
import MyInfo from "./Myinfo";
import { useState } from "react";
import LeftMenu from "../common/LeftMenu";
import MyLibrary from "./MyLibrary";




export default function MyPageMain(){

    const [menuList, setMenuList] = useState([
        {url : '/mypage/lentBookList', text : "대출"},
        {url : '/mypage/reservation', text : "예약 현황"},
        {url : '/mypage/myLibrary', text : "내 서재"},
        {url : '/mypage/statistics', text : "독서 통계"},
        {url : '/mypage/requestBook', text : "희망도서 신청내역"},
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
            <Route path="requestBook" element={<RequestBook/>}/>
            <Route path="myinfo" element={<MyInfo/>}/>
            <Route path="myLibrary" element={<MyLibrary />}/>

        </Routes>
        </> 
    )
}