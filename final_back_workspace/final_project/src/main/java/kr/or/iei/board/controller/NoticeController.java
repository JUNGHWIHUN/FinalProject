package kr.or.iei.board.controller; // 패키지 경로는 그대로 유지

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // @RequestParam 임포트 유지
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.board.model.dto.BoardDto;
import kr.or.iei.board.model.dto.BoardFileDto;
import kr.or.iei.board.model.service.NoticeService;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDto;
import kr.or.iei.common.util.FileUtil;
// import kr.or.iei.member.model.dto.Member; // Member DTO 임포트 제거 (HttpSession 관련)
// import jakarta.servlet.http.HttpSession; // HttpSession 임포트 제거

@RestController
@CrossOrigin("*")
@RequestMapping("/notice") // 요청 매핑 경로를 /notice로 변경
public class NoticeController { // 클래스 이름 BoardController -> NoticeController로 변경

	@Autowired
	private NoticeService service;
	
	@Autowired
	private FileUtil fileUtil;
	
	@Value("${file.uploadPath}")
	private String uploadPath;

	// 게시글 목록 조회
	@GetMapping("/list/{reqPage}")
	@NoTokenCheck	// 로그인 여부에 상관없이 게시글을 조회할 수 있도록 AOP 에서 설정한 어노테이션 추가 (토큰 검사 제외)
	public ResponseEntity<ResponseDto> selectBoardList (@PathVariable int reqPage){
		// --- 디버깅 시작 ---
		System.out.println("[NoticeController] selectBoardList 호출. 요청 페이지: " + reqPage);
		// --- 디버깅 끝 ---
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 조회 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			// 게시글 목록과 페이지네이션 정보 조회
			// NoticeService는 공지사항만 조회하도록 로직을 변경해야 합니다.
			HashMap<String, Object> boardMap = service.selectBoardList(reqPage); 
			res = new ResponseDto(HttpStatus.OK, "", boardMap, "");
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] selectBoardList 응답 준비 완료.");
			// --- 디버깅 끝 ---
			
		}catch (Exception e) {
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] selectBoardList 오류 발생: " + e.getMessage());
			// --- 디버깅 끝 ---
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	// 첨부파일 업로드 (에디터 내 이미지)
	//@ModelAttribute : multipart/form-data 형식일 때 자바 객체로 바인딩하기 위한 어노테이션
	@PostMapping("/editorImage")
	public ResponseEntity<ResponseDto> uploadEditorImage(@ModelAttribute MultipartFile image){
		// --- 디버깅 시작 ---
		System.out.println("[NoticeController] uploadEditorImage 호출.");
		// --- 디버깅 끝 ---
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "에디터 이미지 업로드 중 통신 오류가 발생하였습니다.", null, "error");
		
		try {
			String filePath = fileUtil.uploadFile(image, "/editor/");	//업로드할 파일과 저장할 경로 전달
			res = new ResponseDto(HttpStatus.OK, "", "/editor/"+filePath.substring(0, 8) + "/" + filePath, "");	//res.data.resData = "/editor/20250624/202506241515????? + _????? + .jpg	(FileUtil 에서 설정한 파일명)
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] Editor 이미지 업로드 성공: " + res.getResData());
			// --- 디버깅 끝 ---
		}catch (Exception e) {
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] uploadEditorImage 오류 발생: " + e.getMessage());
			// --- 디버깅 끝 ---
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	// 게시글 작성
	// (공지사항은 관리자만 작성 가능)
	@PostMapping
	public ResponseEntity<ResponseDto> insertBoard (@ModelAttribute MultipartFile [] boardFile, @ModelAttribute BoardDto board, @RequestParam String isAdmin){
		// --- 디버깅 시작 ---
		System.out.println("[NoticeController] insertBoard 호출. isAdmin: " + isAdmin);
		System.out.println("[NoticeController] BoardDto from frontend: " + board);
		// --- 디버깅 끝 ---
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 등록 중 통신 오류가 발생하였습니다", null, "error");

		// 1. 관리자 권한 체크
		if (!"T".equals(isAdmin)) { // isAdmin 값이 'T'가 아니면 관리자가 아님
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] 공지사항 작성 권한 없음: isAdmin=" + isAdmin);
			// --- 디버깅 끝 ---
			return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.FORBIDDEN, "공지사항은 관리자만 작성할 수 있습니다.", null, "error"), HttpStatus.FORBIDDEN);
		}
		
		try {
			ArrayList<BoardFileDto> fileList = new ArrayList<>();
			
			if(boardFile != null && boardFile.length > 0 ) {	
				for(int i=0; i<boardFile.length; i++) {
					MultipartFile mFile = boardFile[i];	
					
					String filePath = fileUtil.uploadFile(mFile, "/board/");	
					
					BoardFileDto DBFile = new BoardFileDto();			
					DBFile.setFileName(mFile.getOriginalFilename());	
					DBFile.setFilePath(filePath);						
					fileList.add(DBFile);								
				}
			}
			
			board.setIsImportant("N"); 
			board.setIsSecret("N");    
			
			int result = service.insertBoard(board, fileList);
			
			if(result > 0) {
				res = new ResponseDto(HttpStatus.OK, "게시글이 등록되었습니다", true, "success");				
			}
			
		}catch (Exception e) {
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] insertBoard 오류 발생: " + e.getMessage());
			// --- 디버깅 끝 ---
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());

	}
	
	// 게시글 1개 조회
	@GetMapping("/{boardNo}")
	@NoTokenCheck 
	public ResponseEntity<ResponseDto> selectOneBoard (@PathVariable int boardNo){
		// --- 디버깅 시작 ---
		System.out.println("[NoticeController] selectOneBoard 호출. BoardNo: " + boardNo);
		// --- 디버깅 끝 ---
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 정보 조회 중 통신 오류가 발생했습니다.", null, "error");
		
		try {
			BoardDto board = service.selectOneBoard(boardNo); // NoticeService의 selectOneBoard 호출
			
			if (board == null) {
				// --- 디버깅 시작 ---
				System.out.println("[NoticeController] 게시글 #" + boardNo + " (공지사항)을 찾을 수 없습니다. (Service에서 null 반환)");
				// --- 디버깅 끝 ---
                return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다.", null, "error"), HttpStatus.NOT_FOUND);
            }
			
			res = new ResponseDto(HttpStatus.OK, "", board, "");
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] selectOneBoard 응답 준비 완료. 게시글 제목: " + board.getBoardTitle());
			// --- 디버깅 끝 ---
		}catch (Exception e) {
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] selectOneBoard 오류 발생: " + e.getMessage());
			// --- 디버깅 끝 ---
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	// 파일 다운로드
	@GetMapping("/file/{boardFileNo}")
	@NoTokenCheck
	public ResponseEntity<Resource> fileDown (@PathVariable int boardFileNo) throws FileNotFoundException{
		// --- 디버깅 시작 ---
		System.out.println("[NoticeController] fileDown 호출. boardFileNo: " + boardFileNo);
		// --- 디버깅 끝 ---
		BoardFileDto boardFile = service.selectBoardFile(boardFileNo);
		
		String savePath = uploadPath + "/board/";
		File file = new File(savePath + boardFile.getFilePath().substring(0, 8) + File.separator + boardFile.getFilePath());
		
		Resource resource = new InputStreamResource(new FileInputStream(file));
		
		HttpHeaders headers = new HttpHeaders();
		headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment;");	
		headers.add(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_OCTET_STREAM_VALUE);
		
		return ResponseEntity.status(HttpStatus.OK).headers(headers).contentLength(file.length()).body(resource);
	}
	
	// 게시글 삭제
	@DeleteMapping("/{boardNo}")
	public ResponseEntity<ResponseDto> deleteBoard (@PathVariable int boardNo, @RequestParam String isAdmin){
		// --- 디버깅 시작 ---
		System.out.println("[NoticeController] deleteBoard 호출. BoardNo: " + boardNo + ", isAdmin: " + isAdmin);
		// --- 디버깅 끝 ---
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 삭제 중 통신 오류가 발생했습니다.", false, "error");

		// 1. 관리자 권한 체크
		if (!"T".equals(isAdmin)) { 
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] 공지사항 삭제 권한 없음: BoardNo=" + boardNo + ", isAdmin=" + isAdmin);
			// --- 디버깅 끝 ---
			return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.FORBIDDEN, "공지사항은 관리자만 삭제할 수 있습니다.", false, "error"), HttpStatus.FORBIDDEN);
		}
		
		try {
			BoardDto delBoard = service.deleteBoard(boardNo); 
			
			if(delBoard != null) {
				List<BoardFileDto> delFileList = delBoard.getFileList();	
				if(delFileList != null && delFileList.size() > 0) {	
					String savePath = uploadPath + "/board/";
					for(BoardFileDto delFile : delFileList) {	
						File file = new File(savePath + delFile.getFilePath().substring(0,8) + File.separator + delFile.getFilePath());
						
						if(file.exists()) {
							file.delete();
						}
					}
				}
				
				String regExp = "<img[^>]*src=[\"']([^\"']+)[\"'][^>]*>";
				Pattern pattern = Pattern.compile(regExp);
				Matcher matcher = pattern.matcher(delBoard.getBoardContent());
				
				while(matcher.find()) {	
					String imageUrl = matcher.group(1);	
					String filePath = imageUrl.substring(imageUrl.lastIndexOf("/")+1);
					String savePath = uploadPath + "/editor/" + filePath.substring(0,8) + File.separator;
					
					File file = new File(savePath + filePath);
					if(file.exists()) {
						file.delete();
					}
				}
				
				res = new ResponseDto(HttpStatus.OK,"게시글이 삭제되었습니다.", true, "success");
			}
			
		}catch (Exception e) {
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] deleteBoard 오류 발생: " + e.getMessage());
			// --- 디버깅 끝 ---
			e.printStackTrace();
		}
		
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	// 게시글 수정
	@PatchMapping
	public ResponseEntity<ResponseDto> updateBoard (@ModelAttribute MultipartFile [] boardFile, @ModelAttribute BoardDto board, @RequestParam String isAdmin){
		// --- 디버깅 시작 ---
		System.out.println("[NoticeController] updateBoard 호출. BoardNo: " + board.getBoardNo() + ", isAdmin: " + isAdmin);
		System.out.println("[NoticeController] BoardDto for update: " + board);
		// --- 디버깅 끝 ---
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 수정 중 통신 오류가 발생했습니다.", false, "error");

		// 1. 관리자 권한 체크
		if (!"T".equals(isAdmin)) { 
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] 공지사항 수정 권한 없음: BoardNo=" + board.getBoardNo() + ", isAdmin=" + isAdmin);
			// --- 디버깅 끝 ---
			return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.FORBIDDEN, "공지사항은 관리자만 수정할 수 있습니다.", false, "error"), HttpStatus.FORBIDDEN);
		}
		
		try {
			if(boardFile != null && boardFile.length > 0) {
				ArrayList<BoardFileDto> addFileList = new ArrayList<>();	
				
				for(int i=0; i<boardFile.length; i++) {
					MultipartFile mFile = boardFile[i];	
					String filePath = fileUtil.uploadFile(mFile, "/board/");	
					System.out.println("controller : " + boardFile[0]); // 이 부분은 디버깅용으로 그대로 두겠습니다.
					
					BoardFileDto addFile = new BoardFileDto();
					addFile.setFileName(mFile.getOriginalFilename());	
					addFile.setFilePath(filePath);	
					addFile.setBoardNo(board.getBoardNo());		
					addFileList.add(addFile);	
				}
				
				board.setFileList(addFileList);		
			}
			
			ArrayList<BoardFileDto> delFileList = service.updateBoard(board);
			
			if(delFileList != null && delFileList.size() > 0) {
				String savePath = uploadPath + "/board/";
				for(int i=0; i<delFileList.size(); i++) {
					BoardFileDto delFile = delFileList.get(i);
					File file = new File(savePath + delFile.getFilePath().substring(0, 8) + File.separator + delFile.getFilePath());
					if(file.exists()) {
						file.delete();
					}
				}
			}
			
			res = new ResponseDto(HttpStatus.OK, "게시글이 수정되었습니다.", true, "success");
			
		}catch (Exception e) {
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] updateBoard 오류 발생: " + e.getMessage());
			// --- 디버깅 끝 ---
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}

	// 중요 공지 설정/해제 API (기존 JSP의 UpdateImportantServlet 역할)
	@PatchMapping("/important/{boardNo}")
	public ResponseEntity<ResponseDto> updateImportantStatus(@PathVariable int boardNo, @ModelAttribute BoardDto boardDto, @RequestParam String isAdmin) {
		// --- 디버깅 시작 ---
		System.out.println("[NoticeController] updateImportantStatus 호출. BoardNo: " + boardNo + ", isImportant: " + boardDto.getIsImportant() + ", isAdmin: " + isAdmin);
		// --- 디버깅 끝 ---
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "중요 공지 설정 변경 중 오류가 발생했습니다.", false, "error");

		// 1. 관리자 권한 체크
		if (!"T".equals(isAdmin)) { 
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] 공지사항 중요 설정 권한 없음: BoardNo=" + boardNo + ", isAdmin=" + isAdmin);
			// --- 디버깅 끝 ---
			return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.FORBIDDEN, "중요 공지 설정은 관리자만 할 수 있습니다.", false, "error"), HttpStatus.FORBIDDEN);
		}

		try {
			int result = service.updateBoardImportantStatus(boardNo, boardDto.getIsImportant());

			if (result > 0) {
				res = new ResponseDto(HttpStatus.OK, "중요 공지 설정이 업데이트되었습니다.", true, "success");
			} else {
				res = new ResponseDto(HttpStatus.BAD_REQUEST, "중요 공지 설정 업데이트에 실패했습니다.", false, "error");
			}
		} catch (Exception e) {
			// --- 디버깅 시작 ---
			System.out.println("[NoticeController] updateImportantStatus 오류 발생: " + e.getMessage());
			// --- 디버깅 끝 ---
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
	
	
	@GetMapping("/noticeList")
	@NoTokenCheck
	public ResponseEntity<ResponseDto> selectNoticeList(){
		ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "게시글 조회 중 오류가 발생하였습니다.", null, "error");
		
		try {
			ArrayList<BoardDto> noticeList = service.selectNoticeList();
			res = new ResponseDto(HttpStatus.OK, "", noticeList, "success");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
	}
}