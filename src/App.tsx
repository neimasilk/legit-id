import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import ErrorBoundary from './components/ErrorBoundary'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import IdentityCreatePage from './pages/IdentityCreatePage'
import VerificationRequestsPage from './pages/VerificationRequestsPage'
import ProfilePage from './pages/ProfilePage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminUserManagementPage from './pages/AdminUserManagementPage'
import AdminVerificationRequestsPage from './pages/AdminVerificationRequestsPage'
import AdminSystemSettingsPage from './pages/AdminSystemSettingsPage'
import BlockchainIntegrationDemo from './components/BlockchainIntegrationDemo'
import './App.css'

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <Router>
      <div className="App">
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/identity/create" element={<IdentityCreatePage />} />
          <Route path="/verification/requests" element={<VerificationRequestsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<AdminUserManagementPage />} />
          <Route path="/admin/verification-requests" element={<AdminVerificationRequestsPage />} />
          <Route path="/admin/settings" element={<AdminSystemSettingsPage />} />
          <Route path="/blockchain-demo" element={<BlockchainIntegrationDemo />} />
        </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  )
}

export default App
