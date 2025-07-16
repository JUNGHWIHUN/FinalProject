import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./Admin.css";
import AdminMenu from "./AdminMenu";

export default function FixBookDetail(){
  
  //useLocation = URL정보와 state 가져오기
  //location.state?.bookDetails; ==이전 페이지에서 현재 페이지로 넘어올 때 넘긴 데이터
    const location = useLocation();
    const bookDetails = location.state?.bookDetails;
    const navigate = useNavigate();

    // 입력값용 state
  const [form, setForm] = useState({ ...bookDetails });
  const [updateBook, setUpdateBook] = useState({...bookDetails});

  // 취소 버튼 클릭 시 초기값으로 복구
  function handleCancel() {
    setUpdateBook({ ...form });
  }

  //수정을 위한 정보 밀어넣기
  function handleChange(e){
    const { name, value } = e.target;
        setUpdateBook((prev) => ({
            ...prev,
             [name]: value,
  }));

  }

  //수정하기
  function fixbook(){

        const confirmUpdate = window.confirm("정말 수정하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }


            let options = {};
            options.url='http://localhost:9999/admin/fixBook';
            options.method = 'post';
            options.data = updateBook;
            

            axios(options)
            .then(function(res){
             alert("수정 완료!");
                setForm({ ...updateBook });
                setUpdateBook({ ...updateBook });
            })
            .catch(function(err){
            console.log(err); 
            });
  }
  function goMode(mode) {
        navigate("/adminPage", { state: { mode } });
    }
  //삭제하기
  function deleteBook(){
     const confirmUpdate = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }

         let options = {};
            options.url='http://localhost:9999/admin/deleteBook';
            options.method = 'post';
            options.data = updateBook;
            

            axios(options)
            .then(function(res){
             alert("삭제 완료!");
                navigate("/adminPage");
            })
            .catch(function(err){
            console.log(err); 
            });
  }

  



    return(
        <>

        <AdminMenu goMode={goMode} />
         <div className="fix-book-container">
              <img src={updateBook.imageUrl} />
              <h3>표제: <input type="text" name="titleInfo" value={updateBook.titleInfo || ""} onChange={handleChange} /></h3>
              <p>출판사: <input type="text" name="pubInfo" value={updateBook.pubInfo || ""} onChange={handleChange} /></p>
              <p>저자: <input type="text" name="authorInfo" value={updateBook.authorInfo || ""} onChange={handleChange} /></p>
              <p>청구기호: <input type="text" name="callNo" value={updateBook.callNo || ""} readOnly /> 청구기호는 변경불가</p>
              <p>ISBN: <input type="text" name="isbn" value={updateBook.isbn || ""} onChange={handleChange} /></p>
              <p>발행년도: <input type="text" name="pubYear" value={updateBook.pubYear || ""} onChange={handleChange} /></p>
              <p>자료 있는 곳: <input type="text" name="placeInfo" value={updateBook.placeInfo || ""} onChange={handleChange} /></p>
              <p>대출가능 여부: <input type="text" name="canLend" value={updateBook.canLend || ""} onChange={handleChange} /></p>
              <p>비고: <input type="text" name="remark" value={updateBook.remark || ""} onChange={handleChange} /></p>
            </div>

            <div className="fix-book-btn-group">
              <button onClick={handleCancel}>취소</button>
              <button onClick={fixbook}>수정하기</button>
              <button onClick={deleteBook}>삭제하기</button>
        </div>
        </>
    )
}