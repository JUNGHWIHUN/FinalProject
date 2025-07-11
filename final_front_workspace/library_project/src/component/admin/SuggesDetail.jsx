import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function SuggestDetail(){
    const location = useLocation();
    const list = location.state.list;

    //확인 버튼 상태 변경용
    const [isCompleted, setIsCompleted] = useState(false);

    const navigate = useNavigate();

     function deleteList(){
        const confirmUpdate = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }

        let options = {};
            options.url='http://localhost:9999/admin/suggesDelete';
            options.method = 'post';
            options.data = {
                target : list.memberNo
            }
            
            axios(options)
            .then(function(res){
                alert("삭제되었습니다.");
                setIsCompleted(true);
            })
            .catch(function(err){
            console.log(err); 
            });
     }

     useEffect(() => {
        // 새로고침 시 실행
     if (performance.navigation.type === 1) {
         alert("이 페이지는 새로고침할 수 없습니다.\n이전 페이지로 이동합니다.");
        navigate(-1); // 이전 페이지로
        }
    }, []);

    return(
        <div className="suggest-detail-wrapper">
      <h3 className="suggest-title">{list.suggesTitle}</h3>

      <p><strong>작성자 :</strong> {list.memberName}</p>
      <p><strong>작성일 :</strong> {list.suggesDate}</p>
      <p><strong>내용 :</strong></p>
      <div className="suggest-content">{list.suggesContent}</div>

      <button
        className="suggest-delete-button"
        onClick={deleteList}
        disabled={isCompleted}
      >
        {isCompleted ? "처리완료" : "삭제"}
      </button>
    </div>
    )
}