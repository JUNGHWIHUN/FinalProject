import axios from "axios"
import { useEffect, useState } from "react"
import {XMLParser} from "fast-xml-parser";
import { useNavigate } from "react-router-dom";


export default function WishBook(){
    const [keyword, setKeyword] = useState("");
    const [books, setBooks] = useState([]);
    const navigate = useNavigate();
    

    const handleSearch = async () => {
    try {
      const response = await axios.get("https://www.nl.go.kr/NL/search/openApi/search.do", {
        params: {
          key: "359916664cbd58845d0dc68ab30b638cf5d66ce4dab3fb27f2e873702542f391",
          resultStyle: "xml",
          pageNo: 1,
          pageSize: 10,
          category : "도서",
          kwd: keyword, // 'title' 대신 'kwd' 사용
        },
        responseType: 'text'
      });

      const parser = new XMLParser({
          ignoreAttributes: true,
      });
      const jsonObj = parser.parse(response.data);


      // --- 이 부분을 수정합니다: 책 목록 경로 변경 ---
      const bookDocs = jsonObj?.root?.result?.item;
      // ---------------------------------------------

      if (bookDocs) {
        setBooks(Array.isArray(bookDocs) ? bookDocs : [bookDocs]);
      } else {
        setBooks([]);
      }
    } catch (error) {
      setBooks([]);
    }
  };

  const getSecureImageUrl = (url) => {
    if (!url || typeof url !== "string" || url.trim() === "") return null;
    // 이 API는 이미지 URL의 전체 경로를 제공하지 않을 가능성이 높습니다.
    // 'http://cover.nl.go.kr/kolis/'와 같은 베이스 URL이 여전히 필요할 수 있습니다.
    return url.startsWith("http://")
      ? url.replace("http://", "https://")
      : url;
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📚 KH공감도서관 책 검색</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="책 제목을 입력하세요"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          검색
        </button>
      </div>

        

      <ul className="space-y-4">
        {books.length > 0 ? (
          books.map((book, index) => {
            // --- 이 부분을 수정합니다: 실제 필드명 사용 ---
            // 로그에서 확인된 필드명: title_info, author_info, pub_info
            // 이미지 URL은 아직 명확하지 않으므로, 기존 가능성 포함.
            const imageUrl = getSecureImageUrl(book.bookImageURL || book.image_url || ''); // 실제 이미지 필드명 확인 필요
            const title = book.title_info || '제목 없음';
            const author = book.author_info || '저자 없음';
            const publisher = book.pub_info || '출판사 없음';
            // ---------------------------------------------

        
            return (
              <li
                key={index}
                className="flex items-start gap-4 border p-4 rounded bg-gray-50 shadow-sm"
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={title + " 표지"}
                    className="w-28 h-40 object-cover rounded border shrink-0"
                    onClick={() => navigate("/requestBook/detailBook" , {state : {book} })}
                    onError={(e) => {
                      e.currentTarget.src = "https://placehold.co/120x160?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-28 h-40 bg-gray-200 flex items-center justify-center text-sm text-gray-500 rounded border">
                    No Image
                  </div>
                )}

                <div className="text-sm space-y-1">
                  <p><strong>📖 제목:</strong> {title}</p>
                  <p><strong>👤 저자:</strong> {author}</p>
                  <p><strong>🏢 출판사:</strong> {publisher}</p>
                </div>
              </li>
            );
          })
        ) : (
          <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
        )}
      </ul>
    </div>
  );
}