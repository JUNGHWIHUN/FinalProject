import { useState } from "react";

// 건의사항 게시글 작성 및 수정 시, 입력폼 컴포넌트
export default function SuggestionFrm(props) {
    // 부모 컴포넌트에서 전달받은 데이터 추출
    const loginMember = props.loginMember;
    const boardTitle = props.boardTitle;
    const setBoardTitle = props.setBoardTitle;
    const isSecret = props.isSecret;
    const setIsSecret = props.setIsSecret;
    
    // 수정 시 전달 데이터는 현재 건의사항 작성 폼에는 필요 없음 (수정 불가)
    // const prevBoardFileList = props.prevBoardFileList;
    // const setPrevBoardFileList = props.setPrevBoardFileList;
    // const delBoardFileNo = props.delBoardFileNo;
    // const setDelBoardFileNo = props.setDelBoardFileNo;

    // 제목 변경 시 호출 함수
    function chgBoardTitle(e) {
        setBoardTitle(e.target.value);
    }

    // 비밀글 여부 변경 시 호출 함수
    function chgIsSecret(e) {
        setIsSecret(e.target.checked ? 'Y' : 'N');
    }

    return (
        <div>
            <div className="board-info-wrap">
                <table className="tbl">
                    <tbody>
                        <tr>
                            <th style={{ width: "30%" }}>
                                <label htmlFor="boardTitle">제목</label>
                            </th>
                            <td>
                                <div className="input-item">
                                    <input type="text" id="boardTitle" name="boardTitle" value={boardTitle} onChange={chgBoardTitle} />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>작성자</th>
                            <td className="left">{loginMember.memberId}</td>
                        </tr>
                        <tr>
                            <th>
                                <label htmlFor="isSecret">비밀글</label>
                            </th>
                            <td className="left">
                                <div className="input-item">
                                    <input type="checkbox" id="isSecret" name="isSecret" checked={isSecret === 'Y'} onChange={chgIsSecret} />
                                    <label htmlFor="isSecret" style={{ marginLeft: '5px' }}>비밀글로 설정 (작성자 및 관리자만 열람 가능)</label>
                                </div>
                            </td>
                        </tr>
                        {/* 건의사항은 첨부파일 기능 없음 */}
                        {/* <tr>
                            <th>
                                <label>첨부파일</label>
                            </th>
                            <td className="left">
                                ...
                            </td>
                        </tr>
                        <tr>
                            <th>첨부파일 목록</th>
                            <td>
                                ...
                            </td>
                        </tr> */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}