package kr.or.iei.myPage.lentBookList.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.admin.model.dto.LentBookList;
import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.myPage.lentBookList.model.service.LentBookListService;
import kr.or.iei.myPage.lentHistory.model.service.LentHistoryService;

@RestController
@CrossOrigin("*")
@RequestMapping("/lentBookList")
public class LentBookListController {
	
	@Autowired
	private LentBookListService service;

	//대출 현황 목록 조회
	@GetMapping
	public ResponseEntity<ResponseDto> selectBororowBook(@RequestParam String memberNo){
		
		ResponseDto res =  new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "대출 현황 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<LentBookList> lentBookList = service.selectBorrowBook(memberNo);
			System.out.println("memberNo : " + memberNo);
			res = new ResponseDto(HttpStatus.OK, "", lentBookList, "success");
			System.out.println("lentBookList : " +lentBookList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//대출 연장할 메소드
	@PatchMapping("/renewBook")
	public ResponseEntity<ResponseDto> renewBook(@RequestParam String lentBookNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "대출 연장하기 중, 오류가 발생하였습니다.", false, "error");
		
		try {
			int result = service.renewBook(lentBookNo);
			
			System.out.println(result);
			
			if(result == -1) {
				
				res = new ResponseDto(HttpStatus.OK, "예약된 도서입니다.", result, "warning");
			}else if (result == 0){
				res = new ResponseDto(HttpStatus.OK, "이미 연장하셨습니다.", result, "warning");
			}else {
				res = new ResponseDto(HttpStatus.OK, "연장에 성공하였습니다.", result, "success");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}
