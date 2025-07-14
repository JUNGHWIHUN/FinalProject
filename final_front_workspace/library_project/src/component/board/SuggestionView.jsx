// src/component/board/SuggestionView.jsx

import { Link, useNavigate, useParams } from "react-router-dom";

import createInstance from "../../axios/Interceptor";

import { useEffect, useState, useMemo, useCallback } from "react";

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

        let boardOptions = {};

        boardOptions.url = serverUrl + '/suggestion/' + boardNo;

        boardOptions.method = 'get';

        boardOptions.params = {

            loginMemberNo: loginMember?.memberNo,

            isAdmin: loginMember?.isAdmin || 'F'

        };



        memoizedAxiosInstance(boardOptions)

            .then(function(res) {

                // --- 중요 변경 시작: 백엔드 응답 데이터 확인 및 처리 ---

                if (res.data && res.data.resData) {

                    setBoard(res.data.resData);

                } else if (res.data && res.data.resMsg) { // 백엔드에서 에러 메시지를 보낼 경우

                    Swal.fire({

                        title: '조회 실패',

                        text: res.data.resMsg,

                        icon: 'warning'

                    }).then(() => {

                        navigate('/board/suggestion/list');

                    });

                } else { // 기타 예상치 못한 응답

                    console.warn("SuggestionView: 백엔드 응답 res.data.resData가 유효하지 않습니다.", res.data);

                    Swal.fire({

                        title: '오류',

                        text: '게시글을 불러오는 데 실패했습니다.',

                        icon: 'error'

                    }).then(() => {

                        navigate('/board/suggestion/list');

                    });

                }

                // --- 중요 변경 끝 ---

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



    }, [boardNo, navigate, serverUrl, memoizedAxiosInstance, loginMember]);



    // 답변 목록 불러오는 함수

    const fetchComments = useCallback(() => {

        let commentOptions = {};

        commentOptions.url = serverUrl + '/suggestion/' + boardNo + '/comments';

        commentOptions.method = 'get';

        memoizedAxiosInstance(commentOptions)

            .then(function(res) {

                if (comments.length !== (res.data.resData.commentList || []).length ||

                    JSON.stringify(comments) !== JSON.stringify(res.data.resData.commentList)) {

                    setComments(res.data.resData.commentList || []);

                }

            })

            .catch(function(error) {

                console.error("답변 목록 조회 실패:", error);

            });

    }, [boardNo, serverUrl, memoizedAxiosInstance, comments]);



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



    // --- 중요 변경 시작: 게시글 내용 표시 여부 판단 로직 ---

    const canViewContent = useMemo(() => {

        // board 객체가 없으면 내용을 볼 수 없음

        if (!board || Object.keys(board).length === 0) {

            return false;

        }



        // 1. 게시글이 비밀글이 아닌 경우 (isSecret === 'N') -> 누구나 볼 수 있음

        if (board.isSecret === 'N') {

            return true;

        }



        // 2. 게시글이 비밀글인 경우 (isSecret === 'Y')

        //    a. 로그인하지 않았으면 볼 수 없음

        if (!loginMember) {

            return false;

        }



        //    b. 로그인 멤버가 관리자인 경우 -> 볼 수 있음

        if (loginMember.isAdmin === 'T') {

            return true;

        }



        //    c. 로그인 멤버가 게시글 작성자인 경우 -> 볼 수 있음

        //       board.boardWriter는 ID 문자열이므로, loginMember.memberNo와 비교하기 위해

        //       백엔드에서 board.boardWriterNo (member_no)를 함께 전달해주는 것이 가장 정확합니다.

        //       현재 board 객체에 boardWriterNo (작성자의 member_no)가 없으므로 boardWriter(ID)와 loginMember.memberId를 비교합니다.

        //       만약 board.boardWriter에 memberId가 아닌 memberNo가 들어있다면, board.boardWriter === loginMember.memberNo로 비교해야 합니다.

        //       여기서는 'boardWriter'가 ID임을 가정하고 'loginMember.memberId'와 비교합니다.

        if (loginMember.memberId === board.boardWriter) { // board.boardWriter는 작성자 ID, loginMember.memberId는 로그인 ID

            return true;

        }

       

        // 위 조건들을 모두 만족하지 않으면 내용을 볼 수 없음

        return false;

    }, [board, loginMember]); // board 또는 loginMember가 변경될 때마다 재계산



    // 로딩 중이거나 게시글 데이터가 없는 경우

    if (!board || Object.keys(board).length === 0) {

        return (

            <section className="section board-view-wrap">

                <div className="board-view-content suggestion-view-container">

                    {/* canViewContent를 따르지 않고, board 자체가 없으면 로딩 메시지 */}

                    <h2>게시글을 불러오는 중이거나 존재하지 않습니다.</h2>

                </div>

            </section>

        );

    }

    // --- 중요 변경 끝 ---





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

                                {board.boardWriter}

                            </td>

                        </tr>

                        <tr>

                            <th className="view-table-label">작성일</th>

                            <td className="view-table-content" colSpan="2">

                                {new Date(board.boardDate).toLocaleDateString('ko-KR')}

                            </td>

                        </tr>

                        {board.fileList && board.fileList.length > 0 && (

                            <tr>

                                <th className="view-table-label">첨부파일</th>

                                <td className="view-table-content">

                                    {board.fileList.map(function(file, index){

                                        return (

                                            <a key={"file-link-"+index} href={`${serverUrl}/suggestion/file/${file.boardFileNo}`} download={file.fileName} className="file-download-link">

                                                {file.fileName} <span className="material-icons file-download-icon">file_download</span>

                                            </a>

                                        );

                                    })}

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>



                <hr className="content-divider"/>



                <div className="board-content-body">

                    {/* --- 중요 변경 시작: canViewContent 조건에 따라 내용 표시/숨김 --- */}

                    {canViewContent ? (

                        board.boardContent ? <Viewer initialValue={board.boardContent} /> : ""

                    ) : (

                        <p className="secret-content-message">

                            <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '5px' }}>lock</span>

                            비밀글입니다. 작성자 또는 관리자만 열람할 수 있습니다.

                        </p>

                    )}

                    {/* --- 중요 변경 끝 --- */}

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