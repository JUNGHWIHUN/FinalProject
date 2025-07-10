package kr.or.iei.requestBook.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.requestBook.model.dao.RequestBookDao;
import kr.or.iei.requestBook.model.dto.SubRequestBook;


@Service
public class RequestBookService {
	
	@Autowired
	private RequestBookDao dao;

	public int insertRequestBook(SubRequestBook book) {
		// TODO Auto-generated method stub
		return dao.insertRequestBook(book);
	}
}
