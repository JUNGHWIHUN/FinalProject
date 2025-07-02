import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import createInstance from "../../axios/Interceptor";

//로그인
export default function Login() {

    /*
    //부모 컴포넌트에세 전달받은 데이터 추출
    const setIsLogin = props.setIsLogin;
    const setLoginMember = props.setLoginMember;
    */

    //스토리지에 저장한 데이터 추출
    const {isLogined, setIsLogined, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();

    useEffect(function(){
        if(!isLogined){ //외부에서 강제 로그아웃된 경우
            setLoginMember(null);   //이 경우에만 loginMember 를 null 처리
        }
    },[]);

    //.env에 저장된 환경변수 값 가져오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER; // http://localhost:9999

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

    /*
    //정상 로그인 시 저장할 State 변수 : 메뉴 등을 다르게 그려주는 데에 필요
    const [isLogin, setIsLogin] = useState(false);
    const [loginMember, setLoginMember] = useState({});

    위 2개 변수는 상위 App 컴포넌트에서 설정해야 다른 컴포넌트로 정보를 전달할 수 있음 (상태 끌어올리기 (State Lifting) : 자식 컴포넌트에서 부모 컴포넌트로 전달 불가능하기 때문)
    */

    //정상 로그인 시 컴포넌트 전환을 위한 navigate
    const navigate = useNavigate();

    //로그인 요청
    function login(){
        if(member.memberId != '' && member.memberPw != ''){ //두 값이 모두 입력되었을 때 서버에 요청
            let options = {};
            options.url = serverUrl + '/member/login';
            options.method = 'post';    //Rest 원칙에는 어긋나나, 로그인과 같이 민감한 정보를 포함한 때에는 기존처럼 Post로 전달
            options.data = member;

            //커스터마이징한 axios 사용
            axiosInstance(options)
            .then(function(res){
                console.log(res);
                //res.data == ResponseDto
                //res.data.resData == LoginMember (Member 객체와 토큰을 포함하고 있는 객체)
                //res.data.resData.member == Member
                //res.data.resData.accessToken  == 요청시마다 헤더에 포함시킬 토큰
                //res.data.resData.refreshToken == accessToken 만료 시 재발급 요청에 필요한 토큰
                if(res.data.resData == null){   //로그인 실패했을 경우
                    Swal.fire({
                        title : '알림',
                        text : res.data.clientMsg,
                        icon : res.data.alertIcon,
                        confirmButtonText : '확인'
                    })
                }else { //정상적으로 로그인된 경우
                    /*
                    //부모 컴포넌트에서 전달받은 setState 함수를 사용해 state 값 변경 : App component 에서 렌더링이 다시 일어남
                    setIsLogin(true);
                    setLoginMember(res.data.resData);
                    */

                    //스토리지 데이터 변경 : 로그인 여부, 로그인 정보, 토큰
                    setIsLogined(true);
                    setLoginMember(res.data.resData);   //Member객체
                    setAccessToken(res.data.resData.accessToken);
                    setRefreshToken(res.data.resData.refreshToken);

                    //메인 컴포넌트로 전환
                    navigate('/');
                }
            })
            .catch(function(err){
                console.log(err);
            })

        }else {
            Swal.fire({
                title : '알림',
                text : '아이디 또는 비밀번호를 입력하세요.',
                icon : 'warning',
                confirmButtonText : '확인'
            })
        }
    }

    return (
        <section className="section login-wrap">
            <div className="page-title">로그인</div>
            <form autoComplete="off" onSubmit={function(e){ //자동완성 기능 해제 (input type-password 요소에서 비밀번호 유출 경고 끄기 위한 목적도 있음)
                e.preventDefault(); //form 태그 기본 이벤트 제어
                login();            //로그인 요청 함수 호출
            }}>
                <div className="input-wrap">
                    <div className="input-title">
                        <label htmlFor="memberId">아이디</label>
                    </div>
                    <div className="input-item">
                        <input type="text"    id="memberId" value={member.memberId} onChange={chgMember}/>
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
            </form>
        </section>
    );
}