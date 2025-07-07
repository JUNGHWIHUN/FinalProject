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
    const [reqPage, setReqPage] = useState(1); 
    const [pageInfo, setPageInfo] = useState({});

    function fetchAllBooks(){
         let options = {};
            options.url='http://localhost:9999/admin/allBookList/'+ reqPage;
            options.method = 'get';
            

            axios(options)
            .then(function(res){
              setAllBookList(res.data.resData.bookList)
              setPageInfo(res.data.resData.pageInfo)
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
                    <table border="1">
                        <thead>
                          <tr>
                             <th>책 제목</th>
                               <th>출판사</th>
                              <th>저자</th>
                              <th>청구기호</th>
                              <th>대출 가능 여부</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allBookList.map(function(book, index){
                             //게시글 1개에 대한 JSX를 BoardItem이 return한 JSX로
                             return <BookItem key={"book"+index} book={book}/>
                          })}
                         </tbody>
                  </table>
                   
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

function BookItem(props){
    const book = props.book;


    return(
        <>
        <tr>
            <td>{book.title}</td>
            <td>{book.pub}</td>
            <td>{book.author}</td>
            <td>{book.bookNo}</td>
            <td>{book.canLent}</td>
        </tr>
        </>
    )



}