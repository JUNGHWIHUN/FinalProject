package kr.or.iei.board.model.dao; // 또는 kr.or.iei.suggestion.model.dao

import java.util.ArrayList;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import kr.or.iei.board.model.dto.BoardDto; // BoardDto 공통 사용
import kr.or.iei.board.model.dto.BoardCommentDto; // CommentDto 임포트
import kr.or.iei.common.model.dto.PageInfoDto;

@Mapper
public interface SuggestionDao {

    // 건의사항 게시판의 전체 게시글 수를 조회합니다.
    int selectSuggestionCount();

    // 건의사항 게시판의 게시글 목록을 페이지 정보와 함께 조회합니다.
    // 비밀글 여부(isSecret)와 로그인 사용자(loginMemberNo)에 따라 조회 결과가 달라질 수 있습니다.
    ArrayList<BoardDto> selectSuggestionList(@Param("pageInfo") PageInfoDto pageInfo, @Param("loginMemberNo") String loginMemberNo);

    // 새로운 게시글 번호를 조회합니다. (BoardDao의 selectBoardNo와 동일)
    int selectBoardNo();

    // 새로운 건의사항 게시글을 데이터베이스에 삽입합니다.
    int insertSuggestion(BoardDto board);

    // 특정 건의사항 게시글의 상세 정보를 조회합니다.
    // DAO는 순수하게 DB 조회만 담당하며, 권한 처리는 서비스 계층에서 수행합니다.
    BoardDto selectOneSuggestion(@Param("boardNo") int boardNo,
                                 @Param("loginMemberNo") String loginMemberNo,
                                 @Param("isAdmin") String isAdmin);
    // 특정 건의사항 게시글의 제목과 내용을 업데이트합니다.
    int updateSuggestion(BoardDto board);

    // 특정 건의사항 게시글을 삭제합니다.
    int deleteSuggestion(int boardNo);

    // --- 건의사항 댓글 관련 메서드 ---

    // 특정 게시글에 댓글을 삽입합니다.
    int insertComment(BoardCommentDto comment);

    // 특정 게시글의 댓글 목록을 조회합니다.
    ArrayList<BoardCommentDto> selectCommentList(@Param("boardNo") int boardNo);

    // 특정 댓글을 수정합니다.
    int updateComment(BoardCommentDto comment);

    // 특정 댓글을 삭제합니다.
    int deleteComment(@Param("commentNo") int commentNo);

    // 특정 댓글의 작성자 회원 번호를 조회합니다. (댓글 삭제 권한 확인용)
    String selectCommentWriterMemberNo(@Param("commentNo") int commentNo);
}