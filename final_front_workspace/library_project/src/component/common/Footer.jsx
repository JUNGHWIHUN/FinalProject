import React from 'react';
import './Common.css'; // Footer 전용 CSS 파일 임포트

export default function Footer(){

    return (
        <footer>
            <div className="footer-content-wrap">
                <div className="footer-links">
                    <span>개인정보처리방침</span>
                    <span className="divider">|</span>
                    <span>KH공감도서관 윤리강령</span> {/* 스크린샷에 맞춰 텍스트 변경 */}
                    <span className="divider">|</span>
                    <span>도서관법령</span> {/* 스크린샷에 맞춰 텍스트 변경 */}
                    <span className="divider">|</span>
                    <span>저작권정책</span>
                </div>
                <div className="footer-info">
                    {/* 스크린샷에 보이는 책 아이콘과 작은 'KH공감도서관' 텍스트 추가 */}
                    <div className="footer-logo-text-group">
                        {/* 실제 로고 이미지 경로로 변경해주세요. 예: src="/images/book-icon-footer.png" */}
                        <img src="src/image/final_logo.png" alt="책 아이콘" className="book-icon-img" />
                    </div>
                    <p className="address-contact-info"> {/* 새로운 클래스명 */}
                        (06234) 서울특별시 강남구 테헤란로 14길 6 남도빌딩 3F<br/>
                        대표전화 02-123-4567 (09:00 ~ 18:00, 휴관일/공휴일 제외)<br/>
                        팩스 02-123-4568
                    </p>
                </div>
            </div>
        </footer>
    );
}