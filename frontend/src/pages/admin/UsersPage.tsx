import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../api/users'
import '../clients/ClientsPage.css'
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

function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    getUsers()
      .then((response) => setUsers(response.data))
      .catch(() => setError('Error loading users'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Users</h1>
          <span className="count-pill">{users.length}</span>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <span>No users</span>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Member since</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="td-name">{user.name}</td>
                  <td className="td-secondary">{user.email}</td>
                  <td>
                    <span className={ROLE_CLASS[user.role] ?? 'badge'}>
                      {user.role}
                    </span>
                  </td>
                  <td className="td-secondary">{user.created_at.split('T')[0]}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default UsersPage