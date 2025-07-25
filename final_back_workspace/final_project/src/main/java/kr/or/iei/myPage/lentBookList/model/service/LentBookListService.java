package kr.or.iei.myPage.lentBookList.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.admin.model.dto.LentBookList;
import kr.or.iei.myPage.lentBookList.model.dao.LentBookListDao;

@Service
public class LentBookListService {

	@Autowired
	private LentBookListDao dao;

	//대출된 도서 현황 조회
	public ArrayList<LentBookList> selectBorrowBook(String memberNo) {
		// TODO Auto-generated method stub
		return dao.selectBorrowBook(memberNo);
	}

	//대출 연장할 메소드
	public int renewBook(String lentBookNo) {
		
		System.out.println("책번호 : " + lentBookNo);
		int result = dao.selectCheckReservation(lentBookNo);
		System.out.println("예약검증:" +  result);
		
		if(result > 0) {
			
			return -1;//예약되어있음
		}else {
			result = dao.renewBook(lentBookNo);//0= 연장불가 0> = 연장성공?
		}
		return result;
		
	}
}
