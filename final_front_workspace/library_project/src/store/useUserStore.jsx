import {create} from 'zustand';
//로그인 정보가 RAM 에 저장되어 있기 때문에, 휘발되지 않도록 하기 위한 조치
import {persist} from 'zustand/middleware'

/*
isLogined : 로그인 여부 (boolean)
loginMember : 로그인 회원 정보
accessToken : 로그인 이후 요청시마다 헤더에 포함될 토큰
refreshToken : accessToken 만료 시 재발급 할 때 필요한 토큰
*/

const useUserStore = create(
    persist (
        (set) => ({
            isLogined : false,
            setIsLogined : function(loginChk){
                set({
                    isLogined : loginChk
                })
            },
            loginMember : null,
            setLoginMember : function(memberObj){
                set({
                    loginMember : memberObj
                })
            },
            accessToken : null,
            setAccessToken : function(accessToken){
                set({
                    accessToken : accessToken
                })
            },
            refreshToken : null,
            setRefreshToken : function(refreshToken){
                set({
                    refreshToken : refreshToken
                })
            }
        })
    )
);

export default useUserStore;