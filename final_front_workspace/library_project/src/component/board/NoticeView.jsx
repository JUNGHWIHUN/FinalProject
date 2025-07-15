// src/component/board/NoticeView.jsx
import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState, useMemo } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";
import Swal from 'sweetalert2';

// 공지사항 게시글 상세 정보
export default function NoticeView(){
    const param = useParams();
    const boardNo = param.boardNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const memoizedAxiosInstance = useMemo(() => createInstance(), []); 
    const navigate = useNavigate();

    const [board, setBoard] = useState({});
    const {loginMember} = useUserStore();

    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/notice/' + boardNo;
        options.method = 'get';

        memoizedAxiosInstance(options)
        .then(function(res){
            setBoard(res.data.resData);
        })
        .catch(function(error) {
            console.error("게시글 조회 실패:", error);
            Swal.fire({
                title: '오류',
                text: '게시글을 불러오는 데 실패했습니다.',
                icon: 'error'
            }).then(() => {
                navigate('/board/notice/list');
            });
        });
    },[boardNo, navigate, serverUrl, memoizedAxiosInstance]);

    function deleteBoard(){
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
                const form = new FormData();
                form.append('boardNo', boardNo);
                form.append('isAdmin', loginMember?.isAdmin || 'F'); 

                let options = {};
                options.url = serverUrl + '/notice/' + boardNo;
                options.method = 'delete';
                options.params = { isAdmin: loginMember?.isAdmin }; 

                memoizedAxiosInstance(options)
                .then(function(res){
                    if(res.data.resData){
                        Swal.fire('삭제 완료!', '게시글이 성공적으로 삭제되었습니다.', 'success')
                            .then(() => {
                                navigate('/board/notice/list');
                            });
                    } else {
                        Swal.fire('삭제 실패', res.data.resMsg || '게시글 삭제에 실패했습니다.', 'error');
                    }
                })
                .catch(function(error) {
                    console.error("게시글 삭제 실패:", error);
                    Swal.fire('오류 발생', '게시글 삭제 중 문제가 발생했습니다.', 'error');
                });
            }
        });
    }

    function handleImportantChange(e) {
        const isChecked = e.target.checked;
        const newIsImportant = isChecked ? 'Y' : 'N';

        Swal.fire({
            title: '중요 공지 설정 변경',
            text: `이 게시글을 ${isChecked ? '중요 공지로 설정' : '일반 공지로 해제'}하시겠습니까?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#5cb85c',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                const form = new FormData();
                form.append('boardNo', boardNo);
                form.append('isImportant', newIsImportant);
                form.append('isAdmin', loginMember?.isAdmin || 'F'); 

                let options = {};
                options.url = serverUrl + '/notice/important/' + boardNo;
                options.method = 'patch';
                options.data = form;
                options.headers = {
                    'Content-Type': 'multipart/form-data',
                };
                options.processData = false;

                memoizedAxiosInstance(options)
                .then(function(res) {
                    if (res.data.resData) {
                        Swal.fire('성공!', res.data.resMsg || '중요 공지 상태가 업데이트되었습니다.', 'success')
                            .then(() => {
                                setBoard(prevBoard => ({ ...prevBoard, isImportant: newIsImportant }));
                            });
                    } else {
                        Swal.fire('실패!', res.data.resMsg || '중요 공지 상태 업데이트에 실패했습니다.', 'error');
                        setBoard(prevBoard => ({ ...prevBoard, isImportant: board.isImportant }));
                    }
                })
                .catch(function(error) {
                    console.error("중요 공지 업데이트 실패:", error);
                    Swal.fire('오류 발생', '중요 공지 상태 변경 중 문제가 발생했습니다.', 'error');
                    setBoard(prevBoard => ({ ...prevBoard, isImportant: board.isImportant }));
                });
            } else {
                setBoard(prevBoard => ({ ...prevBoard, isImportant: board.isImportant }));
            }
        });
    }

    if (!board || Object.keys(board).length === 0) {
        return (
            <section className="section board-view-wrap">
                <div className="page-title">공지사항 상세 보기</div>
                <div className="board-view-content notice-view-container">
                    <h2>게시글을 불러오는 중이거나 존재하지 않습니다.</h2>
                </div>
            </section>
        );
    }

    return (
        <section className="section board-view-wrap">
            <div className="board-view-content notice-view-container">
                {loginMember && loginMember.isAdmin === 'T' && (
                    <div className="admin-options">
                        <h5>관리자 옵션</h5>
                        <div className="important-toggle">
                            <input
                                type="checkbox"
                                id="isImportantCheckbox"
                                checked={board.isImportant === 'Y'}
                                onChange={handleImportantChange}
                            />
                            <label htmlFor="isImportantCheckbox">
                                이 게시글을 중요 공지로 설정
                            </label>
                        </div>
                    </div>
                )}
                
                <table className="board-view-header-table">
                    <tbody>
                        <tr>
                            <th className="view-table-label">제목</th>
                            <td className="view-table-content view-table-title-content" colSpan="2">
                                {board.boardTitle}
                            </td>
                        </tr>
                        <tr>
                            <th className="view-table-label">작성일</th>
                            <td className="view-table-content" colSpan="2">
                                {new Date(board.boardDate).toLocaleDateString('ko-KR')}
                            </td>
                        </tr>
                        <tr>
                            <th className="view-table-label">첨부파일</th>
                            <td className="view-table-content" colSpan="2">
                                {board.fileList && board.fileList.length > 0
                                    ? board.fileList.map(function(file, index){
                                        return (
                                            <a key={"file-link-"+index} href={`${serverUrl}/notice/file/${file.boardFileNo}`} download={file.fileName} className="file-download-link">
                                                {file.fileName} <span className="material-icons file-download-icon">file_download</span>
                                            </a>
                                        );
                                    })
                                    : "첨부파일 없음"
                                }
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
                {/* -- 변경 시작: 목록 버튼을 먼저 렌더링하고 그 아래에 수정/삭제 버튼 -- */}
                <div className="btn-area"> {/* 목록 버튼 영역 */}
                    <button type="button" className="btn-secondary" onClick={() => navigate('/board/notice/list')}>
                        목록
                    </button>
                </div>
                {
                    loginMember && loginMember.isAdmin === 'T'
                    ?
                    <div className="view-btn-zone"> {/* 수정/삭제 버튼 영역 */}
                        <button ><Link to={'/board/notice/update/' + board.boardNo} className='btn-primary lg' >수정하기</Link></button>
                        <button type='button' className="btn-secondary lg" onClick={deleteBoard}>삭제하기</button>
                    </div>
                    :
                    ""
                }
                {/* -- 변경 끝 -- */}
            </div>
        </section>
    );
}

function FileItem(props) {
    const file = props.file;
    const serverUrl = props.serverUrl;
    const axiosInstance = props.memoizedAxiosInstance;

    function fileDown(){
        let options = {};
        options.url = serverUrl + '/notice/file/' + file.boardFileNo;
        options.method = 'get';
        options.responseType = 'blob';

        axiosInstance(options)
        .then(function(res){
            const fileData = res.data;
            const blob = new Blob([fileData]);
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.style.display = 'none';
            link.setAttribute('download', file.fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
            console.error("파일 다운로드 실패:", error);
            Swal.fire('다운로드 실패', '파일 다운로드 중 문제가 발생했습니다.', 'error');
        });
    }

    return (
        <div className="file-item">
            <span className="material-icons file-download-icon" onClick={fileDown}>file_download</span>
            <span className="file-name">{file.fileName}</span>
        </div>
    );
}