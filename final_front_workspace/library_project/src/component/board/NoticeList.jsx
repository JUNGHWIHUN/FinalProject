// src/component/board/NoticeList.jsx
import { Link, useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { useEffect, useState, useMemo } from "react"; // useMemo 임포트 추가
import PageNavi from "../common/PageNavi";
import NoticeListItem from "./NoticeListItem";

// 공지사항 게시글 목록
export default function NoticeList(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    // -- 변경 시작: axiosInstance를 useMemo로 메모이제이션 --
    const memoizedAxiosInstance = useMemo(() => createInstance(), []); // 컴포넌트 마운트 시 한 번만 생성
    // -- 변경 끝 --
    const navigate = useNavigate();

    const [boardList, setBoardList] = useState([]);
    const [pageInfo, setPageInfo] = useState({ start: 1, end: 1, pageNo: 1, pageNaviSize: 5, totalPage: 1 });
    const [reqPage, setReqPage] = useState(1);
    const {loginMember} = useUserStore();

    useEffect(function(){
        if (reqPage === 0) return;

        let options = {};
        options.url = serverUrl + "/notice/list/" + reqPage;
        options.method = 'get';

        // -- 변경 시작: memoizedAxiosInstance 사용 --
        memoizedAxiosInstance(options)
        // -- 변경 끝 --
        .then(function(res){
            // -- 변경 시작: 데이터가 변경되었을 때만 상태 업데이트 (무한 렌더링 방지 로직 유지) --
            if (JSON.stringify(boardList) !== JSON.stringify(res.data.resData.boardList)) {
                setBoardList(res.data.resData.boardList);
            }
            if (JSON.stringify(pageInfo) !== JSON.stringify(res.data.resData.pageInfo)) {
                setPageInfo(res.data.resData.pageInfo);
            }
            // -- 변경 끝 --
        })
        .catch(function(error){
            console.error("공지사항 목록 조회 실패:", error);
        });
    // -- 변경 시작: 의존성 배열에서 axiosInstance 대신 memoizedAxiosInstance 사용 --
    },[reqPage, serverUrl, memoizedAxiosInstance]);
    // -- 변경 끝 --

    return(
        <section className="section board-list">
            <div className="page-title">공지사항</div>
            {loginMember && loginMember.isAdmin === 'T'
            ? <Link to="/board/notice/write" className="btn-primary">글쓰기</Link>
            : ''}
            <div className="board-list-wrap">
                <table className="tbl">
                    <thead>
                        <tr>
                            <th style={{width:'10%'}}>글번호</th>
                            <th style={{width:'auto'}}>제목</th>
                            <th style={{width:'15%'}}>첨부파일</th>
                            <th style={{width:'20%'}}>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boardList.length === 0 ? (
                            <tr>
                                <td colSpan="4">등록된 게시글이 없습니다.</td>
                            </tr>
                        ) : (
                            boardList.map(function(board, index){
                                return (
                                    <tr key={"board" + index} onClick={function(){
                                        navigate('/board/notice/view/' + board.boardNo);
                                    }}>
                                        <td>{board.boardNo}</td>
                                        <td className="board-title">
                                            {board.boardTitle}
                                            {board.fileList && board.fileList.length > 0 && (
                                                <span className="material-icons" style={{ fontSize: '1.2em', verticalAlign: 'middle', marginLeft: '5px', color: '#666' }}>
                                                    attachment
                                                </span>
                                            )}
                                        </td>
                                        <td>
                                            {board.fileList && board.fileList.length > 0 ? '있음' : '없음'}
                                        </td>
                                        <td>{board.boardDate}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="board-paging-wrap">
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </section>
    )
}