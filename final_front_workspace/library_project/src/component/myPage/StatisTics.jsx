import {Bar} from 'react-chartjs-2';
import { Chart as ChartJs,
        BarElement,
        CategoryScale,
        LinearScale,
        Legend,
        Tooltip,
 } from 'chart.js';
import useUserStore from '../../store/useUserStore';
import { useEffect, useState } from 'react';
import createInstance from '../../axios/Interceptor';

ChartJs.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

 //독서 통계 컴포넌트
 export default function StatisTics(){
     //선택된 월
     const [selectedMonth, setSelectedMonth] = useState("");

     //월별 리스트를 위한 state변수
     const [monthList , setMonthList] = useState([]);

     const [chartData, setCharData] = useState(null);

     //로그인한 회원 정보 가져오기
     const {loginMember} = useUserStore();

     const axiosInstacne = createInstance();
     const serverUrl = import.meta.env.VITE_BACK_SERVER;


     useEffect(function(){
        let options = {};
        options.url = serverUrl + "/statistics/months";
        options.method = "get";
        options.params = {
          memberNo : loginMember.memberNo
        }

        axiosInstacne(options)
        .then(function(res){
          const months = res.data.resData;

            // 객체면 month 필드만 추출
            const monthArray = months.map((item) =>
            typeof item === "string" ? item : item.month
        );

          setMonthList(monthArray);
          if(monthArray.length > 0) setSelectedMonth(monthArray[0]); // months가 아니라 monthArray로 접근
        })
        .catch(function(err){
          console.log(err);
        })
     },[])


    useEffect(() => { // selectedMonth가 변경될 때마다 통계 데이터를 가져오도록
        if (selectedMonth) {
            fetchLoanStats();
        } else {
            setCharData(null); // 월이 선택되지 않으면 차트 데이터 초기화
        }
    }, [selectedMonth]); // selectedMonth가 변경될 때 실행되도록 의존성 배열에 추가


    function fetchLoanStats(){
       
        let options = {};
        options.url = serverUrl + "/statistics";
        options.method = "get";
        options.params = {
            memberNo : loginMember.memberNo,
            month : selectedMonth
        };

        axiosInstacne(options)
        .then(function(res){
          
            const data = res.data.resData;

            const labels = data.map(item => item.category);
            const values = data.map(item => item.cnt);

            const charData = {
              labels : labels,
              datasets : [{
                label : "대출 건수",
                data : values,
                backgroundColor : "rgba(75,192,192,0.5)",
              },
            ],
          };
          setCharData(charData);
        })
        .catch(function(err){
            console.log(err);
        })
    }


    function handleMonthChange(e){
      setSelectedMonth(e.target.value);
    }

    return(
        <div className="statistics-container"> {/* 전체 컨테이너 추가 */}
            <h2 className="page-title">독서 통계</h2> {/* 페이지 제목에 클래스 추가 */}

            <div className="month-selector-group"> {/* 셀렉트 박스, 버튼 그룹 */}
                <select value={selectedMonth} onChange={handleMonthChange} className="month-select">
                    {monthList.length === 0 ? (
                        <option value="">데이터 없음</option>
                    ) : (
                        monthList.map((month) => (
                            <option key={month} value={month}>
                                {month}
                            </option>
                        ))
                    )}
                </select>
                <button onClick={fetchLoanStats} className="select-month-button">선택</button>
            </div>

            {chartData ? (
                <div className="chart-container"> {/* 차트 컨테이너 추가 */}
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: "top" } },
                            scales: {
                                y: { beginAtZero: true },
                                x: {
                                    barPercentage: 0.3,
                                    categoryPercentage: 0.6,
                                },
                            },
                        }}
                    />
                </div>
            ) : (
                <p className="no-statistics-message">선택된 월에 대한 독서 통계 데이터가 없습니다.</p>
            )}
        </div>
    );

}