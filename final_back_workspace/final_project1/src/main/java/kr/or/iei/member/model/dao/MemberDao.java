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
    
    // --- 아이디 찾기 및 비밀번호 찾기 로직 변경에 따른 추가/수정 ---

    // 아이디 찾기: 이메일로 회원 아이디 조회 (인증된 회원만)
    String findMemberIdByEmail(@Param("memberEmail") String memberEmail); // 수정: Member -> String 반환

    // 비밀번호 찾기: 아이디와 이메일로 활성화된 회원 존재 여부 확인
    int countActiveMemberByIdAndEmail(@Param("memberId") String memberId, @Param("memberEmail") String memberEmail);

    // 비밀번호 찾기: 특정 회원의 비밀번호 업데이트
    int updatePasswordByIdAndEmail(@Param("memberId") String memberId, @Param("memberEmail") String memberEmail, @Param("newPassword") String newPassword);
	
}

