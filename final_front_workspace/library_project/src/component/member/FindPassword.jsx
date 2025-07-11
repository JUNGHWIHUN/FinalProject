// src/components/myPage/FindPassword.jsx
import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import './Member.css'; // Member.css 임포트

export default function FindPassword() {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const navigate = useNavigate();

    const [memberInfo, setMemberInfo] = useState({
        memberId: "",
        memberEmail: ""
    });
    const [idInputStatus, setIdInputStatus] = useState(0);
    const [emailInputStatus, setEmailInputStatus] = useState(0);

    function chgMemberInfo(e) {
        setMemberInfo({ ...memberInfo, [e.target.id]: e.target.value });
        if (e.target.id === 'memberId') {
            setIdInputStatus(0);
        } else if (e.target.id === 'memberEmail') {
            setEmailInputStatus(0);
        }
    }

    function validateIdFormat() {
        const regExp = /^[a-zA-Z0-9]{8,20}$/;
        if (!regExp.test(memberInfo.memberId)) {
            setIdInputStatus(2);
            return false;
        }
        setIdInputStatus(1);
        return true;
    }

    function validateEmailFormat() {
        const emailRegExp = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
        if (!emailRegExp.test(memberInfo.memberEmail)) {
            setEmailInputStatus(2);
            return false;
        }
        setEmailInputStatus(1);
        return true;
    }

    async function requestPasswordReset() {
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
            options.url = serverUrl + '/member/find-password';
            options.method = 'post';
            options.data = memberInfo;

            const res = await axiosInstance(options);
            console.log(res);

            if (res.data.success) {
                Swal.fire({
                    title: '성공',
                    text: res.data.clientMsg,
                    icon: res.data.alertIcon,
                    confirmButtonText: '확인'
                }).then(() => {
                    navigate('/mypage');
                });
            } else {
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg,
                    icon: res.data.alertIcon,
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
        <div className="login-page-wrapper"> {/* login-page-wrapper 재사용 */}
            <main className="login-main-content"> {/* login-main-content 재사용 */}
                <div className="login-form-container"> {/* login-form-container 재사용 */}
                    <h1 className="login-form-title">비밀번호 찾기</h1> {/* login-form-title 재사용 */}
                    <form onSubmit={async function(e){
                        e.preventDefault();
                        await requestPasswordReset();
                    }}>
                        <div className="input-group"> {/* input-group 재사용 */}
                            <label htmlFor="memberId" className="input-label">아이디</label> {/* input-label 재사용 */}
                            <input
                                type="text"
                                id="memberId"
                                value={memberInfo.memberId}
                                onChange={chgMemberInfo}
                                onBlur={validateIdFormat}
                                className="login-input" /* login-input 재사용 */
                            />
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
                        <div className="input-group"> {/* input-group 재사용 */}
                            <label htmlFor="memberEmail" className="input-label">이메일</label> {/* input-label 재사용 */}
                            <input
                                type="text"
                                id="memberEmail"
                                value={memberInfo.memberEmail}
                                onChange={chgMemberInfo}
                                onBlur={validateEmailFormat}
                                className="login-input" /* login-input 재사용 */
                            />
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
                        <div className="login-button-box"> {/* login-button-box 재사용 */}
                            <button type="submit" className="btn-login-submit"> {/* btn-login-submit 재사용 */}
                                임시 비밀번호 받기
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