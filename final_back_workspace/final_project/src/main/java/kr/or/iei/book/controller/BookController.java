package kr.or.iei.book.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

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
	public ResponseEntity<ResponseDto> searchBookList(@RequestBody Map<String, Object> requestBodyMap){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "도서 검색 중 통신 오류가 발생하였습니다.", null, "error");

        Book searchBook = new Book(); // 서비스에 전달할 Book 객체를 Map 에서 추출해 생성
        searchBook.setTitleInfo((String) requestBodyMap.get("titleInfo"));
        searchBook.setAuthorInfo((String) requestBodyMap.get("authorInfo"));
        searchBook.setPubInfo((String) requestBodyMap.get("pubInfo"));
        searchBook.setISBN((String) requestBodyMap.get("ISBN")); 
        searchBook.setPubYearFrom((String) requestBodyMap.get("pubYearFrom"));
        searchBook.setPubYearTo((String) requestBodyMap.get("pubYearTo"));
		
        Integer reqPage = (Integer) requestBodyMap.get("reqPage"); //요청 페이지 추출

		try {
			//검색정보와 요청 페이지 정보를 함께 전달해 service 객체에서 처리
			HashMap<String, Object> bookMap = service.selectBookList(searchBook, reqPage);	
			res = new ResponseDto(HttpStatus.OK, "", bookMap, "");

			/*ArrayList<BookList> searchResultList = service.searchBookList(book);
			res = new ResponseDto(HttpStatus.OK, "", searchResultList, "");
			System.out.println(searchResultList);*/
						
		}catch(Exception e){
		e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}
