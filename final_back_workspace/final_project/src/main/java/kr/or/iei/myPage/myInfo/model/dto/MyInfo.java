package kr.or.iei.myPage.myInfo.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MyInfo {

	private String memberNo;		//회원 번호
	private String memberId;
	private String memberName;		//이름
	private String memberPhone;		//전화번호
	private String memberAddr;		//주소
	private String memberpw;		//비밀번호
	private String isAdmin;			//관리자 여부
	
}
