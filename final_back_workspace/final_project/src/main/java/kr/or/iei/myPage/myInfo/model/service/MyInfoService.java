package kr.or.iei.myPage.myInfo.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.myPage.myInfo.model.dao.MyInfoDao;
import kr.or.iei.myPage.myInfo.model.dto.MyInfo;

@Service
public class MyInfoService {

	@Autowired
	private MyInfoDao dao;

	public MyInfo selectOneMember(String memberNo) {
		System.out.println(memberNo);
		
		return dao.selectOneMember(memberNo);
	}
	
}
