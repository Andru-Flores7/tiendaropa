import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return <div className="state-block"><div className="spinner" /></div>
  }
  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
