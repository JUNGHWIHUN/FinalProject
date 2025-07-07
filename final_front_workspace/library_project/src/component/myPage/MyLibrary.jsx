
import { use, useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";

//마이페이지 하위의 '내 서재' 기능 컴포넌트
export default function MyLibrary(){

    //백엔드 서버 URL
    const serverUrl = import.meta.env.VITE_BACK_SERVER;

    //커스텀 axios
    const axiosInstance = createInstance();

    //로그인한 회원 정보
    const {isLogined, loginMember} = useUserStore();

    //화면 새로고침용 변수
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    //내 서재 추가/수정시 이름 입력값 저장 변수
    const [name, setName] = useState("");

    //수정 모드일 경우에 서재 정보 저장 (null이면 추가 모드)
    const [updateLibraryName, setUpdateLibraryName] = useState(null); // { myLibraryNo, myLibraryName }

    // 내 서재 목록 리스트를 DB에서 받아와 저장
    const [myLibraryList, setMyLibraryList] = useState([]);
    const [selectedMyLibrary, setSelectedMyLibrary] = useState(""); //선택된 내 서재의 myLibraryNo

    // 선택된 서재에 담긴 책 목록 (추후 구현될 부분)
    const [booksInSelectedLibrary, setBooksInSelectedLibrary] = useState([]);

    // 책 이동을 위한 상태
    const [bookToMove, setBookToMove] = useState(null); // 이동할 책 정보 { myLibraryBookNo, myLibraryCallNo }
    const [targetLibraryNo, setTargetLibraryNo] = useState(""); // 책을 이동시킬 대상 서재 myLibraryNo

    useEffect(() => {
        if (isLogined && loginMember?.memberNo) {
            axiosInstance.get(serverUrl + `/myLibrary/selectMyLibrary/${loginMember.memberNo}`)
                .then(function(res){
                    setMyLibraryList(res.data.resData);
                    //기본 서재 선택 목록 로드 후 첫 번째 서재 또는 기본 서재)
                    if (res.data.resData.length > 0 && !selectedMyLibrary) {
                        const defaultLib = res.data.resData.find(lib => lib.isDefault === 'T');
                        setSelectedMyLibrary(defaultLib ? defaultLib.myLibraryNo : res.data.resData[0].myLibraryNo);
                    }
                })
                .catch(function(err){
                    console.error("내 서재 목록 불러오기 실패:", err);
                    Swal.fire('오류', '내 서재 목록을 불러오는데 실패했습니다.', 'error');
                });
        }
    }, [isLogined, loginMember?.memberNo, refreshTrigger]);

    // 선택된 서재에 담긴 책 목록 불러오기 (selectedMyLibrary 변경 시마다 호출)
    useEffect(() => {
        if (selectedMyLibrary) {
            axiosInstance.get(serverUrl + `/myLibrary/selectMyLibraryBooks/${selectedMyLibrary}`)
                .then(function(res){
                    setBooksInSelectedLibrary(res.data.resData);
                })
                .catch(function(err){

                });
        } else {

        }
    }, [selectedMyLibrary, refreshTrigger]); // refreshTrigger 추가하여 책 이동 후 목록 갱신

    //'내 서재 추가' 또는 '내 서재 이름 수정' 기능
    function handleLibrarySubmit(){
        if (!name.trim()) {
            Swal.fire('경고', '서재 이름을 입력해주세요.', 'warning');
            return;
        }

        const payload = {
            myLibraryNo : "",
            myLibraryMemberNo: loginMember.memberNo,
            myLibraryName: name.trim(),
            isDefault: 'F' // 새로 추가하는 서재는 기본적으로 'F'
        };

        if (updateLibraryName) { // 수정 모드
            payload.myLibraryNo = updateLibraryName.myLibraryNo;
            Swal.fire({
                title: '서재 이름 수정',
                text: `'${updateLibraryName.myLibraryName}' 서재를 '${name.trim()}'(으)로 변경하시겠습니까?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '예',
                cancelButtonText: '아니오'
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosInstance.patch(serverUrl + `/myLibrary/updateMyLibraryName`, payload)
                        .then(function(res){
                            Swal.fire('성공', '서재 이름이 성공적으로 변경되었습니다.', 'success');
                            setName("");
                            setUpdateLibraryName(null);
                            setRefreshTrigger(prev => prev + 1); // 화면 새로고침
                        })
                        .catch(function(err){
                            console.error("서재 이름 수정 실패:", err);
                            Swal.fire('오류', '서재 이름 변경에 실패했습니다.', 'error');
                        });
                }
            });
        } else { // 추가 모드
            Swal.fire({
                title: '새 서재 추가',
                text: `'${name.trim()}' 서재를 새로 추가하시겠습니까?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '예',
                cancelButtonText: '아니오'
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosInstance.post(serverUrl + `/myLibrary/addNewMyLibrary`, payload)
                        .then(function(res){
                            Swal.fire('성공', '새 서재가 성공적으로 추가되었습니다.', 'success');
                            setName("");
                            setRefreshTrigger(prev => prev + 1); // 화면 새로고침
                        })
                        .catch(function(err){
                            console.error("새 서재 추가 실패:", err);
                            Swal.fire('오류', '새 서재 추가에 실패했습니다.', 'error');
                        });
                }
            });
        }
    }

    // 서재 이름 수정 모드 활성화
    function enableUpdateMode(library) {
        setName(library.myLibraryName);
        setUpdateLibraryName(library);
    }

    // 서재 삭제 기능
    function deleteMyLibrary(library) {
        if (library.isDefault === 'T') {
            Swal.fire('알림', '기본 서재는 삭제할 수 없습니다.', 'info');
            return;
        }

        Swal.fire({
            title: '서재 삭제',
            text: `'${library.myLibraryName}' 서재와 이 서재에 담긴 모든 책을 정말로 삭제하시겠습니까?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(serverUrl + `/myLibrary/deleteMyLibrary/${library.myLibraryNo}`)
                    .then(function(res){
                        Swal.fire('삭제 완료', '서재가 성공적으로 삭제되었습니다.', 'success');
                        setRefreshTrigger(prev => prev + 1); // 화면 새로고침
                        setSelectedMyLibrary(""); // 삭제된 서재가 선택되어 있다면 선택 해제
                    })
                    .catch(function(err){
                        console.error("서재 삭제 실패:", err);
                        Swal.fire('오류', '서재 삭제에 실패했습니다.', 'error');
                    });
            }
        });
    }

    // 책 이동 모달 열기
    function openMoveBookModal(book) {
        setBookToMove(book);
        setTargetLibraryNo(""); // 대상 서재 초기화
        // 모달을 열기 위한 로직 (예: useState를 사용하여 모달 가시성 제어)
        Swal.fire({
            title: '책 이동',
            html: `
                <p><strong>'${book.myLibraryCallNo}'</strong> 책을 어느 서재로 옮기시겠습니까?</p>
                <select id="targetLibrarySelect" class="swal2-select">
                    ${myLibraryList.filter(lib => lib.myLibraryNo !== selectedMyLibrary) // 현재 서재는 제외
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
                moveBookToAnotherLibrary(book.myLibraryBookNo, result.value);
            }
            setBookToMove(null); // 모달 닫으면 초기화
        });
    }

    // 책을 다른 서재로 이동
    function moveBookToAnotherLibrary(myLibraryBookNo, newMyLibraryNo) {
        const payload = {
            myLibraryBookNo: myLibraryBookNo,
            newMyLibraryNo: newMyLibraryNo
        };
        axiosInstance.put(serverUrl + `/myLibrary/moveBook`, payload)
            .then(function(res){
                Swal.fire('이동 완료', '책이 성공적으로 이동되었습니다.', 'success');
                setRefreshTrigger(prev => prev + 1); // 화면 새로고침하여 책 목록 갱신
            })
            .catch(function(err){
                console.error("책 이동 실패:", err);
                Swal.fire('오류', '책 이동에 실패했습니다.', 'error');
            });
    }


    return (
        <>
            <h1>내 서재</h1>
            <hr/>

            {/* 내 서재 추가/수정 폼 */}
            <div>
                <h2>{updateLibraryName ? '서재 이름 수정' : '새 서재 추가'}</h2>
                <input
                    type="text"
                    placeholder="서재 이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleLibrarySubmit}>
                    {updateLibraryName ? '수정' : '추가'}
                </button>
                {updateLibraryName && (
                    <button onClick={() => {setName(""); setUpdateLibraryName(null);}}>취소</button>
                )}
            </div>

            <hr/>

            {/* 내 서재 목록 */}
            <div>
                <h2>내 서재 목록</h2>
                {myLibraryList.length === 0 ? (
                    <p>내 서재가 없습니다. 새로운 서재를 추가해보세요!</p>
                ) : (
                    <ul>
                        {myLibraryList.map((library) => (
                            <li key={library.myLibraryNo} style={{ fontWeight: selectedMyLibrary === library.myLibraryNo ? 'bold' : 'normal' }}>
                                <span onClick={() => setSelectedMyLibrary(library.myLibraryNo)} style={{cursor: 'pointer'}}>
                                    {library.myLibraryName} {library.isDefault === 'T' && '(기본 서재)'}
                                </span>
                                <button onClick={() => enableUpdateMode(library)}>이름 수정</button>
                                <button onClick={() => deleteMyLibrary(library)}>삭제</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <hr/>

            {/* 선택된 서재에 담긴 책 목록 */}
            <div>
                <h2>'{myLibraryList.find(lib => lib.myLibraryNo === selectedMyLibrary)?.myLibraryName || '서재를 선택하세요'}'의 책 목록</h2>
                {selectedMyLibrary ? (
                    booksInSelectedLibrary.length === 0 ? (
                        <p>이 서재에는 책이 없습니다.</p>
                    ) : (
                        <ul>
                            {booksInSelectedLibrary.map((book) => (
                                <li key={book.myLibraryBookNo}>
                                    {book.myLibraryCallNo} - {book.bookTitle} (등록일: {new Date(book.registeredDate).toLocaleDateString()})
                                    <button onClick={() => openMoveBookModal(book)}>다른 서재로 이동</button>
                                </li>
                            ))}
                        </ul>
                    )
                ) : (
                    <p>서재를 선택하면 해당 서재에 담긴 책 목록이 표시됩니다.</p>
                )}
            </div>
        </>

    )
}