package kr.or.iei.admin.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.admin.model.dto.BookSelectDto;
import kr.or.iei.admin.model.dto.UserOne;
import kr.or.iei.admin.model.service.AdminService;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDto;

@RestController
@CrossOrigin("*")
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminService service;
	
	
	//대출을 위해 책제목, 저작자, ISBN 중 하나 이상을 받아서 검색하기.
	@PostMapping("/selectBooks")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectBookList(@RequestBody BookSelectDto bookSelectDto){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			System.out.println(bookSelectDto);
			ArrayList<BookList> list = service.selectBookList(bookSelectDto);
			res = new ResponseDto(HttpStatus.OK, "", list, "");
			
			
		}catch(Exception e){
		e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//대출을 위해 책 상세 페이지에서 유저 정보 불러오기.
	@PostMapping("/selectUser")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectUserOne(@RequestBody UserOne userOne){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<UserOne> list = service.selectOneUser(userOne);
			res = new ResponseDto(HttpStatus.OK, "", list, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}
