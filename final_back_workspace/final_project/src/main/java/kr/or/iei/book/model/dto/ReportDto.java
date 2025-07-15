package kr.or.iei.book.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor 
@AllArgsConstructor
public class ReportDto {
	
    private String commentReportNo;    // 댓글신고번호 (DB에서는 시퀀스로 자동 생성되므로 프론트에서 받을 필요는 없음)
    private String reportReason;       // 신고사유 (프론트에서 입력받음)
    private String reportedCommentNo;  // 신고된 댓글 번호 (프론트에서 전달)
    private String reportedCommentCallNo; // 신고된 서평이 작성된 책 청구기호 (프론트에서 전달)
    private String reportedMemberId;   // 신고한 회원아이디 (프론트에서 전달)
    
}
