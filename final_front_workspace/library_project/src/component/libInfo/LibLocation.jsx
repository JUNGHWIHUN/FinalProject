import { useEffect, useRef } from "react";
import KakaoMap from "./KakaoMap";


export default function LibLocation() {

  return (
    <div>
      <h2>📍 오시는 길</h2>
      <KakaoMap />
      <br />
      <table border={1}>
        <tbody>
          <tr>
            <th>주소</th>
            <td>서울특별시 강남구 테헤란로 14길 6</td>
          </tr>
          <tr>
              <th>버스</th>
              <td>역삼역.포스코P&S타워 정류장 <br />
                  🚌 146/740/341/360
              </td>
          </tr>
          <tr>
              <th>지하철</th>
              <td>지하철 2호선 역삼역 3번출구 100m</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}