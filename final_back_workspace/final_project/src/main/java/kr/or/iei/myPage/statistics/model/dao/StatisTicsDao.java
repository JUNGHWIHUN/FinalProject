package kr.or.iei.myPage.statistics.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.myPage.statistics.model.dto.StatisTics;

@Mapper
public interface StatisTicsDao {

	ArrayList<StatisTics> selectStatisTics(String memberNo, String month);

}
