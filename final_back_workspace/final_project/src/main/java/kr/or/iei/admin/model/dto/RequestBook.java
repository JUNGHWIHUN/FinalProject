package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RequestBook {
	
	private String memberNo;			//회원번호
	private String requestReason;		//신청사유
	private String requestBookName;		//신청도서제목
	private String requestBookAuthor;	//신청도서저자
	private String requestBookPub;		//신청도서출판사
	private String status;				//처리상태
	private String requestDate;

}
