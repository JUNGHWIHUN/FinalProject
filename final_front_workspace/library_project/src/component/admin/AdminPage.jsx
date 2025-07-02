import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminPage(){

    const [books, setBooks] = useState({
        title : "", author : "", ISBN : ""
    })

    function changebookValue(e){
        books[e.target.id] = e.target.value;
        setBooks({...books});
    }

    function selectBooks(){
        let options = {};
        options.url='http://localhost:9999/admin/selectBooks';
        options.method = 'post';
        options.data = books;

        axios(options)
        .then(function(res){
            if(res.data > 0){
                //리스트 페이지로 연결하기
            }
        })
        .catch(function(err){
           console.log(err); 
        });
    }

    return(
        <div>
         <a>대출</a>
         <a>반납</a>

         <h3>대출할 도서 검색</h3>
            이름: <input type="text" id="title" value={books.title} onChange={changebookValue}></input>
            저자: <input type="text" id="author" value={books.author} onChange={changebookValue}></input>
            ISBN: <input type="text" id="ISBN" value={books.ISBN} onChange={changebookValue}></input>

            <button onClick={selectBooks}>검색</button>

        </div>
    )
}