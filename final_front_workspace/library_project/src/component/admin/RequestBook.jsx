import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";


export default function RequestBook(){

    const [requestList, setRequestList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [reqPage, setReqPage] = useState(1); 
    const [pageInfo, setPageInfo] = useState({});

    useEffect(() => {
            let options = {};
            options.url='http://localhost:9999/admin/requestList/'+reqPage;
            options.method = 'get';
            

            axios(options)
            .then(function(res){
               setRequestList(res.data.resData.requestList);
               setPageInfo(res.data.resData.pageInfo);
            })
            .catch(function(err){
            console.log(err); 
            });

    }, [requestList])



    if (!requestList) {
        return <div>정보를 불러오는 중...</div>;
        }

    return(
        <>
        <h1></h1>
        </>
    )
}