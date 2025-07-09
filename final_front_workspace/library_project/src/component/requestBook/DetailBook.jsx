import { useLocation } from "react-router-dom"
import { Link } from "react-router-dom";
import createInstance from "../../axios/Interceptor";

export default function DetailBook(){
    
    const location = useLocation();
    const book = location.state;

    //기존 회원 정보 표출 및 수정 정보 입력받아 저장할 변수
    const [member, setMember]= useState({
            memberId : "", memberPhone : ""
    });
    
    //환경변수 파일에 저장된 서버 URL 읽어오기
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();
    const {loginMember, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();
    
    useEffect(function(){
            //랜더링 후, 회원 정보 조회
            let options = {};
            options.url = serverUrl + "/member/" + loginMember.memberNo;
            options.method = "get";
    
            axiosInstacne(options)
            .then(function(res){
                setMember(res.data.resData);
            })
            .catch(function(err){
                console.log(err);
            })
        },[])
    
    function requestBook(){
        let options = {};
        options.url = serverUrl + 'requestBook/detailBook';
        options.method = 'post';
        
    }
        

    return(
        <div>
            <h2>도서 상세 정보</h2>
            <hr />
            <form onSubmit={function(e){
                e.preventDefault();
                requestBook();
            }}>
                <div className="detailBookInfo">
                        <img
                            src={book.book.image_url}
                            alt={book.book.title_info + " 표지"}
                            onError={(e) => {
                                e.currentTarget.src = "https://placehold.co/120x160?text=No+Image";
                        }}
                        />
                        <br />
                    도서 명 : <input type="text" value={book.book.title_info} readOnly/> <br /> 
                    저자 명 : <input type="text" value={book.book.author_info} readOnly/>  <br />
                    출판사 : <input type="text" value={book.book.pub_info} readOnly/><br />
                </div>
                
                <hr />

                <div className="memberInfo">
                    회원 아이디 : <input type="text" readOnly /> <br />
                    회원 전화번호 : <input type="text" readOnly /> <br />
                    신청 사유 : <input type="text" readOnly /> <br />
                    
                    <button type="submit">신청</button>
                    <Link to={"/requestBook/wishBookDirect"}><button>직접 입력하기</button></Link>
                    
                </div>
            </form>
        </div>
    )
}