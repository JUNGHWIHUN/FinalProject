import { useState } from 'react'
import Main from './component/common/Main'
import Join from './component/member/Join'
import Login from './component/member/Login'
import { Route, Routes } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <Routes>
          <Route path='/' element={<Main />}/>
          <Route path='/join' element={<Join />}/>
          <Route path='/login' element={<Login />}/>
        </Routes>
      </main>
    </>
  )
}

export default App
