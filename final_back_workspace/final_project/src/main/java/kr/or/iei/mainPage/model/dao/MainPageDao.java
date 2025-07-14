package kr.or.iei.mainPage.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.admin.model.dto.AdSuggestion;
import kr.or.iei.admin.model.dto.BookList;

@Mapper
public interface MainPageDao {

	ArrayList<BookList> selectReco();

	ArrayList<BookList> selectBest();
	
	
	
}
