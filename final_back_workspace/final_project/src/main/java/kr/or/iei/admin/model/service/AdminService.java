package kr.or.iei.admin.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.admin.model.dao.AdminDao;
import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.admin.model.dto.BookSelectDto;
import kr.or.iei.admin.model.dto.UserOne;

@Service
public class AdminService {

	@Autowired
	private AdminDao dao;

	
	public ArrayList<BookList> selectBookList(BookSelectDto bookSelectDto) {
		
		return dao.selectBookList(bookSelectDto);
	}


	public ArrayList<UserOne> selectOneUser(UserOne userOne) {
		// TODO Auto-generated method stub
		return dao.selectOneUser(userOne);
	}
	
	
	
	
}
