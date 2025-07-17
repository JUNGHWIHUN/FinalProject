import { useState, useEffect } from "react";
import Modal from 'react-modal';
import createInstance from "../../../axios/Interceptor";
import Swal from "sweetalert2";
import './MyLibraryModal.css';

const customModalStyles = {
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
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    }
};

export default function MoveBookModal({
    isVisible,
    closeMoveBookModal,
    bookToMove,
    myLibraryList,
    selectMyLibraryBooks,
    openLibraries,
    setOpenLibraries
}) {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [targetLibraryNo, setTargetLibraryNo] = useState("");

    useEffect(() => {
        if (isVisible) {
            setTargetLibraryNo("");
        }
    }, [isVisible]);

    async function moveBookToAnotherLibrary() {
        if (!targetLibraryNo) {
            Swal.fire({
                title: '알림',
                text: '이동할 서재를 선택해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        if (bookToMove.myLibraryNo === targetLibraryNo) {
            Swal.fire({
                title: '알림',
                text: '현재 서재와 동일한 서재로는 이동할 수 없습니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        const payload = {
            myLibraryBookNo: bookToMove.myLibraryBookNo,
            myLibraryNo: targetLibraryNo,
            myLibraryCallNo: bookToMove.myLibraryCallNo
        };

        try {
            const res = await axiosInstance.patch(
                serverUrl + `/myLibrary/moveBooktoAnotherLibrary`,
                payload
            );

            Swal.fire({
                title: '알림',
                text: res.data.clientMsg,
                icon: res.data.alertIcon
            });

            // 책 목록 갱신
            selectMyLibraryBooks(bookToMove.myLibraryNo);
            selectMyLibraryBooks(targetLibraryNo);

            // 서재 열기 상태 갱신
            setOpenLibraries(prev => {
                const updated = new Set(prev);
                updated.add(bookToMove.myLibraryNo);
                updated.add(targetLibraryNo);
                return Array.from(updated);
            });

            closeMoveBookModal();
        } catch (err) {
            console.error("책 이동 실패:", err);
            Swal.fire('오류', '책 이동에 실패했습니다.', 'error');
        }
    }

    const filteredLibraries = myLibraryList.filter(
        lib => lib.myLibraryNo !== bookToMove?.myLibraryNo
    );

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={closeMoveBookModal}
            style={customModalStyles}
            contentLabel="책 이동"
            ariaHideApp={false}
        >
            <div className="modal-header">
                <h2 className="modal-title">책 이동</h2>
            </div>

            <div className="modal-content-area">
                {bookToMove && (
                    <p className="modal-message">
                        <strong>'{bookToMove.book.titleInfo}'</strong><br />
                        책을 어느 서재로 옮기시겠습니까?
                    </p>
                )}
                <select
                    id="targetLibrarySelect"
                    className="modal-select"
                    value={targetLibraryNo}
                    onChange={(e) => setTargetLibraryNo(e.target.value)}
                >
                    <option value="">-- 이동할 서재를 선택하세요 --</option>
                    {filteredLibraries.length > 0 ? (
                        filteredLibraries.map(lib => (
                            <option key={lib.myLibraryNo} value={lib.myLibraryNo}>
                                {lib.myLibraryName}
                            </option>
                        ))
                    ) : (
                        <option value="" disabled>이동할 다른 서재가 없습니다.</option>
                    )}
                </select>
            </div>

            <div className="modal-actions">
                <button
                    onClick={moveBookToAnotherLibrary}
                    className="btn-modal-confirm"
                >
                    이동
                </button>
                <button
                    onClick={closeMoveBookModal}
                    className="btn-modal-cancel"
                >
                    취소
                </button>
            </div>
        </Modal>
    );
}
