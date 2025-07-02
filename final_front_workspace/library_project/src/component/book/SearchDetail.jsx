import { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SearchDetail (){

    //검색도서 객체 초기값 : 이름, 저자, 출판사, isbn, 발행년도
    const [book, setBook] = useState({
        bookName : "",
        author : "",
        publisher : "",
        ISBN : "",
        pubYearFrom : "",
        pubYearTo : ""
    });

    //페이지 이동용 네비게이트
    const navigate = useNavigate();

    //검색정보 입력란 onChange 호출 함수
    function chgValue(e){
        setBook({ // 기존 book 객체를 복사하고 변경된 필드만 업데이트
            ...book,
            [e.target.id]: e.target.value
        });
    }

    //검색 정보 제출 함수 : navigate 로 이동하며 저장된 book 객체를 함께 전달
    function search (){
        navigate('/searchResultList', {state: {searchCriteria : book}}) //searchCriteria : 검색조건/키워드 전달 객체
    }
    
    //입력값 초기화 함수
    function valueReset(){
        setBook({
            bookName : "",
            author : "",
            publisher : "",
            ISBN : "",
            pubYearFrom : "",
            pubYearTo : ""
        })
    }


    return (
        <>
            <div className="search-wrap">
                <form onSubmit={function(e){
                  e.preventDefault(); //기본 submit 이벤트 제어 : 별도의 함수로 분리
                   search();             //회원가입 처리 함수 호출
                }}>
                    <label htmlFor="bookName">자료명</label>
                    <input type='text' id='bookName' value={book.bookName} onChange={chgValue} placeholder="예 : 홍길동전" /><br/>

                    <label htmlFor="author">저자명</label>
                    <input type='text' id='author' value={book.author} onChange={chgValue} placeholder="예 : 홍길동" /><br/>

                    <label htmlFor="publisher">출판사</label>
                    <input type='text' id='publisher' value={book.publisher} onChange={chgValue} placeholder="예 : 대한출판사" /><br/>

                    <label htmlFor="ISBN">ISBN</label>
                    <input type='number' id='ISBN' maxLength='13' value={book.ISBN} onChange={chgValue} placeholder="책 고유의 13자리 숫자입니다."/>

                    <label htmlFor="ISBN">출판연도</label>
                    <input type='number' id='pubYearFrom' maxLength='4' value={book.pubYearFrom} onChange={chgValue}/> ~ 
                    <input type='number' id='pubYearTo' maxLength='4' value={book.pubYearTo} onChange={chgValue}/><br/>

                    <button type='submit'>검색</button>
                    <button type='button' onClick={valueReset}>입력값 초기화</button>
                </form>
            </div>
        </>
    )
}