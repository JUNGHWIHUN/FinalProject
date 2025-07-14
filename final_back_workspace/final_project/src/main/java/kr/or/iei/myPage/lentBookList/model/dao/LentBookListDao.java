package kr.or.iei.myPage.lentBookList.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.admin.model.dto.LentBookList;

@Mapper
public interface LentBookListDao {

	ArrayList<LentBookList> selectBorrowBook(String memberNo);

	int renewBook(String lentBookNo);

	int selectCheckReservation(String lentBookNo);

}
