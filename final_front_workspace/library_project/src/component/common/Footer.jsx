import React from 'react'; // React 임포트 확인
import './Common.css'; // Footer 전용 CSS 파일 임포트

export default function Footer(){

    return ( 
        <footer>
            <div className="footer-content-wrap">
                <div className="footer-links">
                    <span>개인정보처리방침</span>
                    <span className="divider">|</span>
                    <span>KH공감도서관 물리적영업점</span>
                    <span className="divider">|</span>
                    <span>도서관방침</span>
                    <span className="divider">|</span>
                    <span>저작권정책</span>
                </div>
                <div className="footer-info">
                    <p className="library-name">KH. 공감도서관</p>
                    <p>
                        (06234) 서울특별시 강남구 테헤란로 146 남도빌딩 3F<br/>
                        대표전화 02-123-4567 (09:00 ~ 18:00, 휴관일/공휴일 제외)<br/>
                        팩스 02-123-4568
                    </p>
                </div>
            </div>
        </footer>
    );
}
