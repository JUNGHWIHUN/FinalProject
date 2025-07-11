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
                requestedBookName: book.book.title_info,
                requestedBookAuthor: book.book.author_info,
                requestedBookPub: book.book.pub_info,
                memberNo: loginMember.memberNo,
                memberId: loginMember.memberId,
                memberPhone: loginMember.memberPhone,
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
        <div className="detail-book-wrap"> {/* 전체 컨테이너 */}
            <div className="detail-book-title-area"> {/* 제목 영역 */}
                <h2 className="detail-book-page-title">도서 상세 정보</h2>
                <div className="detail-book-title-underline"></div>
            </div>
            
            <form onSubmit={function(e){
                e.preventDefault();
                requestBook();
            }}>
                <div className="detail-book-info-section"> {/* 도서 정보 섹션 */}
                    <div className="book-image-container"> {/* 이미지 컨테이너 */}
                        <img
                            src={book.book.image_url}
                            alt={book.book.title_info + " 표지"}
                            className="book-cover-image"
                            onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/120x160?text=No+Image";
                        }}
                        />
                    </div>
                    <div className="book-details-group"> {/* 도서 상세 정보 그룹 */}
                        <div className="form-row">
                            <label htmlFor="titleInfo" className="form-label">도서 명</label>
                            <input type="text" id="titleInfo" value={book.book.title_info} readOnly className="form-input-readonly" />
                        </div> 
                        <div className="form-row">
                            <label htmlFor="authorInfo" className="form-label">저자 명</label>
                            <input type="text" id="authorInfo" value={book.book.author_info} readOnly className="form-input-readonly" />
                        </div>
                        <div className="form-row">
                            <label htmlFor="pubInfo" className="form-label">출판사</label>
                            <input type="text" id="pubInfo" value={book.book.pub_info} readOnly className="form-input-readonly" />
                        </div>
                    </div>
                </div>
                
                <hr className="section-divider" /> {/* 구분선 */}

                <div className="member-info-section"> {/* 회원 정보 및 신청 사유 섹션 */}
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
                        <Link to={"/requestBook/wishBookDirect"} className="link-button">
                            <button type="button" className="direct-input-button">직접 입력하기</button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}