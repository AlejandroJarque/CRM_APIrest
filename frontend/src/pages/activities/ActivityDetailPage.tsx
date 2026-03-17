import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActivity } from '../../api/activities'
import '../clients/ClientDetailPage.css'
import './ActivitiesPage.css'

interface Activity {
  id: number
  client_id: number
  title: string
  description: string
  status: string
  date: string
  completed_at: string | null
}

const STATUS_LABEL: Record<string, string> = {
  pending:     'Pendiente',
  in_progress: 'En progreso',
  completed:   'Completada',
}

const STATUS_CLASS: Record<string, string> = {
  pending:     'badge badge--pending',
  in_progress: 'badge badge--progress',
  completed:   'badge badge--done',
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

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>
  if (!activity) return null

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/activities')}>
            ← Back
          </button>
          <h1 className="page-title">{activity.title}</h1>
          <span className={STATUS_CLASS[activity.status] ?? 'badge'}>
            {STATUS_LABEL[activity.status] ?? activity.status}
          </span>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/activities/${activity.id}/edit`)}
        >
          Edit
        </button>
      </div>

      <div className="detail-body">
        <div className="detail-card">
          <h2 className="detail-section-title">General info</h2>
          <div className="detail-fields">
            <div className="detail-field">
              <span className="detail-label">Descriptions</span>
              <span className="detail-value">{activity.description ?? '—'}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Date</span>
              <span className="detail-value">{activity.date.split('T')[0]}</span>
            </div>
            {activity.completed_at && (
              <div className="detail-field">
                <span className="detail-label">Completed at</span>
                <span className="detail-value">{activity.completed_at.split('T')[0]}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivityDetailPage