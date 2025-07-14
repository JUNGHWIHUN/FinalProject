import { Link, useNavigate, useSearchParams } from "react-router-dom"; // useSearchParams 추가
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import { useEffect, useState, useMemo } from "react";
import PageNavi from "../common/PageNavi";

// 공지사항 게시글 목록
export default function NoticeList(){
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const memoizedAxiosInstance = useMemo(() => createInstance(), []);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams(); // useSearchParams 훅 추가

    const [boardList, setBoardList] = useState([]);      
    const [importantNoticeList, setImportantNoticeList] = useState([]);
    const [pageInfo, setPageInfo] = useState({ start: 1, end: 1, pageNo: 1, pageNaviSize: 5, totalPage: 1 });
    // reqPage 상태는 URL 쿼리 파라미터와 동기화됩니다.
    const [reqPage, setReqPage] = useState(1); 
    const {loginMember} = useUserStore();

    // --- 중요 변경 시작: useEffect로 URL 쿼리 파라미터에서 reqPage 읽어오기 ---
    useEffect(() => {
        // URL에서 'page' 쿼리 파라미터를 읽어옵니다.
        const page = searchParams.get('page');
        const pageNum = page ? parseInt(page) : 1; // 'page' 파라미터가 없으면 1페이지로 설정

        // 현재 reqPage와 다르면 업데이트하여 데이터 재요청 트리거
        if (pageNum !== reqPage) {
            setReqPage(pageNum);
        }
    }, [searchParams]); // searchParams가 변경될 때마다 실행
    // --- 중요 변경 끝 ---

    useEffect(function(){
        if (reqPage === 0) return; // 0 페이지 요청 방지

        let options = {};
        options.url = serverUrl + "/notice/list/" + reqPage; 
        options.method = 'get';

        memoizedAxiosInstance(options)
        .then(function(res){
            if (res.data && res.data.resData) {
                const responseData = res.data.resData;

                const allBoardListFromServer = responseData.boardList || []; 
                const newPageInfo = responseData.pageInfo || pageInfo; 

                setBoardList(allBoardListFromServer); 
                
                const filteredImportantNotices = allBoardListFromServer.filter(board => board.isImportant === 'Y');
                setImportantNoticeList(filteredImportantNotices);
                
                setPageInfo(newPageInfo);

            } else {
                console.warn("NoticeList: 백엔드 응답 res.data.resData가 유효하지 않습니다.", res.data);
                setBoardList([]);
                setImportantNoticeList([]); 
                setPageInfo({ start: 1, end: 1, pageNo: 1, pageNaviSize: 5, totalPage: 1 });
            }
        })
        .catch(function(error){
            console.error("공지사항 목록 조회 실패:", error);
            setBoardList([]);
            setImportantNoticeList([]); 
            setPageInfo({ start: 1, end: 1, pageNo: 1, pageNaviSize: 5, totalPage: 1 });
        });
    },[reqPage, serverUrl, memoizedAxiosInstance, loginMember, searchParams]); // searchParams를 의존성 배열에 추가

    // --- 중요 변경 시작: setReqPage 함수를 직접 호출하는 대신 URL 업데이트 ---
    // PageNavi에 전달할 페이지 변경 핸들러를 수정합니다.
    const handlePageChange = (pageNumber) => {
        setSearchParams({ page: pageNumber }); // URL 쿼리 파라미터를 업데이트합니다.
    };
    // --- 중요 변경 끝 ---

    return(
        <section className="section board-list">
            <div className="page-header-container">
                <div className="page-title">공지사항</div>
                {loginMember && loginMember.isAdmin === 'T'
                    ? <Link to="/board/notice/write" className="btn-primary btn-write">글쓰기</Link>
                    : null
                }
            </div>
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
                        {/* 1. 중요 공지사항 영역: reqPage가 1일 때만 최상단에 고정 출력 */}
                        {reqPage === 1 && importantNoticeList.length > 0 && importantNoticeList.map(function(board){
                            return (
                                <tr key={"important-fixed-board-" + board.boardNo} className="important-notice-row" onClick={function(){
                                    navigate('/board/notice/view/' + board.boardNo);
                                }}>
                                    <td>공지</td>
                                    <td className="board-title">
                                        {board.boardTitle}
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        {board.fileList && board.fileList.length > 0 ? (
                                            <span className="material-icons" >
                                                attach_file
                                            </span>
                                        ) : (
                                            null
                                        )}
                                    </td>
                                    <td>{new Date(board.boardDate).toLocaleDateString('ko-KR')}</td>
                                </tr>
                            );
                        })}

                        {/* 2. 전체 공지사항 영역: 일반 공지, 중요 공지 모두 포함하여 페이지네이션에 따라 출력 */}
                        {boardList.length === 0 && importantNoticeList.length === 0 ? (
                            <tr>
                                <td colSpan="4">등록된 게시글이 없습니다.</td>
                            </tr>
                        ) : (
                            boardList && boardList.map(function(board){ 
                                return (
                                    <tr key={"board-" + board.boardNo} onClick={function(){ 
                                        navigate('/board/notice/view/' + board.boardNo);
                                    }}>
                                        <td>{board.boardNo}</td> 
                                        <td className="board-title">
                                            {board.boardTitle}
                                        </td>
                                        <td style={{textAlign: 'center'}}>
                                            {board.fileList && board.fileList.length > 0 ? (
                                                <span className="material-icons" >
                                                    attach_file
                                                </span>
                                            ) : (
                                                null
                                            )}
                                        </td>
                                        <td>{new Date(board.boardDate).toLocaleDateString('ko-KR')}</td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            <div className="board-paging-wrap">
                {/* setReqPage 대신 handlePageChange 함수를 전달합니다. */}
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={handlePageChange} />
            </div>
        </section>
    );
}