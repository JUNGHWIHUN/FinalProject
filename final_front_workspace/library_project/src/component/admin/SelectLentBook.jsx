import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


export default function SelectLentBook(){
    const location = useLocation();
    const returnBooksList = location.state?.returnBooksList;



    return(
        <>
            <h3>반납 도서 검색 결과</h3>
            {returnBooksList && returnBooksList.length > 0  ?(
                <table border="1">
                    <thead>
                        <tr>
                            <th>책 제목</th>
                            <th>대출자</th>
                            <th>예약여부</th>
                            <th>청구기호</th>
                            <th>반납예정일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnBooksList.map(function(book, idx){

                            return(
                            <tr key={idx}>
                                <td><Link  to="/LenterBookDetil" state={{ book: book }}  >{book.title} </Link></td>
                                <td>{book.memberName}</td>
                                <td>{book.reservation}</td>
                                <td>{book.callNo}</td>
                                <td>{book.returnDate}</td>
                            </tr>
                            )
                        })}
                    </tbody>
                </table>

            ) : (
                <p></p>

            )};
        </>

    )
}