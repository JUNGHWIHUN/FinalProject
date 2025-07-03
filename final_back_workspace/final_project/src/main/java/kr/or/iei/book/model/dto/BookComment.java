package kr.or.iei.book.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookComment {
	private String commentNo;			//댓글 번호
	private String commentContent;		//댓글 내용
	private String memberId;			//작성 회원 아이디
	private String callNo;				//책 청구기호
	private String commentDate;			//서평 작성일자
	private String commentUpdateDate;	//서평 수정일자
}
