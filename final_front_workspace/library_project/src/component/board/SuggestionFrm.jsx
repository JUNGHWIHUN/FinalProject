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
        <div className="board-info-wrap">
            {/* --- 중요 변경 시작: NoticeFrm의 표 모양과 스타일명 적용 --- */}
            <table className="board-view-header-table"> {/* NoticeView의 테이블 클래스 재활용 */}
                <tbody>
                    <tr>
                        <th className="view-table-label">제목</th> {/* NoticeFrm과 동일한 클래스명 */}
                        <td className="view-table-content" colSpan="2"> {/* colSpan="2"로 설정 */}
                            <input
                                type="text"
                                id="boardTitle"
                                name="boardTitle"
                                className="form-input" /* NoticeFrm의 입력 필드 스타일 클래스 */
                                placeholder="제목을 입력하세요"
                                value={boardTitle}
                                onChange={chgBoardTitle}
                                required
                            />
                        </td>
                    </tr>
                    <tr>
                        <th className="view-table-label">작성자</th> {/* NoticeFrm과 동일한 클래스명 */}
                        {/* 작성자 정보는 받아서 보여주기만 하므로 input 대신 텍스트로 표시 */}
                        <td className="view-table-content" colSpan="2">{loginMember.memberId}</td> {/* NoticeFrm과 동일한 클래스명, colSpan="2" */}
                    </tr>
                    <tr>
                        <th className="view-table-label">비밀글</th> {/* NoticeFrm과 동일한 클래스명 */}
                        <td className="view-table-content" colSpan="2"> {/* NoticeFrm과 동일한 클래스명, colSpan="2" */}
                            <div className="input-item">
                                <input
                                    type="checkbox"
                                    id="isSecret"
                                    name="isSecret"
                                    checked={isSecret === 'Y'}
                                    onChange={chgIsSecret}
                                />
                                <label htmlFor="isSecret" style={{ marginLeft: '5px' }}>
                                    비밀글로 설정 (작성자 및 관리자만 열람 가능)
                                </label>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            {/* --- 중요 변경 끝 --- */}
        </div>
    );
}