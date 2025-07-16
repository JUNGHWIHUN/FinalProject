import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import './MyPage.css'; // MyPage.css를 임포트하여 MyInfo 관련 스타일을 정의할 예정


export default function MyInfo() {

    const [member, setMember] = useState({
        memberId: '',
        memberName: '',
        memberPw: '',
        memberAddr: '',
        memberPhone: ''
    });

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstance = createInstance();
    const { loginMember, setIsLogined, setLoginMember, setAccessToken, setRefreshToken } = useUserStore();


    // 회원 1명 조회
    useEffect(function() {
        var options = {
            url: serverUrl + "/myInfo",
            method: "get",
            params: {
                memberNo: loginMember.memberNo
            }
        };

        axiosInstance(options)
            .then(function(res) {
                console.log(res.data.resData);
                setMember(res.data.resData);
            })
            .catch(function(err) {
                console.log(err);
            });
    }, []);

    function chgMember(e) {
        var id = e.target.id;
        var value = e.target.value;
        var newMember = Object.assign({}, member);
        newMember[id] = value;
        setMember(newMember);
    }

    // 회원 정보 수정
    function updateMember() {
        Swal.fire({
            title: '알림',
            text: '회원 정보를 수정하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '수정하기',
            cancelButtonText: '취소'
        }).then(function(res) {
            if (res.isConfirmed) {
                let options = {
                    url: serverUrl + '/myInfo',
                    method: 'patch',
                    data: member
                };

                axiosInstance(options)
                    .then(function(res) {

                        Swal.fire('수정 완료', '회원 정보가 수정되었습니다.', 'success');
                    })
                    .catch(function(err) {

                        console.log(err);
                    });
            }
        });
    }

    // 정상 삭제 후, 컴포넌트 전환을 위한 네비게이션 등록
    const navigate = useNavigate();


    // 회원 정보 삭제
    function deleteMember() {
        Swal.fire({
            title: "알림",
            text: '회원을 탈퇴하시겠습니까?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '탈퇴하기',
            cancelButtonText: '취소'
        }).then(function(res) {
            if (res.isConfirmed) {
                let options = {};
                options.url = serverUrl + "/myInfo/" + loginMember.memberNo;
                options.method = "delete"

                axiosInstance(options)
                    .then(function(res) {

                        if (res.data.resData) { // DB에 정상 삭제 된 경우

                            // 스토리지 초기화
                            setIsLogined(false);
                            setLoginMember(null);
                            setAccessToken(null);
                            setRefreshToken(null);

                            delete axiosInstance.defaults.headers.common['Authorization'];


                            navigate('/'); // 로그인 컴포넌트로 전환
                        }
                    })
            }
        })
    }



    return (
        <section className="myinfo-section-wrapper"> {/* 전체 페이지 래퍼 */}
            <div className="page-title">내 정보</div> {/* 페이지 제목 */}
            <form onSubmit={function(e) {
                e.preventDefault();
                updateMember();
            }} className="myinfo-form-container"> {/* 폼 컨테이너 */}
                <div className="input-wrap"> {/* 아이디는 변경 불가하므로 별도 스타일 적용 */}
                    <div className="input-title">아이디</div>
                    <div className="input-item">
                        <input type="text" value={member.memberId} readOnly className="login-input found-id-display" />
                    </div>
                </div>

                {/* 비밀번호 수정 버튼 그룹 */}
                <div className="input-group password-change-group">
                    <button type="button" onClick={() => navigate("/mypage/pwChg")} className="btn-password-change">
                        비밀번호 수정
                    </button>
                </div>

                <div className="input-group"> {/* 이름 입력 그룹 */}
                    <label htmlFor="memberName" className="input-label">이름</label>
                    <input
                        type="text"
                        id="memberName"
                        value={member.memberName}
                        onChange={chgMember}
                        className="login-input" // Login.css의 input 스타일 활용
                    />
                </div>

                <div className="input-group"> {/* 전화번호 입력 그룹 */}
                    <label htmlFor="memberPhone" className="input-label">전화번호</label>
                    <input
                        type="text"
                        id="memberPhone"
                        value={member.memberPhone}
                        onChange={chgMember}
                        className="login-input"
                    />
                </div>

                <div className="input-group"> {/* 주소 입력 그룹 */}
                    <label htmlFor="memberAddr" className="input-label">주소</label>
                    <input
                        type="text"
                        id="memberAddr"
                        value={member.memberAddr}
                        onChange={chgMember}
                        className="login-input"
                    />
                </div>

                <div className="myinfo-button-box"> {/* 버튼 박스 */}
                    <button type="submit" className="btn-login-submit">정보수정</button> {/* 로그인 버튼 스타일 활용 */}
                    {member.isAdmin !== 'T' && (
                        <button type="button" onClick={deleteMember} className="btn-delete-member">
                            회원 탈퇴
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}