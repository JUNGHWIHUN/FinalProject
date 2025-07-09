// src/components/MyLibrary/ManageLibraryModalContent.jsx (경로를 적절히 조정하세요)
import React, { useState } from 'react';
import Swal from 'sweetalert2'; // Swal을 여기서도 사용할 수 있도록 임포트

export default function ManageLibraryModalContent({
    myLibraryList,
    MyLibrarySubmit,
    enableUpdateMode,
    deleteMyLibrary,
    onCloseModal // 모달 닫기 콜백 추가
}) {
    const [newLibraryName, setNewLibraryName] = useState('');

    // 새 서재 등록 버튼 핸들러
    const handleAddLibrary = async () => {
        const success = await MyLibrarySubmit(newLibraryName, null);
        if (success) {
            Swal.close(); // 성공 시 Swal 닫기
            onCloseModal(); // 모달 닫기 완료 후 추가 동작 (새로고침 등)
        }
    };

    // 수정 버튼 핸들러
    const handleEditClick = (library) => {
        onCloseModal(); // 현재 모달을 먼저 닫고
        enableUpdateMode(library); // 수정 모달을 띄움
    };

    // 삭제 버튼 핸들러
    const handleDeleteClick = (library) => {
        onCloseModal(); // 현재 모달을 먼저 닫고
        deleteMyLibrary(library); // 삭제 확인 모달을 띄움
    };

    return (
        <div>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                    id="swal-input-new-library-name" // ID는 유지 (다른 곳에서 참조할 수 있으므로)
                    className="swal2-input"
                    placeholder="새로 추가할 책장명을 입력해주세요."
                    value={newLibraryName}
                    onChange={(e) => setNewLibraryName(e.target.value)}
                    style={{ flexGrow: 1 }} // Input이 남은 공간을 채우도록
                />
                <button id="swal-add-button" className="swal2-confirm swal2-styled" onClick={handleAddLibrary}>
                    등록
                </button>
            </div>
            <ul id="swal-library-list" style={{ listStyle: 'none', padding: '0', textAlign: 'left' }}>
                {myLibraryList.length === 0 ? (
                    <li style={{ textAlign: 'center', padding: '10px' }}>등록된 서재가 없습니다.</li>
                ) : (
                    myLibraryList.map((library) => (
                        <li
                            key={library.myLibraryNo}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '8px 0',
                                borderBottom: '1px solid #eee',
                            }}
                        >
                            <span>
                                {library.myLibraryName} {library.isDefault === 'T' ? '(기본 서재)' : ''}
                            </span>
                            <div>
                                <button
                                    className="swal-edit-button"
                                    onClick={() => handleEditClick(library)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '1.2em',
                                        cursor: 'pointer',
                                        marginRight: '5px',
                                        color: '#666',
                                    }}
                                >
                                    &#x2699; {/* 기어 아이콘 */}
                                </button>
                                {library.isDefault !== 'T' && (
                                    <button
                                        className="swal-delete-button"
                                        onClick={() => handleDeleteClick(library)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            fontSize: '1.2em',
                                            cursor: 'pointer',
                                            color: '#d9534f',
                                        }}
                                    >
                                        &times; {/* X 아이콘 */}
                                    </button>
                                )}
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}