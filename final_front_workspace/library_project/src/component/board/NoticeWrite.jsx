import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import NoticeFrm from "./NoticeFrm"
import createInstance from "../../axios/Interceptor";
import ToastEditor from "../common/ToastEditor";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';


// 공지사항 게시글 작성
export default function NoticeWrite(){

    const {loginMember} = useUserStore();

    const [boardTitle, setBoardTitle] = useState("");
    const [boardContent, setBoardContent] = useState("");
    const [boardFile, setBoardFile] = useState([]);

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const navigate = useNavigate();

    function boardWrite (){
        if(boardTitle !== '' && boardContent !== ''){
            const form = new FormData();

            form.append("boardTitle", boardTitle);
            form.append("boardContent", boardContent);
            form.append("boardWriter", loginMember.memberNo);
            form.append("boardCode", "N");
            form.append("isImportant", "N");
            form.append("isSecret", "N");
            form.append("isAdmin", loginMember.isAdmin); // 로그인 멤버의 isAdmin 정보 추가
            
            for(let i=0; i<boardFile.length; i++){ 
                form.append("boardFile", boardFile[i]);
            }

            let options = {};
            options.method = 'post';
            options.url = serverUrl + '/notice';
            options.data = form;
            options.headers = {};
            options.headers.contentType = 'multipart/form-data';
            options.headers.processData = false;

            axiosInstance(options)
            .then(function(res){
                if (res.data.resData) {
                    Swal.fire({
                        title: '성공',
                        text: '게시글이 성공적으로 등록되었습니다.',
                        icon: 'success'
                    }).then(() => {
                        navigate('/board/notice/list'); // 경로 수정
                    });
                } else {
                    Swal.fire({
                        title: '실패',
                        text: res.data.resMsg || '게시글 등록에 실패했습니다.',
                        icon: 'error'
                    });
                }
            })
            .catch(function(error){
                console.error("게시글 등록 실패:", error);
                Swal.fire({
                    title: '오류 발생',
                    text: '게시글 등록 중 통신 오류가 발생했습니다.',
                    icon: 'error'
                });
            });
            
        }else{
            Swal.fire({
                title : '알림',
                text : '게시글 제목과 내용은 필수 입력값입니다',
                icon : 'warning'
            });
        }
    }

    return(
        <section className="section board-content-wrap">
            <div className="page-title">공지사항 작성</div>
            <form className="board-write-frm" onSubmit={function(e){
                e.preventDefault();
                boardWrite();
            }}>
                <NoticeFrm 
                    loginMember={loginMember} 
                    boardTitle={boardTitle} setBoardTitle={setBoardTitle} 
                    boardFile={boardFile} setBoardFile={setBoardFile}
                />
                <div className="board-content-wrap">
                    <ToastEditor boardContent={boardContent} setBoardContent={setBoardContent} type={0 /* '작성' 을 뜻하는 0을 보냄 */}/>
                </div>
                <div className="button-zone">
                    <button type="submit" className="btn-primary lg">
                        등록하기
                    </button>
                </div>
            </form>
        </section>
    );
}