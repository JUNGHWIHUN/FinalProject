package kr.or.iei.myPage.reservation.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Reservation {
	private long reservationNo;
	private String reservationMemberNo;
	private String reservationCallNo;
	private String reservationDate;
	private String actualReturnDate;
	
	//책정보 불러오기 위한 변수
	private String title;		// 책 제목
	private String author;		// 저자
	private String publisher;	// 출판사
	private String canLend;		// 대출가능여부
	
	//현 상태를 나타내는 변수
	private String status;	//상태 : '예약중' or '대출 가능'
}
