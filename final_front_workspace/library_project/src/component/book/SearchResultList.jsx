import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import createInstance from "../../axios/Interceptor";

export default function SearchResultList (){

    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    const location = useLocation(); //location 객체 : SearchDetail에서 Maps 함수를 통해 전달한 state 객체에 접근하기 위해 사용 -> location.state.searchCriteria 로 검색값 가져오기 가능
    const [currentSearchCriteria, setCurrentSearchCriteria] = useState({}); //현재 검색 조건 저장

    //검색결과 리스트 초기값
    const [searchResultList, setSearchResultList] = useState([]);

    //커스텀 axios 선언
    const axiosInstance = createInstance();

    //첫 렌더링 or location.state가 변경될 때마다 useEffect 실행
    useEffect(() => {
        const { searchCriteria } = location.state;
        setCurrentSearchCriteria(searchCriteria); // 현재 검색 조건 저장
        
        axiosInstance.post(serverUrl + '/book/searchBookList', searchCriteria)
        .then(function(res){
            setSearchResultList(res.data.resData);
            console.log(res.data.resData);
            
        })
        .catch(function(err){
    
        })
    }, [location.state]); 

    return (
        <section className="section board-list">
            <div className="board-list-wrap">
                <ul className="posting-wrap">
                    {searchResultList.map(function(book, index){
                        //책 1개에 대한 jsx를 BoardItem 이 반환한 jsx로
                        return <BookItem key={"board"+index} book={book} serverUrl={serverUrl}/>
                    })}
                </ul>
            </div>
            <div className="board-paging-wrap">
                    {/* 페이지네이션 제작 컴포넌트를 별도 분리하여 작성하고, 필요 시 재사용 */}
                    {/*<PageNavi pageInfo={pageInfo} reqPage={reqPage} setReqPage={setReqPage} />*/}
            </div>
        </section>
    )
}

//책 1개 정보를 받아올 컴포넌트
function BookItem (props){
    const book = props.book;
    const navigate = useNavigate();

    function addToMyLibrary (){
        
    }
      
    return (
        // 전체 li에 클릭 이벤트 유지 (상세보기)
        <li className="posting-item" onClick={function(){
            //상세보기 (BoardView) 컴포넌트 전환
            navigate('/book/searchResultDetail/' + book.callNo);
        }}>
            <div className="posting-content-wrapper"> {/* 이미지와 정보를 감싸는 래퍼 */}
                <div className="posting-img">
                    <img src={book.imageUrl} />
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
                    {book.canLend == 'T' ? '대출가능'
                        : 'R' ? '예약중'
                           : 'L' ? '대출중'
                                : '대출불가'
                    }
                    <button className="btn btn-add-mylibrary" onClick={addToMyLibrary}>내 서재에 등록</button>
        </li>
    );
}