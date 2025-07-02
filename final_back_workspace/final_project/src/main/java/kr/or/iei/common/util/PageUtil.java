package kr.or.iei.common.util;

import org.springframework.stereotype.Component;

import kr.or.iei.common.model.dto.PageInfoDto;

@Component
public class PageUtil {
	
	public PageInfoDto getPageInfo(int reqPage, int viewCnt, int pageNaviSize, int totalCount) {
		
		int end = reqPage * viewCnt;	//마지막 페이지 번호
		int start = end - viewCnt + 1;	//시작 번호
		
		//전체 페이지 수
		/* ex) 
		 * totalPage(전체 페이지 수) : 30
		 * viewCnt : 12 (한 페이지에 나오는 게시글 수)
		 * 
		 * totalCount / (double) viewCnt
		 *    30   / 12.0
		 *    30.0 / 12.0 = 2.5
		 *    
		 * Math.ceil(2.5) => 3.0 => 3
		 */
		
		int totalPage = (int) Math.ceil(totalCount / (double)viewCnt);	//ceil : 올림 처리
		
		//시작 페이지 번호
		int pageNo = ((reqPage - 1) / pageNaviSize) * pageNaviSize + 1;
		
		//별도로 생성한 PageInfoDto 클래스 객체에 담아 반환
		return new PageInfoDto(start, end, pageNo, pageNaviSize, totalPage);
	}
	
}
