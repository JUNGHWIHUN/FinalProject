import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AllbookPage from "./AllBookPage";

export default function AdminPage(){

    const [mode, setMode] = useState("lend");//대출,반납 페이지 전환용
    const [subMode, setSubMode] = useState("");//보조 페이지 전환용

    const [bookList, setBookList] = useState([]);//받아온 책 전체 담아두기

    const [books, setBooks] = useState({ //대출검색을 위한 조건 담기
        title : "", author : "", isbn : ""
    });

    const [returnBooksList, setreturnBooksList] = useState([]);

    const [returnBooks, setRetrunBooks] = useState({//반납 검색을 위한 조건 담기
        callNo : ""
    });


    function changebookValue(e){//값 입력시 값 변경.
        books[e.target.id] = e.target.value;
        setBooks({...books});
    }

    

    const navigate = useNavigate();
        //책 대출 책 찾기
        function selectBooks(){
            let options = {};
            options.url='http://localhost:9999/admin/selectBooks';
            options.method = 'post';
            options.data = books;

            axios(options)
            .then(function(res){
                
                if(res.data.resData.length > 0){
                    setBookList(res.data.resData);
                    
                    console.log(bookList);
                    console.log('---------------------------');
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

        function changeBookReturn(e){
            returnBooks[e.target.id] = e.target.value;
            setRetrunBooks({...returnBooks});
        }
        //반납 책 찾기
        function selectReturnBooks(){
            let options = {};
            options.url='http://localhost:9999/admin/selectRetrunBooks';
            options.method = 'post';
            options.data = returnBooks;

            axios(options)
            .then(function(res){
                if(res.data.resData.length > 0){
                    setreturnBooksList(res.data.resData);
                    
                    console.log(returnBooksList);
                    console.log('---------------------------');
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

       

    return(
        <div>
         <a href="#" onClick={() => setMode("allBook")}>도서관리</a> |
         <a href="#" onClick={() => setMode("allMember")}>회원관리</a> |
         <a href="#" onClick={() => setMode("suggestion")}>건의 사항</a> |
         <a href="#" onClick={() => setMode("bookRequest")}>희망도서</a> | {" "}
         <a href="#" onClick={() => setMode("lend")}>대출</a> |{" "}
         <a href="#" onClick={() => setMode("return")}>반납</a> 

        {mode == "allBook" && <AllbookPage />} 


        {mode == "lend" && (
            <>
            <h3>대출할 도서 검색</h3>
            <p>이름:</p> <input type="text" id="title" value={books.title} onChange={changebookValue}></input>
            <p>저자:</p><input type="text" id="author" value={books.author} onChange={changebookValue}></input>
            <p>isbn:</p><input type="text" id="isbn" value={books.isbn} onChange={changebookValue}></input>

            <button onClick={selectBooks}>검색</button>
            </>
        )}

        {mode == "return" && (
            <>
             <h3>반납할 도서 검색</h3>
            <p>청구기호: </p><input type="text" id="callNo" value={returnBooks.callNo} onChange={changeBookReturn}></input>

            <button onClick={selectReturnBooks}>검색</button>
            </>


        )}
         

        </div>
    )
}