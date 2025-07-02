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
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.service.MemberService;

@RestController // 이 클래스가 RESTful 웹 서비스의 컨트롤러임을 나타냅니다.
@CrossOrigin("*") // 모든 도메인에서의 요청을 허용합니다 (CORS 설정).
@RequestMapping("/member") // 이 컨트롤러의 모든 매핑은 "/member" 경로로 시작합니다.
public class MemberController {
	
	@Autowired // MemberService의 의존성을 주입합니다.
	private MemberService service;
	
	// 아이디 중복 체크
	@GetMapping("/{memberId}/chkId") // GET 요청으로 {memberId}/chkId 경로에 매핑됩니다.
	@NoTokenCheck // 메소드 시작 전 토큰 체크를 하지 않을 메소드를 사용자 어노테이션으로 지정합니다.
	public ResponseEntity<ResponseDto> chkMemberId (@PathVariable String memberId){
		// 초기 응답 DTO를 오류 상태로 설정합니다.
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "아이디 중복 체크 중 통신 오류가 발생하였습니다.", false, "error");
		
		try {
			int count = service.chkMemberId(memberId); // 서비스 계층에서 아이디 중복 여부를 확인합니다.
			// 중복 체크 성공 시, 응답 상태를 OK로 변경하고 결과를 포함합니다.
			res = new ResponseDto(HttpStatus.OK, "", count, "success");
		}catch(Exception e) {
			e.printStackTrace(); // 예외 발생 시 스택 트레이스를 출력합니다.
		}
				
		// 최종 응답 DTO와 HTTP 상태 코드를 포함하여 ResponseEntity를 반환합니다.
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//이메일 중복 체크
	@GetMapping("/{memberEmail}/chkEmail") 
	@NoTokenCheck // 메소드 시작 전 토큰 체크를 하지 않을 메소드를 사용자 어노테이션으로 지정합니다.
	public ResponseEntity<ResponseDto> chkMemberEmail (@PathVariable String memberEmail){
		// 초기 응답 DTO를 오류 상태로 설정합니다.
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "이메일 중복 체크 중 통신 오류가 발생하였습니다.", false, "error");
		
		try {
			int count = service.chkMemberEmail(memberEmail); // 서비스 계층에서 아이디 중복 여부를 확인합니다.
			// 중복 체크 성공 시, 응답 상태를 OK로 변경하고 결과를 포함합니다.
			res = new ResponseDto(HttpStatus.OK, "", count, "success");
		}catch(Exception e) {
			e.printStackTrace(); // 예외 발생 시 스택 트레이스를 출력합니다.
		} 
				
		// 최종 응답 DTO와 HTTP 상태 코드를 포함하여 ResponseEntity를 반환합니다.
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	// 회원가입
	@PostMapping // POST 요청으로 /member 경로에 매핑됩니다.
	@NoTokenCheck // 토큰 체크를 건너뜁니다.
	public ResponseEntity<ResponseDto> insertMember (@RequestBody Member member){ // 요청 본문에서 MemberDto 객체를 받습니다.
		// 초기 응답 DTO를 오류 상태로 설정합니다.
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "회원가입 중, 오류가 발생하였습니다.", false, "error") ;
		
		try {
			int result = service.insertMember(member); // 서비스 계층에서 회원가입을 처리합니다.
			
			if(result > 0) { // 회원가입 성공 시
				res = new ResponseDto(HttpStatus.OK, "회원가입이 완료되었습니다. 로그인 화면으로 이동합니다.", true, "success");
			}else { // 회원가입 실패 시
				res = new ResponseDto(HttpStatus.OK, "회원가입 중, 오류가 발생하였습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace(); // 예외 발생 시 스택 트레이스를 출력합니다.
		}
		
		// 최종 응답 DTO와 HTTP 상태 코드를 포함하여 ResponseEntity를 반환합니다.
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	// 로그인
	@PostMapping("/login") // POST 요청으로 /member/login 경로에 매핑됩니다.
	@NoTokenCheck // 토큰 체크를 건너뜠습니다.
	public ResponseEntity<ResponseDto> memberLogin (@RequestBody Member member){
		// 초기 응답 DTO를 오류 상태로 설정합니다.
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "로그인 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			Member loginMember = service.memberLogin(member); // 서비스 계층에서 로그인 처리를 합니다.
			
			if(loginMember == null) { // 로그인 실패 시 (아이디 또는 비밀번호 불일치)
				res = new ResponseDto(HttpStatus.OK, "아이디 및 비밀번호를 확인하세요.", null, "warning");
			}else { // 로그인 성공 시 (JMT 정보 + 아이디 + 회원레벨을 가지고 있는 LoginMemberDto 객체 정보 반환, 따로 알림은 설정하지 않음)
				res = new ResponseDto(HttpStatus.OK, "", loginMember, "");
				

			}
			
		}catch(Exception e) {
			e.printStackTrace(); // 예외 발생 시 스택 트레이스를 출력합니다.
		}
		
		// 최종 응답 DTO와 HTTP 상태 코드를 포함하여 ResponseEntity를 반환합니다.
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//내 정보 - 회원 1명 조회
	@GetMapping("/memberNo")
	public ResponseEntity<ResponseDto> selectOneMember(@PathVariable String memberNo){
		//초기 응답 DTO를 오류 상태로 설정
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "회원 조회 중, 오류가 발생하였습니다.", null	, "error");
		
		try {
			Member member = service.selectOneMember(memberNo);
			res = new ResponseDto(HttpStatus.OK, "", member, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		// 최종 응답 DTO와 HTTP 상태 코드를 포함하여 ResponseEntity를 반환합니다.
				return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
}
