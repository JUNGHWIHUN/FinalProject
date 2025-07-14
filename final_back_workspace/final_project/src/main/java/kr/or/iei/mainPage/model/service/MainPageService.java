package kr.or.iei.mainPage.model.service;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.admin.model.dto.AdSuggestion;
import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.mainPage.model.dao.MainPageDao;

@Service
public class MainPageService {
	
	@Autowired
	private MainPageDao dao;

	public HashMap<String, Object> selectRecomendedBook() {
		
		ArrayList<BookList> recoList = dao.selectReco();
		
		ArrayList<BookList> bestList = dao.selectBest();
		
		HashMap<String, Object> recoMap = new HashMap<String,Object>();
		recoMap.put("recoList", recoList);
		recoMap.put("bestList", bestList);
		
		return recoMap;
	}

	
	
}
