package kr.or.iei.common.model.dto;

import org.springframework.http.HttpStatus;

//import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
//@Schema(description="응답 데이터 형식")

//컨트롤러에서 결과 처리를 하기 위해 작성한 클래스 : 통신상태, 응답 메시지, 응답 데이터를 변수로 만들어 저장해 처리 결과(정상실행/예외 모두)를 개발자가 컨트롤 가능하도록 (DTO 형식으로 응답 가능하도록) 하기 위해 생성
public class ResponseDto {
	
	//@Schema(description="http 통신 상태")
	private HttpStatus httpStatus;
	//@Schema(description="응답 메시지")
	private String clientMsg;
	//@Schema(description="응답 데이터 (등록, 수정, 삭제 시 boolean / 목록 조회 시 객체 리스트")
	private Object resData;	//모든 응답 데이터를 이 변수에 저장할 수 있도록 자료형을 Object 로 설정
	private String alertIcon;	//프론트에서 응답할 SweetAlert 아이콘의 정보를 저장할 함수
}
