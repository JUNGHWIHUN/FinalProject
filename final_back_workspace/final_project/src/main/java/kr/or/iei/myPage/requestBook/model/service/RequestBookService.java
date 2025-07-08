package kr.or.iei.myPage.requestBook.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.myPage.lentHistory.model.dto.LentHistory;
import kr.or.iei.myPage.requestBook.model.dao.RequestBookDao;

@Service
public class RequestBookService {

	@Autowired
	private RequestBookDao dao;
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectRequestBook(int reqPage, String memberNo) {
		int viewCnt = 10;					//한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 표기하기 위해)
		int pageNaviSize = 5;				//페이지 네비게이션 길이
		
		int totalCount = dao.selectRequestBook(memberNo);
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		HashMap<String, Object> paramMap = new HashMap<>();
		paramMap.put("pageInfo", pageInfo);
		paramMap.put("memberNo", memberNo);
		
		ArrayList<LentHistory> requestBookList = dao.selectRequestBookList(paramMap);
		HashMap<String, Object> requestBookMap = new HashMap<String,Object>();
		
		requestBookMap.put("requestBookList", requestBookList);
		requestBookMap.put("pageInfo", pageInfo);
		
						
		return requestBookMap;
	}
	
}
