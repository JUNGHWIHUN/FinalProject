package kr.or.iei.myPage.memberPwChg.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.myPage.memberPwChg.model.dto.MemberPwChg;
import kr.or.iei.myPage.memberPwChg.model.service.MemberPwChgService;

@RestController
@CrossOrigin("*")
@RequestMapping("/memberPwChg")
public class MemberPwChgController {
	@Autowired
	private MemberPwChgService service;
	
	
	//기존 비밀번호 체크
	@PostMapping("/checkPw")
	public ResponseEntity<ResponseDto> checkPw(@RequestBody MemberPwChg member){
		
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "기존 비밀번호 체크 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			boolean chkResult = service.checkMemberPw(member);
			
			res = new ResponseDto(HttpStatus.OK, "", chkResult, "");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}

	
	//비밀번호 변경
	@PatchMapping("/memberPw")
	public ResponseEntity<ResponseDto> updateMemberPw(@RequestBody MemberPwChg member){
		ResponseDto res=  new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "비밀번호 변경 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.updateMemberPw(member);
			
			//토큰 검증 성공 => 업데이트 결과에 따라서 처리
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "비밀번호가 정상적으로 수정되었습니다. 다시 로그인 해주시길 바랍니다.", true, "success");
			}else {
				res = new ResponseDto(HttpStatus.OK, "비밀번호 변경 중, 오류가 발생하였습니다.", false, "warning");
			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
}
