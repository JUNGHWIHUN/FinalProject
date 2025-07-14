package kr.or.iei.myPage.requestBookList.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.myPage.requestBookList.model.dto.RequestBookList;

@Mapper
public interface RequestBookListDao {

	int selectRequestBookCount(String memberNo);

	ArrayList<RequestBookList> selectRequestBookList(HashMap<String, Object> paramMap);

	
	
}
