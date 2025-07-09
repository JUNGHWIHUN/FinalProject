package kr.or.iei.book.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.book.model.dto.Book;
import kr.or.iei.book.model.dto.BookComment;

@Mapper
public interface BookDao {

    int selectBookCount(Book book);
	
    List<Book> selectBookList(HashMap<String, Object> paramMap);

	Book selectOneBook(String callNo);

	int commentCheck(String memberId, String callNo);

	int insertComment(BookComment comment);
	
    int selectCommentCount(String callNo); 
    
    int updateComment(BookComment comment);
    
    int deleteComment(String commentNo);

    List<BookComment> selectCommentList(HashMap<String, Object> paramMap);
    
    List<Book> selectPopularBooksByGenre(String genreCode);

    List<Book> selectNewArrivalBooksByGenre(String genreCode);

	int hasBeenLentCheck(BookComment comment);

}
