package kr.or.iei.myPage.myInfo.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.myPage.myInfo.model.dao.MyInfoDao;
import kr.or.iei.myPage.myInfo.model.dto.Myinfo;

@Service
public class MyInfoService {

	@Autowired
	private MyInfoDao dao;

	public Myinfo selectOneMember(String memberNo) {

		
		return dao.selectOneMember(memberNo);
	}
	
}
