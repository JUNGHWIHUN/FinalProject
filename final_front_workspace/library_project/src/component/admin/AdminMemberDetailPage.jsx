import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Admin.css";
import AdminMenu from "./AdminMenu";
import { useNavigate } from "react-router-dom";

export default function AdminMemberDetailPage(){

    const navigate = useNavigate();
    const memberNo = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const from = queryParams.get("from");  // "member" 또는 "overdue"
    const bookNo = queryParams.get("bookNo"); // 있을 수도 있고, 없을 수도 있음


    //유저 정보 ,책 정보
    const [memberInfo, setMemberInfo] = useState(null); 
    const [bookInfo, setBookInfo] = useState(null);

    const [canBorrow, setCanBorrow] = useState("");
    const [canComment, setCanComment] = useState("");
    const [maxBorrowCount, setMaxBorrowCount] = useState(0);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

    //유저의 번호 기준으로 정보 불러오기
    useEffect(() => {
            let options = {};
            options.url='http://localhost:9999/admin/memberDetails/'+ memberNo.memberNo;
            options.method = 'get';

            axios(options)
            .then(function(res){
               setMemberInfo(res.data.resData[0]);
               console.log(res.data.resData[0]);
            })
            .catch(function(err){
            console.log(err); 
            });

    }, [memberNo, refreshTrigger])

    //필요한 정보 3개만 따로 추출
    useEffect(() => {
        if (memberInfo) {
        setCanBorrow(memberInfo.canBorrow);
        setCanComment(memberInfo.canComment);
        setMaxBorrowCount(memberInfo.maxBorrowedCount);
        }
        console.log(memberInfo);
    }, [memberInfo, refreshTrigger]);

    //대출 받은경우 책정보 같이 불러오기
     useEffect(() => {
        if(from === "overdue" && bookNo) {
            let options = {};
            options.url='http://localhost:9999/admin/bookDetails/'+ bookNo;
            options.method = 'get';

            axios(options)
            .then(function(res){
               setBookInfo(res.data.resData[0]);
            })
            .catch(function(err){
            console.log(err); 
            });
        }
     },[from, bookNo, refreshTrigger])

     if (!memberInfo) {
        return <div className="admin-loading">회원 정보를 불러오는 중...</div>;
     }

    //회원 정보 수정
    function handleUpdate(){
        const confirmUpdate = window.confirm("정말 수정하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }

        let options = {};
            options.url='http://localhost:9999/admin/memberFix';
            options.method = 'post';
            options.data = {
                memberNo: memberInfo.memberNo,
                canBorrow: canBorrow,
                canComment: canComment,
                maxBorrowedCount: maxBorrowCount,
            };

            axios(options)
            .then(function(res){
                alert("수정되었습니다");
                setRefreshTrigger(prev => prev + 1);
            })
            .catch(function(err){
            console.log(err); 
            });

    }

    function goMode(mode) {
        navigate("/adminPage", { state: { mode } });
    }

    return(
        <>
         <AdminMenu goMode={goMode} />
    

        <h3 className="admin-title">회원 상세 정보</h3>

        <div className="admin-member-info">
           <p className="admin-info-item">회원 이름 : {memberInfo.memberName}</p>
           <p className="admin-info-item">회원 번호 : {memberInfo.memberNo}</p>
           <p className="admin-info-item">회원 아이디 : {memberInfo.memberId}</p>
           <p className="admin-info-item">회원 이메일 : {memberInfo.memberEmail}</p>
           <p className="admin-info-item">회원 전화번호 : {memberInfo.memberPhone}</p>

           <p className="admin-info-item">대출 도서 권수 : {memberInfo.borrowedCount}</p>
           <p className="admin-info-item">회원 누적 연체일수 : {memberInfo.overudeCount}</p>
           <p className="admin-info-item">미대출 횟수 : {memberInfo.noLentCount}</p>
           <p className="admin-info-item">대출불가일자 : {memberInfo.cantBorrowDay}</p>

           <p className="admin-info-item">
                대출 가능 여부 :
                <select
                  className="admin-select"
                  value={canBorrow}
                  onChange={(e) => setCanBorrow(e.target.value)}
                >
                    <option value="T">T</option>
                    <option value="F">F</option>
                </select>
           </p>

            <p className="admin-info-item">
                서평 작성 권한 :
                <select
                  className="admin-select"
                  value={canComment}
                  onChange={(e) => setCanComment(e.target.value)}
                >
                    <option value="T">T</option>
                    <option value="F">F</option>
                </select>
            </p>

            <p className="admin-info-item">
                최대 대출 가능 권수 :
                <input
                  className="admin-input"
                  type="number"
                  value={maxBorrowCount}
                  onChange={(e) => setMaxBorrowCount(e.target.value)}
                  min={1}
                  max={7}
                />
            </p>

            <button className="admin-btn" onClick={handleUpdate}>정보 수정</button>
        </div>

        {from === "overdue" && bookInfo && (
            <>
            <h3 className="admin-subtitle">연체된 도서 정보</h3>
            <p className="admin-info-item">책 제목 : {bookInfo.title}</p>
            <p className="admin-info-item">책 번호 : {bookInfo.bookNo}</p>
            <p className="admin-info-item">isbn : {bookInfo.isbn}</p>
            </>
        )}

        </>
    )
}
