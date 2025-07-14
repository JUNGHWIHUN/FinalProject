package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookLenterDto {
	
	//대출 처리를 할 때, 유저의 번호와 책의 번호를 가져올 Dto.
	private String memberNo;
    private String bookNo;
    
    
    private String bookName;
    private String memberName;
}
