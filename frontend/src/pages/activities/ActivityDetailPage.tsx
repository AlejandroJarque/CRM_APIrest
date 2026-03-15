import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActivity } from '../../api/activities'

interface Activity {
  id: number
  client_id: number
  title: string
  description: string
  status: string
  date: string
  completed_at: string | null
}

function ActivityDetailPage() {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getActivity(Number(id))
      .then((response) => setActivity(response.data))
      .catch(() => setError('Error al cargar la actividad'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>
  if (!activity) return null

  return (
    <div>
      <h1>{activity.title}</h1>
      <p><strong>Descripción:</strong> {activity.description}</p>
      <p><strong>Estado:</strong> {activity.status}</p>
      <p><strong>Fecha:</strong> {activity.date.split('T')[0]}</p>
      {activity.completed_at && (
        <p><strong>Completada el:</strong> {activity.completed_at.split('T')[0]}</p>
      )}
      <button onClick={() => navigate(`/activities/${activity.id}/edit`)}>
        Editar
      </button>
      <button onClick={() => navigate('/activities')}>
        Volver
      </button>
    </div>
  )
}

export default ActivityDetailPage