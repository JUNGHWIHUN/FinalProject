package kr.or.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // @RequestParam 추가
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.common.util.MailSenderUtil; // MailSenderUtil 주입
import kr.or.iei.member.model.dto.LoginMember;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.service.MemberService;
import kr.or.iei.myPage.myLibrary.model.dto.MyLibrary;
import kr.or.iei.myPage.myLibrary.model.service.MyLibraryService; // MyLibraryService 주입

import jakarta.servlet.http.HttpServletRequest; // HttpServletRequest 주입

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin("*")
@RequestMapping("/member")
public class MemberController {
	
	@Autowired
	private MemberService service;
	
	@Autowired
	private MyLibraryService myLibraryService; // 자동 생성될 '내 서재' 를 위해 주입
    
    @Autowired // MailSenderUtil 주입
    private MailSenderUtil mailSenderUtil;
	
	// 아이디 중복 체크
	@GetMapping("/{memberId}/chkId")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> chkMemberId (@PathVariable String memberId){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 중복 체크 중 통신 오류가 발생하였습니다.", false, "error");
		try {
			int count = service.chkMemberId(memberId);
			res = new ResponseDto(HttpStatus.OK, "", count, "success");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	// 이메일 중복 체크
	@GetMapping("/{memberEmail}/chkEmail")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> chkMemberEmail (@PathVariable String memberEmail){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "이메일 중복 체크 중 통신 오류가 발생하였습니다.", false, "error");
		try {
			int count = service.chkMemberEmail(memberEmail);
			res = new ResponseDto(HttpStatus.OK, "", count, "success");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
    // 회원가입 (이메일 인증 링크 발송 포함)
    @PostMapping("/signup") // 회원가입 엔드포인트명 변경 (React와의 통신 명확화)
    @NoTokenCheck
    public ResponseEntity<ResponseDto> insertMember (@RequestBody Member member, HttpServletRequest request){
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "회원가입 중, 오류가 발생하였습니다.", false, "error");
        
        try {
            // 서비스에서 authCode, memberStatus 설정 및 비밀번호 암호화 후 DB 저장
            int result = service.insertMember(member); 
            
            if(result > 0) {
                // 이메일 인증 링크 생성
                String verificationLink = String.format("%s://%s:%d%s/member/verify-signup?authCode=%s&memberEmail=%s",
                        request.getScheme(),
                        request.getServerName(),
                        request.getServerPort(),
                        request.getContextPath(), // 스프링 부트 기본은 빈 문자열
                        member.getAuthCode(),
                        member.getMemberEmail());

                String emailSubject = "[본인인증] KH공감도서관 회원가입을 완료하려면 이메일 인증을 해주세요.";
                String emailContent = "회원가입을 완료하려면 아래 링크를 클릭해주세요:<br><br>"
                                    + "<a href='" + verificationLink + "'>" + verificationLink + "</a><br><br>"
                                    + "감사합니다.";

                boolean emailSent = mailSenderUtil.sendEmail(member.getMemberEmail(), emailSubject, emailContent);

                if (emailSent) {
                    // 성공 시 응답 DTO를 명확하게 구성
                    res = new ResponseDto(HttpStatus.OK, "회원가입이 완료되었습니다. 이메일을 확인하여 인증해주세요.", true, "info"); // clientMsg와 alertIcon 수정
                    
                    // 회원가입 시 자동으로 생성되는 '내 서재' 추가 
                    // memberNo가 DTO에 채워지는지 확인 필요 (MyBatis useGeneratedKeys="true" keyProperty="memberNo" 설정 시)
                    String memberNo = member.getMemberNo(); 
                    if (memberNo != null) { // memberNo가 제대로 받아와졌는지 확인
                        String name = "내 서재";
                        String isDefault = "T";
                        MyLibrary myLibrary = new MyLibrary(null, memberNo, name, isDefault);
                        myLibraryService.addNewMyLibrary(myLibrary);
                    } else {
                        System.err.println("WARN: 회원가입 후 memberNo가 DTO에 채워지지 않아 내 서재를 생성할 수 없습니다.");
                    }
                } else {
                    // 이메일 전송 실패 시 경고 메시지
                    res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "회원가입은 완료되었으나, 인증 이메일 전송에 실패했습니다. 관리자에게 문의하세요.", false, "error");
                    // 이 경우 회원가입 트랜잭션을 롤백할지, 이메일 재전송 기능을 제공할지 고려해야 합니다.
                    // 현재는 회원가입은 성공하고 이메일만 실패한 것으로 처리됩니다.
                }
			} else {
				// 회원가입 DB 저장 실패 시
				res = new ResponseDto(HttpStatus.OK, "회원가입 중 알 수 없는 오류가 발생했습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
            res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류로 인해 회원가입에 실패했습니다.", false, "error");
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
    
    
    // 회원가입 인증 링크 클릭 시 처리 (백엔드에서 직접 처리)
    @GetMapping("/verify-signup")
    @NoTokenCheck
    public ResponseEntity<String> verifySignUp(@RequestParam String authCode, @RequestParam String memberEmail) {
        int result = service.updateMemberStatus(memberEmail, authCode);

        String htmlResponse;
        if (result > 0) {
            htmlResponse = "<html><head><meta charset=\"UTF-8\"></head><body><script>alert('이메일 인증이 완료되었습니다! 이제 로그인할 수 있습니다.'); window.close();</script></body></html>";
            return ResponseEntity.ok(htmlResponse);
        } else {
            htmlResponse = "<html><head><meta charset=\"UTF-8\"></head><body><script>alert('유효하지 않거나 만료된 인증 링크입니다.'); window.close();</script></body></html>";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(htmlResponse);
        }
    }

    // 비밀번호 찾기 (임시 비밀번호 발송 및 DB 업데이트)
    @PostMapping("/find-password")
    @NoTokenCheck
    public ResponseEntity<ResponseDto> findPassword(@RequestBody Map<String, String> requestBody) {
        String memberEmail = requestBody.get("memberEmail");
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 찾기 중, 알 수 없는 오류가 발생했습니다.", false, "error"); // 기본 에러 메시지

        try {
            boolean success = service.processPasswordReset(memberEmail); // 서비스에서 모든 로직 처리
            if (success) {
                // 성공 시 응답 DTO 명확하게 구성
                res = new ResponseDto(HttpStatus.OK, "임시 비밀번호가 이메일로 전송되었습니다. 이메일을 확인해주세요.", true, "info"); // clientMsg와 alertIcon 수정
            } else {
                // 실패 시 응답 DTO 명확하게 구성 (회원 없음 또는 이메일 전송 실패)
                // 서비스 계층에서 반환하는 false가 어떤 의미인지에 따라 메시지 구체화 가능
                res = new ResponseDto(HttpStatus.OK, "입력하신 이메일로 등록된 회원이 없거나, 임시 비밀번호 전송에 실패했습니다.", false, "warning");
            }
        } catch (Exception e) {
            e.printStackTrace();
            res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류로 인해 비밀번호 찾기 요청에 실패했습니다.", false, "error");
        }
        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }
	
	// 로그인
	@PostMapping("/login")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> memberLogin (@RequestBody Member member){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			LoginMember loginMember = service.memberLogin(member);
			
			if(loginMember == null) { 
				res = new ResponseDto(HttpStatus.OK, "아이디 및 비밀번호를 확인하세요.", null, "warning");
                // 이메일 인증이 필요한 경우, 여기서 메시지를 더 구체화할 수 있습니다.
                // 예: res.setMessage("이메일 인증이 필요합니다. 이메일을 확인해주세요.");
			}else { 
				res = new ResponseDto(HttpStatus.OK, "", loginMember, "");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//내 정보 - 회원 1명 조회
	@GetMapping("/{memberNo}")
	public ResponseEntity<ResponseDto> selectOneMember(@PathVariable String memberNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "회원 조회 중, 오류가 발생하였습니다.", null	, "error");
		try {
			Member member = service.selectOneMember(memberNo);
			res = new ResponseDto(HttpStatus.OK, "", member, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
}