package kr.or.iei.book.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.book.model.dao.BookDao;
import kr.or.iei.book.model.dto.Book;
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

		int bookCnt = 8;							//한 페이지당 보여줄 검색리스트의 책 권 수
		int pageNaviSize = 5;						//페이지네이션 길이
		
		 // 1. 검색 조건에 맞는 '모든' 책 검색 결과 가져오기 (HashMap 형태로)
        ArrayList<Book> allMatchedBooks = dao.selectBookList(book); 
        System.out.println("DAO에서 가져온 검색 조건에 맞는 전체 책 개수 (페이지네이션 전): " + allMatchedBooks.size());

        // 2. 검색결과의 전체 책 권수
        int totalCount = allMatchedBooks.size();     
        
        // 3. PageUtil 클래스로 보내 페이지네이션 정보 처리
        PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, bookCnt, pageNaviSize, totalCount);
        System.out.println("계산된 페이지 정보: " + pageInfo.toString());

        // 4. 계산된 페이지 정보(start, end)를 바탕으로 List<Map>에서 현재 페이지의 데이터만 잘라내기
        List<Book> pagedBookList; // 반환 타입 변경
        if (totalCount == 0) {
            pagedBookList = new ArrayList<>(); 
        } else {
            int startIndex = pageInfo.getStart() - 1; 
            int endIndex = pageInfo.getEnd(); 

            if (startIndex >= totalCount) {
                pagedBookList = new ArrayList<>();
            } else {
                endIndex = Math.min(endIndex, totalCount);
                pagedBookList = allMatchedBooks.subList(startIndex, endIndex);
            }
        }
        
        System.out.println("Java 코드에서 필터링된 현재 페이지 책 리스트: " + pagedBookList.size() + "권");
        
        // 5. HashMap에 페이지네이션된 책 목록과 페이지 정보를 담아 반환
        HashMap<String, Object> resultMap = new HashMap<>();
        resultMap.put("searchResultList", pagedBookList); // List<Map> 형태의 데이터
        resultMap.put("pageInfo", pageInfo);                 
        
        return resultMap;
	}
}
