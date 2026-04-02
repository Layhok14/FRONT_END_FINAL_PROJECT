import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'

import './App.css'

// pages for routing
import Home from './Home'
import AdminHome from './Components/Admin/AdminLayout'
import Login from './Components/Admin/Login'
// import PatientHome from './Patient/Components/PatientHome'

function App() {

  return (
    <>
      <nav className="main-nav hidden">
        <Link to="/">Home</Link> |{' '}
        <Link to="/admin">Admin</Link> |{' '}
        <Link to="/patient">Patient</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={<AdminHome />} />
        {/* <Route path="/patient/*" element={<PatientHome />} /> */}
      </Routes>

    </>
  )
}

export default App
