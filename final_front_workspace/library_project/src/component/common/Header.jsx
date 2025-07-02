import { Link } from "react-router-dom"

export default function Header(){
    return (
        <header>
            <div>
                <a href="/adminPage">관리자페이지</a>
                <Link to="/adminPage">관리자2</Link>
            </div>
        </header>
    )
}