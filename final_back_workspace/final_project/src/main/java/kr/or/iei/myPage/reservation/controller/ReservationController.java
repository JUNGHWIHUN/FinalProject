package kr.or.iei.myPage.reservation.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.myPage.reservation.model.dto.Reservation;
import kr.or.iei.myPage.reservation.model.service.ReservationService;


@RestController
@CrossOrigin("*")
@RequestMapping("/reservation")
public class ReservationController {
	@Autowired
	private ReservationService service;
	
	//도서 예약
	@PostMapping("/reservateBook")
	public ResponseEntity<ResponseDto> reservateBook(@RequestBody Reservation reservateBook){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "예약 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			int result = service.reservateBook(reservateBook);
			
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "예약되었습니다", result, "success");
			} else if (result == -1) {
				res = new ResponseDto(HttpStatus.OK, "본인이 대출중인 도서는 예약할 수 없습니다", result, "warning");
			} else {
				res = new ResponseDto(HttpStatus.OK, "서평 작성 도중 오류가 발생했습니다", result, "warning");			
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//예약 목록 조회
	@GetMapping("/{reqPage}")
	public ResponseEntity<ResponseDto> selectReservationList(@PathVariable int reqPage ,@RequestParam String memberNo){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "예약현황 조회 중, 오류가 발생하였습니다.", null, "error");
		
		try {
			HashMap<String, Object> reservationMap = service.selectReservationList(reqPage,memberNo);
			res = new ResponseDto(HttpStatus.OK, "", reservationMap, "");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	//예약 취소
	@PostMapping("/delete")
	public ResponseEntity<ResponseDto> deleteReservation(@RequestBody Reservation reservation ){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "예약 취소 중 , 오류가 발생하였습니다.", null, "error");

		try {
			int result = service.deleteReservation(reservation);
			
			if(result > 0) {
				
				res = new ResponseDto(HttpStatus.OK, "예약이 정상적으로 취소되었습니다.", result, "success");
			}else {
				res = new ResponseDto(HttpStatus.OK, "예약 취소 중, 오류가 발생하였습니다..", result, "warning");

			}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());

	}
}
