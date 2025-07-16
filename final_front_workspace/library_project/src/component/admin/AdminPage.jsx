import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useLocation } from "react-router-dom";
import axios from "axios";
import AllbookPage from "./AllBookPage";
import AdminMemberPage from "./AdminMemberPage";
import RequestBook from "./RequestBook";
import Suggestion from "./Suggestion";
import ReportList from "./RepoartList";
import { Route, Routes } from 'react-router-dom';

import FixBookDetail from "./FixBookDetail";
import RequestDetail from "./RequestDetail";
import SuggestDetail from "./SuggesDetail";
import LentBookDetail from "./LentBookDetail";
import AdminMemberDetailPage from "./AdminMemberDetailPage";
import LenterBookDetil from "./LenterBookDetil";

import "./Admin.css"; 

export default function AdminPage(){

    //목록 전환용
    const [mode, setMode] = useState("lend");
    const [subMode, setSubMode] = useState("");

    //대출을 위한 책 정보
    const [bookList, setBookList] = useState([]);
    //책 검색 조건
    const [books, setBooks] = useState({ title : "", author : "", isbn : "" });
    //반납을 위한 책 정보
    const [returnBooksList, setreturnBooksList] = useState([]);
    //책 검색 조건
    const [returnBooks, setRetrunBooks] = useState({ callNo : "" });

    //조건 밀어넣기
    function changebookValue(e){
        books[e.target.id] = e.target.value;
        setBooks({...books});
    }

    const navigate = useNavigate();

    //책 검색
    function selectBooks(){
        let options = {
            url:'http://localhost:9999/admin/selectBooks',
            method: 'post',
            data: books
        };

        axios(options)
        .then(function(res){
            if(res.data.resData.length > 0){
                setBookList(res.data.resData);
                navigate("/admin/selectBook", { state: { bookList: res.data.resData } });
            }else{
                alert("검색결과 없음");
                setBookList([]);
            }
        })
        .catch(function(err){
            console.log(err); 
        });
    }

    //조건 밀어넣기
    function changeBookReturn(e){
        returnBooks[e.target.id] = e.target.value;
        setRetrunBooks({...returnBooks});
    }

    //책검색
    function selectReturnBooks(){
        let options = {
            url:'http://localhost:9999/admin/selectRetrunBooks',
            method: 'post',
            data: returnBooks
        };

        axios(options)
        .then(function(res){
            if(res.data.resData.length > 0){
                setreturnBooksList(res.data.resData);
                navigate("/admin/selectReTrunBook", { state: { returnBooksList: res.data.resData } });
            }else{
                alert("검색결과 없음");
                setreturnBooksList([]);
            }
        })
        .catch(function(err){
            console.log(err); 
        });
    }
    const location = useLocation();

    useEffect(() => {
        if (location.state?.mode) {
        setMode(location.state.mode);
        }
    }, [location.state]);   

    return (
        <div className="admin-container">
            <div className="admin-menu">
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("allBook"); }}>도서관리</a>|&nbsp;
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("allMember"); }}> 회원관리</a>|&nbsp;
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("bookRequest"); }}> 희망도서</a>|&nbsp;
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("report"); }}> 신고</a>|&nbsp;
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("lend"); }}> 대출</a>|&nbsp;
                <a href="#" onClick={(e) => { e.preventDefault(); setMode("return"); }}> 반납</a>
            </div>

            {mode === "allBook" && <AllbookPage />}
            {mode === "allMember" && <AdminMemberPage />}
            {mode === "bookRequest" && <RequestBook />}
            {mode === "suggestion" && <Suggestion />}
            {mode === "report" && <ReportList />}   

            {mode === "lend" && (
                <>
                <h3 className="admin-section-title">대출할 도서 검색</h3>
                <p className="admin-form-label">이름:</p>
                <input type="text" id="title" value={books.title} onChange={changebookValue} className="admin-form-input" />
                <p className="admin-form-label">저자:</p>
                <input type="text" id="author" value={books.author} onChange={changebookValue} className="admin-form-input" />
                <p className="admin-form-label">ISBN:</p>
                <input type="text" id="isbn" value={books.isbn} onChange={changebookValue} className="admin-form-input" />
                <button onClick={selectBooks} className="admin-form-btn">검색</button>
                </>
            )}

            {mode === "return" && (
                <>
                <h3 className="admin-section-title">반납할 도서 검색</h3>
                <p className="admin-form-label">청구기호: </p>
                <input type="text" id="callNo" value={returnBooks.callNo} onChange={changeBookReturn} className="admin-form-input" />
                <button onClick={selectReturnBooks} className="admin-form-btn">검색</button>
                </>
            )}
        </div>
    )
}
