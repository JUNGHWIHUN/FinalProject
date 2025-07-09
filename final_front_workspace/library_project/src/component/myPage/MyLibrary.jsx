import { use, useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import Swal from "sweetalert2";
import useUserStore from "../../store/useUserStore";
import { useNavigate } from "react-router-dom";

//마이페이지 하위의 '내 서재' 기능 컴포넌트
export default function MyLibrary(){

    const navigate = useNavigate();

    //백엔드 서버 URL
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    //커스텀 axios
    const axiosInstance = createInstance();

    //로그인한 회원 정보
    const {isLogined, loginMember} = useUserStore();

    //화면 새로고침용 상태
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    //내 서재 목록 리스트를 DB에서 받아와 저장
    const [myLibraryList, setMyLibraryList] = useState([]);

    //현재 열려있는 서재들의 myLibraryNo를 저장하는 배열
    const [openLibraries, setOpenLibraries] = useState([]);

    //선택된 서재에 담긴 책 목록
    const [booksInMyLibrary, setBooksInMyLibrary] = useState({});

    //선택된 서재에 담긴 책 목록
    const [bookToMove, setBookToMove] = useState({});

    //선택된 서재에 담긴 책 목록
    const [targetLibraryNo, setTargetLibraryNo] = useState("");

    //서재 목록 불러오기
    useEffect(() => {
        if (isLogined && loginMember?.memberNo) {
            axiosInstance.get(serverUrl + `/myLibrary/selectMyLibrary/${loginMember.memberNo}`)
                .then(function(res){
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
                .catch(function(err){

                });
        }
    }, [isLogined, loginMember?.memberNo, refreshTrigger]);

    //특정 서재의 책 목록을 불러오는 함수
    const selectMyLibraryBooks = (libraryNo) => {
        axiosInstance.get(serverUrl + `/myLibrary/selectMyLibraryBooks/${libraryNo}`)
            .then(function(res){
                setBooksInMyLibrary(prev => ({
                    ...prev,
                    [libraryNo]: res.data.resData
                }));
            })
            .catch(function(err){

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


    //'내 서재 추가' 또는 '내 서재 이름 수정' 기능
    async function MyLibrarySubmit(enteredName, updatedLibraryName){ //Swal 내부에서 호출될 때 인자 받도록 수정
        if (!enteredName.trim()) {
            Swal.showValidationMessage('서재 이름을 입력해주세요.'); // Swal 내에서 유효성 검사 메시지 표시
            return false; // Swal의 preConfirm에서 false 반환하여 모달 닫히지 않게 함
        }

        const payload = {
            myLibraryNo : "",
            myLibraryMemberNo: loginMember.memberNo,
            myLibraryName: enteredName.trim(), //Swal에서 받은 이름 사용
            isDefault: 'F'
        };

        try {
            if (updatedLibraryName) { // 수정 모드
                payload.myLibraryNo = updatedLibraryName.myLibraryNo;
                const result = await Swal.fire({ // Swal.fire 자체를 기다림
                    title: '서재 이름 수정',
                    text: `'${updatedLibraryName.myLibraryName}' 서재를 '${enteredName.trim()}'(으)로 변경하시겠습니까?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '예',
                    cancelButtonText: '아니오'
                });

                if (result.isConfirmed) {
                    const res = await axiosInstance.patch(serverUrl + `/myLibrary/updateMyLibraryName`, payload);
                    Swal.fire({
                        title: '알림',
                        text: res.data.clientMsg,
                        icon: res.data.alertIcon
                    });
                    setRefreshTrigger(prev => prev + 1); // 화면 새로고침 (서재 목록 갱신)
                    return true;
                }
            } else { // 추가 모드
                const result = await Swal.fire({ // Swal.fire 자체를 기다림
                    title: '새 서재 추가',
                    text: `'${enteredName.trim()}' 서재를 새로 추가하시겠습니까?`,
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: '예',
                    cancelButtonText: '아니오'
                });

                if (result.isConfirmed) {
                    const res = await axiosInstance.post(serverUrl + `/myLibrary/addNewMyLibrary`, payload);
                    Swal.fire({
                        title: '알림',
                        text: res.data.clientMsg,
                        icon: res.data.alertIcon
                    });
                    setRefreshTrigger(prev => prev + 1); // 화면 새로고침 (서재 목록 갱신)
                    return true;
                }
            }
        } catch (err) {

        }
        //취소시 false 반환
        return false;
    }

    //서재 이름 수정 모드 활성화
    function enableUpdateMode(library) {
        Swal.fire({
            title: '책장 카테고리 수정',
            html: `
                <input id="swal-input-library-name" class="swal2-input" placeholder="서재 이름을 입력해주세요." value="${library.myLibraryName}">
            `,
            showCancelButton: true,
            confirmButtonText: '수정',
            cancelButtonText: '취소',
            focusConfirm: false,
            preConfirm: () => {
                const enteredName = Swal.getPopup().querySelector('#swal-input-library-name').value;
                return MyLibrarySubmit(enteredName, library); //Swal 내부에서 비동기 처리
            }
        });
    }

    //내 서재 카테고리 관리 모달 열기
    const openManageModal = () => {
        //myLibraryList를 myLibraryNo의 숫자 부분을 기준으로 정렬
        const sortedMyLibraryList = [...myLibraryList].sort((a, b) => {
            const numA = parseInt(a.myLibraryNo.split('_').pop());
            const numB = parseInt(b.myLibraryNo.split('_').pop());
            return numA - numB;
        });

        Swal.fire({
            title: '내 서재 관리',
            html: `
                <div style="margin-bottom: 20px;">
                    <input id="swal-input-new-library-name" class="swal2-input" placeholder="새로 추가할 책장명을 입력해주세요.">
                    <button id="swal-add-button" class="swal2-confirm swal2-styled">등록</button>
                </div>
                <ul id="swal-library-list" style="list-style: none; padding: 0; text-align: left;">
                    ${sortedMyLibraryList.map(library => `
                        <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                            <span>${library.myLibraryName} ${library.isDefault === 'T' ? '(기본 서재)' : ''}</span>
                            <div>
                                <button class="swal-edit-button" data-library-no="${library.myLibraryNo}" data-library-name="${library.myLibraryName}">
                                    &#x2699;
                                </button>
                                ${library.isDefault !== 'T' ? `
                                <button class="swal-delete-button" data-library-no="${library.myLibraryNo}" data-library-name="${library.myLibraryName}" data-is-default="${library.isDefault}">
                                    &times;
                                </button>
                                ` : ''}
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `,
            showConfirmButton: false, // 기본 확인 버튼 숨김
            showCancelButton: false, // 기본 취소 버튼 숨김
            showCloseButton: true, // X 버튼 표시
            didOpen: () => {
                const popup = Swal.getPopup();
                const addButton = popup.querySelector('#swal-add-button');
                const newLibraryNameInput = popup.querySelector('#swal-input-new-library-name');

                // 새 서재 등록 버튼 클릭 이벤트
                addButton.onclick = async () => {
                    const enteredName = newLibraryNameInput.value;
                    const success = await MyLibrarySubmit(enteredName, null);
                    if (success) {
                        Swal.close(); // 성공 시 Swal 닫기
                    }
                };

                //수정 버튼 클릭 이벤트
                popup.querySelectorAll('.swal-edit-button').forEach(button => {
                    button.onclick = () => {
                        const libraryNo = button.dataset.libraryNo;
                        const libraryName = button.dataset.libraryName;
                        Swal.close(); // 기존 Swal 닫고 새 Swal 띄움
                        enableUpdateMode({ myLibraryNo: libraryNo, myLibraryName: libraryName });
                    };
                });

                //삭제 버튼 클릭 이벤트
                popup.querySelectorAll('.swal-delete-button').forEach(button => {
                    button.onclick = () => {
                        const libraryNo = button.dataset.libraryNo;
                        const libraryName = button.dataset.libraryName;
                        const isDefault = button.dataset.isDefault === 'T';
                        Swal.close(); // 기존 Swal 닫고 새 Swal 띄움
                        deleteMyLibrary({ myLibraryNo: libraryNo, myLibraryName: libraryName, isDefault: isDefault });
                    };
                });
            }
        });
    };

    //서재 삭제 기능
    function deleteMyLibrary(library) {
        Swal.fire({
            title: '서재 삭제',
            text: `'${library.myLibraryName}' 해당 서재와 서재에 담긴 모든 책을 삭제하시겠습니까?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then(async (result) => { // async 추가
            if (result.isConfirmed) {
                try { //try-catch 블록 추가
                    const res = await axiosInstance.delete(serverUrl + `/myLibrary/deleteMyLibrary/${library.myLibraryNo}`);
                    Swal.fire({
                        title: '알림',
                        text: res.data.clientMsg,
                        icon: res.data.alertIcon
                    });
                    setRefreshTrigger(prev => prev + 1); //화면 새로고침 (서재 목록 갱신)
                    //삭제된 서재가 열려있는 서재 목록에 있다면 제거
                    setOpenLibraries(prevOpenLibraries => prevOpenLibraries.filter(id => id !== library.myLibraryNo));
                    //삭제된 서재의 책 데이터도 제거
                    setBooksInMyLibrary(prevBooks => {
                        const newBooks = { ...prevBooks };
                        delete newBooks[library.myLibraryNo];
                        return newBooks;
                    });
                } catch (err) {

                }
            }
        });
    }

    //책을 다른 서재로 이동
    function moveBookToAnotherLibrary(book, newMyLibraryNo) { //book 객체 전체를 받아 전달
        const payload = {
            myLibraryBookNo : book.myLibraryBookNo,
            myLibraryNo : newMyLibraryNo
        };
        axiosInstance.patch(serverUrl + `/myLibrary/moveBooktoAnotherLibrary`, payload)
            .then(function(res){
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg,
                    icon: res.data.alertIcon
                });
                // 책 이동 후 원본 서재와 대상 서재의 책 목록을 갱신
                selectMyLibraryBooks(book.myLibraryNo); // 원본 서재 갱신
                selectMyLibraryBooks(newMyLibraryNo); // 대상 서재 갱신

                // 이동된 서재를 열린 상태로 만듭니다.
                setOpenLibraries(prevOpenLibraries => {
                    if (!prevOpenLibraries.includes(newMyLibraryNo)) {
                        return [...prevOpenLibraries, newMyLibraryNo];
                    }
                    return prevOpenLibraries;
                });
            })
            .catch(function(err){
                console.error("책 이동 실패:", err);
                Swal.fire('오류', '책 이동에 실패했습니다.', 'error');
            });
    }

    //책 이동 모달 열기
    function openMoveBookModal(book) {
        setBookToMove(book);
        setTargetLibraryNo(""); // 대상 서재 초기화
        Swal.fire({
            title: '책 이동',
            html: `
                <p><strong>'${book.bookTitle}'</strong> 책을 어느 서재로 옮기시겠습니까?</p>
                <select id="targetLibrarySelect" class="swal2-select">
                    ${myLibraryList.filter(lib => lib.myLibraryNo !== book.myLibraryNo) // 현재 책이 속한 서재는 제외
                        .map(lib => `<option value="${lib.myLibraryNo}">${lib.myLibraryName}</option>`)
                        .join('')}
                </select>
            `,
            showCancelButton: true,
            confirmButtonText: '이동',
            cancelButtonText: '취소',
            preConfirm: () => {
                const selected = document.getElementById('targetLibrarySelect').value;
                if (!selected) {
                    Swal.showValidationMessage('이동할 서재를 선택해주세요.');
                }
                return selected;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                moveBookToAnotherLibrary(book, result.value); // book 객체 전체를 전달
            }
            setBookToMove(null); //모달 닫으면 초기화
        });
    }

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
                    .then(function(res){
                        Swal.fire({
                            title: '알림',
                            text: res.data.clientMsg, 
                            icon: res.data.alertIcon
                        });
                        // 책 제거 후 해당 서재의 책 목록을 갱신
                        selectMyLibraryBooks(book.myLibraryNo);
                    })
                    .catch(function(err){
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
        </>
    )
}