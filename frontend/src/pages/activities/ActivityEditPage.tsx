import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getActivity, updateActivity } from '../../api/activities'

function ActivityEditPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('pending')
  const [date, setDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
      .catch(() => setError('Error al cargar la actividad'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await updateActivity(Number(id), { title, description, status, date })
      navigate('/activities')
    } catch {
      setError('Error al actualizar la actividad')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Editar actividad</h1>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={() => navigate('/activities')}>
          Cancelar
        </button>
      </form>
    </div>
  )
}

export default ActivityEditPage