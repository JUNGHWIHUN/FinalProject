package kr.or.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Member;

@Service
public class MemberService {

	@Autowired
	private MemberDao dao;

	//WebConfig에서 생성하여 컨테이너에 Bean 으로 등록한 객체 주입받아 사용
	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtils jwtUtils;
	
		//아이디 중복체크
		public int chkMemberId(String memberId) {
			return dao.chkMemberId(memberId);
		}
		
		//이메일 중복체크
		public int chkMemberEmail(String memberEmail) {
			return dao.chkMemberEmail(memberEmail);
		}

		//회원가입
		@Transactional
		public int insertMember(Member member) {
			String encodePw = encoder.encode(member.getMemberPw());	//웹에서 입력한 평문 전달 => 암호화된 60글자
			member.setMemberPw(encodePw);	//암호화된 비밀번호로 재할당
			
			return dao.insertMember(member);
		}

		//로그인
		public Member memberLogin(Member member) {
			Member loginMember = dao.memberLogin(member.getMemberId());
			
			if(loginMember == null) {
				//아이디를 잘못 입력해 결과값이 null인 경우 즉시 메소드 종료
				return null;
			}
			
			if(encoder.matches(member.getMemberPw(), loginMember.getMemberPw())) {	
				//사용자가 입력한 평문(전자)을 암호화해 DB에 저장된 암호(후자)와 비교, 일치할 경우 로그인 성공
				//jwt 토큰 발급
				String accessToken = jwtUtils.createAccessToken(loginMember.getMemberId());
				String refreshToken = jwtUtils.createRefreshToken(loginMember.getMemberId());
				
				//비밀번호는 해당 메소드에서 검증하는 역할 외에 필요가 없으므로, 스토리지에 비밀번호가 저장되지 않도록 처리
				loginMember.setMemberPw(null);
				
				//Member 객체에 정보를 담아 반환
				loginMember.setAccessToken(accessToken);
				loginMember.setRefreshToken(refreshToken);
				
				return loginMember;
			}else {
				//비밀번호가 일치하지 않은 경우
				return null;
			}
				
			
		}

}
