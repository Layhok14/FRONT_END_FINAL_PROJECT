import { Routes, Route } from 'react-router-dom'
import './App.css'

// pages for routing
import Login from './pages/Shared/login'
import Register from './pages/Shared/register'
import AdminHome from './Components/Admin/AdminHome'
import PatientHome from './pages/Patient/home'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/*" element={<AdminHome />} />
        <Route path="/patient/*" element={<PatientHome />} />
      </Routes>
    </>
  )
}

export default App
