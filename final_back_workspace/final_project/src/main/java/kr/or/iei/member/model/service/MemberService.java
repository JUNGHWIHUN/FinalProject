package kr.or.iei.member.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.common.util.JwtUtils;
import kr.or.iei.common.util.MailSenderUtil; // MailSenderUtil 주입
import kr.or.iei.member.model.dao.MemberDao; // MemberDao 사용
import kr.or.iei.member.model.dto.LoginMember;
import kr.or.iei.member.model.dto.Member;

import java.security.SecureRandom; // 임시 비밀번호 생성용
import java.util.UUID; // 인증 코드 생성용

@Service
public class MemberService {

	@Autowired
	private MemberDao dao;

	@Autowired
	private BCryptPasswordEncoder encoder;
	
	@Autowired
	private JwtUtils jwtUtils;

    @Autowired // MailSenderUtil 주입
    private MailSenderUtil mailSenderUtil;
	
    // 아이디 중복체크
    public int chkMemberId(String memberId) {
        return dao.chkMemberId(memberId);
    }
    
    // 이메일 중복체크
    public int chkMemberEmail(String memberEmail) {
        return dao.chkMemberEmail(memberEmail);
    }

    // 회원가입 (이메일 인증 기능 추가)
    @Transactional
    public int insertMember(Member member) {
        String encodePw = encoder.encode(member.getMemberPw());
        member.setMemberPw(encodePw);
        
        // 이메일 인증을 위한 authCode와 memberStatus 초기값 설정
        member.setAuthCode(UUID.randomUUID().toString()); // 고유한 인증 코드 생성
        member.setMemberStatus("N"); // 초기 상태는 'N'(미인증)
        
        return dao.insertMember(member); // authCode와 memberStatus가 포함된 member 객체 전달
    }

    // 이메일 인증 후 회원 상태 업데이트
    @Transactional
    public int updateMemberStatus(String memberEmail, String authCode) {
        return dao.updateMemberStatus(memberEmail, authCode);
    }

    // --- 아이디 찾기 로직 (이메일로 아이디 찾기) ---
    public String findMaskedMemberId(String memberEmail) {
        String memberId = dao.findMemberIdByEmail(memberEmail); // DAO에서 아이디 조회
        
        if (memberId != null && !memberId.isEmpty()) {
            // 아이디 마스킹 처리 (기존 로직 활용)
            int idLength = memberId.length();
            String first = memberId.substring(0, Math.min(2, idLength)); // 최소 2글자
            String last = "";
            if (idLength > 4) { // 전체 길이가 4보다 커야 마지막 두 글자 마스킹 가능
                last = memberId.substring(idLength - 2);
            }
            String marker = "*".repeat(Math.max(0, idLength - first.length() - last.length()));
            
            return first + marker + last;
        }
        return null; // 조회 결과 없으면 null 반환
    }

    // --- 비밀번호 찾기 로직 (아이디, 이메일로 임시 비밀번호 발송) ---
    @Transactional
    public boolean processPasswordReset(String memberId, String memberEmail) {
        // 1. 아이디와 이메일로 활성화된 회원 존재하는지 확인
        int memberCount = dao.countActiveMemberByIdAndEmail(memberId, memberEmail);
        if (memberCount == 0) {
            return false; // 회원이 존재하지 않거나, 이메일 인증이 완료되지 않음
        }

        // 2. 임시 비밀번호 생성 (기존 로직 그대로 사용)
        String upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String lower = "abcdefghijklmnopqrstuvwxyz";
        String digit = "0123456789";
        String special = "!@#$";
        String allChar = upper + lower + digit + special;
        SecureRandom random = new SecureRandom();
        StringBuilder randomPw = new StringBuilder();
        randomPw.append(upper.charAt(random.nextInt(upper.length())));
        randomPw.append(lower.charAt(random.nextInt(lower.length())));
        randomPw.append(digit.charAt(random.nextInt(digit.length())));
        randomPw.append(special.charAt(random.nextInt(special.length())));
        for (int i = 0; i < 6; i++) {
            randomPw.append(allChar.charAt(random.nextInt(allChar.length())));
        }
        char[] charArr = randomPw.toString().toCharArray();
        for (int i = 0; i < charArr.length; i++) {
            int randomIdx = random.nextInt(charArr.length);
            char temp = charArr[i];
            charArr[i] = charArr[randomIdx];
            charArr[randomIdx] = temp;
        }
        String newRandomPw = new String(charArr);

        // 3. DB에 임시 비밀번호 업데이트 (암호화하여 저장)
        int updateResult = dao.updatePasswordByIdAndEmail(memberId, memberEmail, encoder.encode(newRandomPw));
        if (updateResult == 0) {
            return false; // DB 업데이트 실패
        }

        // 4. 임시 비밀번호 이메일 발송
        String emailSubject = "임시 비밀번호 안내";
        String emailContent = "회원님의 임시 비밀번호는 <span style='color:red;'>" + newRandomPw + " </span> 입니다. <br><br> 마이페이지에서 비밀번호를 꼭 변경해주시기 바랍니다.";
        
        return mailSenderUtil.sendEmail(memberEmail, emailSubject, emailContent);
    }

    //로그인
    public LoginMember memberLogin(Member member) {
        Member chkMember = dao.memberLogin(member.getMemberId());
        System.out.println("체크멤버 널 체크"+chkMember);
        
        if(chkMember == null) {
            return null;
        }
        
        //이메일 인증이 완료된(memberStatus가 'Y'인) 회원만 로그인 허용
        if ("N".equals(chkMember.getMemberStatus())) {
            // 아직 이메일 인증이 완료되지 않았음을 나타내는 특정 응답
            // 로그인 실패 로직에 포함시키거나 별도로 처리할 수 있습니다.
            return null; // 또는 LoginMember 객체에 특정 상태 코드/메시지 추가
        }
        
        System.out.println("인코딩 전 비밀번호" + member.getMemberPw());

        System.out.println("인코딩 비밀번호" + (encoder.encode(member.getMemberPw())));
        
        System.out.println("DB 비밀번호" + chkMember.getMemberPw());
                
        if(encoder.matches(member.getMemberPw(), chkMember.getMemberPw())) {
        	System.out.println("입력값" + member.getMemberPw());
        	System.out.println("DB값" + chkMember.getMemberPw());
            String accessToken = jwtUtils.createAccessToken(chkMember.getMemberId());
            String refreshToken = jwtUtils.createRefreshToken(chkMember.getMemberId());
            
            chkMember.setMemberPw(null);
            
            
            
            LoginMember loginMember = new LoginMember(chkMember, accessToken, refreshToken);
            
            System.out.println("서비스 최종 반환 로그인 멤버" + loginMember);
            return loginMember;
        }else {
        	System.out.println("비밀번호 불일치 널 진입?");
            return null;
        }
    }

    // 회원 1명 조회
    public Member selectOneMember(String memberNo) {
        Member member = dao.selectOneMember(memberNo);
        if (member != null) {
            member.setMemberPw(null);
        }
        return member;
    }
}