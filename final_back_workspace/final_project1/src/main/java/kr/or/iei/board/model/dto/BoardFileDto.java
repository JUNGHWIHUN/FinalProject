package kr.or.iei.board.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BoardFileDto {
	private int boardFileNo;
	private int boardNo;
	private String fileName;
	private String filePath;
}