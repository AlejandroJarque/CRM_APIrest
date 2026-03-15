import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getClient } from '../../api/clients'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

function ClientDetailPage() {
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getClient(Number(id))
      .then((response) => setClient(response.data))
      .catch(() => setError('Error al cargar el cliente'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>
  if (!client) return null

  return (
    <div>
      <h1>{client.name}</h1>
      <p><strong>Email:</strong> {client.email}</p>
      <p><strong>Teléfono:</strong> {client.phone}</p>
      <p><strong>Dirección:</strong> {client.address}</p>
      <button onClick={() => navigate(`/clients/${client.id}/edit`)}>
        Editar
      </button>
      <button onClick={() => navigate('/clients')}>
        Volver
      </button>
    </div>
  )
}

export default ClientDetailPage