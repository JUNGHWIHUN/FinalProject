package kr.or.iei.admin.controller;

import java.util.ArrayList;
import java.util.HashMap;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.admin.model.dto.BookLenterDto;
import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.admin.model.dto.BookSelectDto;
import kr.or.iei.admin.model.dto.LentBookDto;
import kr.or.iei.admin.model.dto.LentBookList;
import kr.or.iei.admin.model.dto.MemberDto;
import kr.or.iei.admin.model.dto.UserOne;
import kr.or.iei.admin.model.service.AdminService;
import kr.or.iei.book.model.dto.Book;
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
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중, 오류가 발생하였습니다.", null, "error");
		
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
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<UserOne> list = service.selectOneUser(userOne);
			res = new ResponseDto(HttpStatus.OK, "", list, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//대출 처리
	@PostMapping("/lentBook")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> insertbook(@RequestBody BookLenterDto bookLenter){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "대출 등록중 오류 발생..", null, "error");
		
		try {
			int result = service.insertLentBook(bookLenter);
	        if(result > 0) {
	            res = new ResponseDto(HttpStatus.OK, "대출 완료", null, "");
	        }
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	
	//반납을 위해 청구기호 기준으로 검색
	@PostMapping("/selectRetrunBooks")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectLentBook(@RequestBody LentBookDto lentBook){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "책 검색중 오류 발생..", null, "error");
		
		try {
			ArrayList<LentBookList> list = service.selectLentBook(lentBook);
			res = new ResponseDto(HttpStatus.OK, "", list, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//반납 처리
	@PostMapping("/retrunBook")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> retrunBook(@RequestBody LentBookList lentBook){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "책 검색중 오류 발생..", null, "error");
		
		try {
			int result = service.returnBook(lentBook);	
			if(result > 0) {
	            res = new ResponseDto(HttpStatus.OK, "반납 완료", "OK", "");
	        }
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//모든 책 리스트 + 검색
	@GetMapping("/allBookList/{reqPage}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> allBookList(@PathVariable int reqPage, @RequestParam String type, @RequestParam String keyword){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		System.out.println("reqPage: "+reqPage);
		System.out.println("type: "+type);
		System.out.println("keyword: "+keyword);
		try {
			HashMap<String, Object> allBookMap = service.selectAllBook(reqPage, type, keyword);
			res = new ResponseDto(HttpStatus.OK, "", allBookMap, "");
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//대출한 책 리스트
	@GetMapping("allLendBookList/{reqPage}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> allLendBookList(@PathVariable int reqPage, @RequestParam String type, @RequestParam String keyword){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중, 오류가 발생하였습니다.", null, "error");
		System.out.println("reqPage: "+reqPage);
		try {
			HashMap<String, Object> allBookMap = service.selectAllLendBook(reqPage, type, keyword);
			res = new ResponseDto(HttpStatus.OK, "", allBookMap, "");
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//책 수정하기
	@PostMapping("/fixBook")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> fixBook(@RequestBody Book book){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.fixBook(book);
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "수정 완료", null, "");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//책 삭제
	@PostMapping("/deleteBook")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> deleteBook(@RequestBody Book book){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.deleteBook(book);
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "수정 완료", null, "");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//책 등록
	@PostMapping("/inputNewBook")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> inputNewBook(@RequestBody Book book){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "조회 중, 오류가 발생하였습니다.", null, "error");
		
		
		try {
			int result = service.insertBook(book);
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "수정 완료", null, "");
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
		
		
	}
	//모든 회원 리스트
	@GetMapping("/allMemberList/{reqPage}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> allMemberList(@PathVariable int reqPage, @RequestParam String type, @RequestParam String keyword){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		System.out.println("reqPage: "+reqPage);
		System.out.println("type: "+type);
		System.out.println("keyword: "+keyword);
		
		try {
			HashMap<String, Object> allMemberMap = service.selectAllMember(reqPage, type, keyword);
			res = new ResponseDto(HttpStatus.OK, "", allMemberMap, "");
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//연체자 리스트(연체된 도서에 가까움)
	@GetMapping("/overMemberList/{reqPage}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> overMemberList(@PathVariable int reqPage, @RequestParam String type, @RequestParam String keyword){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		System.out.println("reqPage: "+reqPage);
		System.out.println("type: "+type);
		System.out.println("keyword: "+keyword);
		
		try {
			HashMap<String, Object> overMemberMap = service.selectOverMember(reqPage, type, keyword);
			res = new ResponseDto(HttpStatus.OK, "", overMemberMap, "");
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
		
	}
	
	//회원 한명에 대한 정보 가져오기
	@GetMapping("/memberDetails/{memberNo}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> getOneMember(@PathVariable String memberNo){
		System.out.println("회원 한명 정보 불러오기 시도");
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		System.out.println("잘 되는가?1");
		try {
			ArrayList<MemberDto> memberDetail = service.getOneMember(memberNo);
			System.out.println("잘 되는가?2");
			System.out.println("memberDetail: " + memberDetail);
			res = new ResponseDto(HttpStatus.OK, "", memberDetail, "");
			
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//책 하나에 대한 정보 가져오기
	@GetMapping("/bookDetails/{bookNo}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> getOneBook(@PathVariable String bookNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<BookList> bookDetail = service.getOneBook(bookNo);
			res = new ResponseDto(HttpStatus.OK, "", bookDetail, "");
			
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//어드민이 회원정보 수정.
	@PostMapping("/memberFix")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> fixMember(@RequestBody MemberDto memberDto){
			ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.fixMember(memberDto);
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "수정 완료", null, "");
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//희망도서 리스트 가져오기
	@GetMapping("/requestList/{reqPage}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> requestList(@PathVariable int reqPage){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		
		
		try {
			HashMap<String, Object> requestMap = service.selectRequestList(reqPage);
			res = new ResponseDto(HttpStatus.OK, "", requestMap, "");
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//희망도서에서 한권에 대한 처리 상태 변경
	@PostMapping("/requestUpdate")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> requestUpdate(@RequestBody Map<String, String> param){
		String type = param.get("type");
		System.out.println("type : " + type);
	    String target = param.get("target");
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.requestUpdate(type, target);
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "수정 완료", null, "");
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//건의사항 리스트 가져오기
	@GetMapping("/suggesList/{reqPage}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> suggesList(@PathVariable int reqPage){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		
		
		try {
			HashMap<String, Object> suggesMap = service.selectSuggesList(reqPage);
			res = new ResponseDto(HttpStatus.OK, "", suggesMap, "");
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//건의사항 하나 삭제 처리
	@PostMapping("/suggesDelete")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> suggesDelete(@RequestBody Map<String, Object> param){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		String target = (String) param.get("target");
		System.out.println("건의사항 삭제 타겟" + target);
		try {
			int result = service.suggesDelete(target);
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "수정 완료", null, "");
			}
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
		
	}
	
	//신고 테이블 가져오기
	@GetMapping("/reportList/{reqPage}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> reportList(@PathVariable int reqPage){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		
		
		try {
			HashMap<String, Object> reportMap = service.selectReportList(reqPage);
			res = new ResponseDto(HttpStatus.OK, "", reportMap, "");
		}catch(Exception e){
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//건의사항 하나 삭제 처리
	@PostMapping("/repartDelete")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> repartDelete(@RequestBody Map<String, Object> param){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, " 조회 중, 오류가 발생하였습니다.", null, "error");
		String target = (String) param.get("target");
		System.out.println("건의사항 삭제 타겟" + target);
		try {
			int result = service.repartDelete(target);
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "수정 완료", null, "");
			}	
		}catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
			
	}
	
	
}
