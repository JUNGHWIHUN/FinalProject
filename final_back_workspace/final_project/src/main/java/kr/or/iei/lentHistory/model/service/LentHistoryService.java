package kr.or.iei.lentHistory.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.lentHistory.model.dao.LentHistoryDao;
import kr.or.iei.lentHistory.model.dto.LentHistory;

@Service
public class LentHistoryService {

	@Autowired
	private LentHistoryDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectLentHistoryList(int reqPage, String memberNo) {

		
		int viewCnt = 10;					//한 페이지당 보여줄 게시글 갯수 (기존 게시글 목록과 다르게 10개씩 표기하기 위해)
		int pageNaviSize = 5;				//페이지 네비게이션 길이
		
		int totalCount = dao.selectLentHistoryCount(memberNo);
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		HashMap<String, Object> paramMap = new HashMap<>();
		paramMap.put("pageInfo", pageInfo);
		paramMap.put("memberNo", memberNo);
		
		ArrayList<LentHistory> lentHistoryList = dao.selectLentHistoryList(paramMap);
		HashMap<String, Object> lentHistoryMap = new HashMap<String,Object>();
		
		lentHistoryMap.put("lentHistoryList", lentHistoryList);
		lentHistoryMap.put("pageInfo", pageInfo);
		
						
		return lentHistoryMap;
	}
}
