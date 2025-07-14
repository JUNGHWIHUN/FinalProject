// src/component/common/ToastEditor.jsx
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { useRef } from 'react';
import createInstance from "../../axios/Interceptor";

//게시글 본문 내용 작성을 위한 에디터
export default function ToastEditor (props){
    const boardContent = props.boardContent;
    const setBoardContent = props.setBoardContent;
    const type = props.type;    //등록 : 0, 수정 : 1

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const ediotrRef = useRef(null); //에디터로 연결할 ref 변수

    function changeContent(){
        const editorText = ediotrRef.current.getInstance().getHTML();
        setBoardContent(editorText);
    }

    /* 에디터 상단 이미지 업로드 시 처리 순서
     * 1) 서버에 비동기 요청하여 이미지 업로드
     * 2) 서버에서는 업로드한 이미지 파일 경로 응답
     * 3) 매개변수로 전달받은 callbackFunc 에 이미지 경로를 작성하여 에디터 내부에 이미지를 노출시킴
     */
    function uploadImg(file, callbackFunc){
        //파일 업로드 처리 (post, multipart/form-data)
        const form = new FormData();    //웹 API (JS 내장 객체)
        form.append("image", file);

        let options = {};
        // -- 변경 시작: URL 경로 수정 --
        options.url = serverUrl + "/notice/editorImage"; // /board/editorImage -> /notice/editorImage 로 변경
        // -- 변경 끝 --
        options.method = 'post';
        options.data = form;
        options.headers = {};
        options.headers.contentType = 'multipart/form-data';
        options.headers.processData = false;

        axiosInstance(options)
        .then(function(res){
            //res.data.resData = /editor/20250624/202506241515????? + _????? + .jpg : 서버에서 응답한 문자열
            
            //리액트로 생성한 정적 웹 사이트는 보안상의 이유로 파일 시스템 (C드라이브) 에 직접적으로 접근 불가능
            //파일 시스템에 저장된 이미지를 브라우저에 보여주고자 할 때 백엔드 서버에 요청해야 함

            callbackFunc(serverUrl+res.data.resData, '이미지');

        });
    }

    return (
        <div style={{width : '100%', marginTop : '20px'}}>
            {/* wysiwyg : HTML 작성 없이 일반 텍스트로 작성 가능 (HTML 편집기 기능) */}
            {/* 수정하기의 경우  BoardUpdate 가 렌더링되며 호출하고 있는 에디터가 렌더링됨
             * 이후 서버에서 조회해온 게시글 정보로 State 변수를 변경시 리렌더링이 일어남 : 이 때 에디터가 다시 그려지지 않는 것이 문제
             * * 1) BoardUpdate 컴포넌트로 전환 시, boardContent 는 초기값인 빈 문자열 : 이 때 에디터는 렌더링되지 않음
             * 2) BoardUpdate 의 useEffect 에 전달한 함수가 실행되고, boardContent 변수가 변경됨
             * 이 때 boardContent 는 빈 문자열이 아니므로, 아래 조건식을 만족하여 에디터가 렌더링됨
             */}
            {
            type == 0 || (type == 1 && boardContent != '') //작성하기 / 혹은 수정하기+기존 내용이 있을 때만 에디터를 렌더링함
            ?
            <Editor ref={ediotrRef} initialValue={boardContent} initialEditType="wysiwyg" language='ko-KR' height='600px' onChange={changeContent}
            hooks={{addImageBlobHook : uploadImg}}> {/* 에디터 상단 이미지 아이콘을 클릭해 이미지 업로드 후 OK 버튼을 눌렀을 때 동작하는 함수 생성 */}

            </Editor>
            : ""}
        </div>

    )
}