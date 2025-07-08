import { useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";

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
        member[e.target.id] = e.target.value;
        setMember({...member});
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
                if(res.data.resData == 1){
                    setIdChk(3);
                } else {
                    setIdChk(1);
                }
            })
            .catch(function(err){
                console.log(err);
            })
        }
    }

    /* 비밀번호 검증 결과 저장 변수
        0 : 검사 이전 상태
        1 : 유효성 체크 통과, 비밀번호 확인값 일치
        2 : 유효성 체크 실패
        3 : 비밀번호 확인값 불일치
    */
    const [pwChk, setPwChk] = useState(0);

    //비밀번호, 비밀번호 확인 값 onBlur 함수
    function checkMemberPw(e){
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/;

        if(e.target.id == 'memberPw'){
            if(!regExp.test(e.target.value)){
                setPwChk(2);
            } else if(memberPwRe !== ''){ // 변경: memberPwRe가 비어있지 않을 때만 비교
                if(e.target.value === memberPwRe){ // 변경: === 사용
                    setPwChk(1);
                }else {
                    setPwChk(3);
                }
            } else { // 비밀번호 유효성 검증 통과, 비밀번호 확인이 입력되지 않음
                setPwChk(1); // 일단 유효성만 통과하면 1로 설정 (확인값은 나중에 검증)
            }
        }else { //비밀번호 확인 입력
            if(member.memberPw === e.target.value){ // 변경: === 사용
                if(regExp.test(member.memberPw)){ // 비밀번호도 유효성 통과했는지 다시 확인
                    setPwChk(1);
                } else {
                    setPwChk(2); // 비밀번호 자체 유효성 실패
                }
            }else{
                setPwChk(3);
            }
        }
    }

    /* 이메일 검증 결과 저장 변수 (추가)
        0 : 검증 이전 상태
        1 : 유효성 검증 통과 + 중복체크 통과
        2 : 유효성 체크 실패
        3 : 중복된 이메일 존재
    */
    const [emailChk, setEmailChk] = useState(0); // 초기값을 숫자로 변경 (idChk, pwChk와 통일)

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
                if(res.data.resData === 1){ // 변경: === 사용
                    setEmailChk(3);
                } else {
                    setEmailChk(1);
                }
            })
            .catch(function(err){
                console.log(err);
                setEmailChk(0); // 오류 발생 시 초기 상태로 돌리거나, 오류 상태를 표시할 수 있음
            })
        }
    }

    const navigate = useNavigate();

    //회원가입 처리 함수 (이메일 인증 흐름 반영)
    function join(){
        if(idChk === 1 && pwChk === 1 && emailChk === 1 && member.memberName !== '' && member.memberPhone !== ''){
            let options = {};
            options.url = serverUrl + '/member/signup'; // 백엔드 엔드포인트
            options.method = 'post';
            options.data = member;

            axiosInstance(options)
            .then(function(res){
                console.log(res);
                // res.data == ResponseDto
                // res.data.resData == 백엔드에서 true/false로 전달 (success 플래그 역할)
                // res.data.clientMsg == 백엔드에서 정의한 사용자 메시지
                // res.data.alertIcon == 백엔드에서 정의한 Swal 아이콘 ('success', 'info', 'warning', 'error')
                
                Swal.fire({
                    title : '알림',
                    text : res.data.clientMsg, // 백엔드에서 보낸 메시지 사용
                    icon : res.data.alertIcon, // 백엔드에서 보낸 아이콘 사용 ('info'로 변경 예정)
                    confirmButtonText : '확인'
                }).then(function(result){
                    if(res.data.resData){ // 백엔드에서 resData가 true인 경우 (회원가입 및 이메일 발송 성공)
                        navigate('/login'); // 인증 이메일 발송 후 로그인 페이지로 이동
                    }
                    // else { // 실패한 경우는 이 if 문 밖에서 처리되므로 여기선 필요 없음
                    //     // 실패 시 별다른 동작 없이 현재 페이지에 머무름
                    // }
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
        <section className="section join-wrap">
            <div className="page-title">회원가입</div>
            <form onSubmit={function(e){
                e.preventDefault();
                join();
            }}>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberId" value={member.memberId} onChange={chgMember} onBlur={checkMemberId}/>
                    </div>
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
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPw">비밀번호</label>
                    </div>
                    <div className="input-item">
                        <input type="password" id="memberPw" value={member.memberPw} onChange={chgMember} onBlur={checkMemberPw}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPwRe">비밀번호 확인</label>
                    </div>
                    <div className="input-item">
                        <input type="password" id="memberPwRe" value={memberPwRe} onChange={chgMemberPwRe} onBlur={checkMemberPw}/>
                    </div>
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
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberName">이름</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberName" value={member.memberName} onChange={chgMember}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberEmail">이메일</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberEmail" value={member.memberEmail} onChange={chgMember} onBlur={checkMemberEmail}/>
                    </div>
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
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPhone">전화번호</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberPhone" value={member.memberPhone} onChange={chgMember}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPhone">주소</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberAddr" value={member.memberAddr} onChange={chgMember}/>
                    </div>
                </div>
                <div className="join-button-box">
                    <button type="submit" className="btn-primary lg">
                        회원가입
                    </button>
                </div>
            </form>
        </section>
    );
}