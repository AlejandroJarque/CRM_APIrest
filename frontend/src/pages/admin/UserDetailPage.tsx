import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser } from '../../api/users'
import '../clients/ClientDetailPage.css'
import '../activities/ActivitiesPage.css'

interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

const ROLE_CLASS: Record<string, string> = {
  admin: 'badge badge--progress',
  user:  'badge badge--done',
}

function UserDetailPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getUser(Number(id))
      .then((response) => setUser(response.data))
      .catch(() => setError('Error loading user'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>
  if (!user) return null

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admin/users')}>
            ← Back
          </button>
          <h1 className="page-title">{user.name}</h1>
          <span className={ROLE_CLASS[user.role] ?? 'badge'}>
            {user.role}
          </span>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-card">
          <h2 className="detail-section-title">General Info</h2>
          <div className="detail-fields">
            <div className="detail-field">
              <span className="detail-label">Email</span>
              <span className="detail-value">{user.email}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Member since</span>
              <span className="detail-value">{user.created_at.split('T')[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailPage