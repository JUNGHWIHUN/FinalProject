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
    const [emailInputStatus, setEmailInputStatus] = useState(0); 
    const [foundId, setFoundId] = useState(null); // 찾은 아이디를 저장할 상태. 초기값은 null.

    function chgMemberEmail(e) {
        setMemberEmail(e.target.value);
        setEmailInputStatus(0); 
        setFoundId(null); // 새로운 검색 시작 시 기존 아이디 결과는 초기화
    }

    function validateEmailFormat() {
        const emailRegExp = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
        if (!emailRegExp.test(memberEmail)) { // 변경: 정규식 변수명 통일 (기존에 regExp로 되어있다면 그대로, 아니면 emailRegExp로 사용)
            setEmailInputStatus(2); 
            return false;
        }
        setEmailInputStatus(1); 
        return true;
    }

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
            options.url = serverUrl + '/member/find-id'; 
            options.method = 'post';
            options.data = { memberEmail: memberEmail };

            const res = await axiosInstance(options);
            console.log("아이디 찾기 백엔드 응답:", res.data); // 응답 전체를 로그로 찍어 확인

            // === 핵심 변경 부분 ===
            // res.data.resData가 null이 아니면 성공으로 판단
            if (res.data.resData !== null) { 
                setFoundId(res.data.resData); // 백엔드에서 마스킹된 아이디를 resData로 보냄
                Swal.fire({
                    title: '아이디 찾기 성공', // 성공 제목
                    text: res.data.clientMsg, // "아이디를 찾았습니다."
                    icon: res.data.alertIcon, // 'success'
                    confirmButtonText: '확인'
                });
            } else {
                // res.data.resData가 null인 경우 (회원을 찾지 못함)
                setFoundId(null); // 확실히 null로 설정
                Swal.fire({
                    title: '아이디 찾기 실패', // 실패 제목
                    text: res.data.clientMsg, // "입력하신 이메일로 등록된 아이디가 없습니다."
                    icon: res.data.alertIcon, // 'warning'
                    confirmButtonText: '확인'
                });
            }
        } catch (err) {
            console.error("아이디 찾기 요청 오류:", err);
            // 에러 응답이 있을 경우 백엔드에서 보낸 clientMsg 사용
            let errorMessage = (err.response && err.response.data && err.response.data.clientMsg) 
                               ? err.response.data.clientMsg : '아이디 찾기 요청 중 서버 오류가 발생했습니다.';
            Swal.fire({
                title: '오류',
                text: errorMessage,
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
                                ? '이메일 형식이 유효합니다. "아이디 찾기" 버튼을 눌러주세요.' 
                                    : '올바른 이메일 형식을 입력하세요.'
                        }
                    </p>
                </div>
                {foundId && ( // foundId가 null이 아닐 때만 이 블록이 렌더링됨
                    <div className="input-wrap">
                        <div className="input-title">찾은 아이디:</div> 
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