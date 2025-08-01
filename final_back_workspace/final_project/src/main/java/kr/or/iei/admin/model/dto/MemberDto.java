package kr.or.iei.admin.model.dto;
import java.util.ArrayList;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MemberDto {
	private String memberNo;
	private String memberId;
	private String memberPw;
	private String memberName;
	private String memberEmail;
	private String memberPhone;
	private String isAdmin;
	private String enrollDate;
	private String canComment;
	private String overudeCount;
	private String borrowedCount;
	private String maxBorrowedCount;
	private String canBorrow;
	private String cantBorrowDay;
	private String noLentCount;
	private String canRequest;
	private String memberAddr;
	
}
