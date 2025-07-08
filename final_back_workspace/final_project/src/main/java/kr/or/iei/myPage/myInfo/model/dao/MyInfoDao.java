package kr.or.iei.myPage.myInfo.model.dao;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.myPage.myInfo.model.dto.Myinfo;

@Mapper
public interface MyInfoDao {

	Myinfo selectOneMember(String memberNo);


}
