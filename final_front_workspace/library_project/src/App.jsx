import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'

import { Link } from "react-router-dom";
import AdminPage from './component/admin/AdminPage';
import Header from './component/common/Header';
import { Route, Routes } from 'react-router-dom';
import Main from './component/common/Main'
import Join from './component/member/Join'
import Login from './component/member/Login'
import MyPageMain from './component/myPage/MyPageMain';
import BookSearchMain from './component/book/BookSearchMain';
import SelectBook from './component/admin/SelectBook';
import LentBookDetail from './component/admin/LentBookDetail';
import SelectLentBook from './component/admin/SelectLentBook';
import LenterBookDetil from './component/admin/LenterBookDetil';
import FindId from './component/myPage/FindId'; 
import FixBookDetail from './component/admin/FixBookDetail';
import NewBook from './component/admin/NewBook';
import AdminMemberPage from './component/admin/AdminMemberPage';
import FindPassword from './component/myPage/FindPassword'; // MyPage 폴더 하위로 경로 변경



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header />
     
      <main>
        <Routes>
          <Route path='/' element={<Main />}/>
          <Route path='/join' element={<Join />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/adminPage' element={<AdminPage />} />
          <Route path='/LentBookDetail' element={<LentBookDetail />} />
          <Route path='/admin/selectReTrunBook' element={<SelectLentBook />}/>
          <Route path='/LenterBookDetil' element={<LenterBookDetil />} />
          <Route path='/admin/FixBookDetail' element={<FixBookDetail />} />
          <Route path='/admin/newBook' element={<NewBook />} />
          <Route path='/admin/Member' element={<AdminMemberPage />} />

          <Route path='/admin/selectBook' element={<SelectBook />} />
          <Route path = "/myPage/*" element={<MyPageMain/>}/>

          <Route path="/book/*" element={<BookSearchMain />}/>

          {/* 아이디/비밀번호 찾기 페이지 라우트 추가 */}
          <Route path="/find-id" element={<FindId />} />
          <Route path="/find-password" element={<FindPassword />} />

        </Routes>
      </main>

    </>
  )
}

export default App
