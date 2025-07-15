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
import kr.or.iei.book.model.dto.ReportDto;
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
			} else if (result == -2 ) {
				res = new ResponseDto(HttpStatus.OK, "해당 도서를 대출했던 회원만 작성이 가능합니다", result, "warning");
			} else {
				res = new ResponseDto(HttpStatus.OK, "서평 작성 도중 오류가 발생했습니다", result, "warning");			
			}
						
		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//서평 수정
	@PostMapping("/updateComment")
	public ResponseEntity<ResponseDto> updateComment(@RequestBody BookComment comment){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "서평 수정 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			//검색정보와 요청 페이지 정보를 함께 전달해 service 객체에서 처리
			int result = service.updateComment(comment);
			
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "서평이 수정되었습니다", result, "success");			
			} else {
				res = new ResponseDto(HttpStatus.OK, "서평 수정 도중 오류가 발생했습니다", result, "warning");			
			}
		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//서평 삭제
	@PostMapping("/deleteComment")
	public ResponseEntity<ResponseDto> deleteComment(@RequestBody BookComment comment){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "서평 삭제 중 통신 오류가 발생하였습니다.", null, "error");
		
		String commentNo = comment.getCommentNo();
		
		try {
			//검색정보와 요청 페이지 정보를 함께 전달해 service 객체에서 처리
			int result = service.deleteComment(commentNo);	
			
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "서평이 삭제되었습니다", result, "success");			
			} else {
				res = new ResponseDto(HttpStatus.OK, "서평 삭제 도중 오류가 발생했습니다", result, "warning");			
			}
						
		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
    // 서평 신고 처리 엔드포인트
    @PostMapping("/reportComment") // 프론트엔드에서 호출할 URL과 일치시킵니다.
    public ResponseEntity<Map<String, Object>> reportComment(@RequestBody ReportDto reportDTO) {
        Map<String, Object> response = new HashMap<>();
        String clientMsg;
        String alertIcon;

        // 로그인 여부, 신고자 ID 등의 유효성 검사는 프론트에서 일차적으로 처리했지만,
        // 백엔드에서도 한번 더 검증하는 것이 좋습니다.
        if (reportDTO.getReportedMemberId() == null || reportDTO.getReportedMemberId().trim().isEmpty()) {
            clientMsg = "로그인 정보가 유효하지 않습니다.";
            alertIcon = "error";
            response.put("clientMsg", clientMsg);
            response.put("alertIcon", alertIcon);
            return ResponseEntity.badRequest().body(response);
        }

        try {
            int result = service.reportComment(reportDTO);
            if (result > 0) {
                clientMsg = "서평 신고가 성공적으로 접수되었습니다.";
                alertIcon = "success";
            } else {
                clientMsg = "서평 신고에 실패했습니다. 다시 시도해주세요.";
                alertIcon = "error";
            }
        } catch (Exception e) {
            System.err.println("서평 신고 중 서버 오류 발생: " + e.getMessage());
            e.printStackTrace();
            clientMsg = "서평 신고 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
            alertIcon = "error";
        }

        response.put("clientMsg", clientMsg);
        response.put("alertIcon", alertIcon);
        return ResponseEntity.ok(response);
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
