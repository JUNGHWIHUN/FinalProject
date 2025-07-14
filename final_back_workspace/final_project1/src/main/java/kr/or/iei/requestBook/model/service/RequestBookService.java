package kr.or.iei.requestBook.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.requestBook.model.dao.RequestBookDao;
import kr.or.iei.requestBook.model.dto.SubmitRequestBook;

@Service
public class RequestBookService {
	
	@Autowired
	private RequestBookDao dao;

	public int insertRequestBook(SubmitRequestBook book) {
		//신청자격확인
		String canRequest = dao.canRequestChk(book.getMemberNo());

		if(canRequest.equals("T")) {
			//신청
			int result = dao.insertRequestBook(book);
			
			if(result > 0) {
				//신청 후 신청자격 F로
				result = dao.makeCanRequestToF(book.getMemberNo());
				
				return result;
				
			}
			else {
				return 0;	//실패
			}
		} else 
			return -1;	//자격없음
		
	}
}
