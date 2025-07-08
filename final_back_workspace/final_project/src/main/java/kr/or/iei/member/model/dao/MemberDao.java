package kr.or.iei.member.model.dao;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.iei.member.model.dto.Member;

@Mapper
public interface MemberDao {

	int chkMemberId(String memberId);

	int insertMember(Member member);

	Member memberLogin(String memberId);


	Member selectOneMember(String memberNo);

	int chkMemberEmail(String memberEmail);

    // --- 이메일 인증을 위해 추가할 메소드 ---
    // 회원가입 후 이메일 인증 시 회원의 상태 및 authCode 업데이트
    int updateMemberStatus(@Param("memberEmail") String memberEmail, @Param("authCode") String authCode);

    // 비밀번호 찾기: 이메일로 회원 존재 여부 확인 (이메일 인증된 회원만 대상)
    int countActiveMemberByEmail(@Param("memberEmail") String memberEmail);

    // 비밀번호 찾기: 이메일로 비밀번호 업데이트 (이메일 인증된 회원만 대상)
    int updatePasswordByEmail(@Param("memberEmail") String memberEmail, @Param("newPassword") String newPassword);
	
}

