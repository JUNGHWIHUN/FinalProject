package kr.or.iei.book.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.admin.model.dto.BookSelectDto;
import kr.or.iei.book.model.dto.Book;
import kr.or.iei.book.model.service.BookService;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDto;

@RestController 
@CrossOrigin("*") 
@RequestMapping("/book") 
public class BookController {
	
	@Autowired
	private BookService service;

	//도서검색
	@PostMapping("/searchBookList")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> searchBookList(@RequestBody Book book){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "도서 검색 중 통신 오류가 발생하였습니다.", null, "error");
		System.out.println(book.toString());
		
		try {
			ArrayList<BookList> searchResultList = service.searchBookList(book);
			res = new ResponseDto(HttpStatus.OK, "", searchResultList, "");
			System.out.println(searchResultList);
			
			
		}catch(Exception e){
		e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}
