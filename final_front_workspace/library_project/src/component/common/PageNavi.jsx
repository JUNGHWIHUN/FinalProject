//게시판 목록 하단 페이지네이션 제작 컴포넌트
export default function PageNavi (props){

    const pageInfo = props.pageInfo;        //페이지네이션 정보
    const reqPage = props.reqPage;          //요청 페이지
    const setReqPage = props.setReqPage;    //요청 페이지 변경 호출 함수

    const pageArr = new Array();            //페이지네이션 jsx 를 저장할 배열

    console.log(pageInfo);
        console.log(reqPage);
    console.log(setReqPage);


    //제일 앞 페이지로 이동 버튼 (<<)
    pageArr.push(
        <li key="first-page">
            <span className="material-icons page-item" onClick={function(){
                setReqPage(1);  //클릭시 첫 페이지(1) 로 이동
            }}>
                &lt;&lt;
            </span>
        </li>
    );

    //이전 페이지로 이동 버튼 (<)
    pageArr.push(
        <li key='prev-page'>
            <span className="material-icons page-item" onClick={function(){
                if(reqPage > 1){    //요청 페이지 (현재 페이지) 가 1보다 클 때만 동작 (1일 때는 동작하지 않음)
                    setReqPage(reqPage-1);  //클릭시 이전 페이지 (현재 요청 페이지 -1 )로 이동
                }
            }}>
                &lt;
            </span>
        </li>
    );

    //1 2 3 4 5 페이지 숫자 제작
    let pageNo = pageInfo.pageNo;   //페이지 시작 번호
    for(let i=0; i<pageInfo.pageNaviSize; i++){
        pageArr.push(
            <li key={'page' +i}>
                <span className={"page-item" + (pageNo==reqPage ? " active-page" : "")} onClick={function(e){
                    setReqPage(Number(e.target.innerText)); //클릭시 현재 페이지 (현재 이벤트가 일어난 요소 텍스트의 숫자 인식) 로 이동
                }}>
                    {pageNo}
                </span>
            </li>
        );

        pageNo++;

        //게시글이 전부 출력되었으면 페이지네이션을 더 만들지 않고 중지
        if(pageNo > pageInfo.totalPage){
            break;
        }
    };

    //다음 페이지로 이동(>)
    pageArr.push(
        <li key='next-page'>
            <span className="material-icons page-item" onClick={function(){
                if(reqPage < pageInfo.totalPage){   //요청 페이지 (현재 페이지) 가 전체 페이지보다 작을 때만 동작 (마지막 페이지일 때는 동작하지 않음)
                    setReqPage(reqPage+1);  //클릭시 다음 페이지 (현재 요청 페이지 +1 )로 이동
                }
            }}>
                &gt;
            </span>
        </li>
    );

    //마지막 페이지로 이동 (>>)
    pageArr.push(
        <li key="last-page">
            <span className="material-icons page-item" onClick={function(){
                setReqPage(pageInfo.totalPage); //클릭시 마지막 페이지 (=전체 페이지 수) 로 이동
            }}>
                &gt;&gt;
            </span>
        </li>
    );

    return (
        <ul className="pagination">
            {pageArr}
        </ul>
    )
}