import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import BoardFrm from "./BoardFrm"
import createInstance from "../../axios/Interceptor";
import ToastEditor from "../common/ToastEditor";
import { useNavigate } from "react-router-dom";

//게시글 작성
export default function BoardWrite(){                         

    const {loginMember} = useUserStore();                      //작성하기 form 에서 작성자 아이디를 표기하기 위함. 작성하기 클릭 시 boardWriter 에 회원 아이디가 들어가야 함

    const [boardTitle, setBoardTitle] = useState("");        //제목
    // const [boardThumb, setBoardThumb] = useState(null);      //썸네일 이미지 // 썸네일 관련 변수 주석 처리
    const [boardContent, setBoardContent] = useState("");    //내용
    const [boardFile, setBoardFile] = useState([]);          //첨부파일

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const navigate = useNavigate();

    //등록하기 버튼 클릭 시 동작 함수 
    function boardWrite (){
        if(boardTitle != '' && boardContent != ''){
            const form = new FormData();    //파일 업로드 시 사용할 수 있는 내장 객체

            //첫 번째로 작성하는 문자열 : input 의 name 속성값 역할 (구분)
            form.append("boardTitle", boardTitle);
            form.append("boardContent", boardContent);
            form.append("boardWriter", loginMember.memberId);

            /*
            if (boardThumb != null){    //섬네일 이미지를 업로드한 경우에만 실행 (미작성시 null 문자열이 입력되기 때문)
                form.append("boardThumb", boardThumb);
            }
            */
            
            for(let i=0; i<boardFile.length; i++){  //첨부파일 배열 길이가 0보다 클 때 (첨부파일이 있을 때) 
                form.append("boardFile", boardFile[i]); //모두 동일한 이름으로 append
            }


            let options = {};
            options.method = 'post';
            options.url = serverUrl + '/board';
            options.data = form;
            options.headers = {};
            options.headers.contentType = 'multipart/form-data';
            options.headers.processData = false;    //쿼리스트링으로 변환하지 않도록 설정

            axiosInstance(options)
            .then(function(res){
                //게시글 정상 등록 시 BoardList 컴포넌트로 전환
                navigate('/board/list');
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
            <div className="page-title">게시글 작성</div>
            <form className="board-write-frm" onSubmit={function(e){
                e.preventDefault();
                boardWrite();   //등록하기 함수 호출
            }}>
                    {/* 게시글 작성과 수정하기 모두 UI 는 동일하므로 입력 요소들은 별도의 컴포넌트로 분리 작성
                        props 로 State 변수와 변경할 때 호출할 함수들을 전달 */}
                    <BoardFrm loginMember={loginMember} boardTitle={boardTitle} setBoardTitle={setBoardTitle} 
                                // boardThumb={boardThumb} setBoardThumb={setBoardThumb} // 썸네일 관련 props 주석 처리
                                boardFile={boardFile} setBoardFile={setBoardFile}/>
                <div className="board-content-wrap">
                    <ToastEditor boardContent={boardContent} setBoardContent={setBoardContent} type={0 /* '작성' 을 뜻하는 0을 보냄 */}/>   {/* 내용을 변경할 때 마다 리렌더링되도록 본문 내용/내용 변경 함수 전달 */}
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