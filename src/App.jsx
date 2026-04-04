import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AuthPage from './pages/AuthPage'
import CaregiversPage from './pages/CaregiversPage'
import DashboardLayout from './pages/DashboardLayout'
import HistoryPage from './pages/HistoryPage'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import MedicationsPage from './pages/MedicationsPage'
import SettingsPage from './pages/SettingsPage'
import { getCurrentUser } from './utils/storage'

function RootRedirect() {
  const user = getCurrentUser()
  return user ? <Navigate to="/app/home" replace /> : <LandingPage />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<HomePage />} />
        <Route path="medications" element={<MedicationsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="caregivers" element={<CaregiversPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
