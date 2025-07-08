package kr.or.iei.myPage.requestBook.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.myPage.requestBook.model.service.RequestBookService;

@RestController
@CrossOrigin("*")
@RequestMapping("/requestBook")
public class RequestBookController {
	
	@Autowired
	private RequestBookService service;
	
	@GetMapping("/{reqPage}")
	public ResponseEntity<ResponseDto> selectRequestBook(@PathVariable int reqPage, @RequestParam String memberNo){
		
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "희망도서 신청 내역 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> requestBookMap = service.selectRequestBook(reqPage, memberNo);
			res = new ResponseDto(HttpStatus.OK, "", requestBookMap, "");
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}

}
