import { useRef, useState } from "react";

//게시글 작성 및 수정 시, 입력폼 컴포넌트
export default function BoardFrm(props){

    //부모 컴포넌트에서 전달받은 데이터 추출
    const loginMember = props.loginMember;
    const boardTitle = props.boardTitle;
    const setBoardTitle = props.setBoardTitle;
    // const boardThumb = props.boardThumb; // 썸네일 관련 변수 주석 처리
    // const setBoardThumb = props.setBoardThumb; // 썸네일 관련 변수 주석 처리
    const boardFile = props.boardFile;
    const setBoardFile = props.setBoardFile;

    //수정 시 전달 데이터 추출
    const prevBoardFileList = props.prevBoardFileList;
    const setPrevBoardFileList = props.setPrevBoardFileList;
    // const prevThumbPath = props.prevThumbPath; // 썸네일 관련 변수 주석 처리
    // const setPrevThumbPath = props.setPrevThumbPath; // 썸네일 관련 변수 주석 처리
    const delBoardFileNo = props.delBoardFileNo;
    const setDelBoardFileNo = props.setDelBoardFileNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    //제목 변경 시 호출 함수
    function chgBoardTitle(e){
        setBoardTitle(e.target.value);
    }

    //섬네일 이미지 미리보기용 변수 (서버에 전송 X)
    // const [thumbImg, setThumbImg] = useState(null); // 썸네일 관련 변수 주석 처리

    //input type = file 인 섬네일 업로드 요소와 연결하여 사용
    // const thumbFileEl = useRef(null); // 썸네일 관련 변수 주석 처리

    //섬네일 이미지 변경 시 호출 함수 (onChange)
    /*
    function chgThumbFile(e){ // 썸네일 관련 함수 주석 처리
        const files = e.target.files;

        if(files.length != 0 && files[0] != null){
            setBoardThumb(files[0]);    //게시글 등록하기 클릭 시 서버에 전송될 섬네일 파일 객체

            //섬네일 이미지 화면에 보여주기
            const reader = new FileReader();    //브라우저에서 파일을 비동기적으로 읽을 수 있게 해 주는 객체
            reader.readAsDataURL(files[0]);    //파일 데이터 읽어오기
            reader.onloadend = function(){      //모두 읽어오면 실행할 함수 작성
                setThumbImg(reader.result);    //미리보기를 State 변수에 세팅
            }
        }else{  //섬네일 등록을 취소한 경우 (취소버튼을 누른 경우) 섬네일 파일 객체와 미리보기용 변수 초기화
            setBoardThumb(null);
            setThumbImg(null);
        }
    }
    */

    //사용자가 업로드한 첨부파일을 화면에 보여주기 위한 변수 생성 (DB 작업 X)
    const [boardFileImg, setBoardFileImg] = useState([]);   //업로드한 파일명

    //첨부파일 업로드 시 동작함수 (onChange)
    function chgBoardFile(e){
        const files = e.target.files;   //유사 배열이기 때문에 배열에서 제공되는 map 함수 사용 불가
        const fileArr = new Array();    //부모 컴포넌트 (BoardWrite) 에서 전달한 첨부파일 배열 (boardFile) State 변수에 매개변수로 전달할 배열

        const fileNameArr = new Array();    //화면에 첨부파일 목록을 노출시키기 위한 배열

        for(let i=0;i<files.length; i++){   //사용자가 업로드한 파일들 순회
            fileArr.push(files[i]);
            fileNameArr.push(files[i].name);
        }

        /* fileArr, fileNameArr 앞에 전개 연산자 (...) 를 생략하면, 배열 자체가 하나의 요소로 추가됨
         * * let aArr = ['a', 'b'];
         * let bArr = ['c', 'd'];
         * * [...aArr, ...bArr] => ['a','b','c','d']
         * [...aArr, bArr] => ['a','b',['c','d']]
         */
        setBoardFile([...boardFile, ...fileArr]);            //파일 객체 배열
        setBoardFileImg([...boardFileImg, ...fileNameArr]);    //파일 이름 배열
    }

    return (
        <div>
            {/* <div className="board-thumb-wrap">
                 * 1) 마우스로 img 요소 클릭
                   * 2) img 요소 클릭 이벤트 핸들러 내부에서 useRef 로 연결한 input type=file 인 요소가 동적으로 클릭됨
                   * 3) 브라우저에 이미지를 선택할 수 있는 파일 탐색기가 오픈되고, 이미지를 선택
                   * 4) input type=file 인 요소의 onChange 이벤트 핸들러가 동작
                   * 5) onChange 이벤트 핸들러 내부에서 파일을 읽어오고, thumbImg 변수에 읽어온 값을 세팅
                   * 6) thumbImg (State 변수) 가 변경되어 리렌더링이 일어나고, 값에 따라 선택한 이미지가 화면에 보여짐
                   

                {thumbImg
                    ? <img src={thumbImg} onClick={function(e){ //섬네일 이미지가 있을 경우는 해당 섬네일 이미지 출력
                        //e.target == img 요소 객체 : 이 속성을 이용해 다음 요소인 input 을 동적으로 클릭하게 하는 것이 가능하나, react 에서 권장하는 방법은 아님
                        //useRef 훅을 이용해 자바스크립트 변수와 input 요소를 연결하고, 해당 변수를 이용해 컨트롤 가능
                        thumbFileEl.current.click();
                    }}></img>
                    :
                        prevThumbPath   //수정하기에서 기존 섬네일 파일 존재 시 기존 섬네일 파일을 보여주고, 위와 동일하게 클릭시 이벤트를 설정함
                        ?
                        <img src={serverUrl + '/board/thumb/' + prevThumbPath.substring(0,8) + "/" + prevThumbPath} onClick={function(e){
                            thumbFileEl.current.click();
                        }}/>
                        :    
                        <img src="/images/default_img.png" onClick={function(e){    //섬네일 이미지가 없을 경우 기본 섬네일 이미지 출력
                            thumbFileEl.current.click();
                        }}></img>
                }
                <input type='file' accept="image/*" style={{display : 'none'}} ref={thumbFileEl} onChange={chgThumbFile}/>          
            </div> */}
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
                                        prevBoardFileList   //수정하기 로직에서 기존 파일 존재시
                                        ? prevBoardFileList.map(function(oldFile, index){

                                            //기존 파일 삭제 아이콘 클릭 시 호출 함수
                                            function deleteFile (){
                                                const newFileList = prevBoardFileList.filter(function(fOldFile, fIndex){
                                                    return oldFile != fOldFile;
                                                })
                                                setPrevBoardFileList(newFileList);   //삭제 후 새로운 배열을 기존 파일 State 에 저장 : 여기까지가 화면에서 삭제

                                                //서버에서 파일을 삭제하기 위해, 삭제 아이콘을 클릭한 파일의 파일 번호를 변수에 세팅
                                                setDelBoardFileNo([...delBoardFileNo, oldFile.boardFileNo]);
                                            }

                                            //oldFile : BoardFileDto 객체
                                            return <p key={'old-file'+index}>
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

                                            //배열의 각 요소마다 적용되는 함수 (삭제)
                                            function deleteFile(){
                                                boardFileImg.splice(index, 1);       //선택한 요소의 인덱스 번호 객체(해당 객체) 부터 1개 삭제 후 새로운 배열 반환
                                                setBoardFileImg([...boardFileImg]); //화면에 출력되는 배열 변경

                                                boardFile.splice(index, 1);
                                                setBoardFile([...boardFile]);   //DB 에 업로드될 배열 변경
                                            }

                                            return <p key={"new-file"+index}>
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
                    </tbody>
                </table>
            </div>
        </div>
    );
}