import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'

import { Link } from "react-router-dom";
import AdminPage from './component/admin/AdminPage';
import Header from './component/common/header';
import { Route, Routes } from 'react-router-dom';
import Main from './component/common/Main'
import Join from './component/member/Join'
import Login from './component/member/Login'
import MyPageMain from './component/myPage/MyPageMain';


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
          <Route path = "/myPage/*" element={<MyPageMain/>}/>
        </Routes>
      </main>
 
    </>
  )
}

export default App
