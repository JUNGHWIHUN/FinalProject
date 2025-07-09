import createInstance from "../../axios/Interceptor";

export default function WishBookDirect(){
    
    //console.log(book.book);
    //console.log(book.book.title_info);
    

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    
    return(
        <div>
            <h2>도서 상세 정보</h2>
            <hr />
            <form onSubmit={function(e){
                e.preventDefault();
                requestBook();
            }}>
                <div className="detailBookInfo">
                    도서 명 : <input type="text" /> <br /> 
                    저자 명 : <input type="text" />  <br />
                    출판사 : <input type="text" /><br />
                </div>
                
                <hr />

                <div className="memberInfo">
                    회원 아이디 : <input type="text" readOnly /> <br />
                    회원 전화번호 : <input type="text" readOnly /> <br />
                    신청 사유 : <input type="text" readOnly /> <br />
                    
                    <button type="submit">신청</button>
                </div>
            </form>
        </div>
    )
}










