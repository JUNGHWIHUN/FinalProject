// src/component/board/SuggestionList.jsx
import { Link, useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { useEffect, useState, useMemo } from "react";
import PageNavi from "../common/PageNavi";

// 건의사항 게시글 목록
export default function SuggestionList() {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const memoizedAxiosInstance = useMemo(() => createInstance(), []);
    const navigate = useNavigate();

    const [boardList, setBoardList] = useState([]);
    const [pageInfo, setPageInfo] = useState({ start: 1, end: 1, pageNo: 1, pageNaviSize: 5, totalPage: 1 });
    const [reqPage, setReqPage] = useState(1);
    const { loginMember } = useUserStore();

    useEffect(function() {
        if (reqPage === 0) return;

        let options = {};
        options.url = serverUrl + "/suggestion/list/" + reqPage;
        options.method = 'get';
        options.params = {
            loginMemberNo: loginMember?.memberNo,
            isAdmin: loginMember?.isAdmin || 'F'
        };

        memoizedAxiosInstance(options)
            .then(function(res) {
                // 데이터가 변경되었을 때만 상태 업데이트 (무한 렌더링 방지 로직 유지)
                if (JSON.stringify(boardList) !== JSON.stringify(res.data.resData.boardList)) {
                    setBoardList(res.data.resData.boardList);
                }
                if (JSON.stringify(pageInfo) !== JSON.stringify(res.data.resData.pageInfo)) {
                    setPageInfo(res.data.resData.pageInfo);
                }
            })
            .catch(function(error) {
                console.error("건의사항 목록 조회 실패:", error);
                // 오류 처리 (예: 스윗얼럿)
            });
    }, [reqPage, serverUrl, memoizedAxiosInstance, loginMember]);

    return (
        <section className="section board-list">
            <div className="page-title">건의사항</div>
            {loginMember
                ? <Link to="/board/suggestion/write" className="btn-primary">글쓰기</Link>
                : ''}
            <div className="board-list-wrap">
                <table className="tbl">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>글번호</th>
                            <th style={{ width: 'auto' }}>제목</th>
                            <th style={{ width: '15%' }}>글쓴이</th> {/* 폭 조정 */}
                            <th style={{ width: '15%' }}>작성일</th> {/* 폭 조정 */}
                            <th style={{ width: '10%' }}>답변 상태</th> {/* -- 변경 시작: 답변 상태 컬럼 추가 -- */}
                        </tr>
                    </thead>
                    <tbody>
                        {boardList.length === 0 ? (
                            <tr>
                                <td colSpan="5">등록된 게시글이 없습니다.</td> {/* -- 변경: colspan 조정 (컬럼 수 증가) -- */}
                            </tr>
                        ) : (
                            boardList.map(function(board, index) {
                                return (
                                    <tr key={"board" + index} onClick={function() {
                                        navigate('/board/suggestion/view/' + board.boardNo);
                                    }}><td>{board.boardNo}</td><td className="board-title">{board.boardTitle}
                                        {board.isSecret === 'Y' && (
                                            <span className="material-icons" style={{ fontSize: '1.2em', verticalAlign: 'middle', marginLeft: '5px', color: '#666' }}>
                                                lock
                                            </span>
                                        )}</td><td>{board.boardWriterId}</td><td>{board.boardDate}</td>
                                        {/* -- 변경 시작: 답변 상태 표시 -- */}
                                        <td>
                                            {/* board.commentList는 상세 조회 시에만 가져오므로, 여기서는 댓글 수를 직접 판단할 수 없음.
                                                백엔드에서 BoardDto에 commentCount 필드를 추가하여 전달해 주거나,
                                                별도의 API 호출이 필요합니다.
                                                현재는 댓글 목록이 조회되는 가정 하에, BoardDto에 commentCount 필드가 있다는 전제로 작성합니다.
                                                만약 BoardDto에 commentCount가 없다면, 백엔드 BoardDto와 selectSuggestionList 쿼리 수정이 필요합니다.
                                                여기서는 일단 BoardDto에 commentCount가 있다는 가정하에 작성합니다.
                                            */}
                                            {board.commentCount > 0 ? '답변 완료' : '답변 대기'}
                                        </td>
                                        {/* -- 변경 끝 -- */}
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
    );
}