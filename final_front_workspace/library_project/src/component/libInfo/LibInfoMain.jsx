import { Route, Routes, useLocation } from "react-router-dom";
import LibIntroduce from "./LibIntroduce";
import LibUseInfo from "./LibUseInfo";
import LibLocation from "./LibLocation";
import LibRegulation from "./LibRegulation";
import LeftMenu from "../common/LeftMenu";
import { useEffect, useState } from "react";
import './LibInfo.css';

export default function LibInfoMain(){
    
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState(""); // 활성 메뉴 상태 추가

    const [menuList, setMenuList] = useState([
            {url : '/libInfo/introduce', text : "도서관 소개"},
            {url : '/libInfo/useInfo', text : "이용안내"},
            {url : '/libInfo/location', text : "오시는 길"},
            {url : '/libInfo/regulation', text : "운영규정"},
        ]);
    
    useEffect(() => {
            const currentPath = location.pathname;
            const foundMenu = menuList.find(menu => currentPath.startsWith(menu.url));
            if (foundMenu) {
                setActiveMenu(foundMenu.text);
            } else {
                setActiveMenu(""); // 일치하는 메뉴가 없으면 초기화
            }
        }, [location.pathname, menuList]);

    return(
    
    <div className="LibInfo-wrapper"> {/* 마이페이지 전체 컨테이너 */}
        <div className="LibInfo-title-section">
            <h1>도서관 소개</h1>
        </div>
        <div className="LibInfo-content-wrapper">
        <LeftMenu menuList = {menuList} activeMenu={activeMenu}/>
            <div className="LibInfo-main-content">
                <Routes>
                    <Route path="introduce" element={<LibIntroduce />} />
                    <Route path="useInfo" element={<LibUseInfo />} />
                    <Route path="location" element={<LibLocation />} />
                    <Route path="regulation" element={<LibRegulation />} />
                </Routes>
            </div>
        </div>
    </div>
    )
}