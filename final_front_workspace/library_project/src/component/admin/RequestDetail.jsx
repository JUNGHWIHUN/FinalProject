import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Admin.css";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";

export default function RequestDetail(){
  const navigate = useNavigate();

  //페이지에서 넘겨받은 정보
    const location = useLocation();
    const list = location.state.list;


    //반려 승인 전환. 기본값 승인
    const [selectType, setSelectType] = useState("yes");
    const [isCompleted, setIsCompleted] = useState(false);


    //반려-승인 전환
     function keywordType(e){
      setSelectType(e.target.value);
    }

    //수정하기
     function updateList(){
        const confirmUpdate = window.confirm("정말 수정하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }

        let options = {};
            options.url='http://localhost:9999/admin/requestUpdate';
            options.method = 'post';
            options.data = {
                type : selectType, target : list.memberNo
            }
            

            axios(options)
            .then(function(res){
                alert("수정되었습니다.");
                setIsCompleted(true);
            })
            .catch(function(err){
            console.log(err); 
            });
    }

    if (!list) {
    return <p>잘못된 접근입니다.</p>;
    }

    function goMode(mode) {
        navigate("/adminPage", { state: { mode } });
    }

    return(
      <>
      <AdminMenu goMode={goMode} />
       <div className="request-detail">
    <h3>{list.requestBookName}</h3>
    <p>신청자: {list.memberNo}</p>
    <p>저자: {list.requestBookAuthor}</p>
    <p>출판사 : {list.requestBookPub}</p>
    <p>신청 사유: {list.requestReason}</p>
    <p>신청일자 : {list.requestDate}</p>

    {list.status == '0' && (
      <>
        <select value={selectType} onChange={keywordType}>
          <option value="yes">승인</option>
          <option value="no">반려</option>
        </select>
        <button onClick={updateList} disabled={isCompleted}>
          {isCompleted ? "처리완료" : "확인"}
        </button>
      </>
    )}
  </div>
      </>
        
    )
}