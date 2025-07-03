package kr.or.iei.reservation.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.reservation.model.dto.Reservation;

@Mapper
public interface ReservationDao {

	int selectReservationCount();

	ArrayList<Reservation> selectReservationList(HashMap<String, Object> paramMap);
	

	int updateBookCanLend(String reservationCallNo);
	
	int deleteReservation(long reservationNo);


}
