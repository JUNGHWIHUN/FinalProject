import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageNaviNew from './PageNaviNew';
import "./Admin.css";


export default function RequestBook(){
    //건의사항

    //건의사항 목록
    const [requestList, setRequestList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    //페이지 정보
    const [reqPage, setReqPage] = useState(1); 
    const [pageInfo, setPageInfo] = useState({});


    //리스트 가져오기
    useEffect(() => {
            let options = {};
            options.url='http://localhost:9999/admin/requestList/'+reqPage;
            options.method = 'get';
            

            axios(options)
            .then(function(res){
               setRequestList(res.data.resData.RequestList);
               setPageInfo(res.data.resData.pageInfo);
            })
            .catch(function(err){
            console.log(err); 
            });

    }, [reqPage])


    
    if (!requestList) {
        return <div>정보를 불러오는 중...</div>;
        }

    return(
        <>
        <h3>희망도서 목록

            <table border="1">
                        <thead>
                          <tr>
                              <th>회원번호</th>
                              <th>책 제목</th>
                              <th>건의 일자</th>
                              <th>처리</th>
                              <th>확인</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requestList.map(function(list, index){
                             
                             return <ListItem key={"list"+index} list={list}/>
                          })}
                         </tbody>
            </table>

            <div>
                <PageNaviNew pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </h3>
        </>
    )
}

function ListItem(props){
    const list = props.list;

    //타입 저장용
    const [selectType, setSelectType] = useState('yes');
    //확인 버튼 상태 변경용
    const [isCompleted, setIsCompleted] = useState(false);

    function keywordType(e){
      setSelectType(e.target.value);
    }

    function updateList(){
        const confirmUpdate = window.confirm("정말 수정하시겠습니까?");
        if (!confirmUpdate) {
                return; // 취소하면 함수 종료
            }
        console.log(selectType);
        let options = {};
            options.url='http://localhost:9999/admin/requestUpdate';
            options.method = 'post';
            options.data = {
                type : selectType, target : list.requestBookNo
            }
            

            axios(options)
            .then(function(res){
                alert("수정되었습니다.");
                setIsCompleted(true);
            })
            .catch(function(err){
            console.log(err); 
            });
    }

    return(
        <>
        <tr>
            <td><Link to="/RequestDetail" state={{ list : list }}>{list.memberNo}</Link></td>
            <td>{list.requestBookName}</td>
            <td>{list.requestDate}</td>
            <td>
                <select value={selectType} onChange={keywordType}>
                      <option value="yes">승인</option>
                      <option value="no">반려</option>
                </select>
            </td>
            <td><button onClick={updateList} disabled={isCompleted}>{isCompleted ? "처리완료" : "확인"}</button></td>
        </tr>
        </>
    )
}

