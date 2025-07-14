// src/component/board/NoticeFrm.jsx
import { useRef, useState } from "react";
// import Swal from 'sweetalert2'; // 필요한 경우 추가

// 공지사항 게시글 작성 및 수정 시, 입력폼 컴포넌트
export default function NoticeFrm(props){
    // 부모 컴포넌트에서 전달받은 데이터 추출
    const loginMember = props.loginMember;
    const boardTitle = props.boardTitle;
    const setBoardTitle = props.setBoardTitle;
    const boardFile = props.boardFile;
    const setBoardFile = props.setBoardFile;

    // 수정 시 전달 데이터 추출
    const prevBoardFileList = props.prevBoardFileList;
    const setPrevBoardFileList = props.setPrevBoardFileList;
    const delBoardFileNo = props.delBoardFileNo;
    const setDelBoardFileNo = props.setDelBoardFileNo;

    // --- 디버깅 시작 ---
    // setDelBoardFileNo가 함수인지 확인하는 로그
    console.log("NoticeFrm: setDelBoardFileNo type:", typeof setDelBoardFileNo);
    console.log("NoticeFrm: setDelBoardFileNo value:", setDelBoardFileNo);
    // --- 디버깅 끝 ---

    // 제목 변경 시 호출 함수
    function chgBoardTitle(e){
        setBoardTitle(e.target.value);
    }

    // 사용자가 업로드한 첨부파일을 화면에 보여주기 위한 변수 생성 (DB 작업 X)
    const [boardFileImg, setBoardFileImg] = useState([]); // 업로드한 파일명

    // 첨부파일 업로드 시 동작함수 (onChange)
    function chgBoardFile(e){
        const files = e.target.files; // 유사 배열이기 때문에 배열에서 제공되는 map 함수 사용 불가
        const fileArr = []; // 부모 컴포넌트 (NoticeWrite) 에서 전달한 첨부파일 배열 (boardFile) State 변수에 매개변수로 전달할 배열
        const fileNameArr = []; // 화면에 첨부파일 목록을 노출시키기 위한 배열

        for(let i=0;i<files.length; i++){ // 사용자가 업로드한 파일들 순회
            fileArr.push(files[i]);
            fileNameArr.push(files[i].name);
        }

        setBoardFile([...boardFile, ...fileArr]); // 파일 객체 배열
        setBoardFileImg([...boardFileImg, ...fileNameArr]); // 파일 이름 배열
    }

    return (
        <div className="board-info-wrap">
            {/* -- 변경 시작: NoticeView 상단 표 형식 재활용 -- */}
            <table className="board-view-header-table"> {/* NoticeView의 테이블 클래스 재활용 */}
                <tbody>
                    <tr>
                        <th className="view-table-label">제목</th>
                        <td className="view-table-content" colSpan="2"> {/* colSpan="2"로 설정 */}
                            <input
                                type="text"
                                className="form-input" /* 입력 필드 스타일을 위한 클래스 */
                                placeholder="제목을 입력하세요"
                                value={boardTitle}
                                onChange={chgBoardTitle}
                                required
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className="view-table-label">작성자</th> {/* view-table-label 클래스 추가 */}
                        {/* 공지사항은 관리자만 작성하므로, 관리자 아이디 표시 */}
                        <td className="view-table-content" colSpan="2">{loginMember.memberId}</td> {/* view-table-content 클래스 추가, colSpan="2" */}
                    </tr>
                    <tr>
                        <th className="view-table-label">첨부파일</th> {/* view-table-label 클래스 추가 */}
                        <td className="view-table-content file-input-cell" colSpan="2"> {/* view-table-content 클래스 추가, colSpan="2" */}
                            <label htmlFor="boardFile" className="btn-primary sm file-upload-label"> {/* 새로운 클래스 추가 */}
                                파일첨부 <span className="material-icons upload-icon">cloud_upload</span> {/* 아이콘 추가 */}
                            </label>
                            <input type="file" id="boardFile" multiple style={{display : 'none'}} onChange={chgBoardFile}/>
                            
                            {/* 기존 첨부파일 목록 (수정 시) - 컴파일 오류 해결: null 반환 및 div 래핑 */}
                            {prevBoardFileList && prevBoardFileList.length > 0 ? (
                                <div className="selected-files"> {/* div로 감싸기 */}
                                    {prevBoardFileList.map(function(oldFile, index){
                                        // 기존 파일 삭제 아이콘 클릭 시 호출 함수
                                        function deleteFile (){
                                            const newFileList = prevBoardFileList.filter(function(fOldFile){
                                                return oldFile.boardFileNo !== fOldFile.boardFileNo; // 고유 ID로 비교
                                            });
                                            setPrevBoardFileList(newFileList); // 삭제 후 새로운 배열을 기존 파일 State 에 저장 : 여기까지가 화면에서 삭제

                                            if (typeof setDelBoardFileNo === 'function') {
                                                setDelBoardFileNo([...delBoardFileNo, oldFile.boardFileNo]);
                                            } else {
                                                console.error("setDelBoardFileNo is not a function in deleteFile for old files.");
                                            }
                                        }

                                        return (
                                            <span key={'old-file-'+oldFile.boardFileNo} className="file-tag"> {/* className 추가 */}
                                                <span className="fileName">{oldFile.fileName}</span>
                                                <button type="button" className="remove-file-btn" onClick={deleteFile}>&times;</button> {/* button으로 변경 */}
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : null} {/* 빈 문자열 대신 null 반환 */}

                            {/* 새로운 첨부파일 목록 - 컴파일 오류 해결: div 래핑 */}
                            {boardFileImg.length > 0 ? (
                                <div className="selected-files"> {/* div로 감싸기 */}
                                    {boardFileImg.map(function(fileName, index){
                                        // 배열의 각 요소마다 적용되는 함수 (삭제)
                                        function deleteFile(){
                                            const newBoardFileImg = [...boardFileImg];
                                            newBoardFileImg.splice(index, 1);
                                            setBoardFileImg(newBoardFileImg); // 화면에 출력되는 배열 변경

                                            const newBoardFile = [...boardFile];
                                            newBoardFile.splice(index, 1);
                                            setBoardFile(newBoardFile); // DB 에 업로드될 배열 변경
                                        }

                                        return (
                                            <span key={"new-file-"+index} className="file-tag"> {/* className 추가 */}
                                                <span className="fileName">{fileName}</span>
                                                <button type="button" className="remove-file-btn" onClick={deleteFile}>&times;</button> {/* button으로 변경 */}
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : null} {/* 빈 문자열 대신 null 반환 */}
                        </td>
                    </tr>
                    {/* 비밀글 설정 UI 제거 */}
                </tbody>
            </table>
            {/* -- 변경 끝: NoticeView 상단 표 형식 재활용 -- */}
        </div>
    );
}