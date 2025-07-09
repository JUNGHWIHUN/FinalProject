import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminMemberDetailPage(){


    const memberNo = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    

    const from = queryParams.get("from");  // "member" 또는 "overdue"
    const bookNo = queryParams.get("bookNo"); // 있을 수도 있고, 없을 수도 있음

    const [memberInfo, setMemberInfo] = useState(null);
    const [bookInfo, setBookInfo] = useState(null);

    const [canBorrow, setCanBorrow] = useState("");
    const [canComment, setCanComment] = useState("");
    const [maxBorrowCount, setMaxBorrowCount] = useState(0);

    const [refreshTrigger, setRefreshTrigger] = useState(0);

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

    useEffect(() => {
        if (memberInfo) {
        setCanBorrow(memberInfo.canBorrow);
        setCanComment(memberInfo.canComment);
        setMaxBorrowCount(memberInfo.maxBorrowedCount);
        }
        console.log(memberInfo);
    }, [memberInfo, refreshTrigger]);

    
     useEffect(() => {
        if(from == "overdue" && bookNo) {
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
        return <div>회원 정보를 불러오는 중...</div>;
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


    return(
        <>
        <h3>회원 상세 정보</h3>

        <div>
           <p>회원 이름 : {memberInfo.memberName}</p>

           <p>회원 번호 : {memberInfo.memberNo}</p>
           <p>회원 아이디 : {memberInfo.memberId}</p>
           <p>회원 이메일 : {memberInfo.memberEmail}</p>
           <p>회원 전화번호 : {memberInfo.memberPhone}</p>

           <p>대출 도서 권수 : {memberInfo.borrowedCount}</p>
           <p>회원 누적 연체일수 : {memberInfo.overudeCount}</p>
           <p>미대출 횟수 : {memberInfo.noLentCount}</p>
           <p>대출불가일자 : {memberInfo.cantBorrowDay}</p>


           <p>
                대출 가능 여부 :
                <select value={canBorrow} onChange={(e) => setCanBorrow(e.target.value)}>
                    {console.log('대출'+canBorrow)}
                    <option value="T">T</option>
                    <option value="F">F</option>
                </select>
                </p>

            <p>
                서평 작성 권한 :
                <select value={canComment} onChange={(e) => setCanComment(e.target.value)}>
                    {console.log('서평'+canComment)}
                    <option value="T">T</option>
                    <option value="F">F</option>
                </select>
            </p>

            <p>
                최대 대출 가능 권수 :
            <input type="number" value={maxBorrowCount} onChange={(e) => setMaxBorrowCount(e.target.value)} min={1} max={7} />
            {console.log('최대 대출'+maxBorrowCount)}
            </p>

            <button onClick={handleUpdate}>정보 수정</button>
        </div>

        {from == "overdue" && bookInfo && (
            <>
            <h3>연체된 도서 정보</h3>
            <p>책 제목 : {bookInfo.title}</p>
            <p>책 번호 : {bookInfo.bookNo}</p>
            <p>isbn : {bookInfo.isbn}</p>
            </>

        )}
        
        </>
    )
}