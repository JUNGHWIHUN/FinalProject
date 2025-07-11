package kr.or.iei.notice.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Notice {
	
	private String noticeNo;		//공지사항 글번호
	private String noticeTitle;		//공지사항 제목
	private String noticeContent;	//공지사항 내용
	private String noticeDate;		//공지사항 일자
	
	private List<NoticeFile> fileList;		//첨부파일 목록

}
