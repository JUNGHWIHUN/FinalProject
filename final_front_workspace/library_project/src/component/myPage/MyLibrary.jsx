import { use, useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";
import MyLibraryManageModal from "./myLibraryModal/MyLibraryManageModal"; // 새로 생성한 모달 임포트
import MoveBookModal from "./myLibraryModal/MoveBookModal"; // 새로 생성한 모달 임포트

//마이페이지 하위의 '내 서재' 기능 컴포넌트
export default function MyLibrary() {

    const navigate = useNavigate();

    //백엔드 서버 URL
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    //커스텀 axios
    const axiosInstance = createInstance();

    //로그인한 회원 정보
    const { isLogined, loginMember } = useUserStore();

    //화면 새로고침용 상태
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    //내 서재 목록 리스트를 DB에서 받아와 저장
    const [myLibraryList, setMyLibraryList] = useState([]);

    //현재 열려있는 서재들의 myLibraryNo를 저장하는 배열
    const [openLibraries, setOpenLibraries] = useState([]);

    //선택된 서재에 담긴 책 목록
    const [booksInMyLibrary, setBooksInMyLibrary] = useState({});

    // 서재 관리 모달 표시 여부 상태
    const [isManageModalVisible, setIsManageModalVisible] = useState(false);
    // 책 이동 모달 표시 여부 상태
    const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
    // 이동할 책 정보를 저장할 상태
    const [bookToMove, setBookToMove] = useState(null);


    //서재 목록 불러오기
    useEffect(() => {
        if (isLogined && loginMember?.memberNo) {
            axiosInstance.get(serverUrl + `/myLibrary/selectMyLibrary/${loginMember.memberNo}`)
                .then(function(res) {
                    //myLibraryList를 myLibraryNo의 숫자 부분을 기준으로 정렬 (오래된 순서대로)
                    const sortedList = res.data.resData.sort((a, b) => {
                        const numA = parseInt(a.myLibraryNo.split('_').pop());
                        const numB = parseInt(b.myLibraryNo.split('_').pop());
                        return numA - numB;
                    });
                    setMyLibraryList(sortedList);

                    //초기 로드 시 기본 서재를 열려있는 상태로 설정
                    const defaultLib = sortedList.find(lib => lib.isDefault === 'T');
                    if (defaultLib) {
                        setOpenLibraries([defaultLib.myLibraryNo]); //기본 서재만 열기
                        //기본 서재의 책 목록도 미리 불러오도록 트리거
                        selectMyLibraryBooks(defaultLib.myLibraryNo);
                    }
                })
                .catch(function(err) {
                    console.error("서재 목록 불러오기 실패:", err);
                });
        }
    }, [isLogined, loginMember?.memberNo, refreshTrigger]);

    //특정 서재의 책 목록을 불러오는 함수
    const selectMyLibraryBooks = (libraryNo) => {
        axiosInstance.get(serverUrl + `/myLibrary/selectMyLibraryBooks/${libraryNo}`)
            .then(function(res) {
                setBooksInMyLibrary(prev => ({
                    ...prev,
                    [libraryNo]: res.data.resData
                }));
            })
            .catch(function(err) {
                console.error("서재 책 목록 불러오기 실패:", err);
            });
    };

    //서재 열기/닫기 토글 함수
    const toggleLibrary = (libraryNo) => {
        setOpenLibraries(prevOpenLibraries => {
            if (prevOpenLibraries.includes(libraryNo)) {
                //이미 열려있으면 닫기 (제거)
                return prevOpenLibraries.filter(id => id !== libraryNo);
            } else {
                //닫혀있으면 열기 (추가)
                selectMyLibraryBooks(libraryNo); // 열릴 때 책 목록 불러오기
                return [...prevOpenLibraries, libraryNo];
            }
        });
    };

    //서재 관리 모달 열기/닫기 함수
    const openManageModal = () => setIsManageModalVisible(true);
    const closeManageModal = () => setIsManageModalVisible(false);

    //책 이동 모달 열기/닫기 함수
    const openMoveBookModal = (book) => {
        setBookToMove(book);
        setIsMoveModalVisible(true);
    };
    const closeMoveBookModal = () => {
        setIsMoveModalVisible(false);
        setBookToMove(null); // 모달 닫으면 초기화
    };

    //서재에서 책 제거
    function removeBookFromLibrary(book) { // book 객체 전체를 받도록 수정
        Swal.fire({
            title: '도서 제거',
            text: '이 책을 서재에서 제거하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '제거',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(serverUrl + `/myLibrary/deleteFromMyLibrary/${book.myLibraryBookNo}`)
                    .then(function(res) {
                        Swal.fire({
                            title: '알림',
                            text: res.data.clientMsg,
                            icon: res.data.alertIcon
                        });
                        // 책 제거 후 해당 서재의 책 목록을 갱신
                        selectMyLibraryBooks(book.myLibraryNo);
                    })
                    .catch(function(err) {
                        console.error("책 제거 실패:", err);
                        Swal.fire('오류', '책 제거에 실패했습니다.', 'error');
                    });
            }
        });
    }

    return (
        <>
            <div>
                <div>
                    <h2>책장만들기</h2>
                    <button onClick={openManageModal}>
                        &#x2b; {/* 플러스 아이콘 */}
                    </button>
                </div>
                <div>
                    <button>도움말</button>
                    <button>목록엑셀다운로드 &#x21e3;</button> {/* 다운로드 아이콘 */}
                </div>
            </div>
            <hr />

            {/* 모든 서재 목록과 각각의 책 목록 (아코디언 형태) */}
            <div>
                {myLibraryList.length === 0 ? (
                    <p>내 서재가 없습니다. 새로운 서재를 추가해보세요!</p>
                ) : (
                    myLibraryList.map((library) => {
                        const isOpened = openLibraries.includes(library.myLibraryNo);
                        // booksInMyLibrary에서 해당 서재의 책 목록을 가져오거나, 없으면 빈 배열
                        const booksForThisLibrary = booksInMyLibrary[library.myLibraryNo] || [];

                        return (
                            <div key={library.myLibraryNo}>
                                <div
                                    onClick={() => toggleLibrary(library.myLibraryNo)}
                                >
                                    <h3>
                                        {library.myLibraryName}
                                    </h3>
                                    <span>{isOpened ? '▲' : '▼'}</span> {/* 위/아래 화살표 아이콘 */}
                                </div>
                                {isOpened && ( //isOpened 상태일 때만 책 목록을 렌더링
                                    <>
                                        <hr />
                                        <div>
                                            {booksForThisLibrary.length === 0 ? (
                                                <p>등록된 도서가 없습니다.</p>
                                            ) : (
                                                <div className="book-grid-container">
                                                    {booksForThisLibrary.map((bookObj) => (
                                                        <div key={bookObj.myLibraryBookNo} className="book-item-card">
                                                            <div
                                                                onClick={() => navigate('/book/searchResultDetail/' + bookObj.book.callNo)}
                                                                className="book-image-wrapper"
                                                            >
                                                                <img
                                                                    src={bookObj.book.imageUrl}
                                                                    className="book-image"
                                                                />
                                                            </div>
                                                            <p className="book-title">{bookObj.book.titleInfo}</p>
                                                            <p className="book-author-pub">{bookObj.book.authorInfo} | {bookObj.book.pubInfo}</p>
                                                            <button
                                                                onClick={() => openMoveBookModal(bookObj)}
                                                                className="action-button move-button"
                                                            >
                                                                이동
                                                            </button>
                                                            <button
                                                                onClick={() => removeBookFromLibrary(bookObj)}
                                                                className="action-button delete-button"
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                <hr /> {/* 각 서재 섹션 사이에 구분선 */}
                            </div>
                        );
                    })
                )}
            </div>

            {/* 서재 관리 모달 */}
            <MyLibraryManageModal
                isVisible={isManageModalVisible}
                closeManageModal={closeManageModal}
                myLibraryList={myLibraryList}
                loginMember={loginMember}
                setRefreshTrigger={setRefreshTrigger}
            />

            {/* 책 이동 모달 */}
            {bookToMove && ( //bookToMove가 있을 때만 렌더링하여 불필요한 렌더링 방지
                <MoveBookModal
                    isVisible={isMoveModalVisible}
                    closeMoveBookModal={closeMoveBookModal}
                    bookToMove={bookToMove}
                    myLibraryList={myLibraryList}
                    selectMyLibraryBooks={selectMyLibraryBooks}
                />
            )}
        </>
    );
}