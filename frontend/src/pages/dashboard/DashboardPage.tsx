import { useEffect, useState } from 'react'
import { getDashboard } from '../../api/dashboard'

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

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>
  if (!data) return null

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <div>
          <h2>Clientes</h2>
          <p>{data.clients_count}</p>
        </div>
        <div>
          <h2>Actividades totales</h2>
          <p>{data.activities_count}</p>
        </div>
        <div>
          <h2>Completadas este mes</h2>
          <p>{data.activities_completed_this_month}</p>
        </div>
        <div>
          <h2>Pendientes</h2>
          <p>{data.activities_pending}</p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage