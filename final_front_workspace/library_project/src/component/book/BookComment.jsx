import { use, useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import PageNavi from "../common/PageNavi";

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
                tite : '알림',
                text : '로그인이 필요합니다',
                icon : 'warning',
                confirmButtonText : '확인'
            })
            navigate('/login', { state: { from: location.pathname } });
        }
    }

    return (
        <>
            <CommentInput callNo={callNo} axiosInstance={axiosInstance} serverUrl={serverUrl} 
                            isLogined={isLogined} loginMember={loginMember} isLoginedCheck={isLoginedCheck} 
                            updateComment={updateComment} setUpdateComment={setUpdateComment} commentCheck={commentCheck}/>
            <CommentList callNo={callNo} axiosInstance={axiosInstance} serverUrl={serverUrl} 
                            isLogined={isLogined} loginMember={loginMember} 
                            setUpdateComment={setUpdateComment} commentCheck={commentCheck}/>
        </>
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
        setEditingComment(null); // 수정 모드 해제
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
        <div className="comment-section">
            {/* 서평 등록란 */}
            <h3 className="section-title">한줄 서평</h3>
            <form onSubmit={function(e){
                e.preventDefault(); //기본 submit 이벤트 제어 : 별도의 함수로 분리
                commentSubmit();          //등록 함수 호출
            }}>
                <div className="comment-input-area">
                    <textarea type="text" placeholder="비방, 욕설, 인신공격성 글은 삭제 처리될 수 있습니다." id='commentContent' className="comment-content" 
                    value={commentInputValues.commentContent} onFocus={isLoginedCheck} onChange={commentInput}
                    style={{width : '500px', height : '30px'}} maxLength={100}/>
                    <button type='submit'className="btn-comment-submit">등록</button>
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


    return (
        <>
            {/* 작성된 서평 목록 */}
            <div className="comment-list">
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div className="comment-item" key={'comment'+index}> 
                            <p className="comment-content">
                                {comment.commentContent}
                            </p>
                            <span className="comment-meta">
                                {comment.memberId} 작성일: {comment.commentDate} 
                                {comment.commentUpdateDate != "" || comment.commentUpdateDate != null
                                 ? comment.commentUpdateDate
                                 : ""
                                }
                            </span>
                            <div className="comment-actions">
                                {/* 로그인한 회원이 서평 작성자일 때 수정/삭제 버튼 보이게 */}
                                {isLogined && loginMember.memberId == comment.memberId ?
                                    <>
                                        <button onClick={() => commentUpdate(comment)} className="btn btn-update-comment">수정</button>
                                        <button onClick={() => commentDelete(comment)} className="btn btn-delete-comment">삭제</button>
                                    </>
                                :
                                    <button className="btn btn-report-comment">신고</button>
                                }
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-comments-message">아직 등록된 서평이 없습니다.</p>
                )}
            </div>

            {/* 페이지네이션 (CommentList 내부에서 관리) */}
            <div className="comment-pagination">
                <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </>
    );
}