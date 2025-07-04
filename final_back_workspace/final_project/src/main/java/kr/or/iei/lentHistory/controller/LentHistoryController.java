package kr.or.iei.lentHistory.controller;

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
import kr.or.iei.lentHistory.model.service.LentHistoryService;

@RestController
@CrossOrigin("*")
@RequestMapping("/lentHistory")
public class LentHistoryController {

	@Autowired
	private LentHistoryService service;
	
	@GetMapping("/{reqPage}")
	public ResponseEntity<ResponseDto> selectLentHistoryList(@PathVariable int reqPage,@RequestParam String memberNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "대출 된 도서 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> lentHistoryMap = service.selectLentHistoryList(reqPage, memberNo);
			res = new ResponseDto(HttpStatus.OK, "", lentHistoryMap, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}
