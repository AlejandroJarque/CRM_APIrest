import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUsers } from '../../api/users'

interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    getUsers()
      .then((response) => setUsers(response.data))
      .catch(() => setError('Error al cargar los usuarios'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Usuarios</h1>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Miembro desde</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.created_at.split('T')[0]}</td>
              <td>
                <button onClick={() => navigate(`/admin/users/${user.id}`)}>
                  Ver
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UsersPage