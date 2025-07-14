package kr.or.iei.myPage.memberPwChg.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.myPage.memberPwChg.model.dao.MemberPwChgDao;
import kr.or.iei.myPage.memberPwChg.model.dto.MemberPwChg;

@Service
public class MemberPwChgService {
	@Autowired
	private MemberPwChgDao dao;
	
	@Autowired
	private BCryptPasswordEncoder encoder;

	public boolean checkMemberPw(MemberPwChg member) {
		
		MemberPwChg m = dao.selectOneMemeber(member.getMemberId());
		
		return encoder.matches(member.getMemberPw(), m.getMemberPw());
	}

	@Transactional
	public int updateMemberPw(MemberPwChg member) {

		//평문 => 암호화
		String encodePw = encoder.encode(member.getMemberPw());
		member.setMemberPw(encodePw);
		
		
		return dao.updateMemberPw(member);
	}
	
}
