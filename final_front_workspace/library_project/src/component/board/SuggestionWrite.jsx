// src/component/board/SuggestionWrite.jsx
import { useState } from "react";
import useUserStore from "../../store/useUserStore";
import SuggestionFrm from "./SuggestionFrm"; // SuggestionFrm 임포트
import createInstance from "../../axios/Interceptor";
import ToastEditor from "../common/ToastEditor";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'; // Swal 임포트

// 건의사항 게시글 작성
export default function SuggestionWrite() {
    const { loginMember } = useUserStore(); // 작성자 정보 가져오기

    const [boardTitle, setBoardTitle] = useState("");     // 제목
    const [boardContent, setBoardContent] = useState(""); // 내용
    const [isSecret, setIsSecret] = useState("N");        // 비밀글 여부 ('Y'/'N')

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    // 등록하기 버튼 클릭 시 동작 함수
    function boardWrite() {
        if (boardTitle.trim() === '' || boardContent.trim() === '') {
            Swal.fire({
                title: '알림',
                text: '게시글 제목과 내용은 필수 입력값입니다.',
                icon: 'warning'
            });
            return;
        }

        // -- 변경 시작: 로그인 여부 확인 및 경고 처리 --
        if (!loginMember || !loginMember.memberNo) {
            Swal.fire({
                title: '로그인 필요',
                text: '글을 작성하려면 로그인해야 합니다.',
                icon: 'warning'
            });
            return;
        }
        // -- 변경 끝 --

        Swal.fire({
            title: '작성 후 수정 및 삭제가 불가합니다.',
            text: '정말 작성하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '예, 작성합니다!',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                const form = new FormData();

                form.append("boardTitle", boardTitle);
                form.append("boardContent", boardContent);
                form.append("boardWriter", loginMember.memberNo); // 작성자 회원 번호
                form.append("boardCode", "S"); // 건의사항 게시판 코드는 'S'로 고정
                form.append("isImportant", "N"); // 건의사항은 중요 공지 아님
                form.append("isSecret", isSecret); // 비밀글 여부
                // -- 변경 시작: isAdmin 및 loginMemberNo 필드 추가 --
                // 백엔드 컨트롤러의 @RequestParam에 맞춰 isAdmin과 loginMemberNo를 추가
                form.append("isAdmin", loginMember.isAdmin || 'F'); // loginMember가 null이면 'F'
                form.append("loginMemberNo", loginMember.memberNo);
                // -- 변경 끝 --

                // 건의사항은 첨부파일 없음
                // form.append("boardFile", ...); 

                let options = {};
                options.method = 'post';
                options.url = serverUrl + '/suggestion'; // 건의사항 API URL
                options.data = form;
                options.headers = {};
                options.headers.contentType = 'multipart/form-data';
                options.headers.processData = false;

                axiosInstance(options)
                    .then(function (res) {
                        if (res.data.resData) {
                            Swal.fire({
                                title: '성공',
                                text: '건의사항이 성공적으로 등록되었습니다.',
                                icon: 'success'
                            }).then(() => {
                                navigate('/board/suggestion/list');
                            });
                        } else {
                            Swal.fire({
                                title: '실패',
                                text: res.data.resMsg || '건의사항 등록에 실패했습니다.',
                                icon: 'error'
                            });
                        }
                    })
                    .catch(function (error) {
                        console.error("건의사항 등록 실패:", error);
                        Swal.fire({
                            title: '오류 발생',
                            text: '건의사항 등록 중 통신 오류가 발생했습니다.',
                            icon: 'error'
                        });
                    });
            }
        });
    }

    return (
        <section className="section board-content-wrap">
            <div className="page-title">건의사항 작성</div>
            <form className="board-write-frm" onSubmit={function (e) {
                e.preventDefault();
                boardWrite(); // 등록하기 함수 호출
            }}>
                <SuggestionFrm
                    loginMember={loginMember}
                    boardTitle={boardTitle} setBoardTitle={setBoardTitle}
                    isSecret={isSecret} setIsSecret={setIsSecret} // 비밀글 여부 전달
                    // 건의사항은 첨부파일 관련 props 없음
                />
                <div className="board-content-wrap">
                    <ToastEditor boardContent={boardContent} setBoardContent={setBoardContent} type={0 /* '작성' 을 뜻하는 0을 보냄 */}/>
                </div>
                <div className="button-zone">
                    <button type="submit" className="btn-primary lg">
                        등록하기
                    </button>
                </div>
            </form>
        </section>
    );
}