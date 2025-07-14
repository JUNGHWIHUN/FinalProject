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
    // -- 변경 시작: axiosInstance를 useMemo로 메모이제이션 --
    const memoizedAxiosInstance = useMemo(() => createInstance(), []);
    // -- 변경 끝 --
    const navigate = useNavigate();

    const [board, setBoard] = useState({});
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');

    const { loginMember } = useUserStore();

    // 게시글 상세 정보 및 댓글 목록 불러오기
    useEffect(function() {
        // 게시글 상세 정보
        let boardOptions = {};
        boardOptions.url = serverUrl + '/suggestion/' + boardNo;
        boardOptions.method = 'get';
        boardOptions.params = {
            loginMemberNo: loginMember?.memberNo,
            isAdmin: loginMember?.isAdmin || 'F'
        };

        // -- 변경 시작: memoizedAxiosInstance 사용 --
        memoizedAxiosInstance(boardOptions)
        // -- 변경 끝 --
            .then(function(res) {
                setBoard(res.data.resData);
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

        // 댓글 목록 (항상 불러옴)
        fetchComments();

    }, [boardNo, navigate, serverUrl, memoizedAxiosInstance, loginMember]); // 의존성 배열에 memoizedAxiosInstance, loginMember 추가

    // 댓글 목록 불러오는 함수
    // -- 변경 시작: fetchComments 함수 내부에서 memoizedAxiosInstance 사용 --
    const fetchComments = useCallback(() => { // useCallback으로 감싸서 안정화
        let commentOptions = {};
        commentOptions.url = serverUrl + '/suggestion/' + boardNo + '/comments';
        commentOptions.method = 'get';
        memoizedAxiosInstance(commentOptions)
            .then(function(res) {
                // -- 변경 시작: 데이터가 변경되었을 때만 상태 업데이트 (무한 렌더링 방지 로직 추가) --
                if (JSON.stringify(comments) !== JSON.stringify(res.data.resData.commentList)) {
                    setComments(res.data.resData.commentList || []);
                }
                // -- 변경 끝 --
            })
            .catch(function(error) {
                console.error("댓글 목록 조회 실패:", error);
            });
    }, [boardNo, serverUrl, memoizedAxiosInstance, comments]); // comments 의존성 추가 (데이터 비교용)
    // -- 변경 끝 --

    // 댓글 등록 함수 (관리자만 가능)
    function submitComment() {
        if (!loginMember || loginMember.isAdmin !== 'T') {
            Swal.fire('권한 없음', '댓글은 관리자만 작성할 수 있습니다.', 'warning');
            return;
        }
        if (newCommentContent.trim() === '') {
            Swal.fire('알림', '댓글 내용을 입력해주세요.', 'warning');
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

        // -- 변경 시작: memoizedAxiosInstance 사용 --
        memoizedAxiosInstance(options)
        // -- 변경 끝 --
            .then(function(res) {
                if (res.data.resData) {
                    Swal.fire('성공', '댓글이 등록되었습니다.', 'success');
                    setNewCommentContent('');
                    fetchComments();
                } else {
                    Swal.fire('실패', res.data.resMsg || '댓글 등록에 실패했습니다.', 'error');
                }
            })
            .catch(function(error) {
                console.error("댓글 등록 실패:", error);
                Swal.fire('오류', '댓글 등록 중 문제가 발생했습니다.', 'error');
            });
    }

    // 댓글 삭제 함수 (관리자만 가능)
    function deleteComment(commentNo) {
        if (!loginMember || loginMember.isAdmin !== 'T') {
            Swal.fire('권한 없음', '댓글은 관리자만 삭제할 수 있습니다.', 'warning');
            return;
        }
        Swal.fire({
            title: '정말 삭제하시겠습니까?',
            text: '삭제된 댓글은 복구할 수 없습니다.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '예, 삭제합니다!',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                let options = {};
                options.url = serverUrl + '/suggestion/comments/' + commentNo;
                options.method = 'delete';
                options.params = { isAdmin: loginMember.isAdmin };

                // -- 변경 시작: memoizedAxiosInstance 사용 --
                memoizedAxiosInstance(options)
                // -- 변경 끝 --
                    .then(function(res) {
                        if (res.data.resData) {
                            Swal.fire('삭제 완료!', '댓글이 성공적으로 삭제되었습니다.', 'success');
                            fetchComments();
                        } else {
                            Swal.fire('삭제 실패', res.data.resMsg || '댓글 삭제에 실패했습니다.', 'error');
                        }
                    })
                    .catch(function(error) {
                        console.error("댓글 삭제 실패:", error);
                        Swal.fire('오류 발생', '댓글 삭제 중 문제가 발생했습니다.', 'error');
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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '예, 삭제합니다!',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                let options = {};
                options.url = serverUrl + '/suggestion/' + boardNo;
                options.method = 'delete';
                options.params = { isAdmin: loginMember.isAdmin };

                // -- 변경 시작: memoizedAxiosInstance 사용 --
                memoizedAxiosInstance(options)
                // -- 변경 끝 --
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
            <div className="page-title">건의사항 상세 보기</div>
            <div className="board-view-content">
                <div className="board-view-info">
                    <div className="board-thumbnail">
                        {/* 건의사항은 썸네일 기능 없음 - 기본 이미지 사용 */}
                        <img src="/images/default_img.png" />
                    </div>
                    <div className="board-view-preview">
                        <table className="tbl">
                            <tbody>
                                <tr>
                                    <td className="left" colSpan={2}>
                                        {board.boardTitle}
                                        {board.isSecret === 'Y' && (
                                            <span className="material-icons" style={{ fontSize: '1.2em', verticalAlign: 'middle', marginLeft: '5px', color: '#666' }}>
                                                lock
                                            </span>
                                        )}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ width: "20%" }}>작성자</th>
                                    <td style={{ width: "80%" }}>{board.boardWriterId}</td>
                                </tr>
                                <tr>
                                    <th style={{ width: "20%" }}>작성일</th>
                                    <td style={{ width: "80%" }}>{board.boardDate}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <hr />

                <div className="board-content-wrap">
                    {board.boardContent
                        ? <Viewer initialValue={board.boardContent} />
                        : ""
                    }
                </div>
                {
                    loginMember && loginMember.isAdmin === 'T'
                        ? <div className="view-btn-zone">
                            <button type='button' className="btn-secondary lg" onClick={deleteBoard}>삭제하기</button>
                        </div>
                        : ""
                }

                <div className="comment-section" style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #ddd' }}>
                    <h4 style={{ fontSize: '18px', marginBottom: '20px', color: '#333' }}>댓글 {comments.length}개</h4>

                    <div className="comment-list">
                        {comments.length === 0 ? (
                            <p className="no-comments" style={{ textAlign: 'center', color: '#777', padding: '20px' }}>등록된 댓글이 없습니다.</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.commentNo} className="comment-item" style={{ padding: '10px 0', borderBottom: '1px dotted #eee' }}>
                                    <div className="comment-author-info" style={{ display: 'flex', alignItems: 'center', marginBottom: '6px', fontSize: '13px', color: '#777' }}>
                                        <strong className="comment-author" style={{ fontWeight: 'bold', color: '#333', marginRight: '10px' }}>{comment.commentWriterId}</strong>
                                        <span className="comment-date" style={{ marginRight: '5px' }}>{comment.commentDate}</span>
                                        {comment.commentUpdateDate && comment.commentUpdateDate !== comment.commentDate && (
                                            <span className="comment-update-date" style={{ marginLeft: '5px', fontSize: '0.9em', color: '#888' }}>(수정: {comment.commentUpdateDate})</span>
                                        )}
                                        <div className="comment-buttons" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {loginMember && loginMember.isAdmin === 'T' && (
                                                <button type="button" className="comment-action delete-btn" style={{ color: '#dc3545', cursor: 'pointer', fontSize: '13px', background: 'none', border: 'none', padding: '0', textDecoration: 'none', lineHeight: 'normal' }} onClick={() => deleteComment(comment.commentNo)}>삭제</button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="comment-content" style={{ fontSize: '14px', lineHeight: '1.7', color: '#444', paddingLeft: '5px', whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginBottom: '8px' }}>
                                        <Viewer initialValue={comment.commentContent} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 댓글 작성 폼 (관리자만 가능) */}
                    {loginMember && loginMember.isAdmin === 'T' ? (
                        <div className="new-comment-form-wrapper comment-input-form-wrapper" style={{ marginTop: '25px', marginBottom: '20px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #e0e0e0' }}>
                            <h5 style={{ fontSize: '16px', marginBottom: '10px' }}>댓글 쓰기</h5>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <textarea
                                    name="commentContent"
                                    placeholder="댓글을 입력하세요..."
                                    required
                                    rows="4"
                                    value={newCommentContent}
                                    onChange={(e) => setNewCommentContent(e.target.value)}
                                    style={{ width: '100%', minHeight: '70px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', fontFamily: 'Pretendard, sans-serif', resize: 'none', marginBottom: '8px', boxSizing: 'border-sizing' }}
                                ></textarea>
                                <div className="comment-form-actions" style={{ overflow: 'hidden', marginTop: '5px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <button
                                        type="button"
                                        className="btn-submit-new-comment"
                                        onClick={submitComment}
                                        style={{ background: '#ff3366', color: 'white', padding: '8px 15px', border: 'none', borderRadius: '4px', fontSize: '14px', cursor: 'pointer', marginLeft: '8px' }}
                                    >
                                        댓글 등록
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="login-prompt-for-comment" style={{ clear: 'both', textAlign: 'center', padding: '20px 0', fontSize: '14px', color: '#777' }}>
                            댓글은 관리자만 작성할 수 있습니다.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}