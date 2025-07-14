import { Link, useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { useEffect, useState } from "react";
import PageNavi from "../common/PageNavi";

//게시글 목록
export default function BoardList(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [boardList, setBoardList] = useState([]);      //게시글 리스트 저장 변수
    const [reqPage, setReqPage] = useState(1);           //요청 페이지
    const [pageInfo, setPageInfo] = useState({});        //페이지네이션
    const {isLogined} = useUserStore();                  //로그인 여부 (글쓰기 버튼 노출 여부)

    useEffect(function(){
        let options = {};
        options.url = serverUrl + "/board/list/" + reqPage;
        options.method = 'get';

        axiosInstance(options)    //현재 interceptor 에서 결과 처리 응답을 해 주고 있지만, 그 이외 로직이 필요한 경우는 따로 여기에 작성하면 됨
        .then(function(res){
            setBoardList(res.data.resData.boardList);
            setPageInfo(res.data.resData.pageInfo);
        });

    },[reqPage]);   //의존성 배열 : 이 배열 요소가 변경되었을 때 useEffect 를 다시 실행, 즉 reqPage (요청 페이지) 가 변경될 때 이 함수를 실행해 게시글 목록을 새로 불러옴

    return(
        <section className="section board-list">
            <div className="page-title">자유게시판</div>
            {isLogined
            ? <Link to="/board/write" className="btn-primary">글쓰기</Link>
            : ''}
            <div className="board-list-wrap">
                <ul className="posting-wrap">
                    {boardList.map(function(board, index){
                        //게시글 1개에 대한 jsx를 BoardItem 이 반환한 jsx로
                        return <BoardItem key={"board"+index} board={board} serverUrl={serverUrl}/>
                    })}
                </ul>
            </div>
            <div className="board-paging-wrap">
                    {/* 페이지네이션 제작 컴포넌트를 별도 분리하여 작성하고, 필요 시 재사용 */}
                    <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </section>
    )
}

//게시글 1개
function BoardItem(props) {
    const board = props.board;
    const serverUrl = props.serverUrl;
    const navigate = useNavigate();

    return (
        <li className="posting-item" onClick={function(){
            //상세보기 (BoardView) 컴포넌트 전환
            navigate('/board/view/' + board.boardNo);
        }}>
            <div className="posting-img">
                {/* 섬네일 이미지가 등록된 경우 백엔드로 요청하고, 등록되지 않은 경우에는 기본 이미지가 표기되도록 처리 */}
                {/* <img src={board.boardThumbPath ? serverUrl + "/board/thumb/" + board.boardThumbPath.substring(0, 8) + "/" + board.boardThumbPath
                    : "/images/default_img.png"}/>
                */}
                <img src="/images/default_img.png"/> {/* 썸네일 기능 제거에 따라 기본 이미지로 고정 */}
            </div>
            <div className="posting-info">
                <div className="posting-title">{board.boardTitle}</div>
                <div className="posting-sub-info">
                    <span>{board.boardWriter}</span> 
                    <span>{board.boardDate}</span>
                </div>
            </div>
        </li>
    );
}