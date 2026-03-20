import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AppLayout from '../components/layout/AppLayout'

interface Props {
  children: React.ReactNode
  title: string
  actions?: React.ReactNode
}

function AdminRoute({ children, title, actions }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) {
    return (
      <div className="loading" style={{ height: '100vh' }}>
        Cargando...
      </div>
    )
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />

  return (
    <AppLayout title={title} actions={actions}>
      {children}
    </AppLayout>
  )
}

export default AdminRoute