import { useEffect, useState } from 'react'
import { getDashboard } from '../../api/dashboard'
import './DashboardPage.css'

interface DashboardData {
  clients_count: number
  activities_count: number
  activities_completed_this_month: number
  activities_pending: number
}

function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(() => setError('Error al cargar el dashboard'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Cargando...</div>
  if (error) return <div className="error-msg">{error}</div>
  if (!data) return null

  return (
    <div className="page">
      <div className="dashboard-grid">

        <div className="stat-card">
          <span className="stat-label">Clients</span>
          <span className="stat-value">{data.clients_count}</span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Total activities</span>
          <span className="stat-value">{data.activities_count}</span>
        </div>

        <div className="stat-card stat-card--success">
          <span className="stat-label">Completed this month</span>
          <span className="stat-value">{data.activities_completed_this_month}</span>
        </div>

        <div className="stat-card stat-card--warning">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{data.activities_pending}</span>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage