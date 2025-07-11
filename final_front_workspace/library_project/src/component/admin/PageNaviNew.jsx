export default function PageNaviNew({ pageInfo, reqPage, setReqPage }) {
  const startPage = pageInfo.pageNo;
  const endPage = Math.min(startPage + pageInfo.pageNaviSize - 1, pageInfo.totalPage);
  const hasPrev = startPage > 1;
  const hasNext = endPage < pageInfo.totalPage;

  const handlePageClick = (page) => {
    setReqPage(page);
    window.scrollTo(0, 0); // 필요시 스크롤 최상단
  };

  return (
    <div className="pagination">
      {hasPrev && (
        <button onClick={() => handlePageClick(startPage - 1)}>
          ◀ 이전
        </button>
      )}

      {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={page === reqPage ? "active" : ""}
        >
          {page}
        </button>
      ))}

      {hasNext && (
        <button onClick={() => handlePageClick(endPage + 1)}>
          다음 ▶
        </button>
      )}
    </div>
  );
}
