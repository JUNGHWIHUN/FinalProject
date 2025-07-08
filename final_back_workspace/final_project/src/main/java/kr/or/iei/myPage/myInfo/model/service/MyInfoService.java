package kr.or.iei.myPage.myInfo.model.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.myPage.myInfo.model.dao.MyInfoDao;
import kr.or.iei.myPage.myInfo.model.dto.MyInfo;

@Service
public class MyInfoService {

	@Autowired
	private MyInfoDao dao;

	public MyInfo selectOneMember(String memberNo) {
	
		
		return dao.selectOneMember(memberNo);
	}

	@Transactional
	public int updateMember(MyInfo member) {
		
		return dao.updateMember(member);
	}

	@Transactional
	public int deleteMember(String memberNo) {
		
		return dao.deleteMember(memberNo);
	}
	
}
