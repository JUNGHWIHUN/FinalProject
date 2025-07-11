package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdSuggestion {
	
	private String suggesNo;		//글번호
	private String suggesContent;	//내용
	private String suggesTitle;		//제목
	private String suggesDate;		//날짜
	private String memberNo;		//회원번호
	
	private String memberName;		//불러온 이름
	

}
