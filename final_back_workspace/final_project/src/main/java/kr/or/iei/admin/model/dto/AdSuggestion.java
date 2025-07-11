package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdSuggestion {
	
	private String suggesNo;
	private String suggesContent;
	private String suggesTitle;
	private String suggesDate;
	private String memberNo;
	
	private String memberName;
	

}
