import { useEffect, useState } from "react";
import createInstance from "../../axios/Interceptor";
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

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
    const {loginMember, setIsLogined, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();


    //회원 1명조회
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

    //회원 정보 수정
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

    //정상 삭제 후, 컴포넌트 전화을 위한 네비게이션 등록
    const navigate = useNavigate();


    //회원 정보 삭제
    function deleteMember(){
        Swal.fire({
            title : "알림",
            text : '회원을 탈퇴하시겠습니까?',
            icon : 'warning',
            showCancelButton : true,
            confirmButtonText : '탈퇴하기',
            cancelButtonText : '취소'
        }).then(function(res){
            if(res.isConfirmed){
                let options = {};
                options.url = serverUrl + "/myInfo/" + loginMember.memberNo;
                options.method = "delete"

                axiosInstance(options)
                .then(function(res){

                    if(res.data.resData){   //DB에 정상 삭제 된 경우

                        //스토리지 초기화
                        setIsLogined(false);
                        setLoginMember(null);
                        setAccessToken(null);
                        setRefreshToken(null);

                        delete axiosInstance.defaults.headers.common['Authorization'];


                        navigate('/login'); //로그인 컴포넌트로 전환
                    }
                })
            }
        })
    }

   

    return (
        <section>
            <div>내 정보</div>
            <form onSubmit={function(e){
                e.preventDefault();
                updateMember();
            }}>
                <table>
                    <tbody>
                        <tr>
                            <th>아이디</th>
                            <td>{member.memberId}</td>
                        </tr>
                        <tr>
                            <th><label htmlFor="memberName">이름</label></th>
                            <td>
                                <input
                                    type="text"
                                    id="memberName"
                                    value={member.memberName}
                                    onChange={chgMember}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th colSpan="2" style={{ textAlign: "right" }}>
                                비밀번호
                                <button type="button" onClick={() => navigate("/myPage/pwChg")}>
                                비밀번호 변경
                                </button>
                            </th>
                        </tr>
                        <tr>
                            <th><label htmlFor="memberPhone">전화번호</label></th>
                            <td>
                                <input
                                    type="text"
                                    id="memberPhone"
                                    value={member.memberPhone}
                                    onChange={chgMember}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th><label htmlFor="memberAddr">주소</label></th>
                            <td>
                                <input
                                    type="text"
                                    id="memberAddr"
                                    value={member.memberAddr}
                                    onChange={chgMember}
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <button type="submit">정보수정</button>
                <button type="button" onClick={deleteMember}>회원 탈퇴</button>
            </form>
        </section>
    );
}
