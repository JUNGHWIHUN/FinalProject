import { useParams } from "react-router-dom"
import createInstance from "../../axios/Interceptor";
import { useEffect, useState } from "react";

export default function NoticeDetail(){

    const {noticeNo} = useParams();

    const serverUrl = import.meta.env.VITE_BACK_SERVER;
    const axiosInstacne = createInstance();

    const [notice,setNotice] = useState({});

    useEffect(function(){
        let options = {};
        options.url = serverUrl + '/notice/' + noticeNo;
        options.method = 'get';

        console.log(noticeNo);
        axiosInstacne(options)
        .then(function(res){
            console.log(res.data.resData);
        });

    },[])



    return(
       <>
        <div className="notice-detail-container">
      <table className="notice-detail-table">
        <tbody>
          <tr>
            <th>제목</th>
            <td>{notice.noticeTitle}</td>
          </tr>
          <tr>
            <th>작성일</th>
            <td>{notice.noticeDate}</td>
          </tr>
          <tr>
            <th>첨부파일</th>
            <td>
              {notice.fileList && notice.fileList.length > 0 ? (
                notice.fileList.map((file) => (
                  <div key={file.fileNo}>
                    <a
                      href={`${serverUrl}/files/${file.fileName}`}
                      target="_blank"
                      rel="noreferrer"
                      download
                    >
                      {file.fileName}
                    </a>
                  </div>
                ))
              ) : (
                <span>첨부파일 없음</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="notice-detail-content">
        {notice.noticeContent}
      </div>

      <button className="back-button" onClick={() => navigate(-1)}>
        목록
      </button>
    </div>
       </>
    )
}