import { Route, Routes } from "react-router-dom";
import StatisTics from "./StatisTics";
import Scrap from "./Scrap";
import Reservation from "./Reservation";
import LentBookList from "./lentBookList";
import LentHistory from "./LentHistory";
import RequestBook from "./RequestBook";
import MyInfo from "./Myinfo";



export default function MyPageMain(){


   

    return (
        <>
        <Routes>
        <Route path="statistics" element={<StatisTics/>}/>
        <Route path="scrap" element={<Scrap/>}/>
        <Route path="reservation" element={<Reservation/>}/>
        <Route path="lentBookList" element={<LentBookList/>}/>
        <Route path="lentHistory" element={<LentHistory/>}/>
        <Route path="requestBook" element={<RequestBook/>}/>
        <Route path="myinfo" element={<MyInfo/>}/>
        </Routes>
        </> 
    )
}