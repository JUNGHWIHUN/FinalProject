package kr.or.iei.myPage.myLibrary.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.myPage.myLibrary.model.dao.MyLibraryDao;
import kr.or.iei.myPage.myLibrary.model.dto.MyLibrary;

@Service
public class MyLibraryService {
	
	@Autowired
	private MyLibraryDao dao;

	public int addNewMyLibrary(MyLibrary myLibrary) {
		// TODO Auto-generated method stub
		return 0;
	}

}
