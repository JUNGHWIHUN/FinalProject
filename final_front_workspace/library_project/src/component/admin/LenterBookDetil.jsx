import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function LenterBookDetil(){

    const location = useLocation();
    const book = location.state.book;
    const navigate = useNavigate();

    function returnThisBook(){
        let options = {};
            options.url='http://localhost:9999/admin/retrunBook';
            options.method = 'post';
            options.data = book;

            axios(options)
            .then(function(res){
                
                if(res.data.resData == "OK"){
                 alert("반납 처리 완료");
                navigate(-1);
                }else{
                    alert("검색결과 없음");
                    setUserInfo([]);
                }
            })
            .catch(function(err){
            console.log(err); 
            });
    }


    return(
        <>
        <h3>{book.title}</h3>

        <p>청구기호 : {book.callNo}</p>

        <p>대출자 번호: {book.memberNo}</p>
        <p>대출자 이름: {book.memberName}</p>

        <p>반납 예정일: {book.returnDate}</p>

        <button onClick={returnThisBook} disabled={book.actualRetrun !== null}>반납 처리</button>

        </>
    )
}