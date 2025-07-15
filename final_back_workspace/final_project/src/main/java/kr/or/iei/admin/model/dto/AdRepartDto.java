package kr.or.iei.admin.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdRepartDto {
	
	private String repartNo;
	private String repartReson;
	private String commentNo;
	private String commentCallNo;
	private String repoterId;
}
