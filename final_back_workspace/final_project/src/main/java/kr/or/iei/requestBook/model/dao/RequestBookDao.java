package kr.or.iei.requestBook.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.requestBook.model.dto.RequestBook;

@Mapper
public interface RequestBookDao {

	int insertRequestBook(RequestBook book);

}
