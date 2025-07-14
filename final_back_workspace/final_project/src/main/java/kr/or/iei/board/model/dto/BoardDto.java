package kr.or.iei.board.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BoardDto {
	private int boardNo;
	private String boardTitle;
	// private String boardThumbPath; // 썸네일 관련 변수 주석 처리
	private String boardContent;
	private String boardWriter; // 작성자 회원 번호 (FK)
	// private int boardStatus; // 게시글 상태 필드 삭제
	private String boardDate;
	// private String boardUpdateDate; // 수정일 필드 삭제
	// private int boardViewCount; // 조회수 필드 삭제
	
	// 게시판 구분 코드 (예: 'N' for Notice, 'S' for Suggestion)
	private String boardCode;

	// '공지사항'의 중요 공지 여부를 나타내는 필드 (Y/N)
	private String isImportant; 
	// '건의사항'의 비밀글 여부를 나타내는 필드 (Y/N)
	private String isSecret;
	
	// 게시글 작성자의 ID (DB TBL_MEMBER.MEMBER_ID) - 조회 시 사용
	private String boardWriterId; 
	
	//게시글에 대한 파일 정보 저장 변수
	private List<BoardFileDto> fileList;
	
	//삭제 파일 번호 배열 저장 변수
	private int [] delBoardFileNo;
}