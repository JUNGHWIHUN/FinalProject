import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageNaviNew from './PageNaviNew';
import "./Admin.css";
import { useNavigate } from "react-router-dom";

export default function ReportList(){
    //신고 목록 보기

    //신고 목록 
    const [reportList, setReportList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const navigate = useNavigate();

    //페이지 정보
    const [reqPage, setReqPage] = useState(1); 
    const [pageInfo, setPageInfo] = useState({});

    //리스트 불러오기
    useEffect(() => {
            let options = {};
            options.url='http://localhost:9999/admin/reportList/'+reqPage;
            options.method = 'get';
            

            axios(options)
            .then(function(res){
               setReportList(res.data.resData.ReportList);
               setPageInfo(res.data.resData.pageInfo);
            })
            .catch(function(err){
            console.log(err); 
            });

    }, [reqPage])

     if (!reportList) {
        return <div>정보를 불러오는 중...</div>;
    }
    return(
        <>
            <h3>신고 목록</h3>

            <table border="1">
                        <thead>
                          <tr>
                              <th>신고번호</th>
                              <th>신고사유</th>
                              <th>신고한 댓글번호</th>
                              <th>신고한 회원 번호</th>
                              <th>처리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportList.map(function(list, index){
                             
                             return <ListItem key={"list"+index} list={list}/>
                          })}
                         </tbody>
            </table>

            <div>
                <PageNaviNew pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage}></PageNaviNew>
            </div>
        </>
    )
}

function ListItem(props){
    //받아온 리스트 가져오기
    const list = props.list;

    //확인 버튼 상태 변경용
    const [isCompleted, setIsCompleted] = useState(false);

    const navigate = useNavigate();
    //삭제
     function deleteList(){
        const confirmUpdate = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }

        let options = {};
            options.url='http://localhost:9999/admin/repartDelete';
            options.method = 'post';
            options.data = {
                target : list.repartNo
            }
            
            axios(options)
            .then(function(res){
                alert("삭제되었습니다.");
                setIsCompleted(true);
            })
            .catch(function(err){
            console.log(err); 
            });
    }

    function goDetail(p){
        console.log("그거"+p);
        navigate("/book/searchResultDetail/"+p);
    }

    return(
        <>
        <tr>
            <td onClick={() => goDetail(list.commentCallNo)}>{list.repartNo}</td>
            <td>{list.repartReson}</td>
            <td>{list.commentNo}</td>
            <td>{list.repoterNo}</td>
            <td><button onClick={deleteList} disabled={isCompleted}>{isCompleted ? "처리완료" : "삭제"}</button></td>
        </tr>
        </>
    )
}