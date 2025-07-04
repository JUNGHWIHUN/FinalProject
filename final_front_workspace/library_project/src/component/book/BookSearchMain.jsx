import { Link, Route, Routes } from "react-router-dom";
import SearchDetail from "./SearchDetail";
import SearchResultList from "./SearchResultList";
import SearchResultDetail from "./SearchResultDetail";


export default function BookSearchMain (){

    return (
        <>
            <Link to='/book/searchDetail'>상세검색 페이지</Link>

            <Routes>
                <Route path="/searchDetail" element={<SearchDetail />}/>
                <Route path="/searchResultList" element={<SearchResultList />}/>
                <Route path="/searchResultDetail/:callNo" element={<SearchResultDetail />}/>
            </Routes>
        </>
    )
}