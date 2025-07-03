import { useState } from "react";
import { useLocation } from "react-router-dom";

export default function LentBookDetail() {
  const location = useLocation();
  const book = location.state.book;

  //유저 번호로 검색을 하기위한 유저 번호 저장
  const [user, setUser] = useState({
    memberNo : ""
  });

  //검색후 출력된 번호를 기반으로 유저 정보를 출력하기 위함
  const [userInfo, setUserInfo] = useState({
    memberName : "", memberBorrow : ""
  });

  function changeUser(){
    user[e.target.memberNo] = e.target.value;
    setUser({...user});
  };

  function selectLentMember(){
    let options = {};
            options.url='http://localhost:9999/admin/selectUser';
            options.method = 'post';
            options.data = user;

            axios(options)
            .then(function(res){
                
                if(res.data.resData.length > 0){
                   
                }else{
                    alert("검색결과 없음");
                    setUserInfo([]);
                }
            })
            .catch(function(err){
            console.log(err); 
            });
  }

  return (
    <>
      <h1>{book.title}</h1>
      <img src={book.imageUrl}  />
      <p>저자: {book.author}</p>
      <p>출판사: {book.pub}</p>
      <p>출판년도: {book.pubYear}</p>
      <p>ISBN: {book.isbn}</p>
      <p>보관 장소: {book.place}</p>
      <p>대출 가능: {book.canLent}</p>
      <p>비고: {book.remark}</p>

      <br />

      {book.canLent == 'T' && (
        <div>
        대출자 번호 : <input type="text" id="memberNo" value={user.memberNo} onChange={changeUser} />
        <button onClick={selectLentMember}>검색</button>
        </div>
      )}


    </>
  );
}