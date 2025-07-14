// src/component/board/NoticeFrm.jsx
import { useRef, useState } from "react";
// import Swal from 'sweetalert2'; // 필요한 경우 추가

// 공지사항 게시글 작성 및 수정 시, 입력폼 컴포넌트
export default function NoticeFrm(props){ // 클래스 이름 BoardFrm -> NoticeFrm으로 변경

    // 부모 컴포넌트에서 전달받은 데이터 추출
    const loginMember = props.loginMember;
    const boardTitle = props.boardTitle;
    const setBoardTitle = props.setBoardTitle;
    // const boardThumb = props.boardThumb; // 썸네일 관련 변수 제거
    // const setBoardThumb = props.setBoardThumb; // 썸네일 관련 변수 제거
    const boardFile = props.boardFile;
    const setBoardFile = props.setBoardFile;

    // 수정 시 전달 데이터 추출
    const prevBoardFileList = props.prevBoardFileList;
    const setPrevBoardFileList = props.setPrevBoardFileList;
    // const prevThumbPath = props.prevThumbPath; // 썸네일 관련 변수 제거
    // const setPrevThumbPath = props.setPrevThumbPath; // 썸네일 관련 변수 제거
    const delBoardFileNo = props.delBoardFileNo;
    const setDelBoardFileNo = props.setDelBoardFileNo;

    // --- 디버깅 시작 ---
    // setDelBoardFileNo가 함수인지 확인하는 로그
    console.log("NoticeFrm: setDelBoardFileNo type:", typeof setDelBoardFileNo);
    console.log("NoticeFrm: setDelBoardFileNo value:", setDelBoardFileNo);
    // --- 디버깅 끝 ---

    // const serverUrl = import.meta.env.VITE_BACK_SERVER; // 현재 사용되지 않으므로 주석 처리

    // 제목 변경 시 호출 함수
    function chgBoardTitle(e){
        setBoardTitle(e.target.value);
    }

    // 섬네일 이미지 미리보기용 변수 (서버에 전송 X) - 제거
    // const [thumbImg, setThumbImg] = useState(null); 

    // input type = file 인 섬네일 업로드 요소와 연결하여 사용 - 제거
    // const thumbFileEl = useRef(null); 

    // 섬네일 이미지 변경 시 호출 함수 (onChange) - 제거
    /*
    function chgThumbFile(e){
        const files = e.target.files;

        if(files.length !== 0 && files[0] !== null){
            setBoardThumb(files[0]);
            const reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onloadend = function(){
                setThumbImg(reader.result);
            }
        }else{
            setBoardThumb(null);
            setThumbImg(null);
        }
    }
    */

    // 사용자가 업로드한 첨부파일을 화면에 보여주기 위한 변수 생성 (DB 작업 X)
    const [boardFileImg, setBoardFileImg] = useState([]);   // 업로드한 파일명

    // 첨부파일 업로드 시 동작함수 (onChange)
    function chgBoardFile(e){
        const files = e.target.files;   // 유사 배열이기 때문에 배열에서 제공되는 map 함수 사용 불가
        const fileArr = [];             // 부모 컴포넌트 (NoticeWrite) 에서 전달한 첨부파일 배열 (boardFile) State 변수에 매개변수로 전달할 배열
        const fileNameArr = [];         // 화면에 첨부파일 목록을 노출시키기 위한 배열

        for(let i=0;i<files.length; i++){   // 사용자가 업로드한 파일들 순회
            fileArr.push(files[i]);
            fileNameArr.push(files[i].name);
        }

        /* fileArr, fileNameArr 앞에 전개 연산자 (...) 를 생략하면, 배열 자체가 하나의 요소로 추가됨
         * let aArr = ['a', 'b'];
         * let bArr = ['c', 'd'];
         *
         * [...aArr, ...bArr] => ['a','b','c','d']
         * [...aArr, bArr] => ['a','b',['c','d']]
         */
        setBoardFile([...boardFile, ...fileArr]);            // 파일 객체 배열
        setBoardFileImg([...boardFileImg, ...fileNameArr]);    // 파일 이름 배열
    }

    return (
        <div>
            {/* 썸네일 관련 UI 제거 */}
            {/* <div className="board-thumb-wrap"> ... </div> */}
            <div className="board-info-wrap">
                <table className="tbl">
                    <tbody>
                        <tr>
                            <th style={{width : "30%"}}>
                                <label htmlFor="boardTitle">제목</label>
                            </th>
                            <td>
                                <div className="input-item">
                                    <input type="text" id="boardTitle" name="boardTitle" value={boardTitle} onChange={chgBoardTitle}/>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>작성자</th>
                            {/* 공지사항은 관리자만 작성하므로, 관리자 아이디 표시 */}
                            <td className="left">{loginMember.memberId}</td>
                        </tr>
                        <tr>
                            <th>
                                <label>첨부파일</label>
                            </th>
                            <td className="left">
                                <label htmlFor="boardFile" className="btn-primary sm">파일첨부</label>
                                <input type="file" id="boardFile" multiple style={{display : 'none'}} onChange={chgBoardFile}/>
                            </td>
                        </tr>
                        <tr>
                            <th>첨부파일 목록</th>
                            <td>
                                <div className="board-file-wrap">
                                    
                                    {
                                        prevBoardFileList // 수정하기 로직에서 기존 파일 존재시
                                        ? prevBoardFileList.map(function(oldFile, index){
                                            // 기존 파일 삭제 아이콘 클릭 시 호출 함수
                                            function deleteFile (){
                                                const newFileList = prevBoardFileList.filter(function(fOldFile){
                                                    return oldFile.boardFileNo !== fOldFile.boardFileNo; // 고유 ID로 비교
                                                });
                                                setPrevBoardFileList(newFileList);   // 삭제 후 새로운 배열을 기존 파일 State 에 저장 : 여기까지가 화면에서 삭제

                                                // 서버에서 파일을 삭제하기 위해, 삭제 아이콘을 클릭한 파일의 파일 번호를 변수에 세팅
                                                // -- 변경 시작: setDelBoardFileNo 호출 전 함수 여부 확인 --
                                                if (typeof setDelBoardFileNo === 'function') {
                                                    setDelBoardFileNo([...delBoardFileNo, oldFile.boardFileNo]);
                                                } else {
                                                    console.error("setDelBoardFileNo is not a function in deleteFile for old files.");
                                                }
                                                // -- 변경 끝 --
                                            }

                                            // oldFile : BoardFileDto 객체
                                            return <p key={'old-file-'+oldFile.boardFileNo}> {/* 고유 ID 사용 */}
                                                        <span className="fileName">{oldFile.fileName}</span>
                                                        <span className="material-icons del-file-icon" onClick={deleteFile}>
                                                            delete
                                                        </span>
                                                    </p>
                                        })
                                        : ""
                                    }

                                    {/* 수정하기 로직에서는 여기까지 로직이 기존 파일 관련 로직, 이 아래부터 새로운 파일 로직 */}

                                    {
                                        boardFileImg.map(function(fileName, index){

                                            // 배열의 각 요소마다 적용되는 함수 (삭제)
                                            function deleteFile(){
                                                const newBoardFileImg = [...boardFileImg];
                                                newBoardFileImg.splice(index, 1);
                                                setBoardFileImg(newBoardFileImg); // 화면에 출력되는 배열 변경

                                                const newBoardFile = [...boardFile];
                                                newBoardFile.splice(index, 1);
                                                setBoardFile(newBoardFile);   // DB 에 업로드될 배열 변경
                                            }

                                            return <p key={"new-file-"+index}>
                                                        <span className="fileName">{fileName}</span>
                                                        <span className="material-icons del-file-icon" onClick={deleteFile}>
                                                            delete
                                                        </span>
                                                    </p>
                                        })
                                    }
                                </div>
                            </td>
                        </tr>
                        {/* 비밀글 설정 UI 제거 */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}