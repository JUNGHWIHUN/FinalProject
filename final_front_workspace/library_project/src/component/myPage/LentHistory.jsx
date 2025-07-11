import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";
import './MyPage.css'; // MyPage.css 임포트 유지

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
        };

        axiosInstacne(options)
        .then(function(res){
            console.log(res.data.resData.lentHistoryList);
            setLentHistoryList(res.data.resData.lentHistoryList);
            setPageInfo(res.data.resData.pageInfo);
        })
        .catch(function(err){
            console.log(err);
        });
    },[reqPage, loginMember]);

    return(
        <div className="lent-history-container"> {/* 전체 컨테이너 추가 */}
            <h2 className="page-title">대출 이력</h2> {/* 페이지 제목에 클래스 추가 */}

            
            {lentHistoryList.length === 0 ? (
                <p className="no-history-message">대출 이력이 없습니다.</p>
            ) : (
                <table className="lent-history-table"> {/* 테이블에 클래스 추가 */}
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
                            // 카테고리 로직을 더 간결하고 가독성 좋게 변수화
                            const category =
                                lentHistory.lentCallNo && lentHistory.lentCallNo.length > 0
                                ? (lentHistory.lentCallNo.charAt(0) === '0' ? '총류' :
                                   lentHistory.lentCallNo.charAt(0) === '1' ? '철학' :
                                   lentHistory.lentCallNo.charAt(0) === '2' ? '종교' :
                                   lentHistory.lentCallNo.charAt(0) === '3' ? '사회과학' :
                                   lentHistory.lentCallNo.charAt(0) === '4' ? '순수과학' :
                                   lentHistory.lentCallNo.charAt(0) === '5' ? '기술과학' :
                                   lentHistory.lentCallNo.charAt(0) === '6' ? '예술' :
                                   lentHistory.lentCallNo.charAt(0) === '7' ? '언어' :
                                   lentHistory.lentCallNo.charAt(0) === '8' ? '문학' :
                                   lentHistory.lentCallNo.charAt(0) === '9' ? '역사' :
                                   '분류 없음') // '그런 책 없음' 대신 '분류 없음' 또는 적절한 메시지
                                : '정보 없음'; // lentCallNo 자체가 없거나 비어있는 경우

                            return (
                                <tr key={"lentHistory" +index}>
                                    <td>{lentHistory.title}</td>
                                    <td>{category}</td> {/* 변수 사용 */}
                                    <td>{lentHistory.lentDate}</td>
                                    <td>{lentHistory.actualReturnDate}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            <div className="pagination-container"> {/* 페이지네이션 컨테이너 추가 */}
                <PageNavi pageInfo = {pageInfo} reqPage = {reqPage} setReqPage = {setReqPage}/>
            </div>
        </div>
    );
}