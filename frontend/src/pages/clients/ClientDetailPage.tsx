import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getClient, getClientStats } from '../../api/clients'
import './ClientDetailPage.css'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: string
}

interface Stats {
  total: number
  completed: number
  pending: number
  last_activity: string | null
}

function ClientDetailPage() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
  Promise.all([
    getClient(Number(id)),
    getClientStats(Number(id)),
  ])
    .then(([clientRes, statsRes]) => {
      setClient(clientRes.data)
      setStats(statsRes.data)
    })
    .catch(() => setError('Error loading client'))
    .finally(() => setLoading(false))
}, [id])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>
  if (!client) return null

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/clients')}>
            ← Back
          </button>
          <h1 className="page-title">{client.name}</h1>
        </div>
        <button className="btn btn-primary" onClick={() => navigate(`/clients/${client.id}/edit`)}>
          Edit
        </button>
      </div>

      <div className="detail-body">
        <div className="detail-card">
          <h2 className="detail-section-title">General info</h2>
          <div className="detail-fields">
            <div className="detail-field">
              <span className="detail-label">Email</span>
              <span className="detail-value">{client.email ?? '—'}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{client.phone ?? '—'}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Address</span>
              <span className="detail-value">{client.address ?? '—'}</span>
            </div>
          </div>
        </div>

        {stats && (
          <div className="detail-card">
            <h2 className="detail-section-title">Activity stats</h2>
            <div className="detail-fields">
              <div className="detail-field">
                <span className="detail-label">Total activities</span>
                <span className="detail-value">{stats.total}</span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Completed</span>
                <span className="detail-value">{stats.completed}</span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Pending</span>
                <span className="detail-value">{stats.pending}</span>
              </div>
              <div className="detail-field">
                <span className="detail-label">Last activity</span>
                <span className="detail-value">{stats.last_activity ?? '—'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="detail-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/clients/${client.id}/contacts`)}
          >
            View contacts
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClientDetailPage