import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Admin.css";

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

  function changeUser(e){
    user[e.target.id] = e.target.value;
    setUser({...user});
  };
//유저 번호 보내서 이름과 대출 가능 여부 찾기.
  function selectLentMember(){
    let options = {};
            options.url='http://localhost:9999/admin/selectUser';
            options.method = 'post';
            options.data = user;

            axios(options)
            .then(function(res){
                
                if(res.data.resData.length > 0){
                  const member = res.data.resData[0];//첫번째 유저 정보가져오기==하나밖에 없음
                   setUserInfo({
                    memberName: member.memberName,
                     memberBorrow: member.memberBorrow,
                 });

                }else{
                    alert("검색결과 없음");
                    setUserInfo([]);
                }
            })
            .catch(function(err){
            console.log(err); 
            });
  }

  //유저 번호와 책번호를 기준으로, 대출하기
  function lentThisBook(){
    const data = {
    memberNo: user.memberNo,
    bookNo: book.bookNo 
  };

    let options = {};
    options.url = 'http://localhost:9999/admin/lentBook';
    options.method = 'post';
    options.data = data;

    axios(options)
    .then(function(res){
      alert("대출이 완료되었습니다!");
    // 이후 페이지 이동이나 state 변경 필요 시 추가
     })
     .catch(function(err){
       console.log(err);
       alert("대출 처리 중 오류가 발생했습니다.");
     });
  }

  return (
    <div className="lent-detail-container">
    <h1>{book.title}</h1>
    <img src={book.imageUrl} />
    <p>책 번호: {book.bookNo}</p>
    <p>저자: {book.author}</p>
    <p>출판사: {book.pub}</p>
    <p>출판년도: {book.pubYear}</p>
    <p>ISBN: {book.isbn}</p>
    <p>보관 장소: {book.place}</p>
    <p>대출 가능: {book.canLent}</p>
    <p>비고: {book.remark}</p>

    {book.canLent === 'T' && (
      <div className="lent-detail-input-group">
        대출자 번호 :
        <input
          type="text"
          id="memberNo"
          value={user.memberNo}
          onChange={changeUser}
        />
        <button onClick={selectLentMember}>검색</button>
      </div>
    )}

    {userInfo.memberName && (
      <div className="lent-detail-user-info">
        <p>이름: {userInfo.memberName}</p>
        <p>대출 가능 여부: {userInfo.memberBorrow}</p>
        <button
          onClick={lentThisBook}
          disabled={userInfo.memberBorrow !== 'T'}
        >
          대출하기
        </button>
      </div>
    )}
  </div>
  );
}