import { useLocation } from "react-router-dom";
export default function SelectBook(){

    const location = useLocation();
    const bookList = location.state?.bookList;

    return(
        <>
        <h3>대출할 책 검색 결과</h3>
        (bookList.map(function(book,idx) {  
            <table>
            <td>
                <tr>책 제목</tr>
                <tr>출판사</tr>
                <tr>저작자</tr>
                <tr>청구기호</tr>
                <tr>대출가능 여부</tr>
            </td>
            <td>
                <tr>{book.title}</tr>
                <tr>{book.author}</tr>
                <tr>{book.pup}</tr>
                <tr>{book.bookNo}</tr>
                <tr>{book.canLent}</tr>
            </td>
        </table>
        }))
        
        </>
    )
}