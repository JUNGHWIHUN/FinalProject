import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { Link } from "react-router-dom";

//메인(루트 접근 시) 컴포넌트
export default function Main () {

    //로그아웃 로직
    //스토리지에 저장한 데이터 추출
    const {isLogined, setIsLogined, loginMember, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();

    

    const navigate = useNavigate();

    //로그아웃 Link 클릭 시 동작함수
    function logout(e){
        e.preventDefault();

        setLoginMember(null);
        setIsLogined(false);
        setAccessToken(null);
        setRefreshToken(null);

        navigate("/login");
    }

  

    return (
        <section className="section" style={{width:"100%"}}>
            <div className="page-title">메인페이지</div>


            <Link to='/book'>도서검색 페이지</Link>
           

            <h3><a href='/join'>회원가입 링크</a></h3>
            <h3><a href='/login'>로그인 링크</a></h3>

            <Link to='/mypage'>마이페이지</Link>
        

            <h3>
                <button onClick={logout}>로그아웃</button>
            </h3>
            
        </section>
    );
}