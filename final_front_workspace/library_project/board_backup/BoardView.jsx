import { Link, useNavigate, useParams } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";
import { Viewer } from "@toast-ui/react-editor";
import useUserStore from "../../store/useUserStore";

//게시글 상세 정보
export default function BoardView(){
    //BoardList 컴포넌트에서 게시글 1개 정보를 클릭하여 컴포넌트 전환 시, URL 뒤에 전달한 게시글 번호를 추출하기 위한 Hook
    const param = useParams();

    //BoardMain 컴포넌트에 BoardView 컴포넌트 라우터로 등록 시, :boardNo 라고 지정하여 추출 명칭은 다음과 같음
    const boardNo = param.boardNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //서버에서 조회해 온 게시글 1개 정보를 저장할 변수
    const [board, setBoard] = useState({});

    //로그인 회원 정보 (수정, 삭제 버튼 활성화를 위해)
    const {loginMember} = useUserStore();

    const navigate = useNavigate();

    //게시글 상세정보 불러오기
    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/board/' + boardNo;
        options.method = 'get';

        axiosInstance(options)
        .then(function(res){
            //응답받은 게시글 1개 정보를 State 변수에 저장
            setBoard(res.data.resData);
        })
    },[])

    //삭제하기 클릭 시 동작 함수
    function deleteBoard(){
        let options = {};
        options.url = serverUrl + '/board/' + boardNo;
        options.method = 'delete';

        axiosInstance(options)
        .then(function(res){
            if(res.data.resData){
                navigate('/board/list');
            }
        })
    }

    return (
        <section className="section board-view-wrap">
            <div className="page-title">게시글 상세 보기</div>
            <div className="board-view-content">
                <div className="board-view-info">
                    <div className="board-thumbnail">
                        {/* <img src={   //섬네일 존재 여부에 따라 섬네일을 다르게 표시
                            board.boardThumbPath
                            ? serverUrl + "/board/thumb/" + board.boardThumbPath.substring(0, 8) + "/" + board.boardThumbPath
                            : "/images/default_img.png"
                        } />
                        */}
                        <img src="/images/default_img.png" /> {/* 썸네일 기능 제거에 따라 기본 이미지로 고정 */}
                    </div>
                    <div className="board-view-preview">
                        <table className="tbl">
                            <tbody>
                                <tr>
                                    <td className="left" colSpan={4}>
                                        {board.boardTitle}
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{width:"20%"}}>작성자</th>
                                    <td style={{width:"20%"}}>{board.boardWriter}</td>
                                    <th style={{width:"20%"}}>작성일</th>
                                    <td style={{width:"20%"}}>{board.boardDate}</td>
                                </tr>
                            </tbody>
                        </table>
                        <p className="file-title">첨부파일</p>
                        <div className="file-zone">
                            {    /* 첨부파일이 존재하는지 여부에 따라 다르게 표시 */
                                board.fileList
                                ? board.fileList.map(function(file, index){
                                    return <FileItem key={"file"+index} file={file} />
                                })
                                : ""
                            }
                        </div>
                    </div>
                </div>
                
                <hr/>

                <div className="board-content-wrap" >
                    {    //에디터로 작성했기 때문에  boardContent 에는 html 태그가 삽입되어 있음
                         //화면에 보여줄 때는 html 태그를 제외한 텍스트만 표기해야 하는데, dangerouslySetInnerHTML 사용 가능 : 악성 스크립트 삽입 위험이 있어 권장되지 않음
                         //ToastEditor 에서 제공하는 Viewer 를 이용하여 텍스트만 표시 가능
                        board.boardContent
                        ? <Viewer initialValue={board.boardContent} /> 
                        : ""
                    }
                </div>
                {
                    loginMember != null && loginMember.memberId == board.boardWriter
                    ?
                    <div className="view-btn-zone">
                        <Link to={'/board/update/' + board.boardNo} className='btn-primary lg'>수정하기</Link>
                        <button type='button' className="btn-secondary lg" onClick={deleteBoard}>삭제하기</button>
                    </div>
                    :
                    ""
                }
            </div>
        </section>
    );
}

//파일 1개 정보
function FileItem(props) {
    const file = props.file;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    //파일 다운로드 아이콘 클릭 시 동작 함수
    function fileDown(){
        let options = {};
        options.url = serverUrl + '/board/file/' + file.boardFileNo;
        options.method = 'get';
        options.responseType = 'blob';   //서버에서 파일(바이너리) 자체를 응답받기 위해 설정

        axiosInstance(options)
        .then(function(res){
            //res.data : 서버에서 응답해준 리소스(파일) (DTO 형식이 아님)
            const fileData = res.data;
            console.log(res.data);
            const blob = new Blob([fileData]);   //항상 배열로 전달해야 함
            const url = window.URL.createObjectURL(blob);   //브라우저에 요청하기 위한 URL 생성
            
            //비동기 요청에서는 다운로드 창이 자동으로 뜨지 않기 때문에 가상의 a 태그를 만들고, 동적으로 클릭 이벤트를 발생시킨 뒤 a 태그 삭제하는 방식으로
            const link = document.createElement('a');
            link.href = url;                                //다운로드 요청 url 지정
            link.style.display = 'none';                  //a 태그 자체는 화면에서 숨김 
            link.setAttribute('download', file.fileName);   //다운로드할 파일명 지정
            document.body.appendChild(link);                //body 태그 하위로 삽입
            link.click();                                   //동적으로 클릭해 다운로드 유도
            link.remove();                                  //a 태그 삭제

            window.URL.revokeObjectURL(url);     //url 정보 삭제
        })
    }

    return (
        <div className="board-file">
            <span className="material-icons file-icon" onClick={fileDown}>file_download</span>
            <span className="file-name">{file.fileName}</span>
        </div>
    );
}