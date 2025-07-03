package kr.or.iei.book.model.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.admin.model.dto.BookList;
import kr.or.iei.book.model.dto.Book;

@Mapper
public interface BookDao {


    ArrayList<Book> selectBookList(Book book); 


}
