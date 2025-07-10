package kr.or.iei.requestBook.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
<<<<<<<< HEAD:final_back_workspace/final_project/src/main/java/kr/or/iei/requestBook/model/dto/SubRequestBook.java
public class SubRequestBook {
========

public class SubmitRequestBook {
>>>>>>>> master:final_back_workspace/final_project/src/main/java/kr/or/iei/requestBook/model/dto/SubmitRequestBook.java
	
	private String requestBookNo;		//신청도서 번호
	private String memberNo;			//회원 번호
	private String requestedReason; 	//신청 사유
	private String requestedBookName;	//신청도서 제목
	private String requestedBookAuthor;	//신청도서 저자
	private String requestedBookPub;	//신청도서 출판사
	
	
}
