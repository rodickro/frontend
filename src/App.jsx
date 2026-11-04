
import './App.css'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

import PrincipalPage from './pages/PrincipalPage.jsx'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<PrincipalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App
