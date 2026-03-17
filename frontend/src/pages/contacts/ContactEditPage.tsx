import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getContact, updateContact } from '../../api/contacts'
import '../clients/ClientCreatePage.css'

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

  if (loading) return <div className="loading">Cargando...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/clients/${clientId}/contacts`)}
          >
            ← Back
          </button>
          <h1 className="page-title">Edit contact</h1>
        </div>
      </div>

      <div className="form-body">
        {error && <div className="auth-error">{error}</div>}

        <form className="form-card" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del contacto"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@ejemplo.com"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone</label>
            <input
              className="input"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+34 600 000 000"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate(`/clients/${clientId}/contacts`)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ContactEditPage