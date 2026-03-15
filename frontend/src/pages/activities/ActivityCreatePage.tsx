import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createActivity } from '../../api/activities'
import { getClients } from '../../api/clients'

interface Client {
  id: number
  name: string
}

function ActivityCreatePage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [date, setDate] = useState('')
  const [clientId, setClientId] = useState('')
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    getClients().then((response) => setClients(response.data))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createActivity({
        title,
        description,
        status,
        date,
        client_id: Number(clientId),
      })
      navigate('/activities')
    } catch {
      setError('Error al crear la actividad')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Nueva actividad</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Estado</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="pending">Pendiente</option>
            <option value="done">Completada</option>
          </select>
        </div>
        <div>
          <label>Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cliente</label>
          <select value={clientId} onChange={(e) => setClientId(e.target.value)} required>
            <option value="">Selecciona un cliente</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Crear actividad'}
        </button>
        <button type="button" onClick={() => navigate('/activities')}>
          Cancelar
        </button>
      </form>
    </div>
  )
}

export default ActivityCreatePage