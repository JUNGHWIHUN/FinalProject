package kr.or.iei.myPage.myLibrary.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MyLibrary {
	
	private String myLibraryNo;			//내 서재 번호
	private String myLibraryMemberNo;	//내 서재 회원번호
	private String myLibraryName;		//내 서재 이름
	private String isDefault;			//기본으로 생성된 서재인지 확인
}
