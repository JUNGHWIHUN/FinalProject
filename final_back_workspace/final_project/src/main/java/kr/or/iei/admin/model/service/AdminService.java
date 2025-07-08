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
import kr.or.iei.book.model.dto.Book;
import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;

@Service
public class AdminService {

	@Autowired
	private AdminDao dao;
	
	@Autowired
	private PageUtil pageUtil;

	
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
		
		
		String memberName = dao.selectMemberName(bookLenter.getMemberNo());
		String bookTitle = dao.selectBookTitle(bookLenter.getBookNo());
		bookLenter.setBookName(bookTitle);
		bookLenter.setMemberName(memberName);
		
		
		
		//등록
		dao.insertLentBook(bookLenter);
		System.out.println("1단계 성공");
		result++;
		
		//책 상태 변경
		dao.updateBookStatus(bookLenter.getBookNo());
	    System.out.println("2단계 성공");
	    result++;
	    
	    //유저 상태 변경
	    dao.updateMemberBorrowCount(bookLenter.getMemberNo());
	    System.out.println("3단계 성공");
	    result++;
	   //유저 상태 변경
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


	public HashMap<String, Object> selectAllBook(int reqPage, String type, String keyword) {
		int viewCnt = 10;						//한 페이지당 게시글 수
		int pageNaviSize = 5;					//페이지 네비게이션 길이
		int totalCount = dao.selectAllBookCount();//전체 게시글 수
		
		//페이징 정보
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
				
		//게시글 목록
		ArrayList<BookList> BookList = dao.selectAllBookList(pageInfo, type, keyword);
			
		HashMap<String, Object> bookMap = new HashMap<String, Object>();
		bookMap.put("bookList", BookList);
		bookMap.put("pageInfo", pageInfo);
				
		return bookMap;
		
	
	}


	public HashMap<String, Object> selectAllLendBook(int reqPage, String type, String keyword) {
		int viewCnt = 10;						//한 페이지당 게시글 수
		int pageNaviSize = 5;					//페이지 네비게이션 길이
		int totalCount = dao.selectAllLendBookCount();//전체 게시글 수
		
		System.out.println("전체 글 수 "  + totalCount);
		
		//페이징 정보
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		
		
		//게시글 목록
		ArrayList<LentBookList> BookList = dao.selectAllLendBookList(pageInfo, type, keyword);
		System.out.println("리스트 정보 조회");
		HashMap<String, Object> bookMap = new HashMap<String, Object>();
		bookMap.put("bookList", BookList);
		bookMap.put("pageInfo", pageInfo);
				
		return bookMap;
	}

	@Transactional
	public int fixBook(Book book) {
		
		int result = dao.fixBook(book);
		return result;
	}
	
	
	
	
}
