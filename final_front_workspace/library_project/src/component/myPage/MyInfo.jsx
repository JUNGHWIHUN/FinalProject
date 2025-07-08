import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

//개인정보 수정 컴포넌트
export default function MyInfo(){

    //기존 회원 정보 표출 및 수정 정보 입력받아 저장할 변수
    const [member, setMember]= useState({
        
    });

    //환경변수 파일에 저장된 서버 URL 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    const {loginMember, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();

    useEffect(function(){
        //랜더링 후, 회원 정보 조회
        let options = {};
        options.url = serverUrl + "/myInfo";
        options.method = "get";
        options.params = {
            memberNo : loginMember.memberNo
        }

       
        axiosInstacne(options)
        .then(function(res){
            console.log(res.data.resData);
        })
        .catch(function(err){
            console.log(err);
        })
    },[])
    return(
        <>
      
        </>
    )
}