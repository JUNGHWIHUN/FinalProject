package kr.or.iei.myPage.myLibrary.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.book.model.dao.BookDao;
import kr.or.iei.book.model.dto.Book;
import kr.or.iei.myPage.myLibrary.model.dao.MyLibraryDao;
import kr.or.iei.myPage.myLibrary.model.dto.MyLibrary;
import kr.or.iei.myPage.myLibrary.model.dto.MyLibraryBook;

@Service
public class MyLibraryService {
	
	@Autowired
	private MyLibraryDao dao;
	
	@Autowired
	private BookDao bookDao;

	//내 서재 목록 불러오기
	public ArrayList<MyLibrary> selectMyLibrary(String memberNo) {
		return dao.selectMyLibrary(memberNo);
	}
	
	//내 서재의 새로운 책장(카테고리) 만들기
	@Transactional
	public int addNewMyLibrary(MyLibrary myLibrary) {
		return dao.addNewMyLibrary(myLibrary);
	}

	//내 서재에 새로운 도서 추가
	@Transactional
	public int addToMyLibrary(MyLibraryBook myLibraryBook) {
		//해당 서재에 이미 해당 도서가 등록되어 있는지 확인
		int result = dao.myLibraryBookDuplChk(myLibraryBook);
		
		if(result > 0) {
			return -1;
		} else {
			return dao.addToMyLibrary(myLibraryBook);			
		}
		
	}

	//내 서재에 담긴 책 불러오기
	public ArrayList<MyLibraryBook> selectMyLibraryBooks(String myLibraryNo) {
		//담긴 책 목록
		ArrayList<MyLibraryBook> list = dao.selectMyLibraryBooks(myLibraryNo);
		
		//담긴 책들의 상세정보를 배열에 추가
		for(int i=0;i<list.size();i++) {
			MyLibraryBook myLibraryBook = list.get(i);

			Book book = bookDao.selectOneBook(myLibraryBook.getMyLibraryCallNo());
			myLibraryBook.setBook(book);
			
			list.set(i, myLibraryBook);
		}
		
		return list;
	}

	//내 서재 이름 변경
	public int updateMyLibraryName(MyLibrary myLibrary) {
		return dao.updateMyLibraryName(myLibrary);
	}


}
