import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { BrowserRouter } from 'react-router-dom'
import Modal from 'react-modal';

//팝업창을 띄우기 위한 Modal 설정
const appElement = document.getElementById('modal-root') || document.getElementById('root');
if (appElement) { // #modal-root 또는 #root 둘 중 하나라도 있다면 설정
  Modal.setAppElement(appElement);
}

//컴포넌트 외부에서 컴포넌트 전환을 위해 History 사용으로 변경
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import { customHistory } from './common/history.js'

createRoot(document.getElementById('root')).render(
  <HistoryRouter history={customHistory}>
    <App />
  </HistoryRouter>

)
