import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  if (loading) return <p>Laddar...</p>
  if (!user) return <Navigate to="/login" replace />
  return <Outlet />
}
