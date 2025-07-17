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
	
	// 전화번호 중복체크
	@GetMapping("/{memberPhone}/chkPhone")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> chkMemberPhone (@PathVariable String memberPhone){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "전화번호 중복 체크 중 통신 오류가 발생하였습니다.", false, "error");
		try {
			int count = service.chkMemberPhone(memberPhone);
			res = new ResponseDto(HttpStatus.OK, "", count, "success");
		}catch(Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
    //회원가입 (이메일 인증 링크 발송 포함)
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
            htmlResponse = "<html><head><meta charset=\"UTF-8\"></head><body><script>alert('이메일 인증이 완료되었습니다. 이제 로그인할 수 있습니다.'); window.close();</script></body></html>";
            return ResponseEntity.ok(htmlResponse);
        } else {
            htmlResponse = "<html><head><meta charset=\"UTF-8\"></head><body><script>alert('유효하지 않거나 만료된 인증 링크입니다.'); window.close();</script></body></html>";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(htmlResponse);
        }
    }

    // --- 아이디 찾기 로직 (이메일로 아이디 조회 및 마스킹) ---
    @PostMapping("/find-id") // 아이디 찾기 엔드포인트
    @NoTokenCheck
    public ResponseEntity<ResponseDto> findId(@RequestBody Map<String, String> requestBody) {
        String memberEmail = requestBody.get("memberEmail");
        // 초기 응답 DTO를 오류 상태로 설정합니다.
        // HttpStatus는 일단 OK로 두고, resData 유무와 clientMsg/alertIcon으로 프론트에서 판단합니다.
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 찾기 중, 오류가 발생했습니다.", null, "error"); // success 필드 제거

        try {
            String maskedMemberId = service.findMaskedMemberId(memberEmail); // 서비스 호출
            if (maskedMemberId != null) {
                // 아이디 찾기 성공 시: HttpStatus.OK, 메시지, 마스킹된 아이디, 성공 아이콘
                res = new ResponseDto(HttpStatus.OK, "아이디를 찾았습니다.", maskedMemberId, "success"); // success 필드 제거
            } else {
                // 아이디 찾기 실패 시: HttpStatus.OK, 실패 메시지, resData는 null, 경고 아이콘
                res = new ResponseDto(HttpStatus.OK, "입력하신 이메일로 등록된 아이디가 없습니다.", null, "warning"); // success 필드 제거
            }
        } catch (Exception e) {
            e.printStackTrace();
            // 예외 발생 시: HttpStatus.INTERNAL_SERVER_ERROR, 오류 메시지, null, 에러 아이콘
            res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류로 인해 아이디 찾기에 실패했습니다.", null, "error"); // success 필드 제거
        }
        // 최종 응답 DTO와 HTTP 상태 코드를 포함하여 ResponseEntity를 반환합니다.
        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }


    // --- 비밀번호 찾기 (아이디와 이메일로 임시 비밀번호 발송) ---
    @PostMapping("/find-password") // 비밀번호 찾기 엔드포인트 유지
    @NoTokenCheck
    public ResponseEntity<ResponseDto> findPassword(@RequestBody Map<String, String> requestBody) {
        String memberId = requestBody.get("memberId"); // 아이디 추가로 받음
        String memberEmail = requestBody.get("memberEmail");
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 찾기 중, 알 수 없는 오류가 발생했습니다.", false, "error");

        try {
            boolean success = service.processPasswordReset(memberId, memberEmail); // 서비스 호출 시 아이디와 이메일 모두 전달
            if (success) {
                res = new ResponseDto(HttpStatus.OK, "임시 비밀번호가 이메일로 전송되었습니다. 이메일을 확인해주세요.", true, "info");
            } else {
                res = new ResponseDto(HttpStatus.OK, "아이디와 이메일 정보가 일치하는 회원이 없거나, 임시 비밀번호 전송에 실패했습니다.", false, "warning");
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
		System.out.println("컨트롤러 진입 여부");
		System.out.println("프론트 전달한 멤버"+member);
		try {
			LoginMember loginMember = service.memberLogin(member);
			System.out.println("컨트롤러 로그인 멤버" +loginMember);
			
			if(loginMember == null) { 
				res = new ResponseDto(HttpStatus.OK, "아이디 및 비밀번호를 확인하세요.", null, "warning");
				System.out.println("컨트롤러 응답 여부");
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