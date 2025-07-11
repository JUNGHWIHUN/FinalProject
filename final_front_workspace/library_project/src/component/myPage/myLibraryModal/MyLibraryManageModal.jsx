import { useEffect, useState } from "react";
import Modal from 'react-modal';
import createInstance from "../../../axios/Interceptor";
import Swal from "sweetalert2";
import MyLibraryEditModal from "./MyLibraryEditModal";
import './MyLibraryModal.css'; // 새로 생성한 통합 CSS 파일 임포트

// react-modal을 위한 커스텀 스타일 (JSX 파일 내에 유지)
const customManageModalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
        border: 'none',
        background: '#fff',
        overflow: 'visible',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '8px',
        outline: 'none',
        padding: '30px',
        maxWidth: '550px',
        width: '90%',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        maxHeight: '80vh',
    }
};

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
    
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [libraryToEdit, setLibraryToEdit] = useState(null);

    useEffect(() => {
        if (isVisible) {
            setNewLibraryName("");
        }
    }, [isVisible]);

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
            cancelButtonText: '아니오',
            customClass: {
                confirmButton: 'swal2-confirm-button-custom',
                cancelButton: 'swal2-cancel-button-custom'
            },
            buttonsStyling: false
        });

        if (confirmResult.isConfirmed) {
            try {
                const res = await axiosInstance.post(serverUrl + `/myLibrary/addNewMyLibrary`, payload);
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg,
                    icon: res.data.alertIcon
                });
                setRefreshTrigger(prev => prev + 1);
                setNewLibraryName("");
                return true;
            } catch (err) {
                console.error("서재 추가 중 오류 발생:", err);
                Swal.fire('오류', '서재 추가에 실패했습니다.', 'error');
                return false;
            }
        }
        return false;
    }

    async function updateMyLibraryName(editedName, library) {
        const payload = {
            myLibraryNo: library.myLibraryNo,
            myLibraryMemberNo: loginMember.memberNo,
            myLibraryName: editedName,
            isDefault: library.isDefault
        };

        try {
            const res = await axiosInstance.patch(serverUrl + `/myLibrary/updateMyLibraryName`, payload);
            Swal.fire({
                title: '알림',
                text: res.data.clientMsg,
                icon: res.data.alertIcon
            });
            setRefreshTrigger(prev => prev + 1);
            return true;
        } catch (err) {
            console.error("서재 이름 수정 실패:", err);
            Swal.fire('오류', '서재 이름 수정에 실패했습니다.', 'error');
            return false;
        }
    }

    function deleteMyLibrary(library) {
        Swal.fire({
            title: '서재 삭제',
            text: `'${library.myLibraryName}' 해당 서재와 서재에 담긴 모든 책을 삭제하시겠습니까?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '삭제',
            cancelButtonText: '취소',
            customClass: {
                confirmButton: 'swal2-confirm-button-custom',
                cancelButton: 'swal2-cancel-button-custom'
            },
            buttonsStyling: false
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axiosInstance.delete(serverUrl + `/myLibrary/deleteMyLibrary/${library.myLibraryNo}`);
                    Swal.fire({
                        title: '알림',
                        text: res.data.clientMsg,
                        icon: res.data.alertIcon
                    });
                    setRefreshTrigger(prev => prev + 1);
                } catch (err) {
                    console.error("서재 삭제 실패:", err);
                    Swal.fire('오류', '서재 삭제에 실패했습니다.', 'error');
                }
            }
        });
    }

    const handleAddLibrary = async () => {
        await addNewLibrary(newLibraryName);
    };

    const openEditModal = (library) => {
        setLibraryToEdit(library);
        setIsEditModalVisible(true);
    };

    const closeEditModal = () => {
        setIsEditModalVisible(false);
        setLibraryToEdit(null);
    };

    const sortedMyLibraryList = [...myLibraryList].sort((a, b) => {
        const numA = parseInt(a.myLibraryNo.split('_').pop());
        const numB = parseInt(b.myLibraryNo.split('_').pop());
        return numA - numB;
    });

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={closeManageModal}
            style={customManageModalStyles}
            contentLabel="내 서재 관리"
            ariaHideApp={false}
        >
            <div className="modal-header">
                <h2 className="modal-title">내 서재 관리</h2>
            </div>
            <div className="modal-content-area">
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
                {sortedMyLibraryList.length > 0 ? (
                    <ul className="library-list">
                        {sortedMyLibraryList.map(library => (
                            <li key={library.myLibraryNo} className="library-list-item">
                                <span className="library-name">{library.myLibraryName} {library.isDefault === 'T' ? '(기본 서재)' : ''}</span>
                                <div className="library-actions">
                                    <button
                                        className="action-button edit-button"
                                        onClick={() => openEditModal(library)}
                                        title="서재 이름 수정"
                                    >
                                        &#x2699;
                                    </button>
                                    {library.isDefault !== 'T' && (
                                        <button
                                            className="action-button delete-button"
                                            onClick={() => deleteMyLibrary(library)}
                                            title="서재 삭제"
                                        >
                                            &times;
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-library-message">등록된 서재가 없습니다. 새로운 서재를 추가해보세요.</p>
                )}
            </div>
            <div className="modal-actions">
                <button onClick={closeManageModal} className="btn-modal-cancel">닫기</button>
            </div>

            {isEditModalVisible && (
                <MyLibraryEditModal
                    isVisible={isEditModalVisible}
                    closeEditModal={closeEditModal}
                    libraryToEdit={libraryToEdit}
                    onUpdateLibraryName={updateMyLibraryName}
                />
            )}
        </Modal>
    );
}