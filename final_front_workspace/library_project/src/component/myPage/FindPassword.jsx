// src/components/myPage/FindPassword.jsx
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";

export default function FindPassword() {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const [memberEmail, setMemberEmail] = useState("");
    // 이메일 입력 필드의 유효성/상태를 나타내는 상태
    // 0: 초기/입력 중, 1: 유효한 이메일 형식, 2: 유효하지 않은 이메일 형식
    const [emailInputStatus, setEmailInputStatus] = useState(0); 

    function chgMemberEmail(e) {
        setMemberEmail(e.target.value);
        // 이메일 입력이 변경될 때마다 형식 유효성 상태 초기화
        setEmailInputStatus(0); 
    }

    // 이메일 형식 유효성만 검사하는 함수
    function validateEmailFormat() {
        const emailRegExp = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
        if (!emailRegExp.test(memberEmail)) {
            setEmailInputStatus(2); // 유효하지 않은 이메일 형식
            return false;
        }
        setEmailInputStatus(1); // 형식 유효
        return true;
    }

    // 비밀번호 찾기 요청 함수 (폼 제출 시에만 호출)
    async function requestPasswordReset() {
        // 먼저 이메일 형식 유효성 최종 확인
        if (!validateEmailFormat()) {
            Swal.fire({
                title: '알림',
                text: '올바른 이메일 형식을 입력하세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        try {
            let options = {};
            options.url = serverUrl + '/member/find-password';
            options.method = 'post';
            options.data = { memberEmail: memberEmail };

            const res = await axiosInstance(options);
            console.log(res);

            // 백엔드의 ResponseDto 형식에 맞춰 응답 처리
            if (res.data.success) { // 백엔드에서 success: true로 응답한 경우
                Swal.fire({
                    title: '성공',
                    text: res.data.clientMsg, // "임시 비밀번호가 이메일로 전송되었습니다. 이메일을 확인해주세요."
                    icon: res.data.alertIcon, // 'success' 또는 'info'
                    confirmButtonText: '확인'
                }).then(() => {
                    navigate('/mypage'); // 비밀번호 찾기 성공 후 마이페이지 메인으로 이동
                });
            } else { // 백엔드에서 success: false로 응답한 경우
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg, // "입력하신 이메일로 등록된 회원이 없거나, 임시 비밀번호 전송에 실패했습니다."
                    icon: res.data.alertIcon, // 'warning'
                    confirmButtonText: '확인'
                });
                // 실패 시 이메일 입력 필드의 상태는 '유효하지 않거나 등록되지 않은 이메일'로 표시할 수 있음 (선택 사항)
                // setEmailInputStatus(3); // 새로운 상태 정의 필요
            }
        } catch (err) {
            console.error(err);
            const errorMessage = err.response && err.response.data && err.response.data.message
                                 ? err.response.data.message : '비밀번호 찾기 요청 중 서버 오류가 발생했습니다.';
            Swal.fire({
                title: '오류',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
    }

    return (
        <section className="section find-password-wrap">
            <div className="page-title">비밀번호 찾기</div>
            <form onSubmit={async function(e){
                e.preventDefault();
                await requestPasswordReset(); // onSubmit에서만 실제 요청 함수 호출
            }}>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberEmail">이메일</label>
                    </div>
                    <div className="input-item">
                        <input
                            type="text"
                            id="memberEmail"
                            value={memberEmail}
                            onChange={chgMemberEmail}
                            onBlur={validateEmailFormat} // onBlur에서는 형식 유효성만 검사
                        />
                    </div>
                    {/* 메시지 표시 로직 수정 */}
                    <p className={"input-msg" + (emailInputStatus === 0 ? '' : emailInputStatus === 1 ? ' valid' : ' invalid')} > 
                        {
                            emailInputStatus === 0 
                            ? '임시 비밀번호를 받을 이메일 주소를 입력해주세요.'
                                : emailInputStatus === 1
                                ? '이메일 형식이 유효합니다. "임시 비밀번호 받기" 버튼을 눌러주세요.'
                                    : '올바른 이메일 형식을 입력하세요.' // emailInputStatus가 2일 경우
                        }
                    </p>
                </div>
                <div className="find-password-button-box">
                    <button type="submit" className="btn-primary lg">
                        임시 비밀번호 받기
                    </button>
                </div>
            </form>
        </section>
    );
}