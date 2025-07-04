package kr.or.iei.admin.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.admin.model.dao.AdminDao;
import kr.or.iei.admin.model.dto.BookLenterDto;
import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.admin.model.dto.BookSelectDto;
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
		System.out.println("시스템 진입 성공");
		
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
	
	
	
	
}
