import { Route, Routes } from "react-router-dom";
import WishBook from "./wishBook";
import RequestInfo from "./RequestInfo";
import WishBookDirect from "./WishBookDirect";
import DetailBook from "./DetailBook";


export default function RequestBookMain(){

    return (
        <Routes>
        <Route path="requestBookInfo" element={<RequestInfo/>}/>
        <Route path="wishBook" element={<WishBook/>} />
        <Route path="wishBookDirect" element={<WishBookDirect/>} />
        <Route path="detailBook" element={<DetailBook/>} />
        </Routes>
    )
        
    
}