package kr.or.iei.myPage.requestBookList.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RequestBookList {
	private String requestBookNo;			//희망도서 신청번호 
	private String requestMemberNo;			//회원 번호
	private String requestedReason;			//신청 사유
	private String requestedBookName;		//신청도서제목
	private String requestedBookAuthor;		//신청도서 저자
	private String requestedBookPub;		//신청도서 출판사
	private int requestStatus;			//처리 상태
}
