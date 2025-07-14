import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Admin.css";

export default function NewBook(){
    //도서 등록 페이지
    const [newBook, setNewBook] = useState({});
    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value } = e.target;
        setNewBook(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function inputNewBook(){
         const confirmUpdate = window.confirm("정말 등록하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }

         let options = {};
            options.url='http://localhost:9999/admin/inputNewBook';
            options.method = 'post';
            options.data = newBook;
            

            axios(options)
            .then(function(res){
             alert("등록 완료!");
                navigate("/");
            })
            .catch(function(err){
            console.log(err); 
            });
    }



    return(
        <>
    <div className="newbook-container">
      <h3>도서 등록하기</h3>
      <div className="newbook-form">
        <p>표제: <input type="text" name="titleInfo" onChange={handleChange} /></p>
        <p>이미지url: <input type="text" name="imageUrl" onChange={handleChange} /></p>
        {newBook.imageUrl && (
          <p>
            <img src={newBook.imageUrl} alt="미리보기" />
          </p>
        )}
        <p>출판사: <input type="text" name="pubInfo" onChange={handleChange} /></p>
        <p>저자: <input type="text" name="authorInfo" onChange={handleChange} /></p>
        <br />
        <p>청구기호: <input type="text" name="callNo" onChange={handleChange} /></p>
        <p>ISBN: <input type="text" name="isbn" onChange={handleChange} /></p>
        <p>발행년도: <input type="text" name="pubYear" onChange={handleChange} /></p>
        <p>자료 있는 곳: <input type="text" name="placeInfo" onChange={handleChange} /></p>
        <p>대출가능 여부: <input type="text" name="canLend" onChange={handleChange} /></p>
        <p>비고: <input type="text" name="remark" onChange={handleChange} /></p>
      </div>
      <button className="newbook-btn" onClick={inputNewBook}>도서 등록하기</button>
    </div>
  </>
    )
}