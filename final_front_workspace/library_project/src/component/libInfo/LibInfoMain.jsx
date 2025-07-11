import { Route, Routes } from "react-router-dom";
import LibIntroduce from "./LibIntroduce";
import LibUseInfo from "./LibUseInfo";
import LibLocation from "./LibLocation";
import LibRegulation from "./LibRegulation";
import LeftMenu from "../common/LeftMenu";
import { useState } from "react";

export default function LibInfoMain(){
    
    const [menuList, setMenuList] = useState([
            {url : '/libInfo/introduce', text : "도서관 소개"},
            {url : '/libInfo/useInfo', text : "이용안내"},
            {url : '/libInfo/location', text : "오시는 길"},
            {url : '/libInfo/regulation', text : "운영규정"},
        ]);

    return(
    <>
    <LeftMenu menuList = {menuList}/>

       <Routes>
        <Route path="introduce" element={<LibIntroduce />} />
        <Route path="useInfo" element={<LibUseInfo />} />
        <Route path="location" element={<LibLocation />} />
        <Route path="regulation" element={<LibRegulation />} />
       </Routes>

    </>
    )
}