import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";
import Swal from "sweetalert2";
import './MyPage.css'; // MyPage.css 임포트 추가

//예약현황 컴포넌트
export default function Reservation(){

    const [reservations, setReservations] = useState([]);

    //환경변수 파일에 저장된 서버 URL 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    const {loginMember, setLoginMember } = useUserStore(); // setLoginMember는 사용하지 않으므로 필요없을 수 있지만, 기존 코드 유지

    //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});

    //새로고침 (리렌더링) 을 위한 State 변수 추가
    const [refreshTrigger, setRefreshTrigger] = useState(0);


    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/reservation/" + reqPage;
        options.method = "get";
        options.params = {
            reservationMemberNo : loginMember.memberNo
            }

        axiosInstacne(options)
        .then(function(res){
            setReservations(res.data.resData.reservationList);
            console.log(res.data.resData); // 개발자 도구 콘솔 확인용
            setPageInfo(res.data.resData.pageInfo);
        })
        .catch(function(err){
            console.log(err);
        });
    },[reqPage, refreshTrigger]);


    //예약취소하기 버튼 누를 시 호출할 함수
    function delReservation(props){
        const reservationCallNo = props.reservationCallNo;
        const reservationNo = props.reservationNo;

        let options = {};
        options.url = serverUrl + "/reservation/delete";
        options.method = "post";
        options.data = {
            reservationCallNo : reservationCallNo,
            reservationNo : reservationNo
        };

        axiosInstacne(options)
        .then(function(res){
            if(res.data.resData === 1){
                Swal.fire({
                    title : "알림",
                    text : res.data.clientMsg,
                    icon : res.data.alertIcon,
                    confirmButtonText : '확인'
                });
                const deleteRefreshTrigger = refreshTrigger + 1;
                setRefreshTrigger(deleteRefreshTrigger);
            } else {
                Swal.fire({
                    title : '알림',
                    text : res.data.clientMsg,
                    icon : res.data.alertIcon
                });
            }
        })
        .catch(function(err){
            console.log(err);
        });
    }

    // 날짜 형식을 YY/MM/DD로 변환하는 헬퍼 함수
        const formatDate = (dateString) => {
            if (!dateString || dateString.length !== 8) return '';

            const year = dateString.slice(2, 4);   // "25"
            const month = dateString.slice(4, 6);  // "07"
            const day = dateString.slice(6, 8);    // "14"

            return `${year}/${month}/${day}`;      // "25/07/14"
        };

    return(
        <div className="reservation-container"> {/* 전체 컨테이너 추가 */}
            <h2 className="page-title">예약 현황</h2> {/* 페이지 제목에 클래스 추가 */}

            {reservations.length === 0 ? (
                <p className="no-reservations-message">예약 내역이 없습니다.</p>
            ) : (
                <table className="reservation-table">
                    <thead>
                        <tr>
                            <th>책제목</th>
                            <th>저자</th>
                            <th>출판사</th>
                            <th>예약날짜</th>
                            <th>상태</th>
                            <th>취소</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservations.map(function(reservation,index){
                           
                            const formattedDate = formatDate(reservation.reservationDate);

                            return (
                                <tr key={index}>
                                    <td>{reservation.title}</td>
                                    <td>{reservation.author}</td>
                                    <td>{reservation.publisher}</td>
                                    <td>{formattedDate}</td>
                                    <td>{reservation.status}</td>
                                    <td>
                                        <button type="button" onClick={() => delReservation(reservation)} className="cancel-reservation-button">취소하기</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <div className="pagination-container"> {/* 페이지네이션 컨테이너 추가 */}
                <PageNavi pageInfo = {pageInfo} reqPage={reqPage} setReqPage={setReqPage}/>
            </div>
        </div>
    );
}