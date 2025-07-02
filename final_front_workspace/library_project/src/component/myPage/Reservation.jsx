import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

//예약현황 컴포넌트
export default function Reservation(){

    //기존 회원 정보 저장할 변수
    const [memberNo, setMemberNo] = useState('');

    //환경변수 파일에 저장된 서버 URL 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    const {loginMember} = useUserStore(); 

    useEffect(function(){
        //랜더링 후, 회원 정보 조회
        let options = {};
        options.url = serverUrl + '/myPage/' + loginMember.memberNo;
        options.method = 'get';

        axiosInstacne(options)
        .then(function(res){
            console.log(res);
        })
        .cathch(function(err){
            console.log(err);
        })

    },[]);


    return(
        <>
        
        </>
    )
}