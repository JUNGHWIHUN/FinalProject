package kr.or.iei.admin.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.admin.model.dao.AdminDao;
import kr.or.iei.admin.model.dto.AdRepartDto;
import kr.or.iei.admin.model.dto.AdSuggestion;
import kr.or.iei.admin.model.dto.BookLenterDto;
import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.admin.model.dto.BookSelectDto;
import kr.or.iei.admin.model.dto.LentBookDto;
import kr.or.iei.admin.model.dto.LentBookList;
import kr.or.iei.admin.model.dto.MemberDto;
import kr.or.iei.admin.model.dto.RequestBook;
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
		
	    System.out.println(bookLenter.toString());

		
		//등록
		dao.insertLentBook(bookLenter);
		//예약된 같은 청구기호의 책 삭제
		dao.deletereBook(bookLenter);
		
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
		//예약 여부 없음
		if(lentBook.getReservation().equals("F")) {
			dao.updatecanLend(lentBook.getCallNo());
			System.out.println("성공2");
		//예약여부가 있다면 실제 반납날자 업데이트
		//예약 여부 있음.
		}else if(lentBook.getReservation().equals("T")){
			dao.updateReservationActualReturnDate(lentBook.getCallNo());
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
		int totalCount = dao.selectAllLendBookCount();//전체 게시글 수??? 생각해보니 검색 되도록 만들어지면서 수정해야함 ㅇㅇ
		
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


	public int deleteBook(Book book) {
		
		int result = dao.deleteBook(book);
		
		return result;
	}


	public int insertBook(Book book) {
		int result = dao.insertBook(book);
		return result;
	}


	public HashMap<String, Object> selectAllMember(int reqPage, String type, String keyword) {
		int viewCnt = 10;						//한 페이지당 게시글 수
		int pageNaviSize = 5;					//페이지 네비게이션 길이
		int totalCount = dao.selectAllmemberCount(type, keyword);//전체 게시글 수
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		//게시글 목록
		ArrayList<MemberDto> memberList = dao.selectAllmemberList(pageInfo, type, keyword);
		System.out.println("리스트 정보 조회");
		HashMap<String, Object> memberMap = new HashMap<String, Object>();
		memberMap.put("memberList", memberList);
		memberMap.put("pageInfo", pageInfo);
						
		return memberMap;
		
	}


	public HashMap<String, Object> selectOverMember(int reqPage, String type, String keyword) {
		int viewCnt = 10;						//한 페이지당 게시글 수
		int pageNaviSize = 5;					//페이지 네비게이션 길이
		int totalCount = dao.selectIOverMemberCount(type, keyword);//연체된 책 수
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		System.out.println("여기까진 잘 되나");
		
		//게시글 목록
		ArrayList<LentBookList> memberList = dao.selectOverMemberList(pageInfo, type, keyword);
		System.out.println("리스트 정보 조회");
		HashMap<String, Object> memberMap = new HashMap<String, Object>();
		memberMap.put("memberList", memberList);
		memberMap.put("pageInfo", pageInfo);
						
		return memberMap;
	}


	public ArrayList<MemberDto> getOneMember(String memberNo) {
		return dao.getOneMember(memberNo);
	}


	public ArrayList<BookList> getOneBook(String bookNo) {
		// TODO Auto-generated method stub
		return dao.getOneBook(bookNo);
	}

	@Transactional
	public int fixMember(MemberDto memberDto) {
		// TODO Auto-generated method stub
		return dao.fixMember(memberDto);
	}


	public HashMap<String, Object> selectRequestList(int reqPage) {
		int viewCnt = 10;						//한 페이지당 게시글 수
		int pageNaviSize = 5;					//페이지 네비게이션 길이
		int totalCount = dao.selectRequestCount();//연체된 책 수
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		System.out.println("여기까진 잘 되나");
		
		//게시글 목록
		ArrayList<RequestBook> RequestList = dao.selectRequestList(pageInfo);
		System.out.println("리스트 정보 조회");
		HashMap<String, Object> memberMap = new HashMap<String, Object>();
		memberMap.put("RequestList", RequestList);
		memberMap.put("pageInfo", pageInfo);
						
		return memberMap;
	}

	@Transactional
	public int requestUpdate(String type, String target) {
		
		int result = 0;
		
		if(type.equals("yes")) {
			result = dao.requestUpdateYes(target);
		}else if(type.equals("no")) {
			result = dao.requestUpdateNo(target);
		}
		
		return result;
	}


	public HashMap<String, Object> selectSuggesList(int reqPage) {
		int viewCnt = 10;						//한 페이지당 게시글 수
		int pageNaviSize = 5;					//페이지 네비게이션 길이
		int totalCount = dao.selectSuggesCount();//건의사항 갯수
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		System.out.println("여기까진 잘 되나");
		
		//게시글 목록
		ArrayList<AdSuggestion> SuggesList = dao.selectSuggesList(pageInfo);
		System.out.println("리스트 정보 조회");
		HashMap<String, Object> memberMap = new HashMap<String, Object>();
		memberMap.put("SuggesList", SuggesList);
		memberMap.put("pageInfo", pageInfo);
						
		return memberMap;
	}

	@Transactional
	public int suggesDelete(String target) {
		return dao.suggesDelete(target);
	}


	public HashMap<String, Object> selectReportList(int reqPage) {
		int viewCnt = 10;						//한 페이지당 게시글 수
		int pageNaviSize = 5;					//페이지 네비게이션 길이
		int totalCount = dao.selectReportCount();//건의사항 갯수
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		System.out.println("여기까진 잘 되나");
		
		//게시글 목록
		ArrayList<AdRepartDto> ReportList = dao.selectReportList(pageInfo);
		System.out.println("리스트 정보 조회");
		HashMap<String, Object> memberMap = new HashMap<String, Object>();
		memberMap.put("ReportList", ReportList);
		memberMap.put("pageInfo", pageInfo);
						
		return memberMap;
	}

	@Transactional
	public int repartDelete(String target) {
		// TODO Auto-generated method stub
		return dao.repartDelete(target);
	}


	public int insertSuggestion(String memberNo, AdSuggestion suggestion) {
		// TODO Auto-generated method stub
		return dao.insertSuggestion(memberNo, suggestion);
	}
	
	
	
	
}
