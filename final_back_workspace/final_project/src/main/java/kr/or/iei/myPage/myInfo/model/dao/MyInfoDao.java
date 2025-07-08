package kr.or.iei.myPage.myInfo.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.myPage.myInfo.model.dto.MyInfo;

@Mapper
public interface MyInfoDao {

	MyInfo selectOneMember(String memberNo);


}
