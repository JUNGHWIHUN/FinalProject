import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { XMLParser } from "fast-xml-parser";
import { Link, useNavigate } from "react-router-dom";
import PageNavi from "../common/PageNavi";
import './RequestBook.css'; // 이 줄을 추가하세요!

export default function WishBook() {
    const [keyword, setKeyword] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // 실제 검색에 사용될 키워드
    const [books, setBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
    const [totalResults, setTotalResults] = useState(0); // 총 검색 결과 수 상태
    const navigate = useNavigate();

    // 첫 렌더링 시 불필요한 검색 방지를 위한 ref
    const isInitialMount = useRef(true);

    // currentPage 또는 searchQuery가 변경될 때마다 검색을 다시 수행
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        if (searchQuery.trim() !== "") {
            console.log("useEffect triggered with:", { currentPage, searchQuery }); // 디버깅용 로그
            handleSearch();
        } else {
            setBooks([]);
            setTotalResults(0);
            console.log("Search query is empty. Clearing books and totalResults."); // 디버깅용 로그
        }
        window.scrollTo(0, 0)
    }, [currentPage, searchQuery]); // currentPage와 searchQuery 모두 의존성으로 포함

    const handleSearch = async () => {
        console.log("handleSearch called with:", { currentPage, searchQuery }); // 디버깅용 로그
        try {
            const response = await axios.get(
                "https://www.nl.go.kr/NL/search/openApi/search.do",
                {
                    params: {
                        key: "359916664cbd58845d0dc68ab30b638cf5d66ce4dab3fb27f2e873702542f391",
                        resultStyle: "xml",
                        pageNum: currentPage,
                        pageSize: 9, // 한 페이지에 표시할 항목 수
                        category: "도서",
                        kwd: searchQuery, // 실제 검색 키워드는 searchQuery 사용
                    },
                    responseType: "text",
                }
            );

            console.log("API Raw Response Data:", response.data); // 원본 XML 데이터 확인

            const parser = new XMLParser({
                ignoreAttributes: true,
            });
            const jsonObj = parser.parse(response.data);

            console.log("Parsed JSON Object:", jsonObj); // XML 파싱 결과 객체 확인

            const bookDocs = jsonObj?.root?.result?.item;
            const totalCount = jsonObj?.root?.paramData?.total; // API 응답의 total 값은 그대로 사용

            console.log("Extracted bookDocs:", bookDocs); // 추출된 bookDocs 데이터 확인
            console.log("Extracted totalCount:", totalCount); // 추출된 totalCount 데이터 확인

            if (totalCount) {
                setTotalResults(Number(totalCount));
            } else {
                setTotalResults(0);
            }

            if (bookDocs) {
                const processedBooks = Array.isArray(bookDocs)
                    ? bookDocs
                    : [bookDocs];
                setBooks(processedBooks);
                console.log("setBooks called with:", processedBooks); // setBooks에 전달된 배열 확인
            } else {
                setBooks([]);
                console.log("bookDocs is empty or invalid. setBooks called with [].");
            }
        } catch (error) {
            console.error("검색 중 오류 발생:", error);
            setBooks([]);
            setTotalResults(0);
        }
    };

    // 검색 버튼 클릭 또는 Enter 키 입력 시 호출될 함수
    const triggerSearch = () => {
        if (keyword.trim() === "") {
            setBooks([]);
            setTotalResults(0);
            setCurrentPage(1);
            setSearchQuery("");
            return;
        }
        setCurrentPage(1);
        setSearchQuery(keyword);
    };

    const getSecureImageUrl = (url) => {
        if (!url || typeof url !== "string" || url.trim() === "") return null;
        return url.startsWith("http://") ? url.replace("http://", "https://") : url;
    };

    // PageNavi에 전달할 pageInfo 객체 계산
    const pageNaviSize = 5;
    const totalPage = Math.ceil(totalResults / 10);
    const pageNo =
        Math.floor((currentPage - 1) / pageNaviSize) * pageNaviSize + 1;

    const pageInfo = {
        pageNo: pageNo,
        pageNaviSize: pageNaviSize,
        totalPage: totalPage,
    };

    return (
        <div className="wishbook-container">
            <h2 className="wishbook-page-title">📚 KH공감도서관 책 검색</h2>

            <div className="wishbook-search-input-group">
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            triggerSearch();
                        }
                    }}
                    placeholder="책 제목을 입력하세요"
                    className="wishbook-search-input"
                />
                <button
                    onClick={triggerSearch}
                    className="wishbook-search-button"
                >
                    검색
                </button>
            </div>

            <ul className="wishbook-list-grid">
                {books.length > 0 ? (
                    books.map((book) => {
                        const uniqueKey = book.id || book.control_no || `${book.title_info}-${book.author_info}-${Math.random()}`;

                        const imageUrl = getSecureImageUrl(
                            book.bookImageURL || book.image_url || ""
                        );
                        const title = book.title_info || "제목 없음";
                        const author = book.author_info || "저자 없음";
                        const publisher = book.pub_info || "출판사 없음";
                        const price = book.price ? `${Number(book.price).toLocaleString()}원` : "가격 정보 없음";

                        return (
                            <li
                                key={uniqueKey}
                                className="wishbook-card"
                            >
                                <div className="wishbook-image-container">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={title + " 표지"}
                                            className="wishbook-cover-image"
                                            onClick={() =>
                                                navigate("/requestBook/detailBook", { state: { book } })
                                            }
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    "https://placehold.co/120x170?text=No+Image";
                                            }}
                                        />
                                    ) : (
                                        <div className="wishbook-no-image">
                                            No Image
                                        </div>
                                    )}
                                </div>

                                <div className="wishbook-info-text-group">
                                    <p className="wishbook-info-item">
                                        <strong className="wishbook-info-label">제목:</strong> {title}
                                    </p>
                                    <p className="wishbook-info-item">
                                        <strong className="wishbook-info-label">저자:</strong> {author}
                                    </p>
                                    <p className="wishbook-info-item">
                                        <strong className="wishbook-info-label">출판사:</strong> {publisher}
                                    </p>
                                    <button
                                        onClick={() => navigate("/requestBook/detailBook", { state: { book } })}
                                        className="wishbook-apply-button"
                                    >
                                        신청
                                    </button>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <p className="wishbook-no-results">검색 결과가 없습니다. <br /></p>
                )}
                 <div className="button-group">
                    <Link to={"/requestBook/wishBookDirect"} className="link-button">
                        <button type="button" className="direct-input-button">원하는 책이 없어요!</button>
                    </Link>
                </div>
            </ul>

            {totalResults > 0 && (
                <div className="wishbook-pagination-container">
                    <PageNavi
                        pageInfo={pageInfo}
                        reqPage={currentPage}
                        setReqPage={setCurrentPage}
                    />
                </div>
            )}
        </div>
    );
}