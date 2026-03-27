import { useEffect, useState } from 'react'
import { getClients, deleteClient, exportClients } from '../../api/clients'
import { useNavigate } from 'react-router-dom'
import CreateClientModal from '../../components/CreateClientModal/CreateClientModal'
import './ClientsPage.css'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
  status: string
}

interface Meta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

const CARD_COLORS = ['#3b6fd4', '#2da866', '#c47f0a', '#9b59b6', '#dc4a4a']

function getCardColor(name: string) {
  const letter = name.charCodeAt(0)
  return CARD_COLORS[letter % CARD_COLORS.length]
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const STATUS_LABEL: Record<string, string> = {
  lead:     'Lead',
  active:   'Active',
  inactive: 'Inactive',
  lost:     'Lost',
}

const STATUS_CLASS: Record<string, string> = {
  lead:     'badge badge--progress',
  active:   'badge badge--done',
  inactive: 'badge badge--pending',
  lost:     'badge badge--error',
}

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    getClients(page, statusFilter || undefined)
      .then((response) => {
        setClients(response.data)
        setMeta(response.meta)
      })
      .catch(() => setError('Error loading clients'))
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this client?')) return
    try {
      await deleteClient(id)
      setClients(clients.filter((c) => c.id !== id))
      if (meta) setMeta({ ...meta, total: meta.total - 1 })
    } catch {
      alert('Error deleting client')
    }
  }

  function handleCreated() {
    setShowModal(false)
    setPage(1)
    setLoading(true)
    getClients(1, statusFilter || undefined)
      .then((response) => {
        setClients(response.data)
        setMeta(response.meta)
      })
      .finally(() => setLoading(false))
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Clients</h1>
          <span className="count-pill">{meta?.total ?? clients.length}</span>
        </div>
        <select
          className="select"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          style={{ width: 'auto' }}
        >
          <option value="">All statuses</option>
          <option value="lead">Lead</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="lost">Lost</option>
        </select>
        <button className="btn btn-ghost" onClick={exportClients}>
          Export CSV
        </button>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          New client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="empty-state">
          <span>No clients yet</span>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create first client
          </button>
        </div>
      ) : (
        <>
          <div className="clients-grid">
            {clients.map((client) => {
              const color = getCardColor(client.name)
              return (
                <div key={client.id} className="client-card">
                  <div className="client-card-header" style={{ background: `${color}15` }}>
                    <div className="client-card-avatar" style={{ background: color }}>
                      {getInitials(client.name)}
                    </div>
                    <div className="client-card-info">
                      <span className="client-card-name">{client.name}</span>
                      <span className={STATUS_CLASS[client.status] ?? 'badge'}>
                        {STATUS_LABEL[client.status] ?? client.status}
                      </span>
                      {client.address && (
                        <span className="client-card-address">{client.address}</span>
                      )}
                    </div>
                  </div>
                  <div className="client-card-body">
                    <span className="client-card-field">{client.email}</span>
                    {client.phone && (
                      <span className="client-card-field">{client.phone}</span>
                    )}
                  </div>
                  <div className="client-card-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/clients/${client.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/clients/${client.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(client.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                ← Back
              </button>
              <span className="pagination-info">
                {page} / {meta.last_page}
              </span>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page === meta.last_page}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {showModal && (
        <CreateClientModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}

export default ClientsPage