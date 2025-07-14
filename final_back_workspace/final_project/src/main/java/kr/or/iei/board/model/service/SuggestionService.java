package kr.or.iei.board.model.service; // 또는 kr.or.iei.suggestion.model.service

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.board.model.dao.SuggestionDao; // SuggestionDao 주입
import kr.or.iei.board.model.dto.BoardDto;
import kr.or.iei.board.model.dto.BoardCommentDto; // CommentDto 임포트
// import kr.or.iei.board.model.dto.BoardFileDto; // 건의사항은 첨부파일 없으므로 주석 처리
import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;

@Service
public class SuggestionService {

	@Autowired
	private SuggestionDao dao; // SuggestionDao 주입
	
	@Autowired
	private PageUtil pageUtil;
	
	/**
     * selectSuggestionList
     * 기능: 건의사항 게시판의 게시글 목록과 페이지네이션 정보를 조회합니다.
     * @param reqPage 요청 페이지 번호
     * @param loginMemberNo 로그인한 회원의 번호 (비밀글 처리용)
     * @param isAdmin 로그인한 회원이 관리자인지 여부 ('T' 또는 'F')
     * @return 게시글 목록(BoardDto)과 페이지 정보(PageInfoDto)를 담은 HashMap
     */
	public HashMap<String, Object> selectSuggestionList(int reqPage, String loginMemberNo, String isAdmin) {
		
		int viewCnt = 12;							// 한 페이지당 게시글 수
		int pageNaviSize = 5;						// 페이지네이션 길이
		
		int totalCount = dao.selectSuggestionCount(); // 건의사항 게시판의 총 게시글 수 조회
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		
		// 게시글 목록 조회
        // 비밀글인 경우 본인만 보이거나 관리자만 보이도록 쿼리 로직 필요
		ArrayList<BoardDto> boardList = dao.selectSuggestionList(pageInfo, loginMemberNo);
		
		// 비밀글 처리 로직 (프론트에서 처리할 수도 있지만, 여기에서 데이터 가공도 가능)
        for (BoardDto board : boardList) {
            // 로그인하지 않았거나, 관리자가 아니면서, 비밀글이고, 글쓴이가 본인이 아닌 경우
            if ("Y".equals(board.getIsSecret()) &&
                (loginMemberNo == null || (!"T".equals(isAdmin) && !board.getBoardWriter().equals(loginMemberNo)))
            ) {
                // 비밀글이지만 열람 권한이 없는 경우 제목 변경 (예: "비밀글입니다.")
                board.setBoardTitle("비밀글입니다.");
                board.setBoardContent("해당 게시글은 비밀글입니다."); // 내용도 비워둠
                // 필요하다면 isSecret 값을 프론트에 전달하여 프론트에서 UI 변경 (예: 자물쇠 아이콘)
            }
        }

		HashMap<String, Object> boardMap = new HashMap<>();
		boardMap.put("boardList", boardList);
		boardMap.put("pageInfo", pageInfo);
		
		return boardMap;
	}

	/**
     * insertSuggestion
     * 기능: 새로운 건의사항 게시글을 등록합니다.
     * 건의사항 게시판의 BOARD_CODE를 'S'로 고정하고, 중요 공지는 'N'으로 설정합니다.
     * @param board 등록할 게시글 정보 (BoardDto)
     * @return 등록된 행의 수
     */
	@Transactional
	public int insertSuggestion(BoardDto board) {
		int boardNo = dao.selectBoardNo(); // 새로운 게시글 번호 조회
		
		board.setBoardNo(boardNo);	        // 조회한 번호 세팅
		board.setBoardCode("S");            // 건의사항 게시판 코드 'S'로 설정
		board.setIsImportant("N");          // 건의사항은 중요 공지 아님
		// isSecret은 BoardDto에 이미 설정되어 넘어오므로 그대로 사용
        
		// 건의사항은 첨부파일 기능 없으므로 fileList 처리 로직 없음
		
		return dao.insertSuggestion(board); // 건의사항 게시글 삽입
	}

	/**
     * selectOneSuggestion
     * 기능: 특정 건의사항 게시글의 상세 정보를 조회합니다.
     * 이 메서드는 열람 권한(비밀글 여부, 작성자 일치, 관리자 여부)을 Service 계층에서 확인합니다.
     * @param boardNo 조회할 게시글 번호
     * @param loginMemberNo 로그인한 회원의 번호 (권한 확인용)
     * @param isAdmin 로그인한 회원이 관리자인지 여부 ('T' 또는 'F')
     * @return 조회된 게시글 정보 (BoardDto), 권한 없는 경우 제목/내용이 변경되어 반환
     */
	public BoardDto selectOneSuggestion(int boardNo, String loginMemberNo, String isAdmin) {
		// -- 변경 시작: DAO 호출 시 모든 파라미터 전달 --
		BoardDto board = dao.selectOneSuggestion(boardNo, loginMemberNo, isAdmin); 
		// -- 변경 끝 --
		
        // 1. 게시글이 없는 경우
		if (board == null) {
			return null;
		}

        // 2. 다른 게시판의 글인 경우 (혹시 모를 상황 대비)
        if (!"S".equals(board.getBoardCode())) {
            return null; // 건의사항이 아닌 다른 게시판의 글이면 반환하지 않음
        }

        // 3. 비밀글 권한 체크
        // 조건: 비밀글(isSecret='Y') 이면서
        //      (로그인 안 했거나 OR 로그인 회원이 관리자가 아니면서 OR 로그인 회원이 글쓴이가 아님)
        if ("Y".equals(board.getIsSecret()) &&
            (loginMemberNo == null || (!"T".equals(isAdmin) && !board.getBoardWriter().equals(loginMemberNo)))
        ) {
            // 권한이 없는 경우, 내용 대신 비밀글임을 알리는 정보 반환
            // DTO의 특정 필드만 변경하여 프론트에서 처리하도록 할 수 있습니다.
            board.setBoardTitle("비밀글입니다.");
            board.setBoardContent("해당 게시글은 비밀글입니다. 작성자 또는 관리자만 열람할 수 있습니다.");
            // fileList 등 다른 민감 정보도 모두 비워야 할 경우 추가 처리
            board.setFileList(null); 
        }

		return board;
	}

