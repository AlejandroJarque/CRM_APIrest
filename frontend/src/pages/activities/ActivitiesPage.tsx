import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActivities, deleteActivity } from '../../api/activities'

interface Activity {
  id: number
  client_id: number
  title: string
  description: string
  status: string
  date: string
}

function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    getActivities()
      .then((response) => setActivities(response.data))
      .catch(() => setError('Error al cargar las actividades'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta actividad?')) return
    try {
      await deleteActivity(id)
      setActivities(activities.filter((a) => a.id !== id))
    } catch {
      alert('Error al eliminar la actividad')
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Actividades</h1>
      <button onClick={() => navigate('/activities/create')}>
        Nueva actividad
      </button>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr key={activity.id}>
              <td>{activity.title}</td>
              <td>{activity.description}</td>
              <td>{activity.status}</td>
              <td>{activity.date}</td>
              <td>
                <button onClick={() => navigate(`/activities/${activity.id}`)}>
                  Ver
                </button>
                <button onClick={() => navigate(`/activities/${activity.id}/edit`)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(activity.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ActivitiesPage