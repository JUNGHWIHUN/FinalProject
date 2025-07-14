// src/component/board/NoticeUpdate.jsx
import { useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState, useMemo } from "react";
import useUserStore from "../../store/useUserStore";
import NoticeFrm from "./NoticeFrm";
import ToastEditor from "../common/ToastEditor";
import Swal from 'sweetalert2';

// 공지사항 게시글 수정
export default function NoticeUpdate(){
    const param = useParams();
    const boardNo = param.boardNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const memoizedAxiosInstance = useMemo(() => createInstance(), []);
    const navigate = useNavigate();

    const {loginMember} = useUserStore();

    const [boardTitle, setBoardTitle] = useState("");
    const [boardContent, setBoardContent] = useState("");
    const [boardFile, setBoardFile] = useState([]);

    const [prevBoardFileList, setPrevBoardFileList] = useState([]);
    const [delBoardFileNo, setDelBoardFileNo] = useState([]); // delBoardFileNo 상태와 set 함수

    const [currentIsImportant, setCurrentIsImportant] = useState("N");
    const [currentIsSecret, setCurrentIsSecret] = useState("N");

    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/notice/' + boardNo;
        options.method = 'get'; 

        memoizedAxiosInstance(options)
        .then(function(res){
            const board = res.data.resData;
            setBoardTitle(board.boardTitle);
            setBoardContent(board.boardContent);
            setPrevBoardFileList(board.fileList);
            setCurrentIsImportant(board.isImportant);
            setCurrentIsSecret(board.isSecret);
        })
        .catch(function(error) {
            console.error("게시글 정보 조회 실패:", error);
            Swal.fire({
                title: '오류',
                text: '게시글 정보를 불러오는 데 실패했습니다.',
                icon: 'error'
            }).then(() => {
                navigate('/board/notice/list');
            });
        });
    },[boardNo, navigate, serverUrl, memoizedAxiosInstance]); 

    function updateBoard(){
        if(boardTitle !== '' && boardContent !== ''){
            const form = new FormData();

            form.append('boardNo', boardNo);
            form.append('boardTitle', boardTitle);
            form.append('boardContent', boardContent);
            form.append("isAdmin", loginMember.isAdmin || 'F');
            form.append("isImportant", currentIsImportant);
            form.append("isSecret", currentIsSecret);
            
            for(let i=0;i<boardFile.length;i++){
                form.append('boardFile', boardFile[i]);
            }
            for(let i=0;i<delBoardFileNo.length;i++){
                form.append('delBoardFileNo', delBoardFileNo[i]);
            }

            let options = {};
            options.url = serverUrl + '/notice';
            options.method = 'patch';
            options.data = form;
            options.headers = {};
            options.headers.contentType = 'multipart/form-data';
            options.headers.processData = false;

            memoizedAxiosInstance(options)
            .then(function(res){
                if(res.data.resData){
                    Swal.fire({
                        title: '성공',
                        text: '게시글이 성공적으로 수정되었습니다.',
                        icon: 'success'
                    }).then(() => {
                        navigate('/board/notice/view/'+boardNo);
                    });
                } else {
                    Swal.fire({
                        title: '실패',
                        text: res.data.resMsg || '게시글 수정에 실패했습니다.',
                        icon: 'error'
                    });
                }
            })
            .catch(function(error) {
                console.error("게시글 수정 실패:", error);
                Swal.fire({
                    title: '오류 발생',
                    text: '게시글 수정 중 통신 오류가 발생했습니다.',
                    icon: 'error'
                });
            });
        }
    }

    return (
        <section className="section board-content-wrap">
            <div className="page-title">공지사항 수정</div>
            <form className="board-write-frm" onSubmit={function(e){
                e.preventDefault();
                updateBoard();
            }}> 
            <NoticeFrm 
                loginMember={loginMember} 
                boardTitle={boardTitle} setBoardTitle={setBoardTitle} 
                boardFile={boardFile} setBoardFile={setBoardFile}
                
                prevBoardFileList={prevBoardFileList} setPrevBoardFileList={setPrevBoardFileList} 
                delBoardFileNo={delBoardFileNo} 
                setDelBoardFileNo={setDelBoardFileNo} 
            />
                
                <div className="board-content-wrap">
                    <ToastEditor boardContent={boardContent} setBoardContent={setBoardContent} 
                    type={1 /* '수정' 을 뜻하는 1을 보냄 */}/>   
                </div>
                <div className="button-zone">
                    <button type="submit" className="btn-primary lg">
                        수정하기
                    </button>
                </div>
            </form>
        </section>
    );
}