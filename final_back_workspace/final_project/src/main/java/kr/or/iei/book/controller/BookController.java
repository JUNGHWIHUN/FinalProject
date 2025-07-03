package kr.or.iei.book.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.book.model.dto.Book;
import kr.or.iei.book.model.dto.BookComment;
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
	public ResponseEntity<ResponseDto> searchBookList(@RequestBody Map<String, Object> requestBodyMap){	//검색정보 Book 객체와 요청 페이지를 담고 있음
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
						
		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//도서 1권 조회(상세보기)
	@GetMapping("/bookDetail/{callNo}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectOneBook(@PathVariable String callNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "도서 상세정보 조회 중 통신 오류가 발생하였습니다.", null, "error");

		try {
			Book book = service.selectOneBook(callNo);	
			res = new ResponseDto(HttpStatus.OK, "", book, "");
						
		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//서평 목록 불러오기
	@PostMapping("/commentList")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectCommentList(@RequestBody Map<String, Object> requestBodyMap){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "서평 불러오기 중 통신 오류가 발생하였습니다.", null, "error");
		
		//전달받은 값 추출 : 청구기호, 요청 페이지
		String callNo = (String)requestBodyMap.get("callNo");
		Integer reqPage = (Integer)requestBodyMap.get("reqPage");
		
		try {			
			//검색정보와 요청 페이지 정보를 함께 전달해 service 객체에서 처리
			HashMap<String, Object> commentListMap = service.selectCommentList(callNo, reqPage);
			res = new ResponseDto(HttpStatus.OK, "", commentListMap, "");

		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
		
	//서평 작성
	@PostMapping("/insertComment")
	public ResponseEntity<ResponseDto> insertComment(@RequestBody BookComment comment){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "서평 입력 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			//검색정보와 요청 페이지 정보를 함께 전달해 service 객체에서 처리
			int result = service.insertComment(comment);	
			
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "서평이 작성되었습니다", result, "success");			
			} else if (result == -1) {
				res = new ResponseDto(HttpStatus.OK, "이미 서평을 작성했습니다", result, "warning");			
			} else {
				res = new ResponseDto(HttpStatus.OK, "서평 작성 도중 오류가 발생했습니다", result, "warning");			
			}
						
		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
    //이 분야의 인기 도서 조회
    @GetMapping("/popular/{genreCode}")
    @NoTokenCheck
    public ResponseEntity<ResponseDto> getPopularBooksByGenre(@PathVariable String genreCode) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "인기 도서 조회 중 통신 오류 발생", null, "error");
        try {
            List<Book> popularBooks = service.getPopularBooksByGenre(genreCode);
            res = new ResponseDto(HttpStatus.OK, "", popularBooks, "");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(res, res.getHttpStatus());
    }
    
    //이 분야의 신착 도서 조회
    @GetMapping("/newArrivals/{genreCode}")
    @NoTokenCheck
    public ResponseEntity<ResponseDto> getNewArrivalsByGenre(@PathVariable String genreCode) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "신착 도서 조회 중 통신 오류 발생", null, "error");
        try {
            List<Book> newArrivals = service.getNewArrivalsByGenre(genreCode);
            res = new ResponseDto(HttpStatus.OK, "", newArrivals, "");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(res, res.getHttpStatus());
    }
	
}
