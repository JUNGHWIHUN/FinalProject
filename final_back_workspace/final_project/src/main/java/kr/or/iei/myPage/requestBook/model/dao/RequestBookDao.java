package kr.or.iei.myPage.requestBook.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.myPage.lentHistory.model.dto.LentHistory;

@Mapper
public interface RequestBookDao {

	int selectRequestBook(String memberNo);

	

	ArrayList<LentHistory> selectRequestBookList(HashMap<String, Object> paramMap);

}
