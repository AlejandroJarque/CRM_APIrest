import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getActivities, deleteActivity } from '../../api/activities'
import './ActivitiesPage.css'
import '../clients/ClientsPage.css'

interface Activity {
  id: number
  client_id: number
  title: string
  description: string
  status: string
  date: string
}

interface Meta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

const STATUS_LABEL: Record<string, string> = {
  pending:     'Pending',
  in_progress: 'In progress',
  done:   'Completed',
}

const STATUS_CLASS: Record<string, string> = {
  pending:     'badge badge--pending',
  in_progress: 'badge badge--progress',
  done:   'badge badge--done',
}

function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getActivities(page)
      .then((response) => {
        setActivities(response.data)
        setMeta(response.meta)
      })
      .catch(() => setError('Error loading activities'))
      .finally(() => setLoading(false))
  }, [page])

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this activity?')) return
    try {
      await deleteActivity(id)
      setActivities(activities.filter((a) => a.id !== id))
    } catch {
      alert('Error deleting activity')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Activities</h1>
          <span className="count-pill">{meta?.total ?? activities.length}</span>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/activities/create')}>
          New activity
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="empty-state">
          <span>No activities yet</span>
          <button className="btn btn-primary" onClick={() => navigate('/activities/create')}>
            Create first activity
          </button>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td className="td-name">{activity.title}</td>
                    <td>
                      <span className={STATUS_CLASS[activity.status] ?? 'badge'}>
                        {STATUS_LABEL[activity.status] ?? activity.status}
                      </span>
                    </td>
                    <td className="td-secondary">{activity.date}</td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/activities/${activity.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(activity.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && meta.last_page > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                ← Back
              </button>
              <span className="pagination-info">
                {page} / {meta.last_page}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page === meta.last_page}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ActivitiesPage