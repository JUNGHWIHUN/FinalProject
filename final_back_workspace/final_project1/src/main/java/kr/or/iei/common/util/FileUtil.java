package kr.or.iei.common.util;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

@Component
public class FileUtil {
	
	//application.properties 에 작성된 파일 경로 (C:/Temp/react)
	@Value("${file.uploadPath}")
	private String uploadPath;
	
	public String uploadFile(MultipartFile file, String savePath) throws IOException {
		//중복되지 않도록 서버에 저장될 파일명 생성 => 파일 업로드
		
		int ranNum = new Random().nextInt(10000)+1;	//1~10000 까지의 난수
		
		String str = "_"+String.format("%05d", ranNum);	//"_00000" (랜덤 숫자 5자리로 고정)
		
		String name = file.getOriginalFilename();	//사용자가 업로드한 실제 파일명 : test.jpg
		String ext = null;	//확장자 저장 변수
		
		int dot = name.lastIndexOf(".");	//파일명 뒤에서부터 마침포 위치를 찾아 int 로 반환, 없으면 -1 반환
		
		if(dot != -1) {
			ext = name.substring(dot);	//.jpg (마침표가 있는 인덱스 번호부터 끝까지 문자열로 반환)
		}else {
			ext = "";
		}
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");	//년도 / 월 / 일 / 시간 / 분 / 초 /밀리초
		String serverFileName = sdf.format(new Date(System.currentTimeMillis())) + str + ext;	//test.jpg => 202506241515????? + _????? + .jpg
		
		String serverDirectory = serverFileName.substring(0, 8);	//0번 인덱스부터 8-1 번째 인덱스까지 8개 추출 : 20250624
		
		savePath = uploadPath + savePath + serverDirectory + File.separator;	//저장경로 : 업로드경로 + 기존 저장경로 + 새로 만든 디렉토리 + 구분자 (/)

		//파일 업로드 처리
		BufferedOutputStream bos = null;
		
		try {
			File directory = new File(savePath);
			
			if(!directory.exists()) {	//경로 미존재 시 새로 경로 생성
				directory.mkdirs();
			}
			
			byte [] bytes = file.getBytes();
			bos = new BufferedOutputStream(new FileOutputStream(new File(savePath + serverFileName)));	//주 스트림+보조 스트림 연결 및 경로 설정
			bos.write(bytes);	//파일 업로드
		} finally {
			bos.close();
		}
		
		return serverFileName;
	}
}
