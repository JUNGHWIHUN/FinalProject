import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";
import PageNavi from "../common/PageNavi";
import useUserStore from "../../store/useUserStore";
import MyLibraryModal from "./MyLibraryModal";


export default function SearchResultList (){

    //백엔드 포트 번호
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    //location 객체 : SearchDetail에서 Maps 함수를 통해 전달한 state 객체에 접근하기 위해 사용 -> location.state.searchCriteria 로 검색값 가져오기 가능
    const location = useLocation(); 

    //현재 검색 조건 저장 : 이후 결과내 재검색에 사용할 경우 필요
    const [currentSearchCriteria, setCurrentSearchCriteria] = useState({}); 

    //페이지네이션을 위한 요청 페이지/페이지네이션 정보
    const [reqPage, setReqPage] = useState(1);       //요청 페이지 초기값을 1로 설정해 검색시 1페이지부터 출력하도록       
    const [pageInfo, setPageInfo] = useState({});

    //검색결과 리스트 초기값
    const [searchResultList, setSearchResultList] = useState([]);

    //커스텀 axios 선언
    const axiosInstance = createInstance();

    //첫 렌더링 or location.state가 변경될 때마다 useEffect 실행
    useEffect(() => {
        if (!location.state || !location.state.searchCriteria) {     //받아온 정보가 없다면 페이지 출력하지 않음
            console.log("입력된 검색정보 없음");
            setSearchResultList([]);
            setPageInfo({}); // 페이지 정보도 초기화
            return;
        }

        const searchCriteria = location.state.searchCriteria;    //SearchDetail 에서 받아온 검색정보를 객체로 저장
        const finalCriteria = { ...searchCriteria , reqPage : reqPage };    //해당 객체에 요청 페이지 속성 추가   
        setCurrentSearchCriteria(finalCriteria); // 현재 검색 조건 저장
        
        axiosInstance.post(serverUrl + '/book/searchBookList', finalCriteria)
        .then(function(res){
            setSearchResultList(res.data.resData.searchResultList); // 도서 검색 정보 리스트
            setPageInfo(res.data.resData.pageInfo);          // 페이지네이션 정보
            console.log(res.data.resData);
            
        })
        .catch(function(err){
    
        })

        //페이지 전환 시 맨 위 창으로
        window.scrollTo(0,0)
    }, [location.state, reqPage]); //요청 페이지가 달라지면 리렌더링

    return (
        <section className="section board-list">
            {/* 최상단 '통합 검색' 헤더 추가 */}
            <div className="search-title-area">
                <h2 className="search-page-title">검색 결과</h2>
                <div className="search-title-underline"></div>
            </div>
            <div className="board-list-wrap">
                <ul className="posting-wrap">
                    {searchResultList.map(function(book, index){
                        //책 1개에 대한 jsx를 BoardItem 이 반환한 jsx로
                        return <BookItem key={"book"+index} book={book} axiosInstance={axiosInstance} serverUrl={serverUrl}/>
                    })}
                </ul>
            </div>
            <div className="board-paging-wrap">
                    {/* 페이지네이션 제작 컴포넌트를 별도 분리하여 작성하고, 필요 시 재사용 */}
                    <PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />
            </div>
        </section>
    )
}

