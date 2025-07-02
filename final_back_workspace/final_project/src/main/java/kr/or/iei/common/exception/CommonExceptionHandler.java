package kr.or.iei.common.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import kr.or.iei.common.model.dto.ResponseDto;

@RestControllerAdvice	//전역 예외 처리기 (해당 어노테이션이 작성된 컨트롤러에서 예외 발생 시 해당 예외를 처리할 핸들러 클래스)
public class CommonExceptionHandler {

	//발생한 예외 종류가 CommonException 일 때 처리할 핸들러 메소드
	@ExceptionHandler(CommonException.class)
	public ResponseEntity<ResponseDto> commonExceptionHandle(CommonException ex){
		ex.printStackTrace();	//개발자가 예외 내용을 파악할 수 있도록 콘솔에 출력

		ResponseDto res = new ResponseDto(ex.getErrorCode(), "", null, "" );	//발생한 예외의 에러 코드 저장
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
}
