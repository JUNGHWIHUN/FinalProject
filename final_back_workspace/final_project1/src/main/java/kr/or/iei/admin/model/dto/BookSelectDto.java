package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookSelectDto {
	
	private String title;
	private String author;
	private String isbn; 
	
	//isbn을 String => int로 바꿧더니 오류남. 이유 ㅁ?ㄹ
}
