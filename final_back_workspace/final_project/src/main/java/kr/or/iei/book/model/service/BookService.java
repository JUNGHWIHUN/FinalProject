package kr.or.iei.book.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.book.model.dao.BookDao;

@Service
public class BookService {
	
	@Autowired 
	private BookDao dao;
}
