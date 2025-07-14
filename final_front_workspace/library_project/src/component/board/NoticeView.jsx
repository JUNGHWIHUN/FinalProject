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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '예, 삭제합니다!',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '확인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                // -- 변경 시작: FormData를 사용하여 데이터 전송 --
                const form = new FormData();
                form.append('boardNo', boardNo); // 게시글 번호도 함께 보냄
                form.append('isImportant', newIsImportant);
                // 백엔드 컨트롤러의 @RequestParam String isAdmin에 맞춰 isAdmin도 FormData에 추가
                form.append('isAdmin', loginMember?.isAdmin || 'F'); 

                let options = {};
                options.url = serverUrl + '/notice/important/' + boardNo;
                options.method = 'patch';
                options.data = form; // FormData를 data에 할당
                options.headers = {
                    'Content-Type': 'multipart/form-data', // FormData 사용 시 명시 (Axios가 자동 설정해주기도 함)
                };
                options.processData = false; // FormData 사용 시 필수
                // options.params = { isAdmin: loginMember?.isAdmin }; // 쿼리 파라미터 대신 FormData에 포함
                // -- 변경 끝 --

                memoizedAxiosInstance(options)
                .then(function(res) {
                    if (res.data.resData) {
                        Swal.fire('성공!', res.data.resMsg || '중요 공지 상태가 업데이트되었습니다.', 'success')
                            .then(() => {
                                // 상태 변경 후 바로 리렌더링될 수 있도록 setBoard 상태 업데이트
                                setBoard(prevBoard => ({ ...prevBoard, isImportant: newIsImportant }));
                                // navigate('/board/notice/list'); // 목록으로 이동 대신 현재 페이지 상태 업데이트
                            });
                    } else {
                        Swal.fire('실패!', res.data.resMsg || '중요 공지 상태 업데이트에 실패했습니다.', 'error');
                        // 실패 시 체크박스 상태 롤백 (이전 값으로 되돌림)
                        setBoard(prevBoard => ({ ...prevBoard, isImportant: board.isImportant }));
                    }
                })
                .catch(function(error) {
                    console.error("중요 공지 업데이트 실패:", error);
                    Swal.fire('오류 발생', '중요 공지 상태 변경 중 문제가 발생했습니다.', 'error');
                    // 실패 시 체크박스 상태 롤백
                    setBoard(prevBoard => ({ ...prevBoard, isImportant: board.isImportant }));
                });
            } else {
                // 사용자가 취소한 경우 체크박스 상태 롤백
                setBoard(prevBoard => ({ ...prevBoard, isImportant: board.isImportant }));
            }
        });
    }


    return (
        <section className="section board-view-wrap">
            <div className="page-title">공지사항 상세 보기</div>
            <div className="board-view-content">
                {loginMember && loginMember.isAdmin === 'T' && (
                    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
                        <h5>관리자 옵션</h5>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="checkbox"
                                id="isImportantCheckbox"
                                checked={board.isImportant === 'Y'}
                                onChange={handleImportantChange}
                                style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                            />
                            <label htmlFor="isImportantCheckbox" style={{ marginBottom: '0' }}>
                                이 게시글을 중요 공지로 설정
                            </label>
                        </div>
                    </div>
                )}
                
                <div className="board-view-info">
                    <div className="board-thumbnail">
                        <img src="/images/default_img.png" />
                    </div>
                    <div className="board-view-preview">
                        <table className="tbl">
                            <tbody>
                                <tr>
                                    <td className="left" colSpan={2}>
                                        {board.boardTitle}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width:"20%"}}>작성자</th>
                                    <td style={{width:"80%"}}>{board.boardWriter}</td>
                                </tr>
                                <tr>
                                    <th style={{width:"20%"}}>작성일</th>
                                    <td style={{width:"80%"}}>{board.boardDate}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="file-title">첨부파일</p>
                        <div className="file-zone">
                            {board.fileList && board.fileList.length > 0
                                ? board.fileList.map(function(file, index){
                                    return <FileItem key={"file"+index} file={file} serverUrl={serverUrl} memoizedAxiosInstance={memoizedAxiosInstance}/>
                                })
                                : "첨부파일 없음"
                            }
                        </div>
                    </div>
                </div>
                
                <hr/>

                <div className="board-content-wrap" >
                    {board.boardContent
                        ? <Viewer initialValue={board.boardContent} /> 
                        : ""
                    }
                </div>
                {
                    loginMember && loginMember.isAdmin === 'T'
                    ?
                    <div className="view-btn-zone">
                        <Link to={'/board/notice/update/' + board.boardNo} className='btn-primary lg'>수정하기</Link>
                        <button type='button' className="btn-secondary lg" onClick={deleteBoard}>삭제하기</button>
                    </div>
                    :
                    ""
                }
            </div>
        </section>
    );
}

// 파일 1개 정보 (NoticeView.jsx 내부에 있었던 FileItem)
function FileItem(props) {
    const file = props.file;
    const serverUrl = props.serverUrl;
    const axiosInstance = props.memoizedAxiosInstance; // props로 전달받은 인스턴스 사용

    function fileDown(){
        let options = {};
        options.url = serverUrl + '/notice/file/' + file.boardFileNo; // URL 변경
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
        <div className="board-file">
            <span className="material-icons file-icon" onClick={fileDown}>file_download</span>
            <span className="file-name">{file.fileName}</span>
        </div>
    );
}