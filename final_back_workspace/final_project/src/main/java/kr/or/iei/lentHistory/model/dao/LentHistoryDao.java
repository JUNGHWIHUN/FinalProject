package kr.or.iei.lentHistory.model.dao;

import java.util.ArrayList;
import java.util.HashMap;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.lentHistory.model.dto.LentHistory;

@Mapper
public interface LentHistoryDao {

	int selectLentHistoryCount(String memberNo);

	ArrayList<LentHistory> selectLentHistoryList(HashMap<String, Object> paramMap);

	

}
