import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getContact, updateContact } from '../../api/contacts'

function ContactEditPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { clientId, id } = useParams()

  useEffect(() => {
    getContact(Number(clientId), Number(id))
      .then((response) => {
        const contact = response.data
        setName(contact.name)
        setEmail(contact.email ?? '')
        setPhone(contact.phone ?? '')
      })
      .catch(() => setError('Error al cargar el contacto'))
      .finally(() => setLoading(false))
  }, [clientId, id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await updateContact(Number(clientId), Number(id), { name, email, phone })
      navigate(`/clients/${clientId}/contacts`)
    } catch {
      setError('Error al actualizar el contacto')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Editar contacto</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Teléfono</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
        <button type="button" onClick={() => navigate(`/clients/${clientId}/contacts`)}>
          Cancelar
        </button>
      </form>
    </div>
  )
}

export default ContactEditPage