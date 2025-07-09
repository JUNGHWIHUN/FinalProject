// src/components/myPage/FindPassword.jsx
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";

export default function FindPassword() {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const [memberInfo, setMemberInfo] = useState({ // 아이디와 이메일 모두 저장
        memberId: "",
        memberEmail: ""
    });
    // 각 입력 필드의 유효성/상태를 나타내는 상태
    const [idInputStatus, setIdInputStatus] = useState(0); // 0:초기, 1:유효, 2:형식오류
    const [emailInputStatus, setEmailInputStatus] = useState(0); // 0:초기, 1:유효, 2:형식오류

    function chgMemberInfo(e) {
        setMemberInfo({ ...memberInfo, [e.target.id]: e.target.value });
        if (e.target.id === 'memberId') {
            setIdInputStatus(0);
        } else if (e.target.id === 'memberEmail') {
            setEmailInputStatus(0);
        }
    }

    // 아이디 형식 유효성만 검사하는 함수
    function validateIdFormat() {
        const regExp = /^[a-zA-Z0-9]{8,20}$/;
        if (!regExp.test(memberInfo.memberId)) {
            setIdInputStatus(2); // 유효하지 않은 아이디 형식
            return false;
        }
        setIdInputStatus(1); // 형식 유효
        return true;
    }

    // 이메일 형식 유효성만 검사하는 함수
    function validateEmailFormat() {
        const emailRegExp = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
        if (!emailRegExp.test(memberInfo.memberEmail)) {
            setEmailInputStatus(2); // 유효하지 않은 이메일 형식
            return false;
        }
        setEmailInputStatus(1); // 형식 유효
        return true;
    }

    // 비밀번호 찾기 요청 함수 (폼 제출 시에만 호출)
    async function requestPasswordReset() {
        // 모든 입력 필드 유효성 최종 확인
        if (!validateIdFormat() || !validateEmailFormat()) {
            Swal.fire({
                title: '알림',
                text: '아이디와 올바른 이메일 형식을 모두 입력하세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        try {
            let options = {};
            options.url = serverUrl + '/member/find-password'; // 백엔드 비밀번호 찾기 엔드포인트
            options.method = 'post';
            options.data = memberInfo; // 아이디와 이메일 모두 포함된 객체 전달

            const res = await axiosInstance(options);
            console.log(res);

            if (res.data.success) {
                Swal.fire({
                    title: '성공',
                    text: res.data.clientMsg, // "임시 비밀번호가 이메일로 전송되었습니다. 이메일을 확인해주세요."
                    icon: res.data.alertIcon, // 'success' 또는 'info'
                    confirmButtonText: '확인'
                }).then(() => {
                    navigate('/mypage'); // 비밀번호 찾기 성공 후 마이페이지 메인으로 이동
                });
            } else {
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg, // "아이디와 이메일 정보가 일치하는 회원이 없거나, 임시 비밀번호 전송에 실패했습니다."
                    icon: res.data.alertIcon, // 'warning'
                    confirmButtonText: '확인'
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: '오류',
                text: '비밀번호 찾기 요청 중 서버 오류가 발생했습니다.',
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
                await requestPasswordReset();
            }}>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input
                            type="text"
                            id="memberId"
                            value={memberInfo.memberId}
                            onChange={chgMemberInfo}
                            onBlur={validateIdFormat}
                        />
                    </div>
                    <p className={"input-msg" + (idInputStatus === 0 ? '' : idInputStatus === 1 ? ' valid' : ' invalid')} > 
                        {
                            idInputStatus === 0 
                            ? '아이디를 입력해주세요.'
                                : idInputStatus === 1
                                ? '아이디 형식이 유효합니다.'
                                    : '아이디는 영어 대/소문자와 숫자를 포함한 8~20자 입니다.'
                        }
                    </p>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberEmail">이메일</label>
                    </div>
                    <div className="input-item">
                        <input
                            type="text"
                            id="memberEmail"
                            value={memberInfo.memberEmail}
                            onChange={chgMemberInfo}
                            onBlur={validateEmailFormat}
                        />
                    </div>
                    <p className={"input-msg" + (emailInputStatus === 0 ? '' : emailInputStatus === 1 ? ' valid' : ' invalid')} > 
                        {
                            emailInputStatus === 0 
                            ? '임시 비밀번호를 받을 이메일 주소를 입력해주세요.'
                                : emailInputStatus === 1
                                ? '이메일 형식이 유효합니다.'
                                    : '올바른 이메일 형식을 입력하세요.'
                        }
                    </p>
                </div>
                <div className="find-password-button-box">
                    <button type="submit" className="btn-primary lg">
                        임시 비밀번호 받기
                    </button>
                </div>
                <div className="link-box">
                    <p>
                        <span onClick={() => navigate('/login')} className="login-link">로그인 페이지로</span>
                    </p>
                </div>
            </form>
        </section>
    );
}