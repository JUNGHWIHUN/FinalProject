package kr.or.iei.myPage.reservation.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;
import kr.or.iei.myPage.reservation.model.dao.ReservationDao;
import kr.or.iei.myPage.reservation.model.dto.Reservation;


@Service
public class ReservationService {

	@Autowired
	private ReservationDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	//도서 예약
	@Transactional
	public int reservateBook(Reservation reservateBook) {
		//본인이 대출한 도서인지 확인
		int result = dao.selfReservateCheck(reservateBook);
		
		//현재 본인이 대출중인 도서라면 -1 반환
		if(result > 0) {
			return -1;
		}else {
		
			result = dao.reservateBook(reservateBook);
			String callNo = reservateBook.getReservationCallNo();
			
			if(result > 0) {
				//정상적으로 예약되었을 때 해당 책의 대출상태를 '예약중' 으로 변경
				dao.updateBookIsReservated(callNo);
			}
		}
		return result;
	}
	
	//예약현황 조회
	public HashMap<String, Object> selectReservationList(int reqPage , String memberNo) {
		
		int viewCnt = 10;
		int pageNaviSize = 5;
		int totalCount = dao.selectReservationCount(memberNo);
		
		//페이지 네비게이션 정보
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
	    HashMap<String, Object> paramMap = new HashMap<>();
	    paramMap.put("pageInfo", pageInfo);
	    paramMap.put("memberNo", memberNo);

		
	
		ArrayList<Reservation> reservationList = dao.selectReservationList(paramMap);
		HashMap<String, Object> reservationMap = new HashMap<String, Object>();
		reservationMap.put("reservationList", reservationList);
		reservationMap.put("pageInfo", pageInfo);
		
		
		
		
		return reservationMap;
	}

	//예약취소
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
