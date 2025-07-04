import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";

//대출 이력 컴포넌트
export default function LentHistory(){

    //도서 대출 이력을 보여줄 state 변수
    const [lentHistoryList, setLentHistoryList] = useState([]);

    //환경변수 파일에 저장된 서버 URL 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    
    
    
    const axiosInstacne = createInstance();
    const [pageInfo, setPageInfo] = useState({});
    const [reqPage, setReqPage] = useState(1);

    const {loginMember} = useUserStore();

    useEffect(function(){

        let options = {};
        options.url = serverUrl + "/lentHistory/" + reqPage;
        options.method = "get";
        options.params = {
            memberNo : loginMember.memberNo
        }

        axiosInstacne(options)
        .then(function(res){
            console.log(res.data.resData.lentHistoryList);
            setLentHistoryList(res.data.resData.lentHistoryList);
            setPageInfo(res.data.resData.pageInfo);
        })
        .catch(function(err){
            console.log(err);
        })

    },[reqPage, loginMember]);

    return(
        <>
        <div>대출 이력</div>
            <table>
                <thead>
                    <tr>
                        <th>제목</th>        
                        <th>카테고리</th>        
                        <th>대출일</th>        
                        <th>실제 반납일</th>        
                    </tr>
                </thead>
                <tbody>
                    {lentHistoryList.map(function(lentHistory,index){
                        return <tr key={"lentHistory" + index}>
                            <td>{lentHistory.title}</td>
                            <td>{lentHistory.lentCallNo.charAt(0)== '0' ? '총류' :
                                 lentHistory.lentCallNo.charAt(0)== '1' ? '철학' :
                                 lentHistory.lentCallNo.charAt(0)== '2' ? '종교' :
                                 lentHistory.lentCallNo.charAt(0)== '3' ? '사회과학' :
                                 lentHistory.lentCallNo.charAt(0)== '4' ? '순수과학' :
                                 lentHistory.lentCallNo.charAt(0)== '5' ? '기술과학' :
                                 lentHistory.lentCallNo.charAt(0)== '6' ? '예술' :
                                 lentHistory.lentCallNo.charAt(0)== '7' ? '언어' :
                                 lentHistory.lentCallNo.charAt(0)== '8' ? '문학' :
                                 lentHistory.lentCallNo.charAt(0)== '9' ? '역사' :
                                 '그런 책 없음'
                                }
                            </td>
                            <td>{lentHistory.lentDate}</td>
                            <td>{lentHistory.actualReturnDate}</td>
                        </tr>
                    })}
                </tbody>
        </table>
                <div>
                <PageNavi pageInfo = {pageInfo} reqPage = {reqPage} setReqPage = {setReqPage}/>
                </div>
        </>
    )
}