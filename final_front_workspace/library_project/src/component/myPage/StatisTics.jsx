import {Bar} from 'react-chartjs-2';
import { Chart as ChartJs,
        BarElement,
        CategoryScale,
        LinearScale,
        Legend,
        Tooltip,
 } from 'chart.js';
import useUserStore from '../../store/useUserStore';
import { useState } from 'react';
import createInstance from '../../axios/Interceptor';

 ChartJs.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);
 
 //독서 통계 컴포넌트
 export default function StatisTics(){
     //선택된 월
     const [selectedMonth, setSelectedMonth] = useState("2025-06");
     
     const [chartData, setCharData] = useState(null);

     //로그인한 회원 정보 가져오기
     const {loginMember} = useUserStore();

     const axiosInstacne = createInstance();
     const serverUrl = import.meta.env.VITE_BACK_SERVER;


    function fetchLoanStats(){
        let options = {};
        options.url = serverUrl + "/statistics";
        options.method = "get";
        options.params = {
            memberNo : loginMember.memberNo,
            month : selectedMonth
        }

        axiosInstacne(options)
        .then(function(res){
            console.log(res);
        })
        .catch(function(err){
            console.log(err);
        })
    }

    
    return(
        
    <div>
      <h2>📊 월별 대출 통계</h2>

      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        <option value="2025-06">2025-06</option>
        <option value="2025-07">2025-07</option>
        <option value="2025-08">2025-08</option>
      </select>

      <button onClick={fetchLoanStats}>선택</button>

      {chartData && (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      )}
    </div>
  );
    
}