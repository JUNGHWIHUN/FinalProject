package kr.or.iei.notice.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.notice.model.dao.NoticeDao;



@Service
public class NoticeService {

	@Autowired
	private NoticeDao dao;
	
}
