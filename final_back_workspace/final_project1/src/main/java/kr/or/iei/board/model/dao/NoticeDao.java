package kr.or.iei.board.model.dao; // 패키지 경로는 그대로 유지 (원한다면 notice로 변경 가능)

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param; // @Param 어노테이션 임포트

import kr.or.iei.board.model.dto.BoardDto;
import kr.or.iei.board.model.dto.BoardFileDto;
import kr.or.iei.common.model.dto.PageInfoDto;

@Mapper // NoticeDao 인터페이스가 MyBatis 매퍼임을 나타냅니다.
public interface NoticeDao { // 클래스 이름 BoardDao -> NoticeDao로 변경

	int selectBoardCount();

	// 페이지네이션 정보를 받아 게시글 목록을 조회합니다.
    // BOARD_CODE를 추가하여 특정 게시판의 글만 조회할 수 있도록 변경 필요 (추후 진행)
	ArrayList<BoardDto> selectBoardList(PageInfoDto pageInfo);

	int selectBoardNo();

	// 새로운 게시글 정보를 삽입합니다. (첨부파일은 별도 처리)
	int insertBoard(BoardDto board);

	// 게시글에 첨부된 파일 정보를 삽입합니다.
	int insertBoardFile(BoardFileDto file);

	// 게시글 번호를 받아 단일 게시글의 상세 정보를 조회합니다.
	BoardDto selectOneBoard(int boardNo);

	// 파일 번호를 받아 단일 첨부파일 정보를 조회합니다.
	BoardFileDto selectBoardFile(int boardFileNo);

	// 게시글 번호를 받아 게시글 정보를 삭제합니다.
	int deleteBoard(int boardNo);

	// 게시글 정보를 업데이트합니다. (제목, 내용, 중요/비밀글 여부)
	int updateBoard(BoardDto board);

	// 삭제할 파일 번호 배열을 받아 해당 파일들의 정보를 조회합니다.
    // 배열을 파라미터로 받을 때 @Param("array") 등으로 매퍼에서 참조할 이름을 명시할 수 있습니다.
	ArrayList<BoardFileDto> selectDelBoardFile(int[] delBoardFileNo);

	// 삭제할 파일 번호 배열을 받아 해당 파일 정보를 DB에서 삭제합니다.
    // 배열을 파라미터로 받을 때 @Param("array") 등으로 매퍼에서 참조할 이름을 명시할 수 있습니다.
	void deleteBoardFile(int[] delBoardFileNo);
    
    // 중요 공지 상태를 업데이트합니다.
    // 두 개 이상의 파라미터를 받을 때는 @Param을 사용하여 매퍼에서 참조할 이름을 명시하는 것이 좋습니다.
    int updateIsImportant(@Param("boardNo") int boardNo, @Param("isImportant") String isImportant);

    // ***********************************************************************************
    // 향후 추가될 메서드 (현재 NoticeService에서 직접 호출되지는 않지만, 로직 분리 시 필요)
    // ***********************************************************************************
    // 특정 게시판 코드에 해당하는 총 게시글 수를 조회합니다.
    // int selectBoardCountByBoardCode(@Param("boardCode") String boardCode);

    // 특정 게시판 코드에 해당하는 게시글 목록을 페이지 정보에 따라 조회합니다.
    // ArrayList<BoardDto> selectBoardListByBoardCode(@Param("pageInfo") PageInfoDto pageInfo, @Param("boardCode") String boardCode);

    // 특정 게시글의 비밀글 상태를 업데이트합니다. (건의사항 게시판용)
    // int updateIsSecret(@Param("boardNo") int boardNo, @Param("isSecret") String isSecret);
}