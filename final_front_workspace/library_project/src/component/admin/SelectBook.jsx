import { useLocation } from "react-router-dom";
export default function SelectBook(){

   

    

    const location = useLocation();
    const bookList = location.state?.bookList;

     console.log(bookList);
    //console.log(bookList);
    return(
        
         <>
            <h1>책 검색 결과</h1>
            {bookList && bookList.length > 0 ? (
                <table border="1">
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
                                <td>{book.title}</td>
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
        </>
        
        
    )
}