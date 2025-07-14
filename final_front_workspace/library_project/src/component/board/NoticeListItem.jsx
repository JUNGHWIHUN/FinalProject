// src/component/board/NoticeListItem.jsx
import { useNavigate } from "react-router-dom";

// 게시글 1개 (공지사항 목록 아이템)
function NoticeListItem(props) {
    const board = props.board;
    const serverUrl = props.serverUrl;
    const navigate = useNavigate();

    return (
        <li className="posting-item" onClick={function(){
            // 상세보기 (NoticeView) 컴포넌트 전환
            // 경로 수정: "/board"를 명시적으로 추가
            navigate('/board/notice/view/' + board.boardNo);
        }}>
            <div className="posting-img">
                {/* 썸네일 기능 제거에 따라 기본 이미지로 고정 */}
                <img src="/images/default_img.png"/>
            </div>
            <div className="posting-info">
                <div className="posting-title">
                    {board.boardTitle}
                    {/* 첨부파일이 있다면 아이콘 표시 */}
                    {board.fileList && board.fileList.length > 0 && (
                        <span className="material-icons" style={{ fontSize: '1.2em', verticalAlign: 'middle', marginLeft: '5px', color: '#666' }}>
                            attachment
                        </span>
                    )}
                </div>
                <div className="posting-sub-info">
                    {/* 공지사항 목록에는 글쓴이 표시하지 않음 */}
                    {/* <span>{board.boardWriter}</span> */}
                    <span>{board.boardDate}</span>
                </div>
            </div>
        </li>
    );
}
export default NoticeListItem; // export 추가