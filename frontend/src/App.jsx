import React, { Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './i18n'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Loader from './components/common/Loader'
import ProtectedRoute from './components/common/ProtectedRoute'

const LandingPage = React.lazy(() => import('./pages/LandingPage'))
const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'))
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'))
const MedicalChatPage = React.lazy(() => import('./features/medicalChat/MedicalChatPage'))
const ReportsPage = React.lazy(() => import('./pages/ReportsPage'))
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'))
const AdminPage = React.lazy(() => import('./pages/AdminPage'))
const DrugsPage = React.lazy(() => import('./pages/DrugsPage'))
const DrugProfile = React.lazy(() => import('./pages/DrugProfile'))

export default function App() {
  function AppInner() {
    const location = useLocation()
    const hideOn = ['/', '/login', '/register']
    const hideNavbar = hideOn.includes(location.pathname)

    const hideFooterOn = ['/login', '/register', '/reports', '/medical-assistant']
    const hideFooter = hideFooterOn.includes(location.pathname) || location.pathname.startsWith('/drugs')

    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800">
        {!hideNavbar && <Navbar />}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/medical-assistant" element={<MedicalChatPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/drugs" element={<DrugsPage />} />
              <Route path="/drugs/:id" element={<DrugProfile />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </Suspense>
        </main>
        {!hideFooter && <Footer />}
      </div>
    )
  }

  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  )
}
 
