// src/components/myPage/FindId.jsx
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";

export default function FindId() {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const [memberEmail, setMemberEmail] = useState("");
    // 이메일 입력 필드의 유효성/상태를 나타내는 상태
    // 0: 초기/입력 중, 1: 유효한 이메일 형식, 2: 유효하지 않은 이메일 형식
    const [emailInputStatus, setEmailInputStatus] = useState(0); 
    const [foundId, setFoundId] = useState(null); // 찾은 아이디를 저장할 상태

    function chgMemberEmail(e) {
        setMemberEmail(e.target.value);
        setEmailInputStatus(0); // 입력 변경 시 상태 초기화
        setFoundId(null); // 새로운 검색 시작 시 기존 결과 초기화
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

    // 아이디 찾기 요청 함수
    async function requestFindId() {
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
            options.url = serverUrl + '/member/find-id'; // 백엔드 아이디 찾기 엔드포인트
            options.method = 'post';
            options.data = { memberEmail: memberEmail };

            const res = await axiosInstance(options);
            console.log(res);

            if (res.data.success) {
                setFoundId(res.data.resData); // 마스킹된 아이디 저장
                Swal.fire({
                    title: '아이디 찾기 성공',
                    text: res.data.clientMsg, // "아이디를 찾았습니다."
                    icon: res.data.alertIcon, // 'success'
                    confirmButtonText: '확인'
                });
            } else {
                setFoundId(null); // 찾지 못한 경우 null
                Swal.fire({
                    title: '아이디 찾기 실패',
                    text: res.data.clientMsg, // "입력하신 이메일로 등록된 아이디가 없습니다."
                    icon: res.data.alertIcon, // 'warning'
                    confirmButtonText: '확인'
                });
            }
        } catch (err) {
            console.error(err);
            Swal.fire({
                title: '오류',
                text: '아이디 찾기 요청 중 서버 오류가 발생했습니다.',
                icon: 'error',
                confirmButtonText: '확인'
            });
        }
    }

    return (
        <section className="section find-id-wrap">
            <div className="page-title">아이디 찾기</div>
            <form onSubmit={async function(e){
                e.preventDefault();
                await requestFindId();
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
                            onBlur={validateEmailFormat}
                        />
                    </div>
                    <p className={"input-msg" + (emailInputStatus === 0 ? '' : emailInputStatus === 1 ? ' valid' : ' invalid')} > 
                        {
                            emailInputStatus === 0 
                            ? '아이디를 찾을 이메일 주소를 입력해주세요.'
                                : emailInputStatus === 1
                                ? '이메일 형식이 유효합니다.'
                                    : '올바른 이메일 형식을 입력하세요.'
                        }
                    </p>
                </div>
                {foundId && ( // 아이디를 찾았을 경우에만 결과 표시
                    <div className="input-wrap">
                        <div className="input-title">조회 결과:</div>
                        <div className="input-item">
                            <input type="text" value={foundId} readOnly className="found-id-display"/>
                        </div>
                    </div>
                )}
                <div className="find-id-button-box">
                    <button type="submit" className="btn-primary lg">
                        아이디 찾기
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