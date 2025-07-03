import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";
import Swal from "sweetalert2";

//예약현황 컴포넌트
export default function Reservation(){

    const [reservations, setReservations] = useState([]);

    //환경변수 파일에 저장된 서버 URL 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    const {loginMember, setLoginMember } = useUserStore();
    
       //요청 페이지(초기에 1페이지 요청하므로 초기값은 1)
    const [reqPage, setReqPage] = useState(1);
    //페이지 하단 페이지 네비게이션 저장 변수
    const [pageInfo, setPageInfo] = useState({});


    useEffect(function(){

        if(!loginMember) return;

        let options = {};
        options.url = serverUrl + "/reservation/" + reqPage + "?memberNo=" + loginMember.memberNo ;
        options.method = "get"

        console.log(loginMember.memeberNo);

        axiosInstacne(options)
        .then(function(res){
            
            setReservations(res.data.resData.reservationList);
            console.log(res.data.resData.reservationList);

            setPageInfo(res.data.resData.pageInfo);
            
        })
        .catch(function(err){
            console.log(err);
        })

    },[reqPage, loginMember]);

   
    function delReservation(props){
        const reservationCallNo = props.reservationCallNo;
        const reservationNo = props.reservationNo;

        let options = {};
        options.url = serverUrl + "/reservation/delete";
        options.method = "post"
        options.data = {
            reservationCallNo : reservationCallNo,
            reservationNo : reservationNo
        };
        

        axiosInstacne(options)
        .then(function(res){
            Swal.fire({
                title : "알림",
                text : '예약이 정상적으로 취소되었습니다.',
                icon : "success",
                confirmButtonText : '확인'


            })
            
        })
        .catch(function(err){
            console.log(err);
        });
    }
   

    return(
        <>
        <div>예약 현황</div>
            <table>
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
                    return <tr key={index}>
                        <td>{reservation.title}</td>
                        <td>{reservation.reservationNo}</td>
                        <td>{reservation.author}</td>
                        <td>{reservation.publisher}</td>
                        <td>{reservation.reservationDate}</td>
                        <td>{reservation.status}</td>
                        <td>
                            {/* () => 을 쓰는 이유 : 버튼을 클릭할 때가 아니라 렌더링 할 때 
                                함수가 실행되기 때문에 함수가 실행되고, 요청도 미리 날라가게 됨.
                            */}
                            <button type="button" onClick={() => delReservation(reservation)}>취소하기</button>
                        </td>
                    </tr>
                  })}
                </tbody>
            </table>
            <div>
                <PageNavi pageInfo = {pageInfo} reqPage={reqPage} setReqPage={setReqPage}/>
            </div>
        </>
    )
}