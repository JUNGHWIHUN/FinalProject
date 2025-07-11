package kr.or.iei.notice.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class NoticeFile {

	private int fileNo;
	private String NoticeNo;
	private String fileName;
	private String filePath;
}
