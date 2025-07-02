import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import createInstance from "../../axios/Interceptor";

export default function SearchResultList (){

    const location = useLocation(); //location 객체 : SearchDetail에서 Maps 함수를 통해 전달한 state 객체에 접근하기 위해 사용 -> location.state.searchCriteria 로 검색값 가져오기 가능
    const [currentSearchCriteria, setCurrentSearchCriteria] = useState({}); //현재 검색 조건 저장

    //검색결과 리스트 초기값
    const [searchResultList, setSearchResultList] = useState([]);

    //첫 렌더링 or location.state가 변경될 때마다 useEffect 실행
    useEffect(() => {
        if (location.state && location.state.searchCriteria) {  //검색조건 Book 객체가 존재시 실행
            const { searchCriteria } = location.state;
            setCurrentSearchCriteria(searchCriteria); // 현재 검색 조건 저장
        }
    }, [location.state]); 

    //커스텀 axios 선언
    const axiosInstance = createInstance();

    //현재 검색조건이 담긴 Book 객체를 전달해 axios 로 통신
    axiosInstance(currentSearchCriteria)
    .then(function(res){
        setSearchResultList(res.data.resData);
        console.log(searchResultList);
    })
    .catch(function(err){

    })


    return (
        <>
        <div>
            <table border='1'>
                <thead>
                    <th>표지</th>
                    <th>제목</th>
                    <th>저자</th>
                    <th>출판사</th>
                    <th>청구기호</th>
                    <th>출판연도</th>
                    <th>자료위치</th>
                    <th>도서상태</th>
                </thead>
                <tbody>
                    
                </tbody>
            </table>
        </div>
        </>
    )
}