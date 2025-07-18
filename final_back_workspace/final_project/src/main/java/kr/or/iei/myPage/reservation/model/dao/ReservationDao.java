package kr.or.iei.myPage.reservation.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.myPage.reservation.model.dto.Reservation;


@Mapper
public interface ReservationDao {

	int selectReservationCount(String reservationMemberNo);

	ArrayList<Reservation> selectReservationList(HashMap<String, Object> paramMap);
	
	int selfReservateCheck(Reservation reservateBook);

	int updateBookCanLendToL(String reservationCallNo);

	int updateBookCanLendToT(String reservationCallNo);
	
	int deleteReservation(long reservationNo);

	int reservateBook(Reservation reservateBook);

	void updateBookIsReservated(String callNo);

	void updateLentBookIsReservated(String callNo);

	int updateLentBookReservation(String reservationCallNo);




}
