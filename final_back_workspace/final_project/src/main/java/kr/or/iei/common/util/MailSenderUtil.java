package kr.or.iei.common.util; // common 패키지 안에 util 패키지를 만들고 그 안에 생성

import jakarta.mail.MessagingException; // Spring Boot 3.x은 jakarta.mail 사용
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value; // application.properties 값 주입용
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

@Component // Spring 빈으로 등록하여 다른 곳에서 주입받아 사용 가능하게 함
@RequiredArgsConstructor // final 필드 생성자 자동 주입
public class MailSenderUtil {

    private final JavaMailSender javaMailSender; // Spring Boot가 자동으로 주입해줌

    // application.properties에서 발신자 이메일 주입
    @Value("${spring.mail.username}")
    private String senderEmail;

    private final String SENDER_PERSONAL = "KH공감도서관"; // 발신자 이름

    public boolean sendEmail(String receiverEmail, String subject, String content) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            // true는 멀티파트 메시지를 생성하여 HTML 콘텐츠를 지원
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(receiverEmail);
            helper.setSubject(subject);
            helper.setText(content, true); // true는 HTML 콘텐츠임을 나타냄
            helper.setFrom(senderEmail, SENDER_PERSONAL); // application.properties에서 가져온 발신자 이메일 사용

            javaMailSender.send(mimeMessage);
            return true; // 성공
        } catch (MessagingException e) {
            e.printStackTrace();
            System.err.println("이메일 전송 실패 (MessagingException): " + e.getMessage());
            return false; // 실패
        } catch (Exception e) { // IOException 등 다른 예상치 못한 예외 처리
            e.printStackTrace();
            System.err.println("이메일 전송 중 예외 발생: " + e.getMessage());
            return false;
        }
    }
}