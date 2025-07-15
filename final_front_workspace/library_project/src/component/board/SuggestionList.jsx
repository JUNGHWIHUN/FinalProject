import { Link, useNavigate, useSearchParams } from "react-router-dom"; // useSearchParams 추가
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { useEffect, useState, useMemo } from "react";
import PageNavi from "../common/PageNavi";
import Swal from 'sweetalert2'; // Swal 임포트


// 건의사항 게시글 목록
export default function SuggestionList() {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const memoizedAxiosInstance = useMemo(() => createInstance(), []);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // URL 쿼리 파라미터를 위한 훅

    const [boardList, setBoardList] = useState([]);
    const [pageInfo, setPageInfo] = useState({ start: 1, end: 1, pageNo: 1, pageNaviSize: 5, totalPage: 1 });
    // reqPage 상태는 이제 URL 쿼리 파라미터에서 초기화됩니다.
    const [reqPage, setReqPage] = useState(1);
    const { loginMember } = useUserStore();

    useEffect(() => {
        // URL에서 'page' 쿼리 파라미터를 읽어옵니다. (예: ?page=2)
        const page = searchParams.get('page');
        // 파라미터가 없으면 1페이지로, 있으면 해당 페이지 번호로 변환합니다.
        const pageNum = page ? parseInt(page) : 1; 

        // 현재 reqPage와 URL에서 읽어온 페이지 번호가 다르면 상태를 업데이트합니다.
        // 이로써 reqPage가 변경되고, 아래 데이터 로딩 useEffect가 다시 실행됩니다.
        if (pageNum !== reqPage) {
            setReqPage(pageNum);
        }
    }, [searchParams]); // searchParams가 변경될 때마다 이 useEffect가 실행됩니다.

    useEffect(function() {
        // reqPage가 유효한 값일 때만 API 요청을 보냅니다.
        if (reqPage === 0) return;

        let options = {};
        options.url = serverUrl + "/suggestion/list/" + reqPage; // 현재 reqPage에 해당하는 건의사항 목록 요청
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
    }, [reqPage, serverUrl, memoizedAxiosInstance, loginMember, searchParams]); // searchParams를 의존성 배열에 추가

    // 페이지네이션 컴포넌트(PageNavi)에서 페이지 번호가 클릭되면 이 함수가 호출됩니다.
    const handlePageChange = (pageNumber) => {
        // reqPage 상태를 직접 변경하는 대신, URL 쿼리 파라미터를 업데이트합니다.
        // 이 변경은 위에서 추가한 useEffect를 트리거하여 reqPage 상태를 업데이트합니다.
        setSearchParams({ page: pageNumber }); 
    };

    //비밀글일 경우 글 확인 불가 로직
    function boardView(board){
        if(board.isSecret === 'Y'){
            if(board.boardWriter == loginMember.memberNo || loginMember.isAdmin === 'T'){
                navigate('/board/suggestion/view/' + board.boardNo);
            }else{
                Swal.fire({
                    title: '알림',
                    text: '비밀글입니다',
                    icon: 'warning'
                })
            }
        }else{
            navigate('/board/suggestion/view/' + board.boardNo);
        }
    }

    return (
        <section className="section board-list">
            <div className="page-header-container">
                <div className="page-title">건의사항</div>
                {loginMember
                    ? <Link to="/board/suggestion/write" className="btn-primary btn-write">글쓰기</Link>
                    : ''}
            </div>
            <div className="board-list-wrap">
                <table className="tbl">
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>글번호</th>
                            <th style={{ width: 'auto' }}>제목</th>
                            <th style={{ width: '15%' }}>글쓴이</th>
                            <th style={{ width: '15%' }}>작성일</th>
                            <th style={{ width: '10%' }}>답변 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boardList.length === 0 ? (
                            <tr>
                                <td colSpan="5">등록된 게시글이 없습니다.</td>
                            </tr>
                        ) : (
                            boardList.map(function(board, index) {
                                return (
                                    <tr key={"board" + index} onClick={() => boardView(board)} >
                                            <td>{board.boardNo}</td>
                                            <td className="board-title">{board.boardTitle}
                                            {board.isSecret === 'Y' && (
                                                <span className="material-icons" style={{ fontSize: '1.2em', verticalAlign: 'middle', marginLeft: '5px', color: '#666' }}>
                                                    lock
                                                </span>
                                            )}</td><td>{board.boardWriterId}</td><td>{new Date(board.boardDate).toLocaleDateString('ko-KR')}</td>
                                            <td>
                                                {board.commentCount > 0 ? '답변 완료' : '답변 대기'}
                                            </td>
                                        </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="board-paging-wrap">
                {/* PageNavi 컴포넌트에 새로운 페이지 변경 핸들러를 전달합니다. */}
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={handlePageChange} />
            </div>
        </section>
    );
}