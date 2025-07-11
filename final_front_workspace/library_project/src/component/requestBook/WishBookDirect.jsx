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
                memberId: loginMember.memberId, // loginMember.memberId 사용
                memberPhone: loginMember.memberPhone, // loginMember.memberPhone 사용
                requestedReason: reason
            };

            axiosInstacne(options)
                .then(function(res){
                    console.log(res.data);
                    navigate("/requestBook/wishBook");
                })
                .catch(function(err){
                    console.error("신청 오류:", err);
                    alert("신청에 실패했습니다.");
                });
}
        
    return(
        <div className="wishbook-direct-wrap"> {/* 전체 컨테이너 */}
            <div className="wishbook-direct-title-area"> {/* 제목 영역 */}
                <h2 className="wishbook-direct-page-title">희망도서 직접 신청</h2> {/* 제목 텍스트 변경 */}
                <div className="wishbook-direct-title-underline"></div>
            </div>
            
            <form onSubmit={function(e){
                e.preventDefault();
                requestBook();
            }}>
                <div className="book-direct-input-section"> {/* 도서 정보 입력 섹션 */}
                    <div className="form-row">
                        <label htmlFor="bookTitle" className="form-label">도서 명</label>
                        <input type="text" id="bookTitle" value={book.title} onChange={(e) => setBook({...book, title: e.target.value })} required className="form-input" />
                    </div> 
                    <div className="form-row">
                        <label htmlFor="bookAuthor" className="form-label">저자 명</label>
                        <input type="text" id="bookAuthor" value={book.author} onChange={(e) => setBook({...book, author: e.target.value})} required className="form-input" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="bookPublisher" className="form-label">출판사</label>
                        <input type="text" id="bookPublisher" value={book.publisher} onChange={(e) => setBook({...book, publisher: e.target.value})} required className="form-input" />
                    </div>
                </div>
                
                <hr className="section-divider" /> {/* 구분선 */}

                <div className="member-direct-info-section"> {/* 회원 정보 및 신청 사유 섹션 */}
                    <div className="form-row">
                        <label htmlFor="memberId" className="form-label">회원 아이디</label>
                        <input type="text" id="memberId" value={loginMember.memberId} readOnly className="form-input-readonly" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="memberPhone" className="form-label">회원 전화번호</label>
                        <input type="text" id="memberPhone" value={loginMember.memberPhone} readOnly className="form-input-readonly" />
                    </div>
                    <div className="form-row">
                        <label htmlFor="requestedReason" className="form-label">신청 사유</label>
                        <input type="text" id="requestedReason" value={reason} onChange={(e) => setReason(e.target.value)} required className="form-input" />
                    </div>
                    
                    <div className="button-group"> {/* 버튼 그룹 */}
                        <button type="submit" className="submit-button">신청</button>
                    </div>
                </div>
            </form>
        </div>
    )
}