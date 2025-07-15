import { use, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function SearchDetail (){

    //검색도서 객체 초기값 : 이름, 저자, 출판사, isbn, 발행년도
    const [book, setBook] = useState({
        titleInfo : "",
        authorInfo : "",
        pubInfo : "",
        ISBN : "",
        pubYearFrom : "",
        pubYearTo : ""
    });

    //페이지 이동용 네비게이트
    const navigate = useNavigate();

    //검색정보 입력란 onChange 호출 함수
    function chgValue(e){
        const { id, value } = e.target;
        let newValue = value;

        // ISBN 필드 길이 제한 (13자리)
        if (id === 'ISBN') {
            if (newValue.length > 13) {
                newValue = newValue.slice(0, 13);
            }
        }
        // 발행년도 필드 길이 제한 (4자리)
        else if (id === 'pubYearFrom' || id === 'pubYearTo') {
            if (newValue.length > 4) {
                newValue = newValue.slice(0, 4);
            }
        }

        setBook({ // 기존 book 객체를 복사하고 변경된 필드만 업데이트
            ...book,
            [id]: newValue
        });
    }

    //검색 정보 제출 함수 : navigate 로 이동하며 저장된 book 객체를 함께 전달
    function search (){

        if(book.titleInfo == "" && book.authorInfo == "" && book.pubInfo == "" &&
            book.ISBN == "" && book.pubYearFrom == "" && book.pubYearTo ==""){
            Swal.fire({
                title: '알림',
                text: '검색어를 입력해주세요', 
                icon: 'warning', 
                confirmButtonText: '확인'
            })
        }else{
            navigate('/book/searchResultList', {state: {searchCriteria : book}}) //searchCriteria : 검색조건/키워드 전달 객체
        }
    }
    
    //입력값 초기화 함수
    function valueReset(){
        setBook({
            titleInfo : "",
            authorInfo : "",
            pubInfo : "",
            ISBN : "",
            pubYearFrom : "",
            pubYearTo : ""
        })
    }

    return (
        <div className="search-wrap">
            <div className="search-title-area"> {/* 제목 및 구분선을 위한 div 추가 */}
                <h2 className="search-page-title">상세검색</h2>
                <div className="search-title-underline"></div>
            </div>

            <form onSubmit={function(e){
                e.preventDefault();
                search();
            }}>
                <div className="form-row"> {/* 각 입력 필드와 레이블을 위한 행 */}
                    <label htmlFor="titleInfo" className="form-label">자료명</label>
                    <input type='text' id='titleInfo' value={book.titleInfo} onChange={chgValue} placeholder="예 : 책 제목" /> {/* 플레이스홀더 수정 */}
                </div>

                <div className="form-row">
                    <label htmlFor="authorInfo" className="form-label">저자명</label>
                    <input type='text' id='authorInfo' value={book.authorInfo} onChange={chgValue} placeholder="예 : 김철수" /> {/* 플레이스홀더 수정 */}
                </div>

                <div className="form-row">
                    <label htmlFor="pubInfo" className="form-label">출판사</label>
                    <input type='text' id='pubInfo' value={book.pubInfo} onChange={chgValue} placeholder="예 : 대한출판사" />
                </div>

                <div className="form-row pub-year-row"> {/* ISBN과 출판연도를 포함하는 행 */}
                    <label htmlFor="ISBN" className="form-label">ISBN</label>
                    <input type='number' id='ISBN' maxLength='13' value={book.ISBN} onChange={chgValue} />

                    {/* '발행년도' label과 input 필드, 그리고 '~' 텍스트 */}
                    <label className="pub-year-label">발행년도</label> {/* 스크린샷에 맞춰 텍스트 변경 */}
                    <input type='number' id='pubYearFrom' maxLength='4' value={book.pubYearFrom} onChange={chgValue} className="pub-year-input"/> {/* placeholder 추가 */}
                    <span className="year-range-separator">~</span> {/* '~' 텍스트를 위한 span 추가 */}
                    <input type='number' id='pubYearTo' maxLength='4' value={book.pubYearTo} onChange={chgValue} className="pub-year-input"/> {/* placeholder 추가 */}
                </div>

                <div className="search-buttons"> {/* 검색 버튼들을 위한 div */}
                    <button type='submit' className="search-btn">검색</button>
                    <button type='button' onClick={valueReset} className="reset-btn">입력 초기화</button>
                </div>
            </form>
        </div>
    )
}