	/**
     * updateSuggestion
     * 기능: 건의사항 게시글의 제목, 내용, 비밀글 여부 등을 업데이트합니다.
     * 건의사항은 작성 후 수정이 불가하며, 관리자만 수정이 가능하다고 가정합니다.
     * @param board 업데이트할 게시글 정보 (BoardDto)
     * @param isAdmin 수정 요청자가 관리자인지 여부 ('T' 또는 'F')
     * @return 업데이트된 행의 수 (관리자가 아니면 0)
     */
	@Transactional
	public int updateSuggestion(BoardDto board, String isAdmin) {
        // 관리자가 아니면 수정 불가능 (서비스 단에서 권한 재확인)
        if (!"T".equals(isAdmin)) {
            return 0;
        }

        board.setBoardCode("S"); // 건의사항 게시판 코드 'S'로 고정
        board.setIsImportant("N"); // 건의사항은 중요 공지 아님

		return dao.updateSuggestion(board);
	}

	/**
     * deleteSuggestion
     * 기능: 특정 건의사항 게시글을 삭제합니다.
     * 건의사항은 작성자가 삭제할 수 없으며, 관리자만 삭제 가능합니다.
     * @param boardNo 삭제할 게시글 번호
     * @param isAdmin 삭제 요청자가 관리자인지 여부 ('T' 또는 'F')
     * @return 삭제된 BoardDto 객체 (파일 관련 로직 없음), 권한이 없거나 삭제 실패 시 null
     */
	@Transactional
	public BoardDto deleteSuggestion(int boardNo, String isAdmin) {
        // 관리자가 아니면 삭제 불가능
        if (!"T".equals(isAdmin)) {
            return null; // 권한 없음
        }

		// -- 변경 시작: DAO 호출 시 모든 파라미터 전달 (null, "F"는 서비스에서 권한 체크 시 필요 없지만, DAO 시그니처 맞춤) --
		BoardDto board = dao.selectOneSuggestion(boardNo, null, "F"); 
		// -- 변경 끝 --

        if (board == null || !"S".equals(board.getBoardCode())) {
            return null; // 건의사항이 아니거나 없는 글이면 반환하지 않음
        }

		int result = dao.deleteSuggestion(boardNo);
		
		if (result > 0) {
			return board; // 삭제된 게시글 정보 반환 (물리적 파일 삭제 로직은 없음)
		}else
			return null;
	}

    // --- 건의사항 댓글 관련 메서드 ---

    /**
     * insertSuggestionComment
     * 기능: 건의사항 게시글에 댓글을 등록합니다. (관리자만 작성 가능)
     * @param comment 등록할 댓글 정보
     * @param isAdmin 댓글 작성자가 관리자인지 여부 ('T' 또는 'F')
     * @return 등록된 행의 수 (권한 없으면 0)
     */
    @Transactional
    public int insertSuggestionComment(BoardCommentDto comment, String isAdmin) {
        // 관리자 권한 체크 로직
        if (!"T".equals(isAdmin)) {
            return 0; // 관리자가 아니면 댓글 작성 불가능
        }
        return dao.insertComment(comment);
    }

    /**
     * selectSuggestionCommentList
     * 기능: 특정 건의사항 게시글의 댓글 목록을 조회합니다.
     * @param boardNo 게시글 번호
     * @return 댓글 목록 (ArrayList<CommentDto>)
     */
    public ArrayList<BoardCommentDto> selectSuggestionCommentList(int boardNo) {
        return dao.selectCommentList(boardNo);
    }

    /**
     * updateSuggestionComment
     * 기능: 건의사항 게시글의 댓글을 수정합니다. (관리자만 수정 가능)
     * @param comment 수정할 댓글 정보
     * @param isAdmin 댓글 수정자가 관리자인지 여부 ('T' 또는 'F')
     * @return 업데이트된 행의 수 (권한 없으면 0)
     */
    @Transactional
    public int updateSuggestionComment(BoardCommentDto comment, String isAdmin) {
        // 관리자 권한 체크 로직
        if (!"T".equals(isAdmin)) {
            return 0; // 관리자가 아니면 댓글 수정 불가능
        }
        return dao.updateComment(comment);
    }

    /**
     * deleteSuggestionComment
     * 기능: 건의사항 게시글의 댓글을 삭제합니다. (관리자만 삭제 가능)
     * @param commentNo 삭제할 댓글 번호
     * @param isAdmin 댓글 삭제자가 관리자인지 여부 ('T' 또는 'F')
     * @return 삭제된 행의 수 (권한 없으면 0)
     */
    @Transactional
    public int deleteSuggestionComment(int commentNo, String isAdmin) {
        // 관리자 권한 체크 로직
        if (!"T".equals(isAdmin)) {
            return 0; // 관리자가 아니면 댓글 삭제 불가능
        }
        return dao.deleteComment(commentNo);
    }
}