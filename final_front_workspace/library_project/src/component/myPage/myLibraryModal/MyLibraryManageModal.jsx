// MyLibraryManageModal.jsx
import { useEffect, useState } from "react";
import Modal from 'react-modal';
import createInstance from "../../../axios/Interceptor";
import Swal from "sweetalert2"; // 알림용 Swal 유지
import MyLibraryEditModal from "./MyLibraryEditModal"; // 새로 생성한 수정 모달 임포트

export default function MyLibraryManageModal({
    isVisible,
    closeManageModal,
    myLibraryList,
    loginMember,
    setRefreshTrigger
}) {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [newLibraryName, setNewLibraryName] = useState("");
    
    // 서재 이름 수정 모달 제어를 위한 상태 추가
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [libraryToEdit, setLibraryToEdit] = useState(null); // 수정할 서재 정보

    // 모달이 열릴 때마다 입력 필드 초기화
    useEffect(() => {
        if (isVisible) {
            setNewLibraryName("");
        }
    }, [isVisible]);

    // '내 서재 추가' 기능 (기존 MyLibrarySubmit의 '추가 모드' 부분만 남김)
    async function addNewLibrary(enteredName) {
        if (!enteredName.trim()) {
            Swal.fire({
                title: '알림',
                text: '서재 이름을 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return false;
        }

        const payload = {
            myLibraryMemberNo: loginMember.memberNo,
            myLibraryName: enteredName.trim(),
            isDefault: 'F'
        };

        const confirmResult = await Swal.fire({
            title: '새 서재 추가',
            text: `'${enteredName.trim()}' 서재를 새로 추가하시겠습니까?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: '예',
            cancelButtonText: '아니오'
        });

        if (confirmResult.isConfirmed) {
            try {
                const res = await axiosInstance.post(serverUrl + `/myLibrary/addNewMyLibrary`, payload);
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg,
                    icon: res.data.alertIcon
                });
                setRefreshTrigger(prev => prev + 1); // 화면 새로고침 (서재 목록 갱신)
                setNewLibraryName(""); // 입력 필드 초기화
                return true;
            } catch (err) {
                console.error("서재 추가 중 오류 발생:", err);
                Swal.fire('오류', '서재 추가에 실패했습니다.', 'error');
                return false;
            }
        }
        return false; // 취소 시
    }

    // '내 서재 이름 수정' 기능 (MyLibraryEditModal에서 호출될 콜백)
    async function updateMyLibraryName(editedName, library) {
        const payload = {
            myLibraryNo: library.myLibraryNo,
            myLibraryMemberNo: loginMember.memberNo, // 사실 이 필드는 필요 없을 수도 있지만, 기존 로직 유지
            myLibraryName: editedName,
            isDefault: library.isDefault // 기존 isDefault 값 유지
        };

        try {
            const res = await axiosInstance.patch(serverUrl + `/myLibrary/updateMyLibraryName`, payload);
            Swal.fire({
                title: '알림',
                text: res.data.clientMsg,
                icon: res.data.alertIcon
            });
            setRefreshTrigger(prev => prev + 1); // 화면 새로고침 (서재 목록 갱신)
            return true;
        } catch (err) {
            console.error("서재 이름 수정 실패:", err);
            Swal.fire('오류', '서재 이름 수정에 실패했습니다.', 'error');
            return false;
        }
    }

    // 서재 삭제 기능 (이전과 동일)
    function deleteMyLibrary(library) {
        Swal.fire({
            title: '서재 삭제',
            text: `'${library.myLibraryName}' 해당 서재와 서재에 담긴 모든 책을 삭제하시겠습니까?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosInstance.delete(serverUrl + `/myLibrary/deleteMyLibrary/${library.myLibraryNo}`);
                    Swal.fire({
                        title: '알림',
                        text: res.data.clientMsg,
                        icon: res.data.alertIcon
                    });
                    setRefreshTrigger(prev => prev + 1); // 화면 새로고침 (서재 목록 갱신)
                } catch (err) {
                    console.error("서재 삭제 실패:", err);
                    Swal.fire('오류', '서재 삭제에 실패했습니다.', 'error');
                }
            }
        });
    }

    // 새 서재 등록 버튼 클릭 핸들러
    const handleAddLibrary = async () => {
        const success = await addNewLibrary(newLibraryName);
        if (success) {
            // 새 서재 추가 후에는 manage modal을 닫지 않고 유지할 수도 있습니다.
            // closeManageModal(); // 필요에 따라 추가
        }
    };

    // 수정 모달 열기 핸들러
    const openEditModal = (library) => {
        setLibraryToEdit(library);
        setIsEditModalVisible(true);
    };

    // 수정 모달 닫기 핸들러
    const closeEditModal = () => {
        setIsEditModalVisible(false);
        setLibraryToEdit(null); // 초기화
    };

    // myLibraryList를 myLibraryNo의 숫자 부분을 기준으로 정렬 (오래된 순서대로)
    const sortedMyLibraryList = [...myLibraryList].sort((a, b) => {
        const numA = parseInt(a.myLibraryNo.split('_').pop());
        const numB = parseInt(b.myLibraryNo.split('_').pop());
        return numA - numB;
    });

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={closeManageModal}
            style={customManageModalStyles} // MyLibraryManageModal 전용 스타일 (MyLibraryEditModal과 구분)
            contentLabel="내 서재 관리"
        >
            <div className="modal-header">
                <h2>내 서재 관리</h2>
                <button onClick={closeManageModal} className="close-button">&times;</button>
            </div>
            <div className="modal-body">
                <div className="add-library-section">
                    <input
                        type="text"
                        placeholder="새로 추가할 책장명을 입력해주세요."
                        value={newLibraryName}
                        onChange={(e) => setNewLibraryName(e.target.value)}
                        className="modal-input"
                    />
                    <button onClick={handleAddLibrary} className="modal-action-button primary">
                        등록
                    </button>
                </div>
                <ul className="library-list">
                    {sortedMyLibraryList.map(library => (
                        <li key={library.myLibraryNo} className="library-list-item">
                            <span>{library.myLibraryName} {library.isDefault === 'T' ? '(기본 서재)' : ''}</span>
                            <div className="library-actions">
                                <button
                                    className="action-button edit-button"
                                    onClick={() => openEditModal(library)} // 수정 모달 열기
                                >
                                    &#x2699;
                                </button>
                                {library.isDefault !== 'T' && (
                                    <button
                                        className="action-button delete-button"
                                        onClick={() => deleteMyLibrary(library)}
                                    >
                                        &times;
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 서재 이름 수정 모달 렌더링 */}
            {isEditModalVisible && (
                <MyLibraryEditModal
                    isVisible={isEditModalVisible}
                    closeEditModal={closeEditModal}
                    libraryToEdit={libraryToEdit}
                    onUpdateLibraryName={updateMyLibraryName} // MyLibraryEditModal로 업데이트 함수 전달
                />
            )}
        </Modal>
    );
}

// MyLibraryManageModal 전용 스타일 (이름을 다르게 하여 혼동 방지)
const customManageModalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        position: 'static',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        border: '1px solid #ccc',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '8px',
        outline: 'none',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    }
};