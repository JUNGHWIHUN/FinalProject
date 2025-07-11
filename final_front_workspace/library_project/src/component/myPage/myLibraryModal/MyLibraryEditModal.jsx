import { useEffect, useState } from "react";
import Modal from 'react-modal';
import Swal from "sweetalert2";
import './MyLibraryModal.css'; // 새로 생성한 통합 CSS 파일 임포트

// react-modal을 위한 커스텀 스타일 (JSX 파일 내에 유지)
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

export default function MyLibraryEditModal({
    isVisible,
    closeEditModal,
    libraryToEdit, // 수정할 서재의 { myLibraryNo, myLibraryName } 정보
    onUpdateLibraryName // 이름 업데이트 요청을 보낼 콜백 함수
}) {
    const [editedName, setEditedName] = useState("");

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

        const success = await onUpdateLibraryName(editedName.trim(), libraryToEdit);
        if (success) {
            closeEditModal();
        }
    };

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={closeEditModal}
            style={customModalStyles}
            contentLabel="서재 이름 수정"
            ariaHideApp={false}
        >
            <div className="modal-header">
                <h2 className="modal-title">서재 이름 수정</h2>
            </div>
            <div className="modal-content-area">
                <p className="modal-message">현재 서재 이름: <strong>{libraryToEdit?.myLibraryName}</strong></p>
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