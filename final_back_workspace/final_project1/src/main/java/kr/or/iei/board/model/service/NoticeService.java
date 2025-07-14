package kr.or.iei.board.model.service; // 패키지 경로는 그대로 유지

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.board.model.dao.NoticeDao;
import kr.or.iei.board.model.dto.BoardDto;
import kr.or.iei.board.model.dto.BoardFileDto;
import kr.or.iei.common.model.dto.PageInfoDto;
import kr.or.iei.common.util.PageUtil;

@Service
public class NoticeService {

	@Autowired
	private NoticeDao dao;
	
	@Autowired
	private PageUtil pageUtil;
	
	// 게시글 목록 조회
	public HashMap<String, Object> selectBoardList(int reqPage) {
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] selectBoardList 호출. 요청 페이지: " + reqPage);
		// --- 디버깅 끝 ---
		int viewCnt = 12;							
		int pageNaviSize = 5;						
		int totalCount = dao.selectBoardCount();	
		
		PageInfoDto pageInfo = pageUtil.getPageInfo(reqPage, viewCnt, pageNaviSize, totalCount);
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] PageInfo 계산 결과: start=" + pageInfo.getStart() + ", end=" + pageInfo.getEnd() + ", totalPage=" + pageInfo.getTotalPage());
		// --- 디버깅 끝 ---
		
		ArrayList<BoardDto> boardList = dao.selectBoardList(pageInfo);
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] DAO.selectBoardList 조회 결과: " + (boardList != null ? boardList.size() : 0) + "개 게시글");
		if (boardList != null && !boardList.isEmpty()) {
		    boardList.forEach(board -> System.out.println("  게시글: No=" + board.getBoardNo() + ", Title=" + board.getBoardTitle() + ", Code=" + board.getBoardCode() + ", Writer=" + board.getBoardWriter() + ", WriterId=" + board.getBoardWriterId()));
		}
		// --- 디버깅 끝 ---
		
		HashMap<String, Object> boardMap = new HashMap<>();
		boardMap.put("boardList", boardList);
		boardMap.put("pageInfo", pageInfo);
		
		return boardMap;
	}

	// 게시글 등록
	@Transactional
	public int insertBoard(BoardDto board, ArrayList<BoardFileDto> fileList) {
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] insertBoard 호출. BoardDto: " + board + ", FileList size: " + (fileList != null ? fileList.size() : 0));
		// --- 디버깅 끝 ---
		int boardNo = dao.selectBoardNo();
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] 새로 할당된 BoardNo: " + boardNo);
		// --- 디버깅 끝 ---
		
		board.setBoardNo(boardNo);
		board.setBoardCode("N");
		board.setIsImportant("N");
		board.setIsSecret("N");

		int result = dao.insertBoard(board);
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] DAO.insertBoard 결과 (게시글 삽입): " + result);
		// --- 디버깅 끝 ---
		
		if (result > 0) {
			for(int i=0; i<fileList.size(); i++) {
				BoardFileDto file = fileList.get(i);
				file.setBoardNo(boardNo);
				dao.insertBoardFile(file);
				// --- 디버깅 시작 ---
				System.out.println("[NoticeService] 파일 삽입: " + file.getFileName());
				// --- 디버깅 끝 ---
			}
		}
		
		return result;
	}

	// 게시글 1개 조회
	public BoardDto selectOneBoard(int boardNo) {
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] selectOneBoard 호출. BoardNo: " + boardNo);
		// --- 디버깅 끝 ---
		BoardDto board = dao.selectOneBoard(boardNo);
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] DAO.selectOneBoard 조회 결과: " + (board != null ? board.getBoardTitle() : "null"));
		if (board != null) {
		    System.out.println("  조회된 게시글 정보: No=" + board.getBoardNo() + ", Title=" + board.getBoardTitle() + ", Code=" + board.getBoardCode() + ", IsImportant=" + board.getIsImportant() + ", IsSecret=" + board.getIsSecret() + ", WriterId=" + board.getBoardWriterId());
		}
		// --- 디버깅 끝 ---

		if (board != null && !"N".equals(board.getBoardCode())) {
			// --- 디버깅 시작 ---
			System.out.println("[NoticeService] 조회된 게시글이 공지사항이 아님: BoardNo=" + board.getBoardNo() + ", BoardCode=" + board.getBoardCode());
			// --- 디버깅 끝 ---
			return null;
		}

		return board;
	}

	// 게시글 첨부파일 조회
	public BoardFileDto selectBoardFile(int boardFileNo) {
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] selectBoardFile 호출. boardFileNo: " + boardFileNo);
		// --- 디버깅 끝 ---
		return dao.selectBoardFile(boardFileNo);
	}

	// 게시글 삭제
	@Transactional
	public BoardDto deleteBoard (int boardNo) {
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] deleteBoard 호출. BoardNo: " + boardNo);
		// --- 디버깅 끝 ---
		BoardDto board = dao.selectOneBoard(boardNo);	
		
		if (board == null || !"N".equals(board.getBoardCode())) {
			return null;
		}

		int result = dao.deleteBoard(boardNo);
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] DAO.deleteBoard 결과: " + result);
		// --- 디버깅 끝 ---
		
		if (result > 0) {
			return board;
		}else
			return null;
	}

	// 게시글 수정
	@Transactional
	public ArrayList<BoardFileDto> updateBoard(BoardDto board) {
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] updateBoard 호출. BoardNo: " + board.getBoardNo() + ", BoardDto: " + board);
		// --- 디버깅 끝 ---
		board.setBoardCode("N");
		
		int result = dao.updateBoard(board);
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] DAO.updateBoard 결과: " + result);
		// --- 디버깅 끝 ---
		
		if(result > 0) {
			ArrayList<BoardFileDto> delFileList = new ArrayList<>();

			if(board.getFileList() != null && board.getFileList().size() > 0) { 
				for(int i=0; i<board.getFileList().size(); i++) {
					BoardFileDto addFile = board.getFileList().get(i);
					System.out.println("addFile :" + addFile.getFilePath()); // 이 부분은 기존 코드 유지
					dao.insertBoardFile(addFile);
				}
			}
			
			if(board.getDelBoardFileNo() != null && board.getDelBoardFileNo().length > 0) {	
				delFileList = dao.selectDelBoardFile(board.getDelBoardFileNo());	
				dao.deleteBoardFile(board.getDelBoardFileNo());
			}
			
			return delFileList;
		}
		
		return null;
	}

	// 중요 공지 상태 업데이트
	@Transactional
	public int updateBoardImportantStatus(int boardNo, String isImportant) {
		// --- 디버깅 시작 ---
		System.out.println("[NoticeService] updateBoardImportantStatus 호출. BoardNo: " + boardNo + ", isImportant: " + isImportant);
		// --- 디버깅 끝 ---
        return dao.updateIsImportant(boardNo, isImportant); 
	}
}