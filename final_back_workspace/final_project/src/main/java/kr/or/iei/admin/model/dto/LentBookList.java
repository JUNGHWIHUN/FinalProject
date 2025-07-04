package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LentBookList {
	private String lentbookNo;		//대출된 번호
	private String returnDate;		//반납예정일
	private String reservation;		//도서예약여부
	private String memberNo;		//회원번호
	private String callNo;			//청구기호
	private String canRenew;		//도서대출연장가능 여부
	private String actualRetrun;	//실제반납날짜
	private String lentDate;		//대출한 날짜.
	
	private String title;          // 책 제목 
	private String memberName;     // 회원 이름 

	
	
}
