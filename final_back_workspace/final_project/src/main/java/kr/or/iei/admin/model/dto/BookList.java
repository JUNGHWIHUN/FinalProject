package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BookList {

	private String bookNo;
	private String author;
	private String title;
	private String pub;
	private String pubYear;
	private String regDate;
	private int ISBN;
	private String place;
	private String imageUrl;
	private String canLent;
	private String remark;
	
	
}
