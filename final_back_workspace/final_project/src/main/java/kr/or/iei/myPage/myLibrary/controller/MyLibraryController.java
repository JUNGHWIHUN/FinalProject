package kr.or.iei.myPage.myLibrary.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.book.model.dto.Book;
import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.myPage.myLibrary.model.dto.MyLibrary;
import kr.or.iei.myPage.myLibrary.model.dto.MyLibraryBook;
import kr.or.iei.myPage.myLibrary.model.service.MyLibraryService;

@RestController 
@CrossOrigin("*") 
@RequestMapping("/myLibrary") 
public class MyLibraryController {
	
	@Autowired
	private MyLibraryService service;
	
	//내 서재 목록 불러오기
	@GetMapping("/selectMyLibrary/{memberNo}")
	public ResponseEntity<ResponseDto> selectMyLibrary(@PathVariable String memberNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "새로운 내 서재 등록 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<MyLibrary> list = service.selectMyLibrary(memberNo);
			
			res = new ResponseDto(HttpStatus.OK, "", list , "");			

			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}

	//내 서재의 새로운 책장(카테고리) 만들기
	@PostMapping("/addNewMyLibrary")
	public ResponseEntity<ResponseDto> addNewMyLibrary(@RequestBody MyLibrary myLibrary){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "새로운 내 서재 등록 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.addNewMyLibrary(myLibrary);

			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "새로운 내 서재 등록이 완료되었습니다", result , "success");			
			} else {
				res = new ResponseDto(HttpStatus.OK, "새로운 내 서재 등록 중 오류가 발생하였습니다", result , "warning");		
			}

		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	
	//내 서재 이름 변경하기
	@PatchMapping("/updateMyLibraryName")
	public ResponseEntity<ResponseDto> updateMyLibraryName(@RequestBody MyLibrary myLibrary){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "내 서재 이름 변경 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.updateMyLibraryName(myLibrary);

			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "내 서재 이름이 변경되었습니다", result , "success");			
			} else {
				res = new ResponseDto(HttpStatus.OK, "내 서재 이름 변경 중 오류가 발생하였습니다", result , "warning");		
			}

		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	
	//내 서재에 새로운 도서 등록하기
	@PostMapping("/addToMyLibrary")
	public ResponseEntity<ResponseDto> addToMyLibrary(@RequestBody MyLibraryBook myLibraryBook){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "도서 등록 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.addToMyLibrary(myLibraryBook);

			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "내 서재에 해당 도서가 등록었습니다", result , "success");			
			} else if (result < 0){
				res = new ResponseDto(HttpStatus.OK, "이미 해당 서재에 등록되어 있는 도서입니다", result , "warning");		
			} else {
				res = new ResponseDto(HttpStatus.OK, "등록 중 오류가 발생하였습니다", result , "warning");		
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//내 서재에 담긴 책 불러오기
	@GetMapping("/selectMyLibraryBooks/{selectedMyLibrary}")
	public ResponseEntity<ResponseDto> selectMyLibraryBooks(@PathVariable String selectedMyLibrary){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "새로운 내 서재 등록 중 통신 오류가 발생하였습니다.", null, "error");
		try {
			ArrayList<MyLibraryBook> list = service.selectMyLibraryBooks(selectedMyLibrary);
			
			res = new ResponseDto(HttpStatus.OK, "", list , "");			
			
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	
	
}
