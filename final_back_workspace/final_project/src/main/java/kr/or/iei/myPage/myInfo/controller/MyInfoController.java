package kr.or.iei.myPage.myInfo.controller;

import org.apache.ibatis.annotations.Delete;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.myPage.myInfo.model.dto.MyInfo;
import kr.or.iei.myPage.myInfo.model.service.MyInfoService;

@RestController
@CrossOrigin("*")
@RequestMapping("/myInfo")
public class MyInfoController {

	@Autowired
	private MyInfoService service;
	
	//회원 한명 조회
	@GetMapping
	public ResponseEntity<ResponseDto> selectOneMember(@RequestParam String memberNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "회원 정보 조회 중, 오류가 발생하였습니다.", null , "error");
		
		try {
			MyInfo myInfo = service.selectOneMember(memberNo);
						
			
			res = new ResponseDto(HttpStatus.OK, "", myInfo, "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	
	//회원 정보 수정
	@PatchMapping
	public ResponseEntity<ResponseDto> updateMember(@RequestBody MyInfo member){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "회원정보 수정 중, 오류가 발생하였습니다.", false, "error");
		
		
		try {
			int result = service.updateMember(member);
			
			res = new ResponseDto(HttpStatus.OK, "", result, "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//회원 정보 탈퇴
	@DeleteMapping("/{memberNo}")
	public ResponseEntity<ResponseDto> deleteMember(@PathVariable String memberNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "삭제 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.deleteMember(memberNo);
			
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "회원 탈퇴가 정상 처리 되었습니다.", true, "success");
			}else {
				res = new ResponseDto(HttpStatus.OK, "삭제 중, 오류가 발생하였습니다.", false, "warning");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());

	}
}
