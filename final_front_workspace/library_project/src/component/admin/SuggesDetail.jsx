import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        <>
        <h3>{list.suggesTitle}</h3>

        <p>작성자 : {list.memberName}</p>
        <p>작성일 : {list.suggesDate}</p>
        <p>내용 : {list.suggesContent}</p>

        <button onClick={deleteList} disabled={isCompleted}>{isCompleted ? "처리완료" : "삭제"}</button>
        </>
    )
}