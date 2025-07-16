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
				
				//대출도서 테이블의 예약 상태도 F 에서 T 로 변경
				dao.updateLentBookIsReservated(callNo);
			}
		}
		return result;
	}
	
	
	//예약현황 조회
	public HashMap<String, Object> selectReservationList(int reqPage , String reservationMemberNo ) {
		
		int viewCnt = 10;
		int pageNaviSize = 5;
		int totalCount = dao.selectReservationCount(reservationMemberNo);
		
		//페이지 네비게이션 정보
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
	    HashMap<String, Object> paramMap = new HashMap<>();
	    paramMap.put("pageInfo", pageInfo);
	    paramMap.put("memberNo", reservationMemberNo);
	   

		
	
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
		
		String actualReturnDate = reservation.getActualReturnDate();
		
		//책이 현재 반납되지 않은 경우 : R -> L 로 (대출중)
		if(actualReturnDate == null) {
			result = dao.updateBookCanLendToL(reservation.getReservationCallNo());
		//책이 현재 반납된 경우에서 예약취소를 누른 경우 : R -> T (대출가능)
		} else if (actualReturnDate != null)
			result = dao.updateBookCanLendToT(reservation.getReservationCallNo());
		
		//취소버튼 누를 시 해당 행 삭제하기 위한 메소드 
		if(result > 0) {
			result = dao.deleteReservation(reservation.getReservationNo());
			
			
		}
		
		return result;
	}


	
}
