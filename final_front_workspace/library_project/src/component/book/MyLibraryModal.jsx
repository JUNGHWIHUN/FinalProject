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
            isOpen={isVisible}             // 모달 표시 여부 (isVisible prop 사용)
            onRequestClose={closeMyLibraryModal}    // 배경 클릭 또는 ESC 키 눌렀을 때 닫는 함수
            style={customModalStyles}                // 커스텀 스타일 적용 (예시)
            contentLabel="내 서재에 도서 등록"        // 접근성을 위한 레이블
            ariaHideApp={false} // 이 줄을 추가하여 "Please ensure that the element that the Modal is rendered into is not hidden from screenreaders!" 경고를 제거할 수 있습니다.
        >
            {/* 모달 내부에 렌더링될 내용 */}
            <div className="modal-header">
                <h2 className="modal-title">내 서재에 등록</h2>
            </div>
            <div className="modal-content-area">
                <label htmlFor="librarySelect" className="modal-label">
                    등록할 서재 선택:
                </label>
                <select 
                    id="librarySelect" 
                    value={selectedMyLibrary} 
                    onChange={librarySelect}
                    className="modal-select"
                >
                    {/* myLibraryList 상태를 사용하여 옵션 렌더링*/}
                    {myLibraryList.length > 0 ? (
                        myLibraryList.map(item => (
                            <option key={item.myLibraryNo} value={item.myLibraryNo}>
                                {item.myLibraryName}
                            </option>
                        ))
                    ) : (
                        <option value="">등록된 서재가 없습니다.</option>
                    )}
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
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // 배경을 더 어둡게
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
        border: 'none', // 테두리 제거 (shadow로 대체)
        background: '#fff',
        overflow: 'visible', // 스크롤바가 필요 없도록 변경
        WebkitOverflowScrolling: 'touch',
        borderRadius: '8px',
        outline: 'none',
        padding: '30px',
        maxWidth: '450px', // 최대 너비를 약간 늘림
        width: '90%',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)', // 그림자 강화
        display: 'flex', // 내부 요소들을 flex로 정렬
        flexDirection: 'column', // 세로 정렬
        gap: '20px', // 요소들 간의 간격 추가
    }
};