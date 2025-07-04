package kr.or.iei.myPage.myLibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.myPage.myLibrary.model.dto.MyLibrary;
import kr.or.iei.myPage.myLibrary.model.service.MyLibraryService;

@RestController 
@CrossOrigin("*") 
@RequestMapping("/myLibrary") 
public class MyLibraryController {
	
	@Autowired
	private MyLibraryService service;

	//내 서재의 새로운 책장(카테고리) 만들기
	@PostMapping("/addMyLibrary")
	public ResponseEntity<ResponseDto> addNewMyLibrary(@RequestBody MyLibrary myLibrary){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "서평 수정 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.addNewMyLibrary(myLibrary);

			res = new ResponseDto(HttpStatus.OK, "서평이 수정되었습니다","" , "success");			

		}catch(Exception e){
			e.printStackTrace();
		}
	
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}
