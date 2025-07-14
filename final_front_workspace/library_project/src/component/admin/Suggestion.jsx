import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageNaviNew from './PageNaviNew';
export default function Suggestion(){

    const [suggesList, setSuggesList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [reqPage, setReqPage] = useState(1); 
    const [pageInfo, setPageInfo] = useState({});

    useEffect(() => {
            let options = {};
            options.url='http://localhost:9999/admin/suggesList/'+reqPage;
            options.method = 'get';
            

            axios(options)
            .then(function(res){
               setSuggesList(res.data.resData.SuggesList);
               setPageInfo(res.data.resData.pageInfo);
            })
            .catch(function(err){
            console.log(err); 
            });

    }, [reqPage])

     if (!suggesList) {
        return <div>정보를 불러오는 중...</div>;
    }

    return(
        <div className="suggestion-wrapper">
            <h3>건의사항 목록</h3>

            <table className="suggestion-table">
                <thead>
                    <tr>
                        <th>회원이름</th>
                        <th>건의사항 제목</th>
                        <th>건의 일자</th>
                        <th>처리</th>
                    </tr>
                </thead>
                <tbody>
                    {suggesList.map(function(list, index){
                        return <ListItem key={"list"+index} list={list} />;
                    })}
                </tbody>
            </table>

            <div>
                <PageNaviNew pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage}></PageNaviNew>
            </div>
        </div>
    )
}

function ListItem(props){
    const list = props.list;

    //확인 버튼 상태 변경용
    const [isCompleted, setIsCompleted] = useState(false);

     function deleteList(){
        const confirmUpdate = window.confirm("정말 삭제하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }

        let options = {};
            options.url='http://localhost:9999/admin/suggesDelete';
            options.method = 'post';
            options.data = {
                target : list.memberNo
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

    return(
         <tr>
            <td><Link to="/SuggestDetail" state={{ list: list }}>{list.memberName}</Link></td>
            <td>{list.suggesTitle}</td>
            <td>{list.suggesDate}</td>
            <td>
                <button 
                    className="suggestion-button" 
                    onClick={deleteList} 
                    disabled={isCompleted}
                >
                    {isCompleted ? "처리완료" : "삭제"}
                </button>
            </td>
        </tr>
    )
}