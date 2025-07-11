package kr.or.iei.notice.controller;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.notice.model.dto.Notice;
import kr.or.iei.notice.model.service.NoticeService;

@RestController
@CrossOrigin("*")
@RequestMapping("/notice")
public class NoticeController {
	
	@Autowired
	private NoticeService service;
	
	@GetMapping("/noticeList/{reqPage}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectNoticeList(@PathVariable int reqPage){
		
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "공지사항 목록 조회 중, 오류가 발생하였습니다.", null	, "error");
		
		
		
		try {
			//게시글 목록과 페이지 네비게이션 정보 조회
			HashMap<String, Object> noticeMap = service.selectNoticeList(reqPage);
			res = new ResponseDto(HttpStatus.OK, "", noticeMap, "");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	
	//게시글 정보 1개 조회
	@GetMapping("/{noticeNo}")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectOneBoard(@PathVariable String noticeNo){
		
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 정보 조회 중, 오류가 발생하였습니다.", null, "error");
	
		
		try {
			
		} catch (Exception e) {
			Notice notice = service.selectOneBoard(noticeNo);
			res = new ResponseDto(HttpStatus.OK, "", notice, "");
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
}
