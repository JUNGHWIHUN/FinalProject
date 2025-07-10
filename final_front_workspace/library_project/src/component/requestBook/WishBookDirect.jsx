import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";

export default function WishBookDirect(){

    const [book, setBook] = useState({
        title: "",
        author: "",
        publisher: ""
});

    //기존 회원 정보 표출 및 수정 정보 입력받아 저장할 변수
    const [member, setMember]= useState({
            memberId : "", memberPhone : ""
    });
    
    //환경변수 파일에 저장된 서버 URL 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    const {loginMember, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();
    
    //도서 신청사유
    const [reason, setReason] = useState("");

    const navigate = useNavigate();

        function requestBook(){
            let options = {};
            options.url = serverUrl + "/requestBook/wishBookDirect";
            options.method = "post";
            options.data = {
                requestedBookName: book.title,
                requestedBookAuthor: book.author,
                requestedBookPub: book.publisher,
                memberNo : loginMember.memberNo,
                memberId: member.memberId,
                memberPhone: member.memberPhone,
                requestedReason: reason
            };

            axiosInstacne(options)
                .then(function(res){
                    alert("신청이 완료되었습니다!");
                    console.log(res.data);
                    navigate("/Main");
                })
                .catch(function(err){
                    console.error("신청 오류:", err);
                    alert("신청에 실패했습니다.");
                });
}
        

    return(
        <div>
            <h2>도서 상세 정보</h2>
            <hr />
            <form onSubmit={function(e){
                e.preventDefault();
                requestBook();
            }}>
                <div className="wishBookDirectInfo">
                    도서 명 : <input type="text" value={book.title} onChange={(e) => setBook({...book, title: e.target.value })} required/> <br /> 
                    저자 명 : <input type="text" value={book.author} onChange={(e) => setBook({...book, author: e.target.value})} required/>  <br />
                    출판사 : <input type="text" value={book.publisher} onChange={(e) => setBook({...book, publisher: e.target.value})} required/><br />
                </div>
                
                <hr />

                <div className="memberInfo">
                    회원 아이디 : <input type="text" value={loginMember.memberId}  readOnly/> <br />
                    회원 전화번호 : <input type="text" value={loginMember.memberPhone}  readOnly/> <br />
                    신청 사유 : <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} /> <br />
                    
                    <button type="submit">신청</button>
                </div>
            </form>
        </div>
    )
}









