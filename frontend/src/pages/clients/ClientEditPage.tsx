import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getClient, updateClient } from '../../api/clients'
import './ClientCreatePage.css'

function ClientEditPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const { id } = useParams()

  useEffect(() => {
    getClient(Number(id))
      .then((response) => {
        const client = response.data
        setName(client.name)
        setEmail(client.email)
        setPhone(client.phone ?? '')
        setAddress(client.address ?? '')
      })
      .catch(() => setError('Error loading client'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await updateClient(Number(id), { name, email, phone, address })
      navigate('/clients')
    } catch {
      setError('Error updating client')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/clients')}>
            ← Back
          </button>
          <h1 className="page-title">Edit client</h1>
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
              {loading ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ClientEditPage