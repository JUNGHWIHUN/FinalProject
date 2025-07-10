// MyLibraryEditModal.jsx
import { useEffect, useState } from "react";
import Modal from 'react-modal';
import Swal from "sweetalert2";

export default function MyLibraryEditModal({
    isVisible,
    closeEditModal,
    libraryToEdit, // 수정할 서재의 { myLibraryNo, myLibraryName } 정보
    onUpdateLibraryName // 이름 업데이트 요청을 보낼 콜백 함수
}) {
    const [editedName, setEditedName] = useState("");

    // 모달이 열리거나 libraryToEdit이 변경될 때마다 입력 필드를 초기화
    useEffect(() => {
        if (isVisible && libraryToEdit) {
            setEditedName(libraryToEdit.myLibraryName);
        }
    }, [isVisible, libraryToEdit]);

    const handleSubmitUpdate = async () => {
        if (!editedName.trim()) {
            Swal.fire({
                title: '알림',
                text: '서재 이름을 입력해주세요.',
                icon: 'warning',
                confirmButtonText: '확인'
            });
            return;
        }

        if (libraryToEdit.myLibraryName === editedName.trim()) {
            Swal.fire({
                title: '알림',
                text: '변경할 이름이 기존 이름과 동일합니다.',
                icon: 'info',
                confirmButtonText: '확인'
            });
            return;
        }

        // 부모 컴포넌트로부터 전달받은 업데이트 함수 호출
        const success = await onUpdateLibraryName(editedName.trim(), libraryToEdit);
        if (success) {
            closeEditModal(); // 성공 시 모달 닫기
        }
    };

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={closeEditModal}
            style={customModalStyles}
            contentLabel="서재 이름 수정"
        >
            <div className="modal-header">
                <h2>서재 이름 수정</h2>
                <button onClick={closeEditModal} className="close-button">&times;</button>
            </div>
            <div className="modal-body">
                <p>현재 서재 이름: **{libraryToEdit?.myLibraryName}**</p>
                <input
                    type="text"
                    placeholder="새로운 서재 이름을 입력해주세요."
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="modal-input"
                />
            </div>
            <div className="modal-actions">
                <button onClick={handleSubmitUpdate} className="btn-modal-confirm">수정</button>
                <button onClick={closeEditModal} className="btn-modal-cancel">취소</button>
            </div>
        </Modal>
    );
}

// SearchResultDetail의 MyLibraryModal과 동일한 스타일을 사용하거나 필요에 따라 조정합니다.
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