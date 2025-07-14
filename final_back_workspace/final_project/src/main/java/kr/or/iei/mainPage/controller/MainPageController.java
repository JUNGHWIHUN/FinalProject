package kr.or.iei.mainPage.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.admin.model.dto.AdSuggestion;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.mainPage.model.service.MainPageService;

@RestController
@CrossOrigin("*")
@RequestMapping("/mainPage")
public class MainPageController {

	@Autowired
	private MainPageService service;
	
	//추천 도서, 베스트 북 표시를 위한 책 가져오기
	@GetMapping("/recomendedBook")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectRecomendedBook(){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> recoMap = service.selectRecomendedBook();
			res = new ResponseDto(HttpStatus.OK, "", recoMap, "");
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
		
	}
}
