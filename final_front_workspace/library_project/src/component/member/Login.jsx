import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import createInstance from "../../axios/Interceptor";

//로그인
export default function Login() {

    //스토리지에 저장한 데이터 추출
    const {isLogined, setIsLogined, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();
    
    //로그인 페이지로 진입할 때의 location 객체 (state 정보 포함 : 헤더 이외의 방법에서 로그인했을 경우)
    const location = useLocation(); 

    //로그인 후 돌아갈 경로 지정
    const fromPath = location.state?.from || '/';

    useEffect(function(){
        if(!isLogined){
            setLoginMember(null);
        }
    },[]);

    //.env에 저장된 환경변수 값 가져오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    //인터셉터에서 커스터마이징한 axios instance 사용하기
    const axiosInstance = createInstance();

    //로그인 입력 정보 저장 변수(서버 전송용)
    const [member, setMember] = useState({
        memberId : "",
        memberPw : ""
    });

    //아이디, 비밀번호 입력 시 동작 함수
    function chgMember(e){
        member[e.target.id] = e.target.value;
        setMember({...member});
    }

    //정상 로그인 시 컴포넌트 전환을 위한 navigate
    const navigate = useNavigate();

    //로그인 요청
    function login(){
        if(member.memberId !== '' && member.memberPw !== ''){ // 변경: !== 사용
            let options = {};
            options.url = serverUrl + '/member/login';
            options.method = 'post';
            options.data = member;

            axiosInstance(options)
            .then(function(res){
                console.log(res);
                //res.data == ResponseDto
                //res.data.resData == LoginMember (Member 객체와 토큰을 포함하고 있는 객체)
                //res.data.resData.member == Member
                //res.data.resData.accessToken == 요청시마다 헤더에 포함시킬 토큰
                //res.data.resData.refreshToken == accessToken 만료 시 재발급 요청에 필요한 토큰

                if(res.data.resData === null){ // 변경: === 사용 // 로그인 실패했을 경우
                    let alertText = res.data.clientMsg;

                    // 이메일 미인증 상태에 대한 메시지 추가 (백엔드에서 메시지를 명확히 구분하여 보낼 경우 활용)
                    // 현재 백엔드 로직에서는 단순히 null을 반환하므로, '아이디 및 비밀번호를 확인하세요.'로 표시될 수 있습니다.
                    // 필요하다면 백엔드 ResponseDto에 추가적인 status 또는 code를 포함시켜 구분할 수 있습니다.
                    if (res.data.clientMsg === '아이디 및 비밀번호를 확인하세요.') {
                        // 여기서는 특정 조건으로 이메일 미인증 메시지를 구분하기 어려울 수 있으니
                        // 백엔드에서 좀 더 명확한 응답 메시지를 주도록 하는 것이 좋습니다.
                        // 예: "이메일 인증이 필요합니다." 와 같은 특정 메시지가 올 경우 분기
                    }

                    Swal.fire({
                        title : '알림',
                        text : alertText, // "아이디 및 비밀번호를 확인하세요."
                        icon : res.data.alertIcon,
                        confirmButtonText : '확인'
                    });
                }else { //정상적으로 로그인된 경우
                    setIsLogined(true);
                    setLoginMember(res.data.resData.member);
                    setAccessToken(res.data.resData.accessToken);
                    setRefreshToken(res.data.resData.refreshToken);

                    navigate(fromPath, { replace: true });
                }
            })
            .catch(function(err){
                console.log(err);
                Swal.fire({
                    title : '오류',
                    text : '로그인 요청 중 서버 오류가 발생했습니다.',
                    icon : 'error',
                    confirmButtonText : '확인'
                });
            });

        }else {
            Swal.fire({
                title : '알림',
                text : '아이디 또는 비밀번호를 입력하세요.',
                icon : 'warning',
                confirmButtonText : '확인'
            });
        }
    }

    return (
        <section className="section login-wrap">
            <div className="page-title">로그인</div>
            <form autoComplete="off" onSubmit={function(e){
                e.preventDefault();
                login();
            }}>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input type="text" id="memberId" value={member.memberId} onChange={chgMember}/>
                    </div>
                </div>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberPw">비밀번호</label>
                    </div>
                    <div className="input-item">
                        <input type="password" id="memberPw" value={member.memberPw} onChange={chgMember}/>
                    </div>
                </div>
                <div className="login-button-box">
                    <button type="submit" className="btn-primary lg">
                        로그인
                    </button>
                </div>
                {/* 비밀번호 찾기 링크 추가 */}
                <div className="link-box">
                    <p>
                        <span onClick={() => navigate('/find-password')} className="find-link">비밀번호 찾기</span>
                    </p>
                </div>
            </form>
        </section>
    );
}