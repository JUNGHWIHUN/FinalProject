package kr.or.iei.reservation.controller;

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
import kr.or.iei.reservation.model.dto.Reservation;
import kr.or.iei.reservation.model.service.ReservationService;

@RestController
@CrossOrigin("*")
@RequestMapping("/reservation")
public class ReservationController {
	@Autowired
	private ReservationService service;
	
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
	
	@PostMapping("/delete")
	public ResponseEntity<ResponseDto> deleteReservation(@RequestBody Reservation reservation ){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "예약 취소 중 , 오류가 발생하였습니다.", null, "error");

		try {
			int result = service.deleteReservation(reservation);
			res = new ResponseDto(HttpStatus.OK, "", result, "");
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());

	}
}
