import { use, useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";

//마이페이지 하위의 '내 서재' 기능 컴포넌트
export default function MyLibrary(){

    //백엔드 서버 URL
    const serverUrl = import.meta.env.VITE_BACK_SERVER; 

    //커스텀 axios
    const axiosInstance = createInstance();

    //로그인한 회원 정보
    const {isLogined, loginMember} = useUserStore();

    //화면 새로고침용 변수
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    //내 서재 리스트 저장 변수
    const [myLibraryList, setMyLibraryList] = useState([]); 

    //내 서재 추가/수정시 이름 입력값 저장 변수
    const [name, setName] = useState("");

    //수정 모드일 경우에 서재 정보 저장 (null이면 추가 모드)
    const [updateLibraryType, setUpdateLibraryType] = useState(null); 

    useEffect(() => {

    },[refreshTrigger, myLibraryList])


    //'내 서재 추가' 기능
    function addNewMyLibrary(){

        //회원번호, 기본값 전달
        const myLibraryMemberNo = loginMember.memberNo;
        const myLibraryName = name;
        const isDefault = F;

    }



    return (
        <>
            helloworld
            <div>
            </div>
        </>
    )
}