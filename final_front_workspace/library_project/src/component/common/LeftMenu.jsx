import { Link } from "react-router-dom";
import './Common.css'; // LeftMenu.css 임포트 추가

export default function LeftMenu(props){
    const menuList = props.menuList;

    return(
        <div className="left-menu-container"> {/* 클래스 추가 */}
        <ul>
        {menuList.map(function(menu,index){
            return <li key={"menu" + index} className={props.activeMenu === menu.text ? 'active' : ''}> {/* 활성 메뉴를 위한 클래스 추가 */}
                <Link to = {menu.url}>
                    <span>{menu.text}</span>
                </Link>
            </li> 
        })} 
        </ul>
        </div>
    )
}