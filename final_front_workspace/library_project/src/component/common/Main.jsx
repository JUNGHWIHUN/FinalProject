//메인(루트 접근 시) 컴포넌트
export default function Main () {
    
    return (
        <section className="section" style={{width:"100%"}}>
            <div className="page-title">메인페이지</div>
            <h3><a href='/join'>회원가입 링크</a></h3>
            <h3><a href='/login'>로그인 링크</a></h3>
        </section>
    );
}