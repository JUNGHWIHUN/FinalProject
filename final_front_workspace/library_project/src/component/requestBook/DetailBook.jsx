import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";

export default function DetailBook(){
    
    const location = useLocation();
    const book = location.state;

    //기존 회원 정보 표출 및 수정 정보 입력받아 저장할 변수
    const [member, setMember]= useState({
            memberNo : "", memberId : "", memberPhone : ""
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
            options.url = serverUrl + "/requestBook/detailBook";
            options.method = "post";
            options.data = {
                title: book.book.title_info,
                author: book.book.author_info,
                publisher: book.book.pub_info,
                memberNo: loginMember.memberNo,
                memberId: loginMember.memberId,
                memberPhone: loginMember.memberPhone,
                reason: reason
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
                <div className="detailBookInfo">
                        <img
                            src={book.book.image_url}
                            alt={book.book.title_info + " 표지"}
                            onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/120x160?text=No+Image";
                        }}
                        />
                        <br />
                    도서 명 : <input type="text" value={book.book.title_info} readOnly/> <br /> 
                    저자 명 : <input type="text" value={book.book.author_info} readOnly/>  <br />
                    출판사 : <input type="text" value={book.book.pub_info} readOnly/><br />
                </div>
                
                <hr />

                <div className="memberInfo">
                    회원 아이디 : <input type="text" value={loginMember.memberId} readOnly /> <br />
                    회원 전화번호 : <input type="text" value={loginMember.memberPhone} readOnly /> <br />
                    신청 사유 : <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} required /> <br />
                    <button type="submit">신청</button>
                    <Link to={"/requestBook/wishBookDirect"}><button>직접 입력하기</button></Link>
                    
                </div>
            </form>
        </div>
    )
}