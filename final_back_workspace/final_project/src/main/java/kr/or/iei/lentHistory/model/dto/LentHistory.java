package kr.or.iei.lentHistory.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LentHistory {
	private	String lentBookNo;				//대출된 번호
	private String returnDate;				//반납 예정일
	private String reservation;				//도서 예약여부
	private String lentMemberNo;			//대출된 회원번호
	private String lentCallNo;				//대출된 책의 청구기호
	private String canRenew;				//도서 대출 연장가능여부
	private String actualReturnDate;		//책이 실제로 반납된 날짜
	private String lentDate;				//책이 실제로 대출된 날짜
	
	
	//책 정보를 담기 위한 변수
	private String title;					//책 제목
}
