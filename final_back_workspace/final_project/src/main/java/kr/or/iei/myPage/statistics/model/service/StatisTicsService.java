package kr.or.iei.myPage.statistics.model.service;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import kr.or.iei.myPage.statistics.model.dao.StatisTicsDao;
import kr.or.iei.myPage.statistics.model.dto.StatisTics;

@Service
public class StatisTicsService {
	@Autowired
	private StatisTicsDao dao;

	//독서 통계를 위한 메소드(카테고리별 갯수조회)
	public ArrayList<StatisTics> selectStatisTics(String memberNo, String month) {

		return dao.selectStatisTics(memberNo, month);
	}
}
