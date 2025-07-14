import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageNaviNew from './PageNaviNew';
import "./Admin.css";

export default function AllbookPage(){

     // 도서 목록, 대출 목록 전환
    const [subMode, setSubMode] = useState("bookList");
    const navigate = useNavigate();

    // 도서 목록
    const [allBookList, setAllBookList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    // 대출 목록
    const [lendBookList, setLendBookList] = useState([]);
    const [lendTotalCount, setLendTotalCount] = useState(0);

    // 페이지 정보
    const [reqPage, setReqPage] = useState(1); 
    const [pageInfo, setPageInfo] = useState({});

    //검색설정.
    const [filterType, setFilterType] = useState("title");
    const [keyword, setKeyword] = useState("");

    function fetchAllBooks(page = reqPage){
         let options = {};
            options.url='http://localhost:9999/admin/allBookList/'+ reqPage;
            options.method = 'get';
            options.params = {type : filterType, keyword : keyword};

            axios(options)
            .then(function(res){
              setAllBookList(res.data.resData.bookList)
              setPageInfo(res.data.resData.pageInfo)
              setReqPage(page);
            })
            .catch(function(err){
            console.log(err); 
            });
    }

    function fetchLendBooks(page = reqPage){
        let options = {};
            options.url='http://localhost:9999/admin/allLendBookList/'+ reqPage;
            options.method = 'get';
            options.params = {type : filterType, keyword : keyword};

            axios(options)
            .then(function(res){
              setLendBookList(res.data.resData.bookList)
              setPageInfo(res.data.resData.pageInfo)
              setReqPage(page);
            })
            .catch(function(err){
            console.log(err); 
            });
    }

   useEffect(function(){
      fetchAllBooks();
    }, []);

    function keywordType(e){
      setFilterType(e.target.value);
    }

    function keywordSetting(e){
      setKeyword(e.target.value);
    }

    function newbooks(){
      navigate("/admin/newBook");
    }

    useEffect(function(){
    if(subMode === "bookList") {
        fetchAllBooks(reqPage);
    } else if(subMode === "lendList") {
        fetchLendBooks(reqPage);
    }
  }, [reqPage, subMode]);
    

    return(
             <>
            <h3 className="admin-title">도서 관리</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); setSubMode("bookList"); fetchAllBooks(1); }} className="admin-nav-link">도서 목록</a> |
            <a href="#" onClick={(e) => { e.preventDefault(); setSubMode("lendList"); fetchLendBooks(1); }} className="admin-nav-link">대출 목록</a>

            {subMode === "bookList" && (
                <>
                <h4 className="admin-subtitle">전체 도서 목록</h4>
                <div className="admin-search-bar">
                    <select value={filterType} onChange={keywordType} className="admin-select">
                        <option value="title">제목</option>
                        <option value="publisher">출판사</option>
                        <option value="author">저작자</option>
                    </select>
                    <input type="text" id="title" onChange={keywordSetting} className="admin-input" /> 
                    <button onClick={function() { fetchAllBooks(1); }} className="admin-btn">검색하기</button>
                    <button onClick={newbooks} className="admin-btn">도서등록</button>
                </div>
                <table className="admin-table" border="1">
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
                            return <BookItem key={"book"+index} book={book}/>
                        })}
                    </tbody>
                </table>
                <div className="admin-pagination">
                    <PageNaviNew pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage}></PageNaviNew>
                </div>
                </>
            )}

            {subMode === "lendList" && (
                <>
                <h4 className="admin-subtitle">대출중 도서 목록</h4>
                <div className="admin-search-bar">
                    <select value={filterType} onChange={keywordType} className="admin-select">
                        <option value="title">제목</option>
                        <option value="publisher">출판사</option>
                        <option value="memberName">대출자</option>
                    </select>
                    <input type="text" id="title" onChange={keywordSetting} className="admin-input" /> 
                    <button onClick={function() { fetchLendBooks(1); }} className="admin-btn">검색하기</button>
                </div>
                <table className="admin-table" border="1">
                    <thead>
                        <tr>
                            <th>책 제목</th>
                            <th>예약여부</th>
                            <th>대출자</th>
                            <th>청구기호</th>
                            <th>반납예정일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lendBookList.map(function(book, index){
                            return <LendBookItem key={"book"+index} book={book}/>
                        })}
                    </tbody>
                </table>
                <div className="admin-pagination">
                    <PageNaviNew pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage}></PageNaviNew>
                </div>
                </>
            )}
        </>
    )
}

function BookItem(props){
    const book = props.book;
    const callNo = book.bookNo;

    const [bookDetails, setBookDetails] = useState();
    const navigate = useNavigate();

    function LentBookDetail(e){
        let options = {};
        options.url='http://localhost:9999/book/bookDetail/'+ callNo;
        options.method = 'get';

        axios(options)
        .then(function(res){
            console.log(res);
            navigate("/admin/FixBookDetail", { state: { bookDetails: res.data.resData } });
        })
        .catch(function(err){
            console.log(err); 
        });
    }

    return(
        <tr className="admin-table-row">
            <td><span onClick={LentBookDetail} className="admin-link">{book.title}</span></td>
            <td>{book.pub}</td>
            <td>{book.author}</td>
            <td>{book.bookNo}</td>
            <td>{book.canLent}</td>
        </tr>
    )
}

function LendBookItem(props){
    const book = props.book;

    return(
        <tr className="admin-table-row">
            <td>{book.title}</td>
            <td>{book.reservation}</td>
            <td>{book.memberName}</td>
            <td>{book.callNo}</td>
            <td>{book.returnDate}</td>
        </tr>
    )
}
