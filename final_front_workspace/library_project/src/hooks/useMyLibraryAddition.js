import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';


//Modal 을 사용하기 위해 새롭게 생성한 커스텀 훅
export default function useMyLibraryAddition(axiosInstance, serverUrl, isLogined, loginMember, callNo) {
    const navigate = useNavigate();
    const location = useLocation();

    //모달 표시 여부 상태 (변동 없음)
    const [isVisible, setIsVisible] = useState(false);

    // 로그인 체크 함수 (변동 없음)
    const isLoginedCheck = () => {
        if (!isLogined) {
            Swal.fire({
                title: '알림',
                text: '로그인이 필요한 서비스입니다.',
                icon: 'warning',
                confirmButtonText: '확인'
            }).then(() => {
                navigate('/login', { state: { from: location.pathname } });
            });
            return false;
        }
        return true;
    };

    // '내 서재에 등록' 버튼 클릭 핸들러 (모달을 띄우는 함수)
    const openMyLibraryModal = (event, callNo) => { //해당 함수를 최우선으로 작동하도록
        if (event && typeof event.stopPropagation === 'function') {
            event.stopPropagation(); 
        }

        //로그인 여부 확인
        if (!isLoginedCheck()) { 
            return;
        }
    
        setIsVisible(true); 
    };  

    // 모달을 닫는 함수 (변동 없음)
    const closeMyLibraryModal = () => {
        setIsVisible(false); 
    };

    // 모달 내에서 '확인' 버튼 클릭 시 호출될 함수: 실제 내 서재에 해당 도서를 등록하는 로직
    const addToMyLibrary = (selectedMyLibrary, callNo) => { //선택된 내 서재의 myLibraryNo 와 책의 청구기호
        const postData = {
            myLibraryNo: selectedMyLibrary, 
            myLibraryCallNo: callNo
        };

        axiosInstance.post(serverUrl + `/myLibrary/addToMyLibrary`, postData)
            .then(function(res){
                Swal.fire({
                    title: '알림',
                    text: res.data.clientMsg, 
                    icon: res.data.alertIcon, 
                    confirmButtonText: '확인'
                })
            })
            .catch(function(err){

            });

        // 등록 성공/실패 알림 (Swal) 후 모달 닫기
        closeMyLibraryModal(); 
    };

    return {
        isVisible,
        openMyLibraryModal,
        closeMyLibraryModal,
        addToMyLibrary,
    };
}