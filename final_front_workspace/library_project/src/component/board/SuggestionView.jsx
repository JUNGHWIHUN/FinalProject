// src/component/board/SuggestionView.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState, useMemo, useCallback } from "react"; // useMemo 임포트 추가
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Swal from 'sweetalert2';

// 건의사항 게시글 상세 정보
export default function SuggestionView() {
    const param = useParams();
    const boardNo = param.boardNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const memoizedAxiosInstance = useMemo(() => createInstance(), []);
    const navigate = useNavigate();

    const [board, setBoard] = useState({});
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');

    const { loginMember } = useUserStore();

    // 게시글 상세 정보 및 답변 목록 불러오기
    useEffect(function() {
        // 게시글 상세 정보
        let boardOptions = {};
        boardOptions.url = serverUrl + '/suggestion/' + boardNo;
        boardOptions.method = 'get';
        boardOptions.params = {
            loginMemberNo: loginMember?.memberNo,
            isAdmin: loginMember?.isAdmin || 'F'

        };
        
        memoizedAxiosInstance(boardOptions)
        .then(function(res) {
            const board = res.data.resData;
            setBoard(board);
            console.log(res.data.resData);
            
            console.log('로그인멤버넘버'+loginMember?.memberNo);


            })
            .catch(function(error) {
                console.error("게시글 조회 실패:", error);
                Swal.fire({
                    title: '오류',
                    text: error.response?.data?.resMsg || '게시글을 불러오는 데 실패했습니다.',
                    icon: 'error'
                }).then(() => {
                    navigate('/board/suggestion/list');
                });
            });

        fetchComments();

    }, [boardNo, navigate, serverUrl, memoizedAxiosInstance, loginMember]); // 의존성 배열에 memoizedAxiosInstance, loginMember 추가


    // 답변 목록 불러오는 함수
    const fetchComments = useCallback(() => { // useCallback으로 감싸서 안정화
        let commentOptions = {};
        commentOptions.url = serverUrl + '/suggestion/' + boardNo + '/comments';
        commentOptions.method = 'get';
        memoizedAxiosInstance(commentOptions)
            .then(function(res) {
                if (JSON.stringify(comments) !== JSON.stringify(res.data.resData.commentList)) {
                    setComments(res.data.resData.commentList || []);
                }
            })
            .catch(function(error) {
                console.error("답변 목록 조회 실패:", error);
            });
    }, [boardNo, serverUrl, memoizedAxiosInstance, comments]); // comments 의존성 추가 (데이터 비교용)

    // 답변 등록 함수 (관리자만 가능)
    function submitComment() {
        if (!loginMember || loginMember.isAdmin !== 'T') {
            Swal.fire('권한 없음', '답변은 관리자만 작성할 수 있습니다.', 'warning');
            return;
        }
        if (newCommentContent.trim() === '') {
            Swal.fire('알림', '답변 내용을 입력해주세요.', 'warning');
            return;
        }

        let options = {};
        options.url = serverUrl + '/suggestion/comments';
        options.method = 'post';
        options.data = {
            boardNo: boardNo,
            commentContent: newCommentContent,
            memberNo: loginMember.memberNo,
            parentCommentNo: null
        };
        options.params = { isAdmin: loginMember.isAdmin };

        memoizedAxiosInstance(options)
            .then(function(res) {
                if (res.data.resData) {
                    Swal.fire('성공', '답변이 등록되었습니다.', 'success');
                    setNewCommentContent('');
                    fetchComments();
                } else {
                    Swal.fire('실패', res.data.resMsg || '답변 등록에 실패했습니다.', 'error');
                }
            })
            .catch(function(error) {
                console.error("답변 등록 실패:", error);
                Swal.fire('오류', '답변 등록 중 문제가 발생했습니다.', 'error');
            });
    }

    // 답변 삭제 함수 (관리자만 가능)
    function deleteComment(commentNo) {
        if (!loginMember || loginMember.isAdmin !== 'T') {
            Swal.fire('권한 없음', '답변은 관리자만 삭제할 수 있습니다.', 'warning');
            return;
        }
        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 답변은 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5cb85c',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                let options = {};
                options.url = serverUrl + '/suggestion/comments/' + commentNo;
                options.method = 'delete';
                options.params = { isAdmin: loginMember.isAdmin };

                memoizedAxiosInstance(options)
                    .then(function(res) {
                        if (res.data.resData) {
                            Swal.fire('삭제 완료!', '답변이 성공적으로 삭제되었습니다.', 'success');
                            fetchComments();
                        } else {
                            Swal.fire('삭제 실패', res.data.resMsg || '답변 삭제에 실패했습니다.', 'error');
                        }
                    })
                    .catch(function(error) {
                        console.error("답변 삭제 실패:", error);
                        Swal.fire('오류 발생', '답변 삭제 중 문제가 발생했습니다.', 'error');
                    });
            }
        });
    }

    // 게시글 삭제 함수 (관리자만 가능)
    function deleteBoard() {
        if (!loginMember || loginMember.isAdmin !== 'T') {
            Swal.fire('권한 없음', '건의사항은 관리자만 삭제할 수 있습니다.', 'warning');
            return;
        }

        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 게시글은 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#5cb85c',
            cancelButtonColor: '#d33',
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                let options = {};
                options.url = serverUrl + '/suggestion/' + boardNo;
                options.method = 'delete';
                options.params = { isAdmin: loginMember.isAdmin };

                memoizedAxiosInstance(options)
                    .then(function(res) {
                        if (res.data.resData) {
                            Swal.fire('삭제 완료!', '건의사항이 성공적으로 삭제되었습니다.', 'success')
                                .then(() => {
                                    navigate('/board/suggestion/list');
                                });
                        } else {
                            Swal.fire('삭제 실패', res.data.resMsg || '건의사항 삭제에 실패했습니다.', 'error');
                        }
                    })
                    .catch(function(error) {
                        console.error("건의사항 삭제 실패:", error);
                        Swal.fire('오류 발생', '건의사항 삭제 중 문제가 발생했습니다.', 'error');
                    });
            }
        });
    }


    return (
        <section className="section board-view-wrap">
            <div className="board-view-content suggestion-view-container">
                <table className="board-view-header-table">
                    <tbody>
                        <tr>
                            <th className="view-table-label">제목</th>
                            <td className="view-table-content view-table-title-content" colSpan="2">
                                {board.boardTitle}
                                {board.isSecret === 'Y' && (
                                    <span className="material-icons" style={{ fontSize: '1.2em', verticalAlign: 'middle', marginLeft: '5px', color: '#666' }}>
                                        lock
                                    </span>
                                )}
                            </td>
                        </tr>
                        <tr>
                            <th className="view-table-label">글쓴이</th>
                            <td className="view-table-content view-table-title-content" colSpan="2">
                                {board.boardWriterId}
                            </td>
                        </tr>
                        <tr>
                            <th className="view-table-label">작성일</th>
                            <td className="view-table-content" colSpan="2">
                                {new Date(board.boardDate).toLocaleDateString('ko-KR')}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <hr className="content-divider"/>

                <div className="board-content-body">
                    {board.boardContent
                        ? <Viewer initialValue={board.boardContent} /> 
                        : ""
                    }
                </div>

                <div className="btn-area">
                    <button type="button" className="btn-secondary" onClick={() => navigate('/board/suggestion/list')}>
                        목록
                    </button>
                </div>
                {
                    loginMember && loginMember.isAdmin === 'T'
                    ?
                    <div className="view-btn-zone">
                        <button></button> {/* 이 빈 버튼이 무엇을 위한 것인지 불명확하여 유지합니다. */}
                        <button type='button' className="btn-secondary lg" onClick={deleteBoard}>삭제하기</button>
                    </div>
                    :
                    ""
                }

                {/* -- 변경 시작: 답변 섹션 - 삭제 버튼 위치 조정 -- */}
                <div className="comment-section">
                    <div className="comment-list">
                        {comments.length === 0 ? (
                            <p className="no-comments">등록된 답변이 없습니다.</p>
                        ) : (
                            comments.map(comment => (
                                // 각 답변 항목을 감싸는 div (position: relative의 기준)
                                <div key={comment.commentNo} className="comment-item-wrapper">
                                    <table className="comment-table">
                                        <tbody>
                                            <tr>
                                                <th className="view-table-label">답변자</th>
                                                <td className="view-table-content" colSpan={2}>
                                                    <strong className="comment-author">{comment.commentWriterId}</strong>
                                                    {/* 이전에는 여기 삭제 버튼이 있었으나, 테이블 밖으로 옮겨졌습니다. */}
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className="view-table-label">답변일</th>
                                                <td className="view-table-content" colSpan={2}>
                                                    <span className="comment-date">{comment.commentDate}</span>
                                                    {comment.commentUpdateDate && comment.commentUpdateDate !== comment.commentDate && (
                                                        <span className="comment-update-date">(수정: {comment.commentUpdateDate})</span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                {/* 답변 내용 셀은 전체 너비를 사용하므로 colSpan="3" */}
                                                <td className="view-table-content comment-content-cell" colSpan="3">
                                                    <div className="comment-content">
                                                        <Viewer initialValue={comment.commentContent} />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                   
                                    {/* 삭제 버튼을 테이블 외부, comment-item-wrapper 내부에 배치 */}
                                    {loginMember && loginMember.isAdmin === 'T' && (
                                        <div className="view-btn-zone">
                                            <button></button>
                                            <button type="button" className="btn-secondary lg" onClick={() => deleteComment(comment.commentNo)}>답변 삭제</button>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* 답변 작성 폼 (관리자만 가능) */}
                    {loginMember && loginMember.isAdmin === 'T' ? (
                        <div className="new-comment-form-wrapper comment-input-form-wrapper">
                            <h5>답변하기</h5> {/* "답변"으로 유지 */}
                            <div className="comment-form-inner">
                                <textarea
                                    name="commentContent"
                                    placeholder="답변을 입력하세요..." /* "답변"으로 유지 */
                                    required
                                    rows="4"
                                    value={newCommentContent}
                                    onChange={(e) => setNewCommentContent(e.target.value)}
                                ></textarea>
                                <div className="comment-form-actions">
                                    <button
                                        type="button"
                                        className="btn-submit-new-comment"
                                        onClick={submitComment}
                                    >
                                        답변 등록
                                    </button> {/* "답변"으로 유지 */}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="login-prompt-for-comment">
                            답변은 관리자만 작성할 수 있습니다. {/* "답변"으로 유지 */}
                        </p>
                    )}
                </div>
                {/* -- 변경 끝: 답변 섹션 -- */}

            </div>
        </section>
    );
}