//건의사항 쓰기 기능
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../store/useUserStore";

export default function NoticeWrite(){

    const [newSuggestion, setNewSuggestion] = useState({});
    const navigate = useNavigate();
    const [memberNo, setMemberNo] = useState();
    const {isLogined, loginMember} = useUserStore();
    


    function handleChange(e) {
        const { name, value } = e.target;
        setNewSuggestion(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    useEffect(() => { 
        if(loginMember && loginMember.memberNo){
            setMemberNo(loginMember.memberNo);
        }
    }, [loginMember])


    function insertSuggestion(){
        const confirmUpdate = window.confirm("정말 등록하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }

         let options = {};
            options.url='http://localhost:9999/admin/insertSuggestion/'+ memberNo;
            options.method = 'post';
            options.data = newSuggestion;
            

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
        <h3>건의사항 쓰기</h3>
        <p>제목 : <input type="text" name="suggesTitle" onChange={handleChange}/></p>
        <p>내용 : <input type="text" name="suggesContent" onChange={handleChange}/></p>
        <button onClick={insertSuggestion}>건의사항 등록</button>

        </>
    )
}