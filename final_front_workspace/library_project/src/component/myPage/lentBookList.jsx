import { useState } from "react"
import createInstance from "../../axios/Interceptor";

//현재 대출 목록 컴포넌트
export default function LentBookList(){

    
    const [lentBookList, setLentBookList] = useState([]);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    const [PageInfo, setPageInfo] = useState({});
    

    return(
        <>
        <h3>hi</h3>
        </>
    )
}