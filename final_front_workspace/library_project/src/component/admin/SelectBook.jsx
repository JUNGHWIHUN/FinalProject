import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Admin.css";

export default function SelectBook(){

   //정보 가져오기
    const location = useLocation();
    const bookList = location.state?.bookList;

     console.log(bookList);
    //console.log(bookList);
    return(
        
         <div className="select-book-wrapper">
    <h1>책 검색 결과</h1>
    {bookList && bookList.length > 0 ? (
      <table className="select-book-table">
        <thead>
          <tr>
            <th>책 제목</th>
            <th>출판사</th>
            <th>저작자</th>
            <th>청구기호</th>
            <th>대출가능 여부</th>
          </tr>
        </thead>
        <tbody>
          {bookList.map((book, idx) => (
            <tr key={idx}>
              <td>
                <Link to="/LentBookDetail" state={{ book: book }}>
                  {book.title}
                </Link>
              </td>
              <td>{book.pub}</td>
              <td>{book.author}</td>
              <td>{book.bookNo}</td>
              <td>{book.canLent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>검색 결과가 없습니다.</p>
    )}
  </div>
    )
}

