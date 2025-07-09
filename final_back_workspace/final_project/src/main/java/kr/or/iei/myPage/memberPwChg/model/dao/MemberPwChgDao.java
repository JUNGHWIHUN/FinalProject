package kr.or.iei.myPage.memberPwChg.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.myPage.memberPwChg.model.dto.MemberPwChg;

@Mapper
public interface MemberPwChgDao {

	MemberPwChg selectOneMemeber(String memberNo);

	int updateMemberPw(MemberPwChg member);

}
