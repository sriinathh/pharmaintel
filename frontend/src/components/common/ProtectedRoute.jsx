import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Loader from './Loader'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <Loader variant="fullscreen" label="Validating session…" />
  if (!user) return <Navigate to="/login" replace />
  return children
}
