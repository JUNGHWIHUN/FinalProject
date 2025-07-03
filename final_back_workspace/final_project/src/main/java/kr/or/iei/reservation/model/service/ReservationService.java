package kr.or.iei.reservation.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.reservation.model.dao.ReservationDao;
import kr.or.iei.reservation.model.dto.Reservation;

@Service
public class ReservationService {

	@Autowired
	private ReservationDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	public HashMap<String, Object> selectReservationList(int reqPage , String memberNo) {
		
		int viewCnt = 10;
		int pageNaviSize = 5;
		int totalCount = dao.selectReservationCount();
		
		//페이지 네비게이션 정보
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		HashMap<String, Object> paramMap = new HashMap<>();
		paramMap.put("start", pageInfo.getStart());
		paramMap.put("end", pageInfo.getEnd());
		paramMap.put("memberNo", memberNo);

		ArrayList<Reservation> reservationList = dao.selectReservationList(paramMap);
		HashMap<String, Object> reservationMap = new HashMap<String, Object>();
		reservationMap.put("reservationList", reservationList);
		reservationMap.put("pageInfo", pageInfo);
		reservationMap.put("memberNo", memberNo);
		
		
		
		return reservationMap;
	}

	@Transactional
	public int deleteReservation(Reservation reservation) {
		//책 테이블 can_lend 도서 대출 가능 여부 L-> T로 업데이트
		int result = 0;
		
		result = dao.updateBookCanLend(reservation.getReservationCallNo());
		
		
		
		
		//취소버튼 누를 시 해당 행 삭제하기 위한 메소드 
		if(result > 0) {
			result = dao.deleteReservation(reservation.getReservationNo());
			
			
		}
		
		return result;
	}

	
}
