import { useEffect, useState } from 'react'
import { getClients, deleteClient } from '../../api/clients'
import { useNavigate } from 'react-router-dom'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getClients()
      .then((response) => setClients(response.data))
      .catch(() => setError('Error al cargar los clientes'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este cliente?')) return
    try {
      await deleteClient(id)
      setClients(clients.filter((c) => c.id !== id))
    } catch {
      alert('Error al eliminar el cliente')
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Clientes</h1>
      <button onClick={() => navigate('/clients/create')}>
            Nuevo cliente
        </button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>{client.name}</td>
              <td>{client.email}</td>
              <td>{client.phone}</td>
              <td>
                <button onClick={() => navigate(`/clients/${client.id}`)}>Ver</button>
                <button onClick={() => navigate(`/clients/${client.id}/edit`)}>Editar</button>
                <button onClick={() => handleDelete(client.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClientsPage