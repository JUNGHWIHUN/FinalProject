package kr.or.iei.requestBook.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.requestBook.model.dto.SubmitRequestBook;

@Mapper
public interface RequestBookDao {

	int insertRequestBook(SubmitRequestBook book);

	String canRequestChk(String memberNo);

	int makeCanRequestToF(String memberNo);

}
