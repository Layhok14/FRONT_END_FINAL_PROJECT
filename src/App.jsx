import { Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Login from './pages/Shared/login'
import Register from './pages/Shared/register'
import AdminHome from './Components/Admin/AdminHome'
import PatientHome from './pages/Patient/home'
import Medications from './pages/Patient/medications'

function App() {
  return (
    <>
      <nav className="main-nav">
        <Link to="/login">Login</Link> 
        <Link to="/register">Register</Link> 
        <Link to="/admin">Admin</Link> 
        <Link to="/">Patient Home</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/" element={<PatientHome />} />
        <Route path="/medications" element={<Medications />} />
      </Routes>
    </>
  )
}

export default App