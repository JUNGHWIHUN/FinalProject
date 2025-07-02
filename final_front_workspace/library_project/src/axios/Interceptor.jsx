import axios from "axios";
import useUserStore from "../store/useUserStore";
import Swal from "sweetalert2";
import { customHistory } from "../common/history";

// 각 컴포넌트에서 axios를 사용할 때 공통된 부분을 하나로 합쳐 코딩을 수월하게 만들기 위한 함수 (컴포넌트가 아님)
// axios의 기본값이 아닌, 여기서 커스터마이징된 대로 axios를 사용할 수 있도록 만듭니다.

// 외부 컴포넌트에서 서버 요청 시 사용할 axios 인스턴스 생성 함수
export default function createInstance() {
    const instance = axios.create(); // 새로운 axios 인스턴스 생성
    return setInterceptors(instance); // 생성된 인스턴스에 인터셉터 설정 후 반환
}

// axios 인스턴스에 인터셉터 설정 (요청/응답 가로채기)
function setInterceptors(instance) {

    // 요청 인터셉터: 클라이언트 → 서버 요청 시 요청 객체를 가로채어 처리
    instance.interceptors.request.use(
        function(config) { // 요청이 정상적으로 구성된 경우
            // 스토리지에 저장된 accessToken 추출.
            // 인터셉터는 컴포넌트가 아니므로, useUserStore.getState()를 통해 직접 상태를 가져와야 합니다.
            const accessToken = useUserStore.getState().accessToken; 

            // 스토리지에 accessToken이 존재하면 요청 헤더에 Authorization 필드로 포함시킵니다.
            if(accessToken != null){
                config.headers['Authorization'] = accessToken;
            }

            return config; // 수정된 요청 설정 반환
        },
        function(error) { // 요청 구성 중 오류가 발생한 경우
            return Promise.reject(error); // Promise.reject로 오류 전달
        },
    );
    
    // 응답 인터셉터: 서버 → 클라이언트 응답 시 응답 객체를 가로채어 처리
    instance.interceptors.response.use(
        function(response) { // 서버 응답이 정상적으로 도착한 경우 
            
            // 서버에서 HttpStatus.OK로 응답되었고, 알림창에 띄워줄 메시지가 응답된 경우
            if(response.data.clientMsg !== undefined && response.data.clientMsg !== ''){
                Swal.fire({
                    title : '알림',
                    text : response.data.clientMsg,
                    icon : response.data.alertIcon
                });
            }

            return response; // 정상 응답 반환
        },
        function(error) {  // 응답 처리 중 오류가 발생한 경우 (ResponseDTO.HttpStatus: 4xx, 5xx 등)

            const originalRequest = error.config; // 기존 요청 정보를 담고 있는 객체
            
            // HTTP 상태 코드가 403 (Forbidden)인 경우: 토큰 유효시간 만료 처리
            // accessToken이 만료되었을 때와 refreshToken이 만료되었을 때 모두 403으로 응답될 수 있으므로 구분 필요
            if(error.response.status === 403){ 
                // 응답 코드가 403이면서, 헤더에 refreshToken이 포함되지 않았고, 재요청이 아닌 경우 (accessToken이 만료된 경우)
                if(originalRequest.headers.refreshToken === undefined && !originalRequest._retry) { 
                    originalRequest._retry = true; // 무한 루프 방지를 위해 재요청 플래그 설정

                    // 스토리지에 저장되어 있는 회원 정보와 refreshToken 데이터 추출
                    const loginMember = useUserStore.getState().loginMember;
                    const refreshToken = useUserStore.getState().refreshToken;

                    let options = {};
                    options.url = import.meta.env.VITE_BACK_SERVER + '/member/refresh';
                    options.method = 'post';
                    options.data = loginMember;
                    options.headers = {};
                    options.headers.refreshToken = refreshToken; // 헤더에 refreshToken을 포함시켜 accessToken 재발급 요청

                    // 새로운 accessToken을 얻기 위해 재발급 요청을 보냅니다.
                    return instance(options)
                        .then(function(res){
                            if(res.data.resData != null){
                                const reAccessToken = res.data.resData; // 재발급된 accessToken

                                // 스토리지에 재발급된 accessToken 재할당
                                useUserStore.getState().setAccessToken(reAccessToken);

                                // 기존 요청 헤더에 재발급된 accessToken 할당 후 재요청
                                originalRequest.headers['Authorization'] = reAccessToken;
                                
                                // 토큰 재발급 이후, 기존 요청을 다시 서버에 보냅니다.
                                return instance(originalRequest);
                            }
                            return Promise.reject(error); // 재발급 실패 시 기존 오류 반환
                        })
                        .catch(function(err){
                            // refreshToken 재발급 요청 중 오류 발생 시, 로그인 페이지로 리다이렉트
                            Swal.fire({
                                title : '알림',
                                text : '로그인 기간이 만료되었습니다. 다시 로그인 하세요.',
                                icon : 'warning',
                                confirmButtonText : '확인'
                            }).then(function(result){
                                if(result.isConfirmed){
                                    // 로그인 만료 처리: 스토리지 정보 초기화 및 로그인 컴포넌트로 전환
                                    useUserStore.getState().setIsLogined(false);
                                    useUserStore.getState().setAccessToken(null);
                                    useUserStore.getState().setRefreshToken(null);

                                    // 인터셉터는 컴포넌트 외부에 존재하므로 React Hook (navigate)을 직접 사용할 수 없습니다.
                                    // 외부에서 브라우저 주소창을 JavaScript로 변경할 수 있게 해주는 history 도구를 사용해야 합니다.
                                    // history 도구를 이용하여 브라우저 주소창을 변경하면, 라우터가 이를 감지하고 path가 일치하는 컴포넌트로 전환(렌더링)합니다.
                                    customHistory.push('/login');
                                }
                            });
                            return Promise.reject(err);
                        });
                } else { // 서버 응답 코드가 403인데, refreshToken이 이미 포함되어 있거나 이미 재요청된 경우 (refreshToken도 만료된 경우)
                    Swal.fire({
                        title : '알림',
                        text : '로그인 기간이 만료되었습니다. 다시 로그인 하세요.',
                        icon : 'warning',
                        confirmButtonText : '확인'
                    }).then(function(result){
                        if(result.isConfirmed){
                            // 로그인 만료 처리: 스토리지 정보 초기화 및 로그인 컴포넌트로 전환
                            useUserStore.getState().setIsLogined(false);
                            useUserStore.getState().setAccessToken(null);
                            useUserStore.getState().setRefreshToken(null);
                            customHistory.push('/login');
                        }
                    });
                }

            } else if(error.response.status === 401){ // HTTP 상태 코드가 401 (Unauthorized)인 경우: 발급 토큰과 헤더에 포함된 토큰이 다른 경우 (비인가 접근)
                // 필요에 따라 사용자에게 알림 또는 추가 처리 로직을 구현합니다.
                Swal.fire({
                    title : '알림',
                    text : '인증되지 않은 접근입니다. 다시 로그인 해주세요.',
                    icon : 'error',
                    confirmButtonText : '확인'
                }).then(() => {
                    useUserStore.getState().setIsLogined(false);
                    useUserStore.getState().setAccessToken(null);
                    useUserStore.getState().setRefreshToken(null);
                    customHistory.push('/login');
                });
            } else { // 그 외의 오류 (예: HttpStatus.INTERNAL_SERVER_ERROR == 500, 서버 오류 등)
                const res = error.response.data; // 백엔드에서 응답한 ResponseDTO 객체
                Swal.fire({
                    title : "알림",
                    text : res.clientMsg,
                    icon : res.alertIcon
                });
            }

            return Promise.reject(error); // 오류를 호출자에게 전달
        },
    );

    return instance; // 인터셉터가 설정된 axios 인스턴스 반환
}