import { use, useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import PageNavi from "../common/PageNavi";
import Modal from 'react-modal';


//도서 상세정보의 서평란 관리용 부모 컴포넌트
export default function Comment (props) {

    //도서 청구기호 추출
    const callNo = props.callNo;

    const serverUrl = import.meta.env.VITE_BACK_SERVER; //백엔드 서버 URL
    const axiosInstance = createInstance();

    //로그인 회원 정보
    const {isLogined, loginMember} = useUserStore();

    //이하 두 변수는 상태 끌어올리기 (State Lifting) 를 위해 작성
    //CommentList와 CommentInput이 공유할 '수정 중인 서평' 상태를 Comment 컴포넌트에 정의
    const [updateComment, setUpdateComment] = useState(null); //null이면 작성 모드, 객체면 수정 모드

    //서평 등록/수정/삭제 성공 시 CommentList 갱신을 위한 트리거
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    //서평 등록/수정/삭제 성공 시 호출될 콜백 함수
    const commentCheck = () => {
        setRefreshTrigger(prev => prev + 1); // 트리거 값을 변경하여 CommentList 갱신 유도
    };

    //로그인 체크 함수
    function isLoginedCheck(){
        if(!isLogined){
            Swal.fire({
                title : '알림',
                text : '로그인이 필요합니다',
                icon : 'warning',
                confirmButtonText : '확인'
            })
            // navigate('/login', { state: { from: location.pathname } }); // 이 부분은 Comment 컴포넌트 내에 navigate가 없어 주석 처리하거나, Comment 컴포넌트에도 navigate를 props로 전달해야 함.
        }
    }

    return (
        <div className="detail-section comment-area-section"> {/* 서평 섹션 전체를 감싸는 div */}
            <h3 className="section-title">한줄 서평</h3> {/* 서평 섹션 제목 */}
            <CommentInput callNo={callNo} axiosInstance={axiosInstance} serverUrl={serverUrl} 
                            isLogined={isLogined} loginMember={loginMember} isLoginedCheck={isLoginedCheck} 
                            updateComment={updateComment} setUpdateComment={setUpdateComment} commentCheck={commentCheck}/>
            <CommentList callNo={callNo} axiosInstance={axiosInstance} serverUrl={serverUrl} 
                            isLogined={isLogined} loginMember={loginMember} 
                            setUpdateComment={setUpdateComment} commentCheck={commentCheck}/>
        </div>
    )
}


//서평 입력/수정용 컴포넌트
function CommentInput ({ callNo, axiosInstance, serverUrl, loginMember, isLoginedCheck, updateComment, setUpdateComment, commentCheck }) {

    // 한줄서평 작성값을 저장할 변수
    // 수정 모드일 경우 updateComment 내용을 초기값으로 설정
    const [commentInputValues, setCommentInputValues] = useState({
        commentContent : "", //초기값 설정
        memberId : "",
        callNo : callNo
    });

    // 컴포넌트 마운트 시 또는 updateComment가 변경될 때마다 입력값 초기화/설정
    useEffect(() => {
        setCommentInputValues({
            commentContent : updateComment ? updateComment.commentContent : "",
            memberId : loginMember?.memberId || "",
            callNo : callNo
        });
    }, [updateComment, callNo, loginMember]); //updateComment, callNo, loginMember 변경 시 실행

    // 서평 입력값 업데이트 함수
    function commentInput(e){
        setCommentInputValues(prev => ({ // 이전 상태를 활용하여 업데이트
            ...prev,
            [e.target.id]: e.target.value
        }));
    }

    // 수정 취소 함수 (수정 모드일 때만 노출)
    function cancelUpdate(){
        setUpdateComment(null); // 수정 모드 해제
        setCommentInputValues({ commentContent: "", memberId: loginMember?.memberId || "", callNo: callNo }); // 입력값 초기화
    }

    //새로고침용 변수
    const [refreshTrigger, setRefreshTrigger] = useState(0); 

    //서평 작성 후 전송
    function commentSubmit(){

        //서평 입력칸이 비었을 때 (공백 포함)
        if (commentInputValues.commentContent.trim() === "") { 
            Swal.fire({
                title: '알림',
                text: '서평 내용을 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        //서평 작성 / 수정 시 각 전달 내용을 다르게 설정
        let postUrl = "";
        const postData = { ...commentInputValues, memberId: loginMember?.memberId}; //전송할 데이터 복사

        if (updateComment) { //수정 모드일 경우
            postUrl = serverUrl + '/book/updateComment';
            postData.commentNo = updateComment.commentNo; //수정할 서평의 고유 번호 추가 전달
        } else { //작성 모드일 경우
            postUrl = serverUrl + '/book/insertComment';
        }

        //서평 내용 전송 후 결과값 받아오기
        axiosInstance.post(postUrl, postData)
        .then(function(res){
            Swal.fire({
                title: '알림',
                text: res.data.clientMsg, 
                icon: res.data.alertIcon, 
                confirmButtonText: '확인'
            }).then(() => {
                setCommentInputValues({commentContent : "", memberId: loginMember?.memberId || "", callNo: callNo}); // 입력값 초기화
                setUpdateComment(null); // 수정 모드 해제
                commentCheck(); // 부모 컴포넌트에 서평 목록 갱신 요청
            });
        })
        .catch(function(err){

        })
    }

    

    return (
        // Comment 컴포넌트에서 이미 section-title을 포함한 comment-section을 감싸고 있으므로 이 div는 제거
        <div className="comment-input-container"> {/* 서평 입력 컨테이너 */}
            <form onSubmit={function(e){
                e.preventDefault(); //기본 submit 이벤트 제어 : 별도의 함수로 분리
                commentSubmit();          //등록 함수 호출
            }}>
                <div className="comment-input-area">
                    <textarea type="text" placeholder="비방, 욕설, 인신공격성 글은 삭제 처리될 수 있습니다." id='commentContent' className="comment-content-textarea"
                    value={commentInputValues.commentContent} onMouseDown={isLoginedCheck} onChange={commentInput}
                    maxLength={100}/>
                    <button type='submit'className="btn-comment-submit">{updateComment ? "수정" : "등록"}</button>
                    {updateComment && ( // 수정 모드일 때만 취소 버튼 노출
                        <button type='button' onClick={cancelUpdate} className="btn-comment-cancel">취소</button>
                    )}
                </div>
            </form>
        </div>
    )
}


//서평 목록을 출력할 컴포넌트 : 페이지네이션과 함께 출력
function CommentList({ callNo, axiosInstance, serverUrl, isLogined, loginMember, setUpdateComment, commentCheck }){
    //이 컴포넌트에서 관리할 서평 목록
    const [comments, setComments] = useState([]);

    //서평 페이지네이션 현재 페이지
    const [reqPage, setReqPage] = useState(1); 

    //서평 페이지네이션 정보
    const [pageInfo, setPageInfo] = useState({}); 

    // ---- 신고 관련 상태 추가 ----
    const [isReportModalOpen, setIsReportModalOpen] = useState(false); // 신고 모달 열림/닫힘 상태
    const [reportReason, setReportReason] = useState(""); // 신고 사유 입력값
    const [currentReportedComment, setCurrentReportedComment] = useState(null); // 현재 신고할 댓글 정보


    //callNo, currentPage, refreshTrigger 변경 시 서평 목록 조회
    useEffect(() => {
        if (!callNo) {
            setComments([]);
            setPageInfo({});
            return;
        }

        //서평 목록을 가져오는 백엔드 API 호출 : callNo 와 reqPage 를 파라미터로 받고, 서평 목록과 페이지 정보를 반환
        axiosInstance.post(serverUrl + '/book/commentList', { callNo: callNo, reqPage: reqPage })
        .then(function(res){
            if (res.data && res.data.resData && Array.isArray(res.data.resData.commentList)) {
                setComments(res.data.resData.commentList);
                setPageInfo(res.data.resData.pageInfo);
            } else {
                console.warn("CommentList: 서평 목록 데이터가 배열이 아니거나 없음", res.data);
                setComments([]);
                setPageInfo({});
            }
        })
        .catch(function(err){

        });

    }, [callNo, reqPage, commentCheck, axiosInstance, serverUrl]); //의존성 배열 : 서평 등록/수정/삭제 시 업데이트

    //서평 수정 버튼 함수
    function commentUpdate(comment){
        //수정할 서평 객체를 상태에 저장하여 CommentInput에 전달
        setUpdateComment(comment); 
    };

    //서평 삭제 버튼 함수
    function commentDelete(comment){
        Swal.fire({
            title: "서평 삭제",
            text: "정말 이 서평을 삭제하시겠습니까?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "예",
            cancelButtonText: "아니오"
        }).then(function(result){
            if (result.isConfirmed) {
                axiosInstance.post(serverUrl + '/book/deleteComment', { 
                    commentNo: comment.commentNo 
                })
                .then(res => {
                    Swal.fire({
                        title: '알림',
                        text: res.data.clientMsg, 
                        icon: res.data.alertIcon,
                    })
                    commentCheck(); //페이지 새로고침
                })
                .catch(function(err){

                });
            }
        });
    };

//서평 신고 함수 (신고 모달 열기)
    function report(comment){
        if (!isLogined) {
            Swal.fire({
                title: '알림',
                text: '로그인이 필요합니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }
        setCurrentReportedComment(comment); // 어떤 댓글을 신고할지 저장
        setReportReason(""); // 모달 열기 전에 사유 초기화
        setIsReportModalOpen(true); // 신고 모달 열기
    }

    // 신고 사유 입력 핸들러
    const handleReportReasonChange = (e) => {
        setReportReason(e.target.value);
    };

    // 신고 제출 함수
    const submitReport = () => {
        if (reportReason.trim() === "") {
            Swal.fire({
                title: '알림',
                text: '신고 사유를 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        if (reportReason.length > 50) {
            Swal.fire({
                title: '알림',
                text: '신고 사유는 50자를 초과할 수 없습니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }
        
        // 백엔드로 전송할 데이터 구성
        const reportData = {
            reportReason: reportReason,
            reportedCommentNo: currentReportedComment.commentNo, // 신고된 댓글 번호
            reportedCommentCallNo: callNo, // 신고된 서평이 작성된 책 청구기호
            reportedMemberId: loginMember.memberId // 신고한 회원 아이디
        };

        // 백엔드 API 호출
        axiosInstance.post(serverUrl + '/book/reportComment', reportData) // 실제 엔드포인트에 따라 변경 필요
        .then(function(res){
            Swal.fire({
                title: '알림',
                text: res.data.clientMsg || '서평 신고가 완료되었습니다.', 
                icon: res.data.alertIcon || 'success',
                confirmButtonText: '확인'
            }).then(() => {
                setIsReportModalOpen(false); // 모달 닫기
                setCurrentReportedComment(null); // 신고 댓글 정보 초기화
                setReportReason(""); // 사유 초기화
                // 필요하다면 commentCheck()를 호출하여 목록을 갱신할 수 있습니다.
            });
        })
        .catch(function(err){
            console.error("서평 신고 중 오류 발생:", err);
            Swal.fire({
                title: '오류',
                text: '서평 신고에 실패했습니다. 다시 시도해주세요.',
                icon: 'error',
                confirmButtonText: '확인'
            });
        });
    };

    // 신고 모달 닫기 함수
    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setReportReason(""); // 사유 초기화
        setCurrentReportedComment(null); // 댓글 정보 초기화
    };


    return (
        <div className="comment-list-container"> {/* 서평 목록 전체를 감싸는 div */}
            {/* 작성된 서평 목록 */}
            <div className="comment-list">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div className="comment-item" key={'comment'+index}> 
                            <p className="comment-content-text"> {/* 텍스트용 클래스 추가 */}
                                {comment.commentContent}
                            </p>
                            <div className="comment-footer"> {/* 메타 정보와 버튼을 감싸는 div */}
                                <span className="comment-meta">
                                    {comment.memberId} 작성일: {comment.commentDate} 
                                    {comment.commentUpdateDate && ( // commentUpdateDate가 있을 때만 표시
                                        <span> (수정일: {comment.commentUpdateDate})</span>
                                    )}
                                </span>
                                <div className="comment-actions">
                                    {/* 로그인한 회원이 서평 작성자일 때/관리자일 때  수정/삭제 버튼 보이게 */}
                                    {(isLogined && loginMember.memberId === comment.memberId) ||(isLogined && loginMember.isAdmin === 'T') ?
                                        <>
                                            <button onClick={() => commentUpdate(comment)} className="btn-comment-action btn-update">수정</button>
                                            <button onClick={() => commentDelete(comment)} className="btn-comment-action btn-delete">삭제</button>
                                        </>
                                        :
                                        // 로그인하지 않았거나 다른 작성자의 서평일 경우
                                        <button className="btn-comment-action btn-report" onClick={() => report(comment)}>신고</button>
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments-message">아직 등록된 서평이 없습니다.</p>
                )}
            </div>

            {/* 페이지네이션 (CommentList 내부에서 관리) */}
            {pageInfo.totalPage > 1 && ( /* 전체 페이지가 1보다 클 때만 페이지네이션 표시 */
                <div className="comment-pagination">
                    <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
                </div>
            )}

<Modal
    isOpen={isReportModalOpen}
    onRequestClose={closeReportModal}
    contentLabel="서평 신고"
    className="report-modal"
    overlayClassName="report-modal-overlay"
>
    <div className="modal-header"> {/* 헤더 클래스 추가 */}
        <h2 className="modal-title">서평 신고</h2> {/* 타이틀 클래스 추가 */}
    </div>
    <div className="modal-content-area modal-body"> {/* 콘텐츠 영역 공통 클래스 및 개별 클래스 적용 */}
        <p className="modal-label">신고 사유를 입력해주세요 (최대 50자):</p> {/* p 태그에 modal-label 클래스 적용 */}
        <textarea
            className="modal-input report-reason-textarea" // 공통 입력 필드 클래스 및 개별 클래스 적용
            value={reportReason}
            onChange={handleReportReasonChange}
            maxLength={50}
            placeholder="신고 사유를 자세히 입력해주세요."
        />
    </div>
    <div className="modal-actions modal-footer"> {/* 버튼 그룹 공통 클래스 및 개별 클래스 적용 */}
        <button className="btn-modal-confirm btn-report-submit" onClick={submitReport}>신고</button> {/* 공통 버튼 클래스 및 개별 클래스 적용 */}
        <button className="btn-modal-cancel btn-report-cancel" onClick={closeReportModal}>취소</button> {/* 공통 버튼 클래스 및 개별 클래스 적용 */}
    </div>
</Modal>

        </div>
    );
} 