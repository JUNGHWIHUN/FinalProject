package kr.or.iei.admin.model.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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

@Mapper
public interface AdminDao {

	ArrayList<BookList> selectBookList(BookSelectDto bookSelectDto);

	ArrayList<UserOne> selectOneUser(UserOne userOne);

	int insertLentBook(BookLenterDto bookLenter);

	int updateBookStatus(String bookNo);

	int updateMemberBorrowCount(String memberNo);

	int updateMemberCanBorrow(String memberNo);

	ArrayList<LentBookList> selectLentBook(LentBookDto lentBook);

	int updateactual(String lentbookNo);

	void updatecanLend(String callNo);

	void updateborrowedcount(String memberNo);

	void updateOverdueDayCount(HashMap<String, String> param);

	void updateborrowed(String memberNo);

	int selectAllBookCount();

	ArrayList<BookList> selectAllBookList(@Param("pageInfo") PageInfoDto pageInfo,
            @Param("type") String type,
            @Param("keyword") String keyword);

	int selectAllLendBookCount();

	ArrayList<LentBookList> selectAllLendBookList(@Param("pageInfo") PageInfoDto pageInfo,
            @Param("type") String type,
            @Param("keyword") String keyword);

	String selectMemberName(String memberNo);

	String selectBookTitle(String bookNo);

	int fixBook(Book book);

	int deleteBook(Book book);

	int insertBook(Book book);

	int selectAllmemberCount(String type, String keyword);

	ArrayList<MemberDto> selectAllmemberList(PageInfoDto pageInfo, String type, String keyword);

	int selectIOverMemberCount(String type, String keyword);

	ArrayList<LentBookList> selectOverMemberList(PageInfoDto pageInfo, String type, String keyword);

	ArrayList<MemberDto> getOneMember(String memberNo);

	ArrayList<BookList> getOneBook(String bookNo);

	int fixMember(MemberDto memberDto);

	int selectRequestCount();

	ArrayList<RequestBook> selectRequestList(PageInfoDto pageInfo);

	int requestUpdateYes(String target);

	int requestUpdateNo(String target);

	int selectSuggesCount();

	ArrayList<AdSuggestion> selectSuggesList(PageInfoDto pageInfo);

	int suggesDelete(String target);

	int selectReportCount();

	ArrayList<AdRepartDto> selectReportList(PageInfoDto pageInfo);

	int repartDelete(String target);

	int insertSuggestion(@Param("memberNo") String memberNo,@Param("suggestion") AdSuggestion suggestion);


}
