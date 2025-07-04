package kr.or.iei.admin.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.admin.model.dao.AdminDao;
import kr.or.iei.admin.model.dto.BookLenterDto;
import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.admin.model.dto.BookSelectDto;
import kr.or.iei.admin.model.dto.LentBookDto;
import kr.or.iei.admin.model.dto.LentBookList;
import kr.or.iei.admin.model.dto.UserOne;

@Service
public class AdminService {

	@Autowired
	private AdminDao dao;

	
	public ArrayList<BookList> selectBookList(BookSelectDto bookSelectDto) {
		
		return dao.selectBookList(bookSelectDto);
	}


	public ArrayList<UserOne> selectOneUser(UserOne userOne) {
		
		return dao.selectOneUser(userOne);
	}

	@Transactional
	public int insertLentBook(BookLenterDto bookLenter) {
		
		//작업을 완료했는지 디버깅용
		int result = 0;
		
		dao.insertLentBook(bookLenter);
		System.out.println("1단계 성공");
		result++;
		
		dao.updateBookStatus(bookLenter.getBookNo());
	    System.out.println("2단계 성공");
	    result++;
	    
	    dao.updateMemberBorrowCount(bookLenter.getMemberNo());
	    System.out.println("3단계 성공");
	    result++;
	   
	    dao.updateMemberCanBorrow(bookLenter.getMemberNo());
	    System.out.println("4단계 성공");
	    result++;
	    
	    System.out.println("result :" + result);
	    return result;
	}


	public ArrayList<LentBookList> selectLentBook(LentBookDto lentBook) {
		
		return dao.selectLentBook(lentBook);
	}

	@Transactional
	public int returnBook(LentBookList lentBook) {
		//반납 날짜 등록, 예약자 유무에 따라 대출가능상태로 전환, 연체 일수 계산 후 등록.
		System.out.println("성공0");
		
		//대출된 도서 테이블에 실 반납 날짜 등록.
		dao.updateactual(lentBook.getLentbookNo());
		System.out.println("성공1");
		//예약여부가 있다면 처리 없음. 없다면 대출 가능상태로 변경.
		if(lentBook.getReservation().equals("F")) {
			dao.updatecanLend(lentBook.getCallNo());
			System.out.println("성공2");
		}
		
		//회원에 대해 현재 대출 도서 권수 -1
		dao.updateborrowedcount(lentBook.getMemberNo());
		System.out.println("성공3");
		
		//회원에 대해 연체 일자 등록
		HashMap<String, String> param = new HashMap<String, String>();
		param.put("lentbookNo", lentBook.getLentbookNo());
		param.put("memberNo", lentBook.getMemberNo());

		dao.updateOverdueDayCount(param);
		System.out.println("성공4");
		
		//회원에 대해 대출 가능 여부 가능으로 변경
		dao.updateborrowed(lentBook.getMemberNo());
		System.out.println("성공5");
		
		
		
		
		return 1;
	}
	
	
	
	
}
