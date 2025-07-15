import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "./MyPage.css"

// 현재 대출 목록 컴포넌트
export default function LentBookList() {
    const [lentBookList, setLentBookList] = useState([]);
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const { loginMember } = useUserStore();
    const navigate = useNavigate();

   

    // 대출 목록 불러오기
    function getLentBookList() {
        let options = {
            url: serverUrl + "/lentBookList",
            method: "get",
            params: {
                memberNo: loginMember.memberNo
            }
        };

        axiosInstance(options)
            .then(function (res) {
                setLentBookList(res.data.resData);
                console.log(res.data.resData);
            })
            .catch(function (err) {
                console.log(err);
            });
    }

    // 처음 마운트 시 목록 불러오기
    useEffect(() => {
        getLentBookList();
    }, []);

    // 대출 연장 요청
    function renewBook(lentBookNo) {
        let options = {
            url: serverUrl + "/lentBookList/renewBook",
            method: "patch",
            params: {
                lentBookNo: lentBookNo
            }
        };

        axiosInstance(options)
            .then(function (res) {
                console.log(res);
                if (res.data.resData === 1) {
                    Swal.fire({
                        title : '알림',
                        text : res.data.clientMsg,
                        icon : res.data.alertIcon
                    })
                    getLentBookList(); // 목록 다시 불러오기
                } else {
                    Swal.fire({
                        title : '알림',
                        text : res.data.clientMsg,
                        icon : res.data.alertIcon
                    });
                }
            })
            .catch(function (err) {
                console.log(err);
            });
        }
        console.log("리스트"+lentBookList);
        
    return (
        <div className="lent-book-list">
            <h2>대출 현황</h2>
            {lentBookList.length == 0 ?
                <p className="no-history-message">대출중인 도서가 없습니다.</p>
            :
            lentBookList.map(function (lentBook, index) {
                
                const today = new Date();
                today.setHours(0,0,0,0);        //시간을 00시로 초기화
                   

                    const returnDateParts = lentBook.returnDate.split("/"); // "25/07/09" → ["25", "07", "09"]
                    const returnDate = new Date("20" + returnDateParts[0], returnDateParts[1] - 1, returnDateParts[2]); // 년, 월, 일
                    const isOverdue = returnDate < today;

                    console.log(isOverdue);
                
                    return (
                    <div key={"lentBook" + index} className="book-item">
                        <img src={lentBook.imageUrl} className="book-img" />
                        <div className="book-info">
                            <div className="book-title">{lentBook.title}</div>
                            <div>대출번호 : {lentBook.lentBookNo}</div>
                            <div style={{ color: isOverdue ? "red" : "black" }}>
                                반납 예정일 : {lentBook.returnDate} 
                            </div>
                             <button
                                type="button"
                                disabled={isOverdue}
                                onClick={() => renewBook(lentBook.lentBookNo)}
                            >
                                대출 연장하기
                            </button>
                                {isOverdue && (
                                    <div style={{ color: "red", fontSize: "0.9rem", marginTop: "4px" }}>
                                        연체된 도서는 연장할 수 없습니다.
                                    </div>
                                )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}