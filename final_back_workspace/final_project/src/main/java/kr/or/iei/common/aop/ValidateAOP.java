package kr.or.iei.common.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import kr.or.iei.common.exception.CommonException;
import kr.or.iei.common.util.JwtUtils;

/* AOP : 관점 지향 프로그래밍
 * 		- 공통 기능을 핵심 비즈니스 로직과 분리하여 재사용성과 유지보수성을 향상시킬 수 있음
 * 		- 횡단 관심사 (트랜잭션, 로깅 처리 등) 을 비즈니스 로직과 분리
 */

@Component
@Aspect
public class ValidateAOP {

	//PointCut : 공통 기능을 수행할 메소드를 지정할 때 사용하는 어노테이션
	@Pointcut("execution(* kr.or.iei.*.controller.*.*(..))")	//* : 모든 반환 자료형, kr.or.iei.*.controller.*.*(..)" : 모든 패키지의 컨트롤러 하위에 있는 자바 파일과 그 하위의 모든 메소드, 모든 매개변수
	public void allControllerPointCut() {}	//구현부 없음 : 단순 지정 기능만 수행하기 때문
	
	@Pointcut("@annotation(kr.or.iei.common.annotation.NoTokenCheck)")	//제외할 어노테이션의 경로 지정
	public void noTokenCheckAnnotation() {}
	
	@Autowired
	private JwtUtils jwtUtils;
	
	//모든 컨트롤러 메소드가 실행되기 전에 수행할 공통 로직
	@Before("allControllerPointCut() && !noTokenCheckAnnotation()")	//두 조건을 모두 만족하는 메소드에만 적용됨 :  모든 컨트롤러 메소드 중, noTokenCheck 가 작성되지 않은 메소드가 실행되기 이전에 수행할 공통 로직
	public void validateTokenAop() {
		//요청 객체 얻어오기
		HttpServletRequest request = ((ServletRequestAttributes)(RequestContextHolder.currentRequestAttributes())).getRequest();
		
		//헤더에서 토큰 추출
		/*
		 * URL ex) : http://localhost:9999/member/checkPw
		 * URI ex) : /member/checkPw
		 */
		String uri = request.getRequestURI();
		
		//재발급 요청일 때만 refreshToken 추출, 그 이외에는 accessToken 추출 ("Authorization" 키 이름을 저장되어 있음)
		String token = uri.endsWith("refresh") ? request.getHeader("refreshToken") : request.getHeader("Authorization");	
		
		//토큰 검증 메소드 호출
		Object resObj = jwtUtils.validateToken(token);
		
		//토큰 검증 실패시
		if(resObj instanceof HttpStatus httpStatus) {
			CommonException ex = new CommonException("invalid jwtToken in request Header");	//sts 콘솔창 하단에 표시할 메시지
			ex.setErrorCode(httpStatus);	//401 또는 403 코드
			throw ex;	//이 예외는 컨트롤러에 도달하기 전에 실행되기 전에 발생하므로 컨트롤러에서 예외 처리 불가능 : 이 예외를 처리할 ExceptionHandler 클래스 필요
		}
	}
}
