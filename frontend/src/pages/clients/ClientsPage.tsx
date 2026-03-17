import { useEffect, useState } from 'react'
import { getClients, deleteClient } from '../../api/clients'
import { useNavigate } from 'react-router-dom'
import './ClientsPage.css'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  address: string
}

interface Meta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getClients(page)
      .then((response) => {
        setClients(response.data)
        setMeta(response.meta)
      })
      .catch(() => setError('Error al cargar los clientes'))
      .finally(() => setLoading(false))
  }, [page])

  async function handleDelete(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este cliente?')) return
    try {
      await deleteClient(id)
      setClients(clients.filter((c) => c.id !== id))
    } catch {
      alert('Error al eliminar el cliente')
    }
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
        <button className="btn btn-primary" onClick={() => navigate('/clients/create')}>
          New client
        </button>
      </div>

      {clients.length === 0 ? (
        <div className="empty-state">
          <span>No clients yet</span>
          <button className="btn btn-primary" onClick={() => navigate('/clients/create')}>
            Create first client
          </button>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id}>
                    <td className="td-name">{client.name}</td>
                    <td className="td-secondary">{client.email}</td>
                    <td className="td-secondary">{client.phone}</td>
                    <td>
                      <div className="row-actions">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </div>
  )
}

export default ClientsPage