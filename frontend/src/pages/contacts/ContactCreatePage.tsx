import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createContact } from '../../api/contacts'

function ContactCreatePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { clientId } = useParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createContact(Number(clientId), { name, email, phone })
      navigate(`/clients/${clientId}/contacts`)
    } catch {
      setError('Error al crear el contacto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Nuevo contacto</h1>
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
          {loading ? 'Guardando...' : 'Crear contacto'}
        </button>
        <button type="button" onClick={() => navigate(`/clients/${clientId}/contacts`)}>
          Cancelar
        </button>
      </form>
    </div>
  )
}

export default ContactCreatePage