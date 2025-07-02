package kr.or.iei.member.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Member {
	private String memberNo;		//회원번호
	private String memberId;		//아이디
	private String memberPw;		//비밀번호
	private String memberName;		//이름
	private String memberEmail;		//이메일
	private String memberPhone;		//전화번
	private String isAdmin;			//관리자 여부 (T/F)
	private String enrollDate;		//가입일
	private String canComment;		//서평 작성 권한 (T/F)
	private int overdueDayCount;	//누적 연체일수
	private int borrowedBookCount;	//현재 대출도서 권수
	private int maxBorrowCount;		//최대 대출가능권수
	private String canBorrow;		//대출가능여부 (T/F)
	private int cantBorrowDay;		//대출불가일수 (연체시)
	private int noLentCount;		//예약 후 미대출 건수
	private String canRequest;		//신규도서 신청권한 (T/F)
}
