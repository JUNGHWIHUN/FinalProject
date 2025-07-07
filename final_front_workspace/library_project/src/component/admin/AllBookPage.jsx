import { useState } from "react";
import axios from "axios";

export default function AllbookPage(){

    
     // 도서 목록, 대출 목록 전환
    const [subMode, setSubMode] = useState("bookList");

    // 도서 목록
    const [allBookList, setAllBookList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    // 대출 목록
    const [lendBookList, setLendBookList] = useState([]);
    const [lendTotalCount, setLendTotalCount] = useState(0);

    // 페이지 정보
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    function fetchAllBooks(){
         let options = {};
            options.url='http://localhost:9999/admin/allBookList';
            options.method = 'post';
            options.data = returnBooks;

            axios(options)
            .then(function(res){
               if(res.data.resData > 0){
                setAllBookList(res.data.books);
                setTotalCount(res.data.totalCount);
                setCurrentPage(page);
               }
            })
            .catch(function(err){
            console.log(err); 
            });
    }

    return(
             <>
            <h3>도서 관리</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); setSubMode("bookList"); fetchAllBooks(1); }}>도서 목록</a> |
            <a href="#" onClick={(e) => { e.preventDefault(); setSubMode("lendList"); fetchLendBooks(1); }}>대출 목록</a>

            {subMode === "bookList" && (
                <>
                    <h4>전체 도서 목록</h4>
                    {allBookList.length > 0 ? (
                        <>
                            <ul>
                                {allBookList.map((book, index) => (
                                    <li key={index}>{book.title} / {book.author} / {book.pub} / {book.bookNo} / {book.canLent}</li>
                                ))}
                            </ul>
                            {renderPagination(totalCount, fetchAllBooks)}
                        </>
                    ) : <p>목록이 없습니다.</p>}
                </>
            )}

            {subMode === "lendList" && (
                <>
                    <h4>대출된 도서 목록</h4>
                    {lendBookList.length > 0 ? (
                        <>
                            <ul>
                                {lendBookList.map((book, index) => (
                                    <li key={index}>{book.title} / {book.author} / {book.isbn}</li>
                                ))}
                            </ul>
                            {renderPagination(lendTotalCount, fetchLendBooks)}
                        </>
                    ) : <p>목록이 없습니다.</p>}
                </>
            )}
        </>
    
    )
}