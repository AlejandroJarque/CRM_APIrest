import { useEffect, useState } from 'react'
import { getClients } from '../../api/clients'
import { createContact } from '../../api/contacts'
import './CreateContactModal.css'

interface Client {
  id: number
  name: string
}

interface Props {
  onClose: () => void
  onCreated: () => void
  defaultClientId?: number
}

export default function CreateContactModal({ onClose, onCreated, defaultClientId }: Props) {
  const [clients, setClients] = useState<Client[]>([])
  const [clientId, setClientId] = useState(defaultClientId ? String(defaultClientId) : '')
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!defaultClientId) {
      getClients().then((response) => setClients(response.data))
    }
  }, [defaultClientId])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientId) {
      setError('Please select a client')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await createContact(Number(clientId), { name, position, email, phone })
      onCreated()
    } catch {
      setError('Error creating contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New contact</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="modal-form" onSubmit={handleSubmit}>
          {!defaultClientId && (
            <div className="input-group">
              <label className="input-label">Client</label>
              <select
                className="select"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                required
              >
                <option value="">Select a client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">Name</label>
              <input
                className="input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contact name"
                required
              />
            </div>
            <div className="input-group">
              <label className="input-label">Position</label>
              <input
                className="input"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="CEO, Developer..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
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
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Create contact'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}