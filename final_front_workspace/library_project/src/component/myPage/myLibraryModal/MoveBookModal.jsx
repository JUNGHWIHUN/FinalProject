// MoveBookModal.jsx
import { useState, useEffect } from "react";
import Modal from 'react-modal';
import createInstance from "../../../axios/Interceptor";
import Swal from "sweetalert2";

export default function MoveBookModal({
    isVisible,
    closeMoveBookModal,
    bookToMove, // 이동할 책 정보
    myLibraryList, // 내 서재 목록
    selectMyLibraryBooks, // 책 목록 갱신 함수
}) {
    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();

    const [targetLibraryNo, setTargetLibraryNo] = useState("");

    // 모달이 열릴 때마다 대상 서재 선택 초기화
    useEffect(() => {
        if (isVisible) {
            setTargetLibraryNo("");
        }
    }, [isVisible]);

    // 책을 다른 서재로 이동
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
            myLibraryCallNo : bookToMove.myLibraryCallNo
        };

        try {
            const res = await axiosInstance.patch(serverUrl + `/myLibrary/moveBooktoAnotherLibrary`, payload);
            Swal.fire({
                title: '알림',
                text: res.data.clientMsg,
                icon: res.data.alertIcon
            });
            // 책 이동 후 원본 서재와 대상 서재의 책 목록을 갱신
            selectMyLibraryBooks(bookToMove.myLibraryNo); // 원본 서재 갱신
            selectMyLibraryBooks(targetLibraryNo); // 대상 서재 갱신

            closeMoveBookModal(); // 성공 시 모달 닫기
        } catch (err) {
            console.error("책 이동 실패:", err);
            Swal.fire('오류', '책 이동에 실패했습니다.', 'error');
        }
    }

    const filteredLibraries = myLibraryList.filter(lib => lib.myLibraryNo !== bookToMove?.myLibraryNo);

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={closeMoveBookModal}
            style={customModalStyles}
            contentLabel="책 이동"
        >
            <div className="modal-body">
                {bookToMove && (
                    <p><strong>'{bookToMove.book.titleInfo}'</strong><br/> 책을 어느 서재로 옮기시겠습니까?</p>
                )}
                <select
                    id="targetLibrarySelect"
                    className="modal-select"
                    value={targetLibraryNo}
                    onChange={(e) => setTargetLibraryNo(e.target.value)}
                >
                    <option value="">-- 이동할 서재를 선택하세요 --</option>
                    {filteredLibraries.map(lib => (
                        <option key={lib.myLibraryNo} value={lib.myLibraryNo}>
                            {lib.myLibraryName}
                        </option>
                    ))}
                </select>
            </div>
            <div className="modal-actions">
                <button onClick={moveBookToAnotherLibrary} className="btn-modal-confirm">이동</button>
                <button onClick={closeMoveBookModal} className="btn-modal-cancel">취소</button>
            </div>
        </Modal>
    );
}

const customModalStyles = {
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
        maxWidth: '400px',
        width: '90%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    }
};