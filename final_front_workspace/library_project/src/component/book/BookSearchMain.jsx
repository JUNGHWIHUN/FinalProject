import { Link, Route, Routes } from "react-router-dom";
import SearchDetail from "./SearchDetail";
import SearchResultList from "./SearchResultList";
import SearchResultDetail from "./SearchResultDetail";
import BookComment from "./BookComment";
import './Book.css'

export default function BookSearchMain (){

    return (
        <>
            <Routes>
                <Route path="/searchDetail" element={<SearchDetail />}/>
                <Route path="/searchResultList" element={<SearchResultList />}/>
                <Route path="/searchResultDetail/:callNo" element={<SearchResultDetail />}/>
                <Route path="/commnet" element={<BookComment />}/>
            </Routes>
        </>
    )
}