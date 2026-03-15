import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser } from '../../api/users'

interface User {
  id: number
  name: string
  email: string
  role: string
  created_at: string
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
      .catch(() => setError('Error al cargar el usuario'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>
  if (!user) return null

  return (
    <div>
      <h1>{user.name}</h1>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Rol:</strong> {user.role}</p>
      <p><strong>Miembro desde:</strong> {user.created_at.split('T')[0]}</p>
      <button onClick={() => navigate('/admin/users')}>
        Volver
      </button>
    </div>
  )
}

export default UserDetailPage