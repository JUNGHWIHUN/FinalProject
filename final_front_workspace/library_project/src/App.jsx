import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom';
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router-dom";


import AdminPage from './component/admin/AdminPage';
import Header from './component/common/Header';
import Footer from './component/common/Footer';
import Main from './component/common/Main'
import Join from './component/member/Join'
import Login from './component/member/Login'
import MyPageMain from './component/myPage/MyPageMain';
import BookSearchMain from './component/book/BookSearchMain';
import SelectBook from './component/admin/SelectBook';
import SelectLentBook from './component/admin/SelectLentBook';
import RequestBookMain from './component/requestBook/requestBookMain';
import NewBook from './component/admin/NewBook';
import AdminMemberPage from './component/admin/AdminMemberPage';
import FindId from './component/member/FindId'; 
import KakaoMap from './component/libInfo/KakaoMap';
import BoardMain from './component/board/BoardMain';
import FixBookDetail from './component/admin/FixBookDetail';
import RequestDetail from './component/admin/RequestDetail';
import SuggestDetail from './component/admin/SuggesDetail';
import LentBookDetail from './component/admin/LentBookDetail';
import LenterBookDetil from './component/admin/LenterBookDetil';
import AdminMemberDetailPage from './component/admin/AdminMemberDetailPage';
import FindPassword from './component/member/FindPassword';
import LibInfoMain from './component/libInfo/LibInfoMain';

function App() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate();

  


  return (
    <>
    <Header />

        <div className="main-content-wrapper"> {/* 이 div를 추가합니다. */}
          <Routes>
            <Route path='/' element={<Main />}/>  {/* 메인 화면은 여기서 렌더링됨 */}
            <Route path='/join' element={<Join />}/>
            <Route path='/login' element={<Login />}/>
            <Route path='/adminPage' element={<AdminPage />} />
            
            <Route path='/admin/selectReTrunBook' element={<SelectLentBook />}/>
            
            <Route path='/requestBook/*' element={<RequestBookMain />} />
             <Route path='/RequestDetail' element={<RequestDetail />} />
            <Route path='/SuggestDetail' element={<SuggestDetail />} />
            <Route path='/LentBookDetail' element={<LentBookDetail />} />
            <Route path='/admin/FixBookDetail' element={<FixBookDetail />} />
            <Route path='/LenterBookDetil' element={<LenterBookDetil />} />
            <Route path='/admin/memberDetail/:memberNo' element={<AdminMemberDetailPage />} />
            

            
            <Route path='/admin/newBook' element={<NewBook />} />
            <Route path='/admin/Member' element={<AdminMemberPage />} />
            

            <Route path='/admin/selectBook' element={<SelectBook />} />
            <Route path = "/myPage/*" element={<MyPageMain/>}/>

            <Route path="/book/*" element={<BookSearchMain />}/>
            <Route path='/board/*' element={<BoardMain/>}/> 

            {/* 아이디/비밀번호 찾기 페이지 라우트 추가 */}
            <Route path="/find-id" element={<FindId />} />
            <Route path="/find-password" element={<FindPassword />} />

            {/*도서관 안내 메인 페이지*/}
            <Route path='/libInfo/*' element={ <LibInfoMain />} />

          </Routes>
        </div>

      <Footer />

      

    </>
  )
}

export default App
