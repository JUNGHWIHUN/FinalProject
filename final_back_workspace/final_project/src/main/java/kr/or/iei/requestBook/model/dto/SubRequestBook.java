package kr.or.iei.requestBook.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class SubRequestBook {
	
	private String requestBookNo;		//신청도서 번호
	private String memberNo;			//회원 번호
	private String requestedReason; 	//신청 사유
	private String requestedBookName;	//신청도서 제목
	private String requestedBookAuthor;	//신청도서 저자
	private String requestedBookPub;	//신청도서 출판사
	
	
}
