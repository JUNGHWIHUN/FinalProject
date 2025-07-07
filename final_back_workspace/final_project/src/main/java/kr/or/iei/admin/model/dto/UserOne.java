package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserOne {
	
	private String memberNo;//회원번호
	private String memberName;//회원이름
	private String memberBorrow;//회원의 대출 가능 여부
}
