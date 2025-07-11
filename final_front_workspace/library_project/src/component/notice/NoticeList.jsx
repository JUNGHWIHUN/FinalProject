import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";


export default function NoticeList(){

    const [notices, setNotices] = useState([]);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    
    const [pageInfo, setPageInfo] = useState({});
    const  [reqPage , setReqPage] = useState(1);

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/notice/noticeList" + reqPage;
        options.method = "get"
      

        axiosInstacne(options)
        .then(function(res){
            console.log(res.data.resData);
        })
        .catch(function(err){

        })

    },[reqPage])

    return(
        <table>
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>첨부파일</th>
                    <th>작성일</th>
                </tr>
            </thead>
            <tbody>
                {notices.map(function(notice, index){
                    return <tr key={"notice"+ index}>
                        <td>{notice.noticeNo}</td>
                        <td>{notice.noticeTitle}</td>
                        <td>{notice.noticeFile}</td>
                        <td>{notice.noticeDate}</td>
                    </tr>
                })}
            </tbody>
            <div>
                <PageNavi pageInfo = {pageInfo} reqPage = {reqPage} setReqPage={setReqPage}/>
            </div>
        </table>
    )
}