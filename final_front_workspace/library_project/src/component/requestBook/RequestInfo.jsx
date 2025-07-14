import {Link, useNavigate} from "react-router-dom";
import React from 'react'; // React를 명시적으로 import
import useUserStore from "../../store/useUserStore";
import Swal from "sweetalert2";


export default function RequestInfo(){

    const {isLogined, setIsLogined, loginMember, setLoginMember, setAccessToken, setRefreshToken} = useUserStore();

    const navigate = useNavigate();

    return(
        <div className="request-info-wrap"> {/* 전체 희망도서 신청 정보 컨테이너 */}
            <div className="info-section">
                <h4 className="section-title">희망도서 신청 안내</h4>
                <p className="info-text">
                    <span className="info-label">신청자격 :</span> KH공감도서관 정회원(회원증 소지자)
                </p>
                <p className="info-text">
                    <span className="info-label">신청권수 :</span> KH공감도서관 통합 1인 월 3권
                </p>
                <p className="info-text">
                    <span className="info-label">신청방법 :</span> KH공감도서관 홈페이지에서 도서 신청
                </p>
                <p className="info-text">
                    <span className="info-label">신청확인 :</span> KH공갑도서관 홈페이지 공지사항을 통해 안내
                </p>
            </div><br/>

            <div className="info-section">
                <h4 className="section-title">희망도서 처리현황 안내</h4>
                <p className="info-text">
                    <span className="info-label">신청중 :</span> 이용자가 도서관에 희망도서를 신청한 상태
                </p>
                <p className="info-text">
                    <span className="info-label">소장중 :</span> 도서가 자료실에 비치된 상태
                </p>
                <p className="info-text">
                    <span className="info-label">취소됨 :</span> 신청한 자료가 취소된 상태(취소사유 표시)
                </p>
            </div><br/>

            <div className="info-section">
                <h4 className="section-title">희망도서 제외 기준</h4>
                <p className="info-text">자관에 소장되어 있거나 구입·정리 중인 도서, 신청 중복 도서</p>
                <p className="info-text">발행 연도가 5년 이상 경과된 도서(단, 컴퓨터·과학 분야는 3년 이상 경과된 도서)</p>
                <p className="info-text">연감, 백서, 보고서, 참고도서 류</p>
                <p className="info-text">수험서, 학습서, 교재, 문제집 등(기본 개념서 제외)</p>
                <p className="info-text">심화단계의 전문서, 전공서적(대형 인터넷 서점 분야 기준)</p>
                <p className="info-text">정기간행물, 비도서자료, 외국도서</p>
                <p className="info-text">3권을 초과하는 시리즈 또는 전집도서</p>
                <p className="info-text">만화, 무협지, 로맨스, 판타지, 라이트노벨, 그래픽노블, 게임가이드북 등 각종 오락용 출판물</p>
                <p className="info-text">청소년 정서에 바람직하지 않은 영향을 줄 수 있는 선정적인 도서</p>
                <p className="info-text">전문종교자료(개인 신앙자료·연구자료 등) 및 사상·정치 목적의 자료</p>
                <p className="info-text">영리목적 또는 상업적으로 신청된 동일 출판사의 도서</p>
                <p className="info-text">미출간도서(POD)·1인 출판도서 등 입수가 어려운 도서</p>
                <p className="info-text">자료 형태가 도서관 소장도서로 부적합한 도서</p>
                <p className="info-detail">(스프링 제본, 낱장자료(리플릿), 악보, 필사책, 컬러링북, 쓰기익힘책, 팝업북 등)</p>
                <p className="info-text">기타 공공도서관에 적합하지 않은 도서(심의를 거쳐 논의할 수 있음)</p>
            </div><br/>

            <div className="info-section">
                <h4 className="section-title">유의사항</h4>
                <p className="info-text">희망도서 신청은 한달에 1권만 가능합니다.</p>
                <p className="info-text">도서관 소장여부를 먼저 확인하신 후 신청바랍니다.</p>
                <p className="info-text">신청도서의 구입은 월 2회로 매월 1일 ~ 매월 15일, 매월 16일 ~ 매월 말일까지 신청된 도서를 각각 취합하여 주문합니다.</p>
                <p className="info-text">소요시간은 신청마감 후 한 달 이내 입니다.(입고 절차에 따라 늦어 질 수 있습니다)</p>
                <p className="info-text">신청자명, 휴대폰번호, 신청도서의 서지사항(서명, 저자, 출판사, 정가(할인가 X))을 정확하게 입력바랍니다.</p>
                <p className="info-text">희망도서 도착 후 해당 도서 신청자에게 7일간 우선권이 주어지며, 신청자가 대출 권수 초과이거나 대출정지일 경우에는 우선권이 없습니다.</p>
            </div><br/>

            <div className="button-container">
                <Link
                    to={isLogined ? "/requestBook/wishBook" : '#'}
                    onClick={(e) => {
                        if (!isLogined) {
                            e.preventDefault(); // 기본 이동 막기
                            Swal.fire({
                                title : '알림',
                                text : '로그인이 필요합니다',
                                icon : 'warning',
                                confirmButtonText : '확인'
                            })
                            navigate("/login");
                        }
                    }}
                    className="request-button-link">
                    <button className="request-button">신청하기</button>
                </Link>
            </div>
        </div>
    )
}