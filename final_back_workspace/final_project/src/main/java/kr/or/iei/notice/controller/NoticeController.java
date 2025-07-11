package kr.or.iei.notice.controller;

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
	public ResponseEntity<ResponseDto> selectNoticeList(@RequestBody Notice notice ,@PathVariable int reqPage){
		
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "공지사항 목록 조회 중, 오류가 발생하였습니다.", null	, "error");
		
		
		
		try {
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}
