package kr.or.iei.notice.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.notice.model.dao.NoticeDao;
import kr.or.iei.notice.model.dto.Notice;



@Service
public class NoticeService {

	@Autowired
	private NoticeDao dao;

	@Autowired
	private PageUtil pageUtil;
	
	public HashMap<String, Object> selectNoticeList(int reqPage) {

		int viewCnt = 12;						//한 페이지당 게시글 수
		int pageNaviSize = 5;					//페이지 네비게이션 길이
		int totalCount = dao.selectNoticeCount();//전체 게시글 수
			
		
		//페이징 정보
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		//게시글 목록
		ArrayList<Notice> noticeList = dao.selectNoticeList(pageInfo);
		
		HashMap<String, Object> noticeMap = new HashMap<String, Object>();
		noticeMap.put("noticeList", noticeList);
		noticeMap.put("pageInfo", pageInfo);
		
		return noticeMap;
	}

	//게시글 한개 조회
	public Notice selectOneBoard(String noticeNo) {
		// TODO Auto-generated method stub
		return dao.selectOneBoard(noticeNo);
	}
	
}