//책 1개 정보를 받아올 컴포넌트
function BookItem (props){
    const book = props.book;
    const callNo = book.callNo;
    const navigate = useNavigate();
    const axiosInstance = props.axiosInstance;
    const serverUrl = props.serverUrl;

    //로그인 회원 정보 (예약, 내 서재 버튼을 위해)
    const {isLogined, loginMember} = useUserStore();

    //이하, '내 서재에 등록' 버튼을 눌렀을 때 팝업창 (Modal) 을 띄우기 위해 필요한 변수와 함수들
    //모달 표시 여부 상태 (부모 컴포넌트에서 관리)
    const [isVisible, setIsVisible] = useState(false);

    //'내 서재에 등록' 버튼 클릭 핸들러 (모달을 띄우는 함수)
    const openMyLibraryModal = (e) => {
        e.stopPropagation();    //li 태그에 설정된 onClick 이벤트보다 해당 버튼의 onClick 우선

        // 로그인 체크
        isLoginedCheck();
        
        setIsVisible(true); // 모달을 띄우는 상태를 true로 설정
    };

    //모달을 닫는 함수
    const closeMyLibraryModal = () => {
        setIsVisible(false); // 모달 닫는 상태로 변경
    };

    //모달 내에서 '확인' 버튼 클릭 시 호출될 함수 : 실제 내 서재에 해당 도서를 등록하는 로직
    const addToMyLibrary = (selectedMyLibrary, callNo) => {

        const postData = { 
            myLibraryNo : selectedMyLibrary, 
            myLibraryCallNo : callNo
        }

        axiosInstance.post(serverUrl + `/myLibrary/addToMyLibrary`, postData)
            .then(function(res){
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg, 
                    icon: res.data.alertIcon, 
                    confirmButtonText: '확인'
                })
            })
            .catch(function(err){

            });

        // 등록 성공/실패 알림 (Swal) 후 모달 닫기
        closeMyLibraryModal(); 
    };

    //로그인 체크 함수
    function isLoginedCheck(){
        if(!isLogined){
            Swal.fire({
                title : '알림',
                text : '로그인이 필요합니다',
                icon : 'warning',
                confirmButtonText : '확인'
                
            })
            navigate('/login', { state: { from: location.pathname } });
        }
    }

    return (
        // 전체 li에 클릭 이벤트 유지 (상세보기)
        <li className="posting-item" onClick={isVisible? null : function(){    //Modal 창이 열려있을 때는 함수를 제거해 페이지 이동 막기
            //상세보기 (BoardView) 컴포넌트 전환
            navigate('/book/searchResultDetail/' + book.callNo);
        }}>
            <div className="posting-content-wrapper"> {/* 이미지와 정보를 감싸는 래퍼 */}
                <div className="posting-img">
                    <img src={book.imageUrl} alt={book.titleInfo} />
                </div>
                <div className="posting-info">
                    {/* 제목 */}
                    <div className="posting-title">{book.titleInfo}</div>
                    {/* 부가 정보 (저자, 출판사 등) */}
                    <div className="posting-sub-info">
                        {/* 저자, 출판사, 역자 등 */}
                        <p>{book.authorInfo}</p> 
                        <p>{book.pubInfo} {book.pubYear}</p> {/* 출판사, 출판연도 */}
                        <p>{book.callNo}</p> {/* 분류 기호, 자료형 */}
                        <p>{book.placeInfo}</p> {/* 소장 위치 */}
                    </div>
                </div>
            </div> {/* .posting-content-wrapper 끝 */}
            <div className="book-item-buttons-bottom"> {/* 버튼들을 아래쪽에 배치하기 위한 새로운 div */}
                {/* 대출 상태에 따라 텍스트 및 클래스 변경, 클릭 속성 제거 */}
                <div className={`lent-status-display ${book.canLend === 'T' ? 'status-available' : book.canLend === 'R' ? 'status-reserved' : book.canLend === 'L' ? 'status-lented' : 'status-unavailable'}`}>
                    {book.canLend === 'T' ? '대출가능'
                        : book.canLend === 'R' ? '예약중'
                            : book.canLend === 'L' ? '대출중'
                                : '대출불가'
                    }
                </div>
                <button className="btn-add-mylibrary" onClick={(e) => openMyLibraryModal(e)}>내 서재에 등록</button>
            </div>

            {/* isVisible 상태가 true일 때만 모달을 렌더링 */}
            {isVisible && (
                <MyLibraryModal
                    isVisible={isVisible}      // 모달 표시 여부
                    closeMyLibraryModal={closeMyLibraryModal} // 모달 닫기 함수
                    callNo={book.callNo}         //누른 책의 청구기호
                    addToMyLibrary={addToMyLibrary}    // 모달에서 '등록' 완료 시 호출될 콜백
                />
            )}
        </li>
    );
}