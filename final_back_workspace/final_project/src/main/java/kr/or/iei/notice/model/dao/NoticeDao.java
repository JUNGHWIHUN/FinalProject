package kr.or.iei.notice.model.dao;

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.notice.model.dto.Notice;

@Mapper
public interface NoticeDao {

	int selectNoticeCount();

	ArrayList<Notice> selectNoticeList(PageInfoDto pageInfo);

	Notice selectOneBoard(String noticeNo);

}
