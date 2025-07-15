// kr.or.iei.board.controller.SuggestionController.java
package kr.or.iei.board.controller;

import java.util.ArrayList;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam; // @RequestParam 임포트 유지

import kr.or.iei.board.model.dto.BoardDto;
import kr.or.iei.board.model.dto.BoardCommentDto;
import kr.or.iei.board.model.service.SuggestionService;
import kr.or.iei.common.annotation.NoTokenCheck;
import kr.or.iei.common.model.dto.ResponseDto;
// import kr.or.iei.member.model.dto.Member; // Member DTO 임포트 제거
// import jakarta.servlet.http.HttpSession; // HttpSession 임포트 제거

@RestController
@CrossOrigin("*")
@RequestMapping("/suggestion")
public class SuggestionController {

    @Autowired
    private SuggestionService service;

    // 건의사항 게시글 목록 조회
    @GetMapping("/list/{reqPage}")
    @NoTokenCheck
    public ResponseEntity<ResponseDto> selectSuggestionList(@PathVariable int reqPage, @RequestParam(required = false) String loginMemberNo, @RequestParam(required = false, defaultValue = "F") String isAdmin) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "건의사항 조회 중 통신 오류가 발생하였습니다.", null, "error");

        try {
            // loginMemberNo와 isAdmin은 @RequestParam으로 직접 받으므로 Member 객체에서 추출하는 로직 불필요
            HashMap<String, Object> suggestionMap = service.selectSuggestionList(reqPage, loginMemberNo, isAdmin);
            res = new ResponseDto(HttpStatus.OK, "", suggestionMap, "");

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }

    // 건의사항 게시글 작성
    @PostMapping
    public ResponseEntity<ResponseDto> insertSuggestion(@ModelAttribute BoardDto board, @RequestParam String loginMemberNo, @RequestParam String isAdmin) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "건의사항 등록 중 통신 오류가 발생하였습니다", null, "error");

        // 로그인 여부 확인 (loginMemberNo가 비어있으면 로그인 안 된 것으로 간주)
        if (loginMemberNo == null || loginMemberNo.isEmpty()) {
            return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다.", null, "error"), HttpStatus.UNAUTHORIZED);
        }

        try {
            board.setBoardWriter(loginMemberNo); // 작성자 회원 번호 설정
            int result = service.insertSuggestion(board); // isAdmin은 서비스 내부에서 사용하지 않음

            if (result > 0) {
                res = new ResponseDto(HttpStatus.OK, "건의사항이 등록되었습니다", true, "success");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }

    // 건의사항 게시글 1개 조회
    @GetMapping("/{boardNo}")
    @NoTokenCheck
    public ResponseEntity<ResponseDto> selectOneSuggestion(@PathVariable int boardNo, @RequestParam(required = false) String loginMemberNo, @RequestParam(required = false, defaultValue = "F") String isAdmin) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "건의사항 정보 조회 중 통신 오류가 발생했습니다.", null, "error");

        try {
            BoardDto board = service.selectOneSuggestion(boardNo, loginMemberNo, isAdmin);

            res = new ResponseDto(HttpStatus.OK, "", board, "");
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }


    // 건의사항 게시글 삭제
    @DeleteMapping("/{boardNo}")
    public ResponseEntity<ResponseDto> deleteSuggestion(@PathVariable int boardNo, @RequestParam String isAdmin) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "건의사항 삭제 중 통신 오류가 발생했습니다.", false, "error");

        // 1. 관리자 권한 체크
        if (!"T".equals(isAdmin)) { // 관리자만 삭제 가능
            return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.FORBIDDEN, "삭제 권한이 없습니다.", false, "error"), HttpStatus.FORBIDDEN);
        }

        try {
            BoardDto delBoard = service.deleteSuggestion(boardNo, isAdmin);

            if (delBoard != null) {
                res = new ResponseDto(HttpStatus.OK, "건의사항이 삭제되었습니다.", true, "success");
            } else {
                res = new ResponseDto(HttpStatus.BAD_REQUEST, "건의사항 삭제에 실패했습니다. (게시글 없거나 권한 없음)", false, "error");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }


    // 답변 등록
    @PostMapping("/comments")
    public ResponseEntity<ResponseDto> insertComment(@RequestBody BoardCommentDto comment, @RequestParam String isAdmin) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "답변 등록 중 통신 오류가 발생했습니다.", null, "error");

        // 관리자 권한 체크
        if (!"T".equals(isAdmin)) {
            return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.FORBIDDEN, "답변은 관리자만 작성할 수 있습니다.", null, "error"), HttpStatus.FORBIDDEN);
        }

        try {
            // comment.setMemberNo는 @RequestBody로 받아온 comment 객체에 이미 바인딩됩니다.
            // (프론트에서 FormData가 아닌 JSON으로 보내고, comment DTO에 memberNo가 있다면 자동으로 바인딩됩니다.)
            int result = service.insertSuggestionComment(comment, isAdmin);

            if (result > 0) {
                res = new ResponseDto(HttpStatus.OK, "답변이 등록되었습니다.", true, "success");
            } else {
                res = new ResponseDto(HttpStatus.BAD_REQUEST, "답변 등록에 실패했습니다.", false, "error");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }

    // 답변 목록 조회 (변경 없음)
    @GetMapping("/{boardNo}/comments")
    @NoTokenCheck
    public ResponseEntity<ResponseDto> selectCommentList(@PathVariable int boardNo) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "답변 조회 중 통신 오류가 발생했습니다.", null, "error");

        try {
            ArrayList<BoardCommentDto> commentList = service.selectSuggestionCommentList(boardNo);
            HashMap<String, Object> dataMap = new HashMap<>();
            dataMap.put("commentList", commentList);
            res = new ResponseDto(HttpStatus.OK, "", dataMap, "");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }


    // 답변 삭제
    @DeleteMapping("/comments/{commentNo}")
    public ResponseEntity<ResponseDto> deleteComment(@PathVariable int commentNo, @RequestParam String isAdmin) {
        ResponseDto res = new ResponseDto(HttpStatus.INTERNAL_SERVER_ERROR, "답변 삭제 중 통신 오류가 발생했습니다.", false, "error");

        // 관리자 권한 체크
        if (!"T".equals(isAdmin)) {
            return new ResponseEntity<ResponseDto>(new ResponseDto(HttpStatus.FORBIDDEN, "답변은 관리자만 삭제할 수 있습니다.", false, "error"), HttpStatus.FORBIDDEN);
        }

        try {
            int result = service.deleteSuggestionComment(commentNo, isAdmin);

            if (result > 0) {
                res = new ResponseDto(HttpStatus.OK, "답변이 삭제되었습니다.", true, "success");
            } else {
                res = new ResponseDto(HttpStatus.BAD_REQUEST, "답변 삭제에 실패했습니다.", false, "error");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<ResponseDto>(res, res.getHttpStatus());
    }
}