import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
//import './App.css'

import { Link } from "react-router-dom";
import AdminPage from './component/admin/AdminPage';

import Header from './component/common/header';

import { Route, Routes } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

    <Header />
      <Routes>
        <Route path='/adminPage' element={<AdminPage />} />
      </Routes>
      
    </>
  )
}

export default App
