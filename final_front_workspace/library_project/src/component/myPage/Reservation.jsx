import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

//예약현황 컴포넌트
export default function Reservation(){


    //환경변수 파일에 저장된 서버 URL 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    const {loginMember} = useUserStore(); 

    

    useEffect(function(){
       console.log(loginMember);

    },[]);


    return(
        <>
        <h3>hi</h3>
        </>
    )
}