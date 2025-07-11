// src/components/myPage/FindId.jsx
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import './Member.css'; // Member.css 임포트

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
        if (!emailRegExp.test(memberEmail)) {
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
            console.log("아이디 찾기 백엔드 응답:", res.data);

            if (res.data.resData !== null) { 
                setFoundId(res.data.resData);
                Swal.fire({
                    title: '아이디 찾기 성공',
                    text: res.data.clientMsg,
                    icon: res.data.alertIcon,
                    confirmButtonText: '확인'
                });
            } else {
                setFoundId(null);
                Swal.fire({
                    title: '아이디 찾기 실패',
                    text: res.data.clientMsg,
                    icon: res.data.alertIcon,
                    confirmButtonText: '확인'
                });
            }
        } catch (err) {
            console.error("아이디 찾기 요청 오류:", err);
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
        <div className="login-page-wrapper"> {/* login-page-wrapper 재사용 */}
            <main className="login-main-content"> {/* login-main-content 재사용 */}
                <div className="login-form-container"> {/* login-form-container 재사용 */}
                    <h1 className="login-form-title">아이디 찾기</h1> {/* login-form-title 재사용 */}
                    <form onSubmit={async function(e){
                        e.preventDefault();
                        await requestFindId();
                    }}>
                        <div className="input-group"> {/* input-group 재사용 */}
                            <label htmlFor="memberEmail" className="input-label">이메일</label> {/* input-label 재사용 */}
                            <input
                                type="text"
                                id="memberEmail"
                                value={memberEmail}
                                onChange={chgMemberEmail}
                                onBlur={validateEmailFormat}
                                className="login-input" /* login-input 재사용 */
                            />
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
                        {foundId && (
                            <div className="input-group"> {/* input-group 재사용 */}
                                <label className="input-label">찾은 아이디:</label> 
                                <input type="text" value={foundId} readOnly className="login-input found-id-display"/> {/* login-input 및 새로운 스타일 클래스 적용 */}
                            </div>
                        )}
                        <div className="login-button-box"> {/* login-button-box 재사용 */}
                            <button type="submit" className="btn-login-submit"> {/* btn-login-submit 재사용 */}
                                아이디 찾기
                            </button>
                        </div>
                        <div className="login-bottom-links"> {/* login-bottom-links 재사용 */}
                            <span onClick={() => navigate('/login')} className="link-item">로그인 페이지로</span>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}