import { use, useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import logoImage from "../../image/final_logo.png"; // 로고 이미지 임포트
import './Member.css'; // Member.css 파일을 임포트하여 스타일을 적용

//회원가입
export default function Join() {

    //.env에 저장된 환경변수 값 가져오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER; // http://localhost:9999

    //인터셉터에서 커스터마이징한 axios instance 사용하기
    const axiosInstance = createInstance();

    //각 입력 값 변경 시, 저장 변수(서버 전송용)
    const [member, setMember] = useState({
        memberId : "",
        memberPw : "",
        memberName : "",
        memberEmail : "",
        memberPhone : "",
        memberAddr : ""
    });

    //회원정보 onChange 호출 함수
    function chgMember(e){
        setMember({...member, [e.target.id]: e.target.value});
    }

    //비밀번호 확인 값 변경 시 저장 변수 및 처리 함수 : DB에 등록하지 않고 화면에서만 처리됨
    const [memberPwRe, setMemberPwRe] = useState('');

    function chgMemberPwRe(e){
        setMemberPwRe(e.target.value);
    }

    /* 아이디 유효성 체크, 중복 체크 결과 저장 변수
        0 : 검증 이전 상태
        1 : 유효성 검증 통과 + 중복체크 통과
        2 : 유효성 체크 실패
        3 : 중복된 아이디 존재
    */
    const [idChk, setIdChk] = useState(0);

    //아이디 유효성 검사 이벤트 핸들러 함수
    function checkMemberId(e){
        const regExp = /^[a-zA-Z0-9]{8,20}$/;

        if(!regExp.test(member.memberId)){
            setIdChk(2);
        } else {
            let options = {};
            options.url = serverUrl + '/member/' + member.memberId + '/chkId'; 
            options.method = 'get';

            axiosInstance(options)
            .then(function(res){
                console.log(res);
                if(res.data.resData === 1){
                    setIdChk(3);
                } else {
                    setIdChk(1);
                }
            })
            .catch(function(err){
                console.log(err);
                setIdChk(0);
            })
        }
    }

    /* 비밀번호 검증 결과 저장 변수
        0 : 검사 이전 상태
        1 : 유효성 체크 통과 + 비밀번호 확인값 일치
        2 : 유효성 체크 실패
        3 : 비밀번호 확인값 불일치
    */
    const [pwChk, setPwChk] = useState(0);

    //비밀번호, 비밀번호 확인 값 onBlur 함수
    function checkMemberPw(e){
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/;

        if(e.target.id === 'memberPw'){
            if(!regExp.test(e.target.value)){
                setPwChk(2); // 비밀번호 유효성 실패
            } else {
                // 비밀번호 확인값이 비어있지 않다면 비밀번호 일치 여부 확인
                if(memberPwRe !== ''){
                    if(e.target.value === memberPwRe){
                        setPwChk(1); // 비밀번호 일치
                    }else {
                        setPwChk(3); // 비밀번호 불일치
                    }
                } else {
                    // memberPwRe가 비어있으면 유효성만 통과 상태로 표시 (또는 초기 상태 유지)
                    setPwChk(0); // 비밀번호 확인 대기 상태로 변경
                }
            }
        }else { // memberPwRe (비밀번호 확인) 필드에서 onBlur 발생 시
            // memberPwRe 값이 비어있지 않을 때만 비밀번호 일치 여부 확인
            if (e.target.value !== '') { 
                if(member.memberPw === e.target.value){
                    if(regExp.test(member.memberPw)){
                        setPwChk(1);
                    } else {
                        setPwChk(2);
                    }
                }else{
                    setPwChk(3);
                }
            } else { // memberPwRe가 비어있으면 초기 상태로 설정
                setPwChk(0); 
            }
        }
    }

    /* 이메일 검증 결과 저장 변수
        0 : 검증 이전 상태
        1 : 유효성 검증 통과 + 중복체크 통과
        2 : 유효성 체크 실패
        3 : 중복된 이메일 존재
    */
    const [emailChk, setEmailChk] = useState(0);

    //이메일 유효성 검사 및 중복 체크 이벤트 핸들러 함수
    function checkMemberEmail(e){
        const emailRegExp = /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

        if(!emailRegExp.test(member.memberEmail)){
            setEmailChk(2);
        } else {
            let options = {};
            options.url = serverUrl + '/member/' + member.memberEmail + '/chkEmail'; 
            options.method = 'get';

            axiosInstance(options)
            .then(function(res){
                console.log(res);
                if(res.data.resData === 1){
                    setEmailChk(3);
                } else {
                    setEmailChk(1);
                }
            })
            .catch(function(err){
                console.log(err);
                setEmailChk(0);
            })
        }
    }

    const [phoneChk, setPhoneChk] = useState(0);

    //전화번호 유효성 검사 및 중복 체크 이벤트 핸들러 함수
    function checkMemberPhone(e){
        const phoneRegExp = /^\d{3}-\d{4}-\d{4}$/;

        if(!phoneRegExp.test(member.memberPhone)){
            setEmailChk(2);
        } else {
            let options = {};
            options.url = serverUrl + '/member/' + member.memberPhone + '/chkPhone'; 
            options.method = 'get';

            axiosInstance(options)
            .then(function(res){
                console.log(res);
                if(res.data.resData === 1){
                    setPhoneChk(3);
                } else {
                    setPhoneChk(1);
                }
            })
            .catch(function(err){
                console.log(err);
                setPhoneChk(0);
            })
        }
    }


    const navigate = useNavigate();

    //회원가입 처리 함수 (이메일 인증 흐름 반영)
    function join(){
        if(idChk === 1 && pwChk === 1 && emailChk === 1 && member.memberName !== '' && member.memberPhone !== '' && member.memberAddr !== '' && phoneChk === 1 ){
            let options = {};
            options.url = serverUrl + '/member/signup';
            options.method = 'post';
            options.data = member;

            axiosInstance(options)
            .then(function(res){
                console.log(res);
                
                Swal.fire({
                    title : '알림',
                    text : res.data.clientMsg,
                    icon : res.data.alertIcon,
                    confirmButtonText : '확인'
                }).then(function(result){
                    if(res.data.resData){
                        navigate('/login');
                    }
                });
            })
            .catch(function(err){
                console.error(err);
                Swal.fire({
                    title : '오류',
                    text : '회원가입 요청 중 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
                    icon : 'error',
                    confirmButtonText : '확인'
                });
            });
        } else {
            Swal.fire({
                title : '알림',
                text : '모든 필수 입력값을 올바르게 입력하고 유효성 검사를 완료해주세요.',
                icon : 'warning',
                confirmButtonText : '확인'
            });
        }
    }

    return (
        <div className="login-page-wrapper">
            <main className="login-main-content">
                <div className="join-form-container">
                    <div className="join-logo-container">
                        <img src={logoImage} alt="KH공감도서관 로고" className="join-logo-image" onClick={() => navigate('/')} style={{ cursor: 'pointer' }} />
                        <h1 className="login-form-title">회원가입</h1>
                    </div>
                    <form onSubmit={function(e){
                        e.preventDefault();
                        join();
                    }}>
                        <div className="input-group">
                            <label htmlFor="memberId" className="input-label">아이디</label>
                            <input type="text" id="memberId" value={member.memberId} onChange={chgMember} onBlur={checkMemberId} className="login-input"/>
                            <p className={"input-msg" + (idChk === 0 ? '' : idChk === 1 ? ' valid' : ' invalid')} >
                                {
                                    idChk === 0 
                                    ? ''
                                    : idChk === 1
                                    ? '사용 가능한 아이디입니다.'
                                    : idChk === 2
                                    ? '아이디는 영어 대/소문자와 숫자를 포함한 8~20자 입니다.'
                                    : '이미 사용중인 아이디입니다.'
                                }
                            </p>
                        </div>
                        <div className="input-group">
                            <label htmlFor="memberPw" className="input-label">비밀번호</label>
                            <input type="password" id="memberPw" value={member.memberPw} onChange={chgMember} onBlur={checkMemberPw} className="login-input"/>
                            <p className={"input-msg" + (pwChk === 0 ? '' : pwChk === 1 ? ' valid' : ' invalid')}>
                                {
                                    pwChk === 0
                                    ? ''
                                    : pwChk === 1
                                    ? '비밀번호가 정상적으로 입력되었습니다.'
                                    : pwChk === 2
                                    ? '비밀번호는 영어, 숫자, 특수문자로 6~30글자를 입력하세요.'
                                    : '비밀번호와 비밀번호 확인값이 일치하지 않습니다.'
                                }
                            </p>
                        </div>
                        <div className="input-group">
                            <label htmlFor="memberPwRe" className="input-label">비밀번호 확인</label>
                            <input type="password" id="memberPwRe" value={memberPwRe} onChange={chgMemberPwRe} onBlur={checkMemberPw} className="login-input"/>
                            <p className={"input-msg" + (pwChk === 0 ? '' : pwChk === 1 ? ' valid' : ' invalid')}>
                                {
                                    pwChk === 0
                                    ? ''
                                    : pwChk === 1
                                    ? '비밀번호와 비밀번호 확인값이 일치합니다.'
                                    : pwChk === 2
                                    ? '비밀번호는 영어, 숫자, 특수문자로 6~30글자를 입력하세요.'
                                    : '비밀번호와 비밀번호 확인값이 일치하지 않습니다.'
                                }
                            </p>
                        </div>
                        <div className="input-group">
                            <label htmlFor="memberName" className="input-label">이름</label>
                            <input type="text" id="memberName" value={member.memberName} onChange={chgMember} className="login-input"/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="memberEmail" className="input-label">이메일</label>
                            <input type="text" id="memberEmail" value={member.memberEmail} onChange={chgMember} onBlur={checkMemberEmail} className="login-input"/>
                            <p className={"input-msg" + (emailChk === 0 ? '' : emailChk === 1 ? ' valid' : ' invalid')} > 
                                {
                                    emailChk === 0 
                                    ? ''
                                    : emailChk === 1
                                    ? '사용 가능한 이메일입니다.'
                                    : emailChk === 2
                                    ? '올바른 이메일 형식을 입력하세요.'
                                    : '이미 사용중인 이메일입니다.'
                                }
                            </p>
                        </div>
                        <div className="input-group">
                            <label htmlFor="memberPhone" className="input-label">전화번호</label>
                            <input type="text" id="memberPhone" value={member.memberPhone} onChange={chgMember} onBlur={checkMemberPhone} className="login-input"/>
                            <p className={"input-msg" + (phoneChk === 0 ? '' : phoneChk === 1 ? ' valid' : ' invalid')} > 
                                {
                                    phoneChk === 0 
                                    ? ''
                                    : phoneChk === 1
                                    ? '사용 가능한 전화번호입니다.'
                                    : phoneChk === 2
                                    ? "전화번호는 '-' 를 포함해 13자리를 입력하세요."
                                    : '이미 사용중인 전화번호입니다.'
                                }
                            </p>
                        </div>
                        <div className="input-group">
                            <label htmlFor="memberAddr" className="input-label">주소</label>
                            <input type="text" id="memberAddr" value={member.memberAddr} onChange={chgMember} className="login-input"/>
                        </div>
                        <div className="login-button-box">
                            <button type="submit" className="btn-login-submit">
                                회원가입
                            </button>
                        </div>
                        <div className="login-bottom-links">
                            <span className="link-item" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }}>로그인</span>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}