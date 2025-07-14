import LibDirectorImage from "../../image/LibDirector_JHH.png";
import './LibInfo.css';

export default function LibIntroduce() {
  return (
    <div className="greeting-container">
        <div className="greeting-text">
        <h2>인사말</h2>
        <p>
          안녕하십니까? <br />
          KH_공감도서관 홈페이지를 방문해 주신 여러분을 진심으로 환영합니다. <br /><br />
          KH_공감도서관은 대한민국을 대표하는 지식과 문화의 요람으로서, <br />
          우리나라의 소중한 문화유산과 지식자원을 보존하고 널리 알리는 데 앞장서고 있습니다. <br />
          우리 도서관은 다양한 자료와 정보를 통해 지식의 나눔과 학문의 발전을 도모하고, 모든 국민이 자유롭게 지식에 접근할 수 있는 환경을 제공하기 위해 최선을 다하고 있습니다. <br />
          우리 도서관은 수많은 도서와 디지털 자료, 희귀 문헌 등을 소장하고 있으며, <br />
          이를 바탕으로 다양한 연구와 교육 프로그램을 운영하고 있습니다. <br />
          또한, 디지털 대전환의 시대에 맞추어 디지털도서관 시스템을 강화하고, <br />
          최신 기술을 활용한 서비스 제공을 통해 이용자 여러분의 편의를 도모하고자 합니다. <br />
          앞으로도 KH_공감도서관은 지식과 문화의 중심지로서, 국민 여러분의 사랑과 신뢰를 받는 도서관이 되기 위해 노력할 것입니다. <br />
          여러분의 지속적인 관심과 성원을 부탁드리며, 언제나 편안하고 유익한 공간이 될 수 있도록 최선을 다하겠습니다. <br />
          감사합니다. <br />
        </p>
        </div>
        <div className="greeting-director">
            <img src={LibDirectorImage} alt="도서관장 정휘훈" className="LibDirector-icon-img" />
            <br />
            <span className="director-name">도서관장 정휘훈</span>
        </div>
    </div>
  );
}