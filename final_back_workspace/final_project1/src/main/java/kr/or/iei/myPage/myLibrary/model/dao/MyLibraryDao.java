package kr.or.iei.myPage.myLibrary.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.myPage.myLibrary.model.dto.MyLibrary;
import kr.or.iei.myPage.myLibrary.model.dto.MyLibraryBook;

@Mapper
public interface MyLibraryDao {

	ArrayList<MyLibrary> selectMyLibrary(String memberNo);

	int myLibraryBookDuplChk(MyLibraryBook myLibraryBook);
	
	int addToMyLibrary(MyLibraryBook myLibraryBook);

	ArrayList<MyLibraryBook> selectMyLibraryBooks(String myLibraryNo);

	int addNewMyLibrary(MyLibrary myLibrary);

	int updateMyLibraryName(MyLibrary myLibrary);

	int deleteMyLibrary(String myLibraryNo);

	int deleteFromMyLibrary(String myLibraryBookNo);

	int moveBooktoAnotherLibrary(MyLibraryBook myLibraryBook);


}
