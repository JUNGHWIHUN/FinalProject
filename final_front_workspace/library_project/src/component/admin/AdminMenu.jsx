import "./Admin.css"; 

export default function AdminMenu({ goMode }) {
  return (
    <div className="admin-menu" style={{padding: "24px"}}>
      <a href="#" onClick={(e) => { e.preventDefault(); goMode("allBook"); }}>도서관리</a>|&nbsp;
      <a href="#" onClick={(e) => { e.preventDefault(); goMode("allMember"); }}>회원관리</a>|&nbsp;
      <a href="#" onClick={(e) => { e.preventDefault(); goMode("bookRequest"); }}>희망도서</a>|&nbsp;
      <a href="#" onClick={(e) => { e.preventDefault(); goMode("report"); }}>신고</a>|&nbsp;
      <a href="#" onClick={(e) => { e.preventDefault(); goMode("lend"); }}>대출</a>|&nbsp;
      <a href="#" onClick={(e) => { e.preventDefault(); goMode("return"); }}>반납</a>
    </div>
  );
}