package kr.or.iei.book.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.book.model.dao.BookDao;
import kr.or.iei.book.model.dto.Book;
import kr.or.iei.book.model.dto.BookComment;
import kr.or.iei.book.model.dto.ReportDto;
import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;

@Service
public class BookService {
	
	@Autowired 
	private BookDao dao;
	
	@Autowired
	private PageUtil pageUtil;
	
	//도서검색
    public HashMap<String, Object> selectBookList(Book book, int reqPage) {
        
        int bookCnt = 8;        //한 페이지당 보여줄 검색리스트의 책 권 수
        int pageNaviSize = 5;   //페이지네이션 길이

        //1. 검색 조건에 맞는 전체 책 권수만 DB에서 조회
        int totalCount = dao.selectBookCount(book); 

        //2. PageUtil 클래스로 보내 페이지네이션 정보 처리
        PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, bookCnt, pageNaviSize, totalCount);

        //3. DAO에 전달할 파라미터 맵 생성
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("book", book);       // 검색 조건 Book 객체
        paramMap.put("pageInfo", pageInfo); // 페이지 정보 객체

        //4. DB에서 해당 페이지의 책 목록만 조회
        List<Book> pagedBookList = dao.selectBookList(paramMap); 
        
        //5. HashMap에 페이지네이션된 책 목록과 페이지 정보를 담아 반환
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("searchResultList", pagedBookList);	//프론트의 res.data.resData.searchResultList에 매핑
        resultMap.put("pageInfo", pageInfo);                 
        
        return resultMap;
    }

	//도서 1권 조회(상세보기)
	public Book selectOneBook(String callNo) {
		Book book = new Book();
		book = dao.selectOneBook(callNo);
		
		//대출이 되었을 경우 반납예정일 조회
		String returnDate = dao.selectReturnDate(callNo);
		book.setReturnDate(returnDate);
		 
		return book;
	}
	
	//서평 목록 조회
    public HashMap<String, Object> selectCommentList(String callNo, Integer reqPage) {
		
		int commentCnt = 5;		//한 페이지당 보여줄 서평 수
		int pageNaviSize = 5;	//페이지네이션 길이
		
		//1. 해당하는 책의 모든 서평 총 개수만 DB에서 가져오기
        int totalCount = dao.selectCommentCount(callNo); 

        //2. PageUtil 클래스로 보내 페이지네이션 정보 처리
        PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, commentCnt, pageNaviSize, totalCount);

        //3. DAO에 전달할 파라미터 맵 생성
        HashMap<String, Object> paramMap = new HashMap<>();
        paramMap.put("callNo", callNo);
        paramMap.put("pageInfo", pageInfo);

        //4. DB에서 해당 페이지의 서평 목록만 조회
        List<BookComment> pagedCommentList = dao.selectCommentList(paramMap); 
                
        //5. HashMap에 페이지네이션된 서평 목록과 페이지 정보를 담아 반환
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("commentList", pagedCommentList);	//프론트의 res.data.resData.commentList에 매핑
        resultMap.put("pageInfo", pageInfo);                 
        
        return resultMap;
	}

	//서평 작성
    @Transactional
	public int insertComment(BookComment comment) {
		int result = 0;		//처리 결과값을 저장할 변수 설정
		
		//해당 도서 대출이력이 있는지 확인 : 
		result = dao.hasBeenLentCheck(comment);
		
		//대출이력이 확인된 이후에 이하 로직 수행
		if(result > 0) {
			//서평 중복작성 여부 확인
			String memberId = comment.getMemberId();
			String callNo = comment.getCallNo();
					
			result = dao.commentCheck(memberId, callNo);
			
			if(result > 0) {
				result = -1;	//이미 작성한 경우 -1 을 반환
			} else {
				result = dao.insertComment(comment);
			}
		} else return -2;	//해당 도서를 대출한 이력이 없으면 -2 반환
		
		return result;
		
	}
	
	//서평 수정
    @Transactional
	public int updateComment(BookComment comment) {
		return dao.updateComment(comment);
	}
	
	//서평 삭제
    @Transactional
	public int deleteComment(String commentNo) {
		return dao.deleteComment(commentNo);
	}
    
    // 서평 신고를 처리하는 메서드
    public int reportComment(ReportDto reportDTO) {
        // 여기에서 필요하다면 추가적인 비즈니스 로직 (예: 신고 내용 필터링, 중복 신고 방지 등)을 구현할 수 있습니다.
        // 현재는 단순히 DAO를 호출하여 DB에 삽입합니다.
        return dao.insertReport(reportDTO);
    }

	//이 분야 인기도서 조회
	public List<Book> getPopularBooksByGenre(String genreCode) {
        return dao.selectPopularBooksByGenre(genreCode);
	}

	//이 분야 신착도서 조회
	public List<Book> getNewArrivalsByGenre(String genreCode) {
        return dao.selectNewArrivalBooksByGenre(genreCode);
	}
	
	
}
