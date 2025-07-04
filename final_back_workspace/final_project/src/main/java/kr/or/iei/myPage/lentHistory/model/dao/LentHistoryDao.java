package kr.or.iei.myPage.lentHistory.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.myPage.lentHistory.model.dto.LentHistory;



@Mapper
public interface LentHistoryDao {

	int selectLentHistoryCount(String memberNo);

	ArrayList<LentHistory> selectLentHistoryList(HashMap<String, Object> paramMap);

	

}
