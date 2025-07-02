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
        memberPhone : ""
    });

    //회원정보 onChange 호출 함수
    //onChange 핸들러가 상태를 업데이트하더라도, input 필드가 항상 상태를 반영하도록 하고 React 제어 컴포넌트의 모든 기능을 활용하려면 input 필드에 항상 value={member.memberId} (또는 해당 상태 속성)를 포함해야 합니다.
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
        //아이디 정규 표현식
        const regExp = /^[a-zA-Z0-9]{8,20}$/;  // ^ : 시작, $ : 끝, [] : 안에 들어가는 것만 통과, {} : 글자 수, 해당 변수는 boolean 값 (충족시 T, 미충족시 F)

        if(!regExp.test(member.memberId)){  //유효성 검증에 실패한 경우
            setIdChk(2);
        } else {    //유효성 검증에 성공 시 DB에서 중복여부 확인
            let options = {};
            options.url = serverUrl + '/member/' + member.memberId + '/chkId'; 
            options.method = 'get';

            //커스터마이징한 axios 사용
            axiosInstance(options)
            .then(function(res){
                console.log(res);
                //res.data == ResponseDto
                //res.data.resData == count == 중복체크 결과
                if(res.data.resData == 1){  //중복 아이디 존재
                    setIdChk(3);
                } else {    //중복 아이디 없음
                    setIdChk(1);    //회원가입 가능
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
        //비밀번호 정규 표현식
        const regExp = /^[a-zA-Z0-9!@#$]{6,30}$/;   //영어 대/소문자, 특수문자 !@#$, 숫자 6~30 글자

        if(e.target.id == 'memberPw'){  //비밀번호 입력
            
            if(!regExp.test(e.target.value)){   //비밀번호 유효성 체크 실패
                setPwChk(2);

            } else if(memberPwRe != ''){    //비밀번호 확인창에 입력

                if(e.target.value == memberPwRe){   //비밀번호 == 비밀번호 확인
                    setPwChk(1);
                }else {
                    setPwChk(3);
                }

            } else{ //비밀번호는 유효성 검증 통과, 비밀번호 확인이 입력되지 않음
                setPwChk(3);
            }

        }else { //비밀번호 확인 입력
            if(member.memberPw == e.target.value){  //비밀번호 == 비밀번호 확인

                if(regExp.test(member.memberPw)){
                    setPwChk(1);
                }

            }else{  //비밀번호와 확인값 불일치
                setPwChk(3);
            }
        }
    }

    const navigate = useNavigate();

    //회원가입 처리 함수
    function join(){
        if(idChk == 1 && pwChk == 1){   //아이디, 비밀번호 모두 통과시
            let optios = {};
            optios.url = serverUrl+'/member';
            optios.method = 'post'; //멤버 등록 : post 로 전달
            optios.data = member;   //객체 전달

            //커스터마이징한 axios 사용
            axiosInstance(optios)
            .then(function(res){
                //res.data == ResponseDto
                //res.data.resData == 회원가입 결과 (true/false)
                //res.data.clientMst == 결과 처리 메시지
                console.log(res);

                Swal.fire({
                    tite : '알림',
                    text : res.data.clientMsg,
                    icon : res.data.alertIcon,
                    confirmButtonText : '확인'
                })
                .then(function(result){
                    if(res.data.resData){   //회원가입 정상 처리시 로그인 화면으로 이동
                        navigate('/login');
                    }
                })
            })
            .catch(function(err){
                console.log(err);
            })
        }else {
            Swal.fire({
                title : '알림',
                text : '입력값이 유효하지 않습니다',
                icon : res.data.alertIcon,
                confirmButtonText : '확인'
            });
        }
    }

    return (
        <section className="section join-wrap">
            <div className="page-title">회원가입</div>
            <form onSubmit={function(e){
                e.preventDefault(); //기본 submit 이벤트 제어 : 가입은 별도의 join 함수로 분리
                join();             //회원가입 처리 함수 호출
            }}>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberId" value={member.memberId} onChange={chgMember} onBlur={checkMemberId}/>   {/* onBlur : 해당 태그에서 포커스를 잃었을 때 작동하는 이벤트 핸들러 */}
                    </div>
                    <p className={"input-msg" + (idChk == 0 ? '' : idChk == 1 ? ' valid' : ' invalid')} >   {/* 조건에 따라 클래스 값을 변경 */}
                        {
                            idChk == 0 
                            ? ''
                                : idChk == 1
                                ? '사용 가능한 아이디입니다'
                                    : idChk == 2
                                    ? '아이디는 영어 대/소문자와 숫자를 포함한 8~20자 입니다'
                                        : '이미 사용중인 아이디입니다'
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
                    <p className={"input-msg" + (pwChk == 0 ? '' : pwChk == 1 ? ' valid' : ' invalid')}>
                        {
                            pwChk == 0
                            ? ''
                                : pwChk == 1
                                ? '비밀번호가 정상적으로 입력되었습니다'
                                    : pwChk == 2
                                    ? '비밀번호는 영어, 숫자, 특수문자로 6~30글자를 입력하세요'
                                        : '비밀번호와 비밀번호 확인값이 일치하지 않습니다'
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
                        <input type="text" id="memberEmail" value={member.memberEmail} onChange={chgMember}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPhone">전화번호</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberPhone" value={member.memberPhone} onChange={chgMember}/>
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