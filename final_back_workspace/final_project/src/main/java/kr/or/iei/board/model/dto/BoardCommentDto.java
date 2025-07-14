package kr.or.iei.board.model.dto; // 또는 kr.or.iei.comment.model.dto

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BoardCommentDto {
    private int commentNo; // 댓글 고유 번호
    private int boardNo; // 댓글이 속한 게시글 번호 (FK)
    private String memberNo; // 댓글 작성자 회원 번호 (FK)
    private String commentContent; // 댓글 내용
    private String commentDate; // 댓글 작성일
    // private String commentUpdateDate; // 댓글 최종 수정일 (DDL에서 제거됨)
    // private Integer parentCommentNo; // 부모 댓글 번호 (DDL에서 제거됨)

    // 조회 시 필요한 추가 정보 (MEMBER_MBTI는 DDL에서 제거됨)
    private String commentWriterId; // 댓글 작성자 아이디 (TBL_MEMBER.MEMBER_ID)
    private String commentWriterNickname; // 댓글 작성자 닉네임 (TBL_MEMBER.MEMBER_NICKNAME)
    // private String commentWriterMbti; // 댓글 작성자 MBTI (DDL에서 제거됨)
}