package kr.or.iei.myPage.myLibrary.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class MyLibraryBook {
	
    private String myLibraryBookNo;     //내 서재에 등록된 책들을 구별할 고유 번호 : select, update, delete 등에 쓰임
    private String myLibraryNo;         //이 책이 속한 내 서재의 번호 (FK)
    private String myLibraryCallNo;     //해당 책의 청구기호 (FK)
    private String registeredDate;      //내 서재에 이 책이 등록된 날짜
}
