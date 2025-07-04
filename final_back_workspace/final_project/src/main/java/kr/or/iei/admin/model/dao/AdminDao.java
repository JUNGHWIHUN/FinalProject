package kr.or.iei.admin.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.admin.model.dto.BookLenterDto;
import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.admin.model.dto.BookSelectDto;
import kr.or.iei.admin.model.dto.UserOne;

@Mapper
public interface AdminDao {

	ArrayList<BookList> selectBookList(BookSelectDto bookSelectDto);

	ArrayList<UserOne> selectOneUser(UserOne userOne);

	int insertLentBook(BookLenterDto bookLenter);

	int updateBookStatus(String bookNo);

	int updateMemberBorrowCount(String memberNo);

	int updateMemberCanBorrow(String memberNo);

}
