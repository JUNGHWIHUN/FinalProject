package kr.or.iei.book.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.book.model.dao.BookDao;
import kr.or.iei.book.model.dto.Book;

@Service
public class BookService {
	
	@Autowired 
	private BookDao dao;

	//도서검색
	public ArrayList<BookList> searchBookList(Book book) {
		return dao.searchBookList(book);
	}
}
