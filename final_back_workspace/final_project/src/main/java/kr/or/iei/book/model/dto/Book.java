package kr.or.iei.book.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data

public class Book {
	private String callNo;		//청구기호
	private String authorInfo;	//저자 정보
	private String titleInfo;	//제목
	private String pubInfo;		//출판사
	private String pubYear;		//발행년도
	private String regDate;		//도서 비치일
	private String ISBN;		//isbn
	private String placeInfo;	//도서 비치 장소
	private String imgUrl;		//책 표지 이미지 url 주소
	private String canLend;		//대출 상태 (T : 대출가능 / F : 대출불가 / R : 예약됨 / L : 대출중)
	private String remark;		//비고란 : 도서정보 수정시 기록
}
