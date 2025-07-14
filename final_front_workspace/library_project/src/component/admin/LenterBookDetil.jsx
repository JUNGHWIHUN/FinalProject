import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";
export default function LenterBookDetil(){

    const location = useLocation();
    const book = location.state.book;
    const navigate = useNavigate();

    function returnThisBook(){
        let options = {};
        options.url='http://localhost:9999/admin/retrunBook';
        options.method = 'post';
        options.data = book;

        axios(options)
        .then(function(res){
            if(res.data.resData === "OK"){
                alert("반납 처리 완료");
                navigate("/adminPage");
            } else {
                alert("검색결과 없음");
            }
        })
        .catch(function(err){
            console.log(err); 
        });
    }

    return(
        <div className="return-book-detail-container">
            <h3 className="return-book-title">{book.title}</h3>

            <p><strong>청구기호:</strong> {book.callNo}</p>
            <p><strong>대출자 번호:</strong> {book.memberNo}</p>
            <p><strong>대출자 이름:</strong> {book.memberName}</p>
            <p><strong>반납 예정일:</strong> {book.returnDate}</p>

            <button 
                className="return-book-btn" 
                onClick={returnThisBook} 
                disabled={book.actualRetrun !== null}
            >
                반납 처리
            </button>
        </div>
    )
}