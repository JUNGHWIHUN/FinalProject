package kr.or.iei.requestBook.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.requestBook.model.dto.SubmitRequestBook;
import kr.or.iei.requestBook.model.service.RequestBookService;

@RestController
@CrossOrigin("*")
@RequestMapping("/requestBook")
public class RequestBookController {

	@Autowired
	private RequestBookService service;
	
	@PostMapping("/detailBook")
	public ResponseEntity<ResponseDto> requestBook(@RequestBody SubmitRequestBook book) {
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "도서신청 중, 오류가 발생하였습니다.", false, "error");
		
		try {
		int result = service.insertRequestBook(book);
		if(result > 0) {
			res = new ResponseDto(HttpStatus.OK, "도서신청이 완료되었습니다.", true, "success");
		}else if(result == 0){
			res = new ResponseDto(HttpStatus.OK, "도서신청 중, 오류가 발생하였습니다", false, "warning"); 
		}else {
			res = new ResponseDto(HttpStatus.OK, "도서신청은 1달에 1권만 가능합니다", false, "warning"); 
		}
		}catch(Exception e) {
		e.printStackTrace();
	}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	@PostMapping("/wishBookDirect")
	public ResponseEntity<ResponseDto> wishBookDirect(@RequestBody SubmitRequestBook book) {
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "도서신청 중, 오류가 발생하였습니다.", false, "error");
		
		try {
		int result = service.insertRequestBook(book);
		if(result > 0) {
			res = new ResponseDto(HttpStatus.OK, "도서신청이 완료되었습니다.", true, "success");
		}else if(result == 0){
			res = new ResponseDto(HttpStatus.OK, "도서신청 중, 오류가 발생하였습니다", false, "warning"); 
		}else {
			res = new ResponseDto(HttpStatus.OK, "도서신청은 1달에 1권만 가능합니다", false, "warning"); 
		}
		}catch(Exception e) {
		e.printStackTrace();
	}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}
