import { useEffect, useState } from "react";
import Modal from 'react-modal'; // 팝업창 생성을 위한 react-modal 임포트
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";

export default function MyLibraryModal ({isVisible, closeMyLibraryModal, addToMyLibrary, callNo }){

    const serverUrl = import.meta.env.VITE_BACK_SERVER; 
    const axiosInstance = createInstance();
    const {isLogined, loginMember} = useUserStore();

    // 내 서재 목록 리스트를 DB에서 받아와 저장
    const [myLibraryList, setMyLibraryList] = useState([]); 
    const [selectedMyLibrary, setSelectedMyLibrary] = useState(""); //선택된 내 서재의 myLibraryNo

    useEffect(() => {

        if(!isLogined){
            return;
        }

        axiosInstance.get(serverUrl + `/myLibrary/selectMyLibrary/${loginMember.memberNo}`)
            .then(function(res){
                setMyLibraryList(res.data.resData);

                // 서재 목록 로드 후 첫 번째 서재를 기본 선택 (선택 사항)
                if (res.data.resData.length > 0) {
                    setSelectedMyLibrary(res.data.resData[0].myLibraryNo);
                }
            })
            .catch(function(err){

            });

    }, [isVisible, isLogined, loginMember?.memberNo]);    //창이 새로 열릴 때마다 한번씩 리렌더링


    //드롭다운 선택 변경 핸들러
    const librarySelect = (e) => {
        setSelectedMyLibrary(e.target.value);
    };

    //'등록' 버튼 클릭 핸들러
    const submitToMyLibrary = () => {

        //부모 컴포넌트로 선택된 서재 ID와 책 정보를 전달
        addToMyLibrary(selectedMyLibrary, callNo);
    };

    return (
        //react-modal 컴포넌트 사용
        <Modal
            isOpen={isVisible}                      // 모달 표시 여부 (isVisible prop 사용)
            onRequestClose={closeMyLibraryModal}    // 배경 클릭 또는 ESC 키 눌렀을 때 닫는 함수
            style={customModalStyles}               // 커스텀 스타일 적용 (예시)
            contentLabel="내 서재에 도서 등록"        // 접근성을 위한 레이블
        >
            {/* 모달 내부에 렌더링될 내용 */}
            <div className="modal-content">
                <label htmlFor="librarySelect" className="modal-label">
                    등록할 서재 선택:
                </label>
                <select 
                    id="librarySelect" 
                    value={selectedMyLibrary} 
                    onChange={librarySelect}
                    className="modal-select"
                >
                    <option value="">-- 서재 종류를 선택하세요 --</option>
                    {/* myLibraryList 상태를 사용하여 옵션 렌더링*/}
                    {myLibraryList.map(item => (
                            <option key={item.myLibraryNo} value={item.myLibraryNo}>
                                {item.myLibraryName}
                            </option>
                    ))}
                </select>
            </div>

            <div className="modal-actions">
                <button onClick={submitToMyLibrary} className="btn-modal-confirm">등록</button>
                <button onClick={closeMyLibraryModal} className="btn-modal-cancel">취소</button>
            </div>
        </Modal>
    );
}

// react-modal을 위한 커스텀 스타일 (예시)
const customModalStyles = {
    overlay: { // 모달 배경 스타일
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: { // 모달 내용 컨테이너 스타일
        position: 'static', // Portal로 인해 static으로 설정하여 flex 중앙 정렬에 따르도록
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
    }
};