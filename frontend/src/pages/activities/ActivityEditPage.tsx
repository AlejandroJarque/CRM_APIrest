import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActivity, updateActivity } from '../../api/activities'
import '../clients/ClientCreatePage.css'

function ActivityEditPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [date, setDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getActivity(Number(id))
      .then((response) => {
        const activity = response.data
        setTitle(activity.title)
        setDescription(activity.description ?? '')
        setStatus(activity.status)
        setDate(activity.date.split('T')[0])
      })
      .catch(() => setLoadError('Error loading activity'))
      .finally(() => setLoadingInitial(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoadingSubmit(true)

    try {
      await updateActivity(Number(id), { title, description, status, date })
      navigate('/activities')
    } catch {
      setError('Error updating activity')
    } finally {
      setLoadingSubmit(false)
    }
  }

  if (loadingInitial) return <div className="loading">Loading...</div>
  if (loadError) return <div className="error-msg">{loadError}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/activities')}>
            ← Back
          </button>
          <h1 className="page-title">Edit activity</h1>
        </div>
      </div>

      <div className="form-body">
        {error && <div className="auth-error">{error}</div>}

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Title</label>
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Activity title"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Description</label>
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              rows={2}
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">Status</label>
              <select
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Date</label>
              <input
                className="input"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/activities')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ActivityEditPage