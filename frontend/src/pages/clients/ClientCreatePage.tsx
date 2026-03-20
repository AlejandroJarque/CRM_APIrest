import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '../../api/clients'
import './ClientCreatePage.css'

function ClientCreatePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await createClient({ name, email, phone, address })
      navigate('/clients')
    } catch {
      setError('Error creating client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/clients')}>
            ← Back
          </button>
          <h1 className="page-title">New client</h1>
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
              placeholder="Client name"
              required
            />
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
                required
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

          <div className="input-group">
            <label className="input-label">Address</label>
            <input
              className="input"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city..."
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate('/clients')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Create Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientCreatePage