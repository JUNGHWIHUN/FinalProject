package kr.or.iei.myPage.myInfo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
	
}
