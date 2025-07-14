import { useEffect, useState } from "react"
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import PageNavi from "../common/PageNavi";

//희망도서 신청 내역
export default function RequestBook(){

      //희망도서 신청한 내역을 보여줄 State 변수
      const [requestBooks, setRequestBooks] = useState([]);

      const serverUrl = import.meta.env.VITE_BACK_SERVER;
      const axiosInstacne = createInstance();
      const {loginMember} = useUserStore();

      const [pageInfo, setPageInfo] = useState({});
      const [reqPage, setReqPage] = useState(1);


      useEffect(function(){
            let options = {};
            options.url = serverUrl + "/requestBookList/" + reqPage;
            options.method = "get"
            options.params = {
                  memberNo : loginMember.memberNo
            }

            axiosInstacne(options)
            .then(function(res){
                  setRequestBooks(res.data.resData.requestBookList);
                  setPageInfo(res.data.resData.pageInfo);
            })
            .catch(function(err){
                  console.log(err);
            })

      },[reqPage]);


      return(
            <div className="request-book-container"> {/* 전체 컨테이너 추가 */}
                  <h2 className="page-title">희망도서 신청내역</h2> {/* 페이지 제목에 클래스 추가 */}

                  {requestBooks.length === 0 ? (
                        <p className="no-request-books-message">희망도서 신청 내역이 없습니다.</p>
                  ) : (
                        <table className="request-book-table"> {/* 테이블에 클래스 추가 */}
                              <thead>
                                    <tr>
                                          <th>책제목</th>
                                          <th>저자</th>
                                          <th>출판사</th>
                                          <th>상태</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {requestBooks.map(function(requestBook, index){
                                          // 상태 텍스트 변환 로직 (기존 로직 유지)
                                          const statusText = requestBook.requestStatus === 0
                                                ? "접수중"
                                                : requestBook.requestStatus === 1
                                                ? "반려"
                                                : requestBook.requestStatus === 2
                                                ? "처리완료"
                                                : "알 수 없음";

                                          return (
                                          <tr key={"requestBook" + index}>
                                                <td>{requestBook.requestedBookName}</td>
                                                <td>{requestBook.requestedBookAuthor}</td>
                                                <td>{requestBook.requestedBookPub}</td>
                                                <td>{statusText}</td> {/* 변환된 상태 텍스트 사용 */}
                                          </tr>
                                          );
                                    })}
                              </tbody>
                        </table>
                  )}
                  <div className="pagination-container"> {/* 페이지네이션 컨테이너 추가 */}
                          <PageNavi pageInfo = {pageInfo} reqPage={reqPage} setReqPage={setReqPage}/>
                  </div>
            </div>
      )
}