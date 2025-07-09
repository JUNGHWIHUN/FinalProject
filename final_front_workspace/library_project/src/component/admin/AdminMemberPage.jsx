import axios from "axios";
import PageNavi from '../common/PageNavi';
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";


export default function AdminMemberPage(){

     // 목록 전환
    const [subMode, setSubMode] = useState("userList");
    const navigate = useNavigate();

    //회원 목록
    const [allMemberList, setAllMemberList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

     //회원 목록
    const [overMemberList, setOverMemberList] = useState([]);
    const [overTotalCount, setOverTotalCount] = useState(0);

    // 페이지 정보
    const [reqPage, setReqPage] = useState(1); 
    const [pageInfo, setPageInfo] = useState({});

    //검색설정.
    const [filterType, setFilterType] = useState("name");
    const [keyword, setKeyword] = useState("");
    //타입 세팅
    function keywordType(e){
      setFilterType(e.target.value);
    }
    //키워드 세팅
    function keywordSetting(e){
      setKeyword(e.target.value);
    }

    function fetAllMemberList(){
            let options = {};
            options.url='http://localhost:9999/admin/allMemberList/'+ reqPage;
            options.method = 'get';
            options.params = {type : filterType, keyword : keyword};

            axios(options)
            .then(function(res){
              setAllMemberList(res.data.resData.memberList)
              setPageInfo(res.data.resData.pageInfo)
            })
            .catch(function(err){
            console.log(err); 
            }); 
    }

    function fetOverdueList(){
        let options = {};
            options.url='http://localhost:9999/admin/overMemberList/'+ reqPage;
            options.method = 'get';
            options.params = {type : filterType, keyword : keyword};

            axios(options)
            .then(function(res){
              setOverMemberList(res.data.resData.memberList)
              setPageInfo(res.data.resData.pageInfo)
            })
            .catch(function(err){
            console.log(err); 
            }); 
    }



    return(
        <>

        <h3>회원 관리</h3>
            <a href="#" onClick={(e) => { e.preventDefault(); setSubMode("userList"); fetAllMemberList(1); }}>회원목록</a> |
            <a href="#" onClick={(e) => { e.preventDefault(); setSubMode("overdueList"); fetOverdueList(1); }}>연체자 목록</a>

        {subMode === "userList" && (
            <>
            <select value={filterType} onChange={keywordType}>
                     <option value="name">회원이름</option>
                     <option value="id">아이디</option>
                     <option value="email">이메일</option>
                     <option value="phone">전화번호</option>
                </select>
                <input type="text" id="title" onChange={keywordSetting}></input> <button onClick={function() { fetAllMemberList(1); }}>검색하기</button>
            <table border="1">
                        <thead>
                          <tr>
                              <th>회원이름</th>
                              <th>아이디</th>
                              <th>이메일</th>
                              <th>누적 연체 일수</th>
                              <th>전화번호</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allMemberList.map(function(member, index){
                             
                             return <MemberItem key={"member"+index} member={member}/>
                          })}
                         </tbody>
                  </table>
            
            </>

        )}

        {subMode === "overdueList" && (
            <>
                <select value={filterType} onChange={keywordType}>
                     <option value="memberName">회원이름</option>
                     <option value="bookName">대출된 책 목록</option>
                </select>
                <input type="text" id="title" onChange={keywordSetting}></input> <button onClick={function() { fetOverdueList(1); }}>검색하기</button>
            <table border="1">
                        <thead>
                          <tr>
                              <th>회원이름</th>
                              <th>대출된 책 제목</th>
                              <th>대출일</th>
                              <th>연체 일수</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overMemberList.map(function(member, index){
                             
                             return <OverMemberItem key={"member"+index} member={member}/>
                          })}
                         </tbody>
                  </table>
            
            </>

        )}


        </>
    )
}

function MemberItem(props){
    const member = props.member;
    const memberNo = member.memberNo;

     console.log("MemberItem - memberNo:", memberNo);

    return(
        <>
       
        <tr>
            <td><Link to={`/admin/memberDetail/${memberNo}?from=member`}>{member.memberName}</Link></td>
            <td>{member.memberId}</td>
            <td>{member.memberEmail}</td>
            <td>{member.overudeCount}</td>
            <td>{member.memberPhone}</td>
        </tr>
        </>
    )


}

function OverMemberItem(props){
    const member = props.member;
    const memberNo = member.memberNo;
    const bookNo = member.callNo;
    console.log("OverMemberItem - member:", member);
    console.log("OverMemberItem - bookNo:", member.callNo);


    return(
        <>
        <tr>
            <td><Link to={`/admin/memberDetail/${memberNo}?from=overdue&bookNo=${bookNo}`}>{member.memberName}</Link> </td>
            <td>{member.title}</td>
            <td>{member.lentDate}</td>
            <td>{member.overDue}</td>
        </tr>
        </>
    )


}