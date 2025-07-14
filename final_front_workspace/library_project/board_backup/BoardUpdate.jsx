import { useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import BoardFrm from "./BoardFrm";
import ToastEditor from "../common/ToastEditor";

//게시글 수정
export default function BoardUpdate(){
    const param = useParams();
    const boardNo = param.boardNo;    //게시글 번호 추출

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();


    //BoardWrite 에서 사용했던 State 변수와 동일하게 선언
    const {loginMember} = useUserStore();                      //작성하기 form 에서 작성자 아이디를 표기하기 위함. 작성하기 클릭 시 boardWriter 에 회원 아이디가 들어가야 함

    const [boardTitle, setBoardTitle] = useState("");        //제목
    // const [boardThumb, setBoardThumb] = useState(null);      //썸네일 이미지 // 썸네일 관련 변수 주석 처리
    const [boardContent, setBoardContent] = useState("");    //내용
    const [boardFile, setBoardFile] = useState([]);          //첨부파일

    //기존 게시글 정보 불러오기 : 기존 View 로직 및 메소드 재사용 + 기존 정보를 보여줄 변수 선언
    // const [prevThumbPath, setPrevThumbPath] = useState(null);       //서버에 저장한 기존 섬네일 파일명 // 썸네일 관련 변수 주석 처리
    const [prevBoardFileList, setPrevBoardFileList] = useState([]); //BoardFile 객체 리스트
    const [delBoardFileNo, setDelBoardFileNo] = useState([]);       //삭제대상 파일 번호 저장 배열

    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/board/' + boardNo;
        options.method = 'get'; 

        axiosInstance(options)
        .then(function(res){
            const board = res.data.resData;
            setBoardTitle(board.boardTitle);           //기존 제목
            setBoardContent(board.boardContent);       //기존 내용
            // setPrevThumbPath(board.boardThumbPath);    //서버에 저장된 섬네일명 // 썸네일 관련 변수 주석 처리
            setPrevBoardFileList(board.fileList);      //BoardDto 에 저장한 List 변수 (객체 배열)
        })
    },[]);

    //수정하기 버튼 클릭 시 호출 함수
    function updateBoard(){
        /*
        console.log(boardNo);
        console.log(boardTitle)
        console.log(boardContent)
        console.log(boardThumb)
        console.log(boardFile)
        console.log(delBoardFileNo)
        console.log(prevThumbPath)
        */

        if(boardTitle != null && boardContent != null){
            const form = new FormData();

            form.append('boardNo', boardNo);
            form.append('boardTitle', boardTitle);
            form.append('boardContent', boardContent);

            //이하는 해당 조건을 만족했을 때에만 해당 속성명 + 속성값을 append 함 (하지 않을 경우 null)
            //기존 섬네일 파일명
            /*
            if(prevThumbPath != null){    //기존 섬네일이 존재할 때
                form.append('prevThumbPath', prevThumbPath);
            }
            //새롭게 등록한 섬네일 파일 객체
            if(boardThumb != null){ //새로 등록한 섬네일이 있을 때
                form.append('boardThumb', boardThumb);
            }
            */
            //추가 첨부파일
            for(let i=0;i<boardFile.length;i++){ //추가로 첨부하는 파일 배열의 크기가 0 이상일 때
                form.append('boardFile', boardFile[i]);
                
                console.log('프론트엔드 파일 : ' + boardFile[0]);
                
            }
            //기존 첨부파일 중 삭제 대상 파일
            for(let i=0;i<delBoardFileNo.length;i++){ //삭제하는 기존 파일 배열의 크기가 0 이상일 때
                form.append('delBoardFileNo', delBoardFileNo[i]);   //해당 파일 객체 정보 추출
            }

            let options = {};
            options.url = serverUrl + '/board';
            options.method = 'patch';
            options.data = form;
            options.headers = {};
            options.headers.contentType = 'multipart/form-data';
            options.headers.processData = false;    //쿼리스트링으로 변환하지 않도록 설정

            axiosInstance(options)
            .then(function(res){
                //게시글 정상 수정 시 해당 글 상세보기 페이지로 이동
                if(res.data.resData){
                    navigate('/board/view/'+boardNo);
                }
            });
        }   
    }

    return (
        <section className="section board-content-wrap">
            <div className="page-title">게시글 수정</div>
            <form className="board-write-frm" onSubmit={function(e){
                e.preventDefault();
                updateBoard();   //수정하기 함수 호출
            }}> 

            {/* BoardWrite 에서 호출했던 BoardFrm 재사용, 작성하기와 수정하기의 UI 는 동일하고, 기존 정보가 보이느냐 보이지 않느냐 차이
                기존 정보가 입력 폼에 보여야 하므로, 전달해야 하는 데이터들이 더 많음 */}
            <BoardFrm loginMember={loginMember} boardTitle={boardTitle} setBoardTitle={setBoardTitle} 
                        // boardThumb={boardThumb} setBoardThumb={setBoardThumb} // 썸네일 관련 props 주석 처리
                        boardFile={boardFile} setBoardFile={setBoardFile}
                        
                        prevBoardFileList={prevBoardFileList} setPrevBoardFileList={setPrevBoardFileList} 
                        // prevThumbPath={prevThumbPath} setPrevThumbPath={setPrevThumbPath} // 썸네일 관련 props 주석 처리
                        delBoardFileNo={delBoardFileNo} setDelBoardFileNo={setDelBoardFileNo} />
                
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