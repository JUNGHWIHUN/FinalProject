package kr.or.iei.myPage.statistics.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.myPage.statistics.model.dto.StatisTics;
import kr.or.iei.myPage.statistics.model.service.StatisTicsService;

@RestController
@CrossOrigin("*")
@RequestMapping("/statistics")
public class StatisTicsController {

	@Autowired
	private StatisTicsService service;
	
	
	
	//사용자가 대출한 월 목록 조회
	@GetMapping("/months")
	public ResponseEntity<ResponseDto> selectAvailalbeMonths(@RequestParam String memberNo){
		ResponseDto res = new ResponseDto(HttpStatus.OK, "월 목록 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<StatisTics> statisTics = service.selectAvailableMonths(memberNo);
			
			
			
			res= new ResponseDto(HttpStatus.OK, "", statisTics, "");
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	
	//독서 통계를 위한 대출된 도서 조회
	@GetMapping
	public ResponseEntity<ResponseDto> selectStatisTics(@RequestParam String memberNo, @RequestParam String month){
		
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<StatisTics> statisTics = service.selectStatisTics(memberNo, month);
			res = new ResponseDto(HttpStatus.OK, "", statisTics, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
}
