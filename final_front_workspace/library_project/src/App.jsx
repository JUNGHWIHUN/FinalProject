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
          

          <Route path='/admin/selectBook' element={<SelectBook />} />
          <Route path = "/myPage/*" element={<MyPageMain/>}/>
          <Route path="/book/*" element={<BookSearchMain />}/>

        </Routes>
      </main>

    </>
  )
}

export default App
