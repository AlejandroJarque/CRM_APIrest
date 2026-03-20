import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllContacts } from '../../api/contacts'
import '../clients/ClientsPage.css'

interface Contact {
  id: number
  client_id: number
  client_name: string
  name: string
  email: string
  phone: string
  position: string
}

interface Meta {
  current_page: number
  last_page: number
  total: number
}

function AllContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    getAllContacts(page)
      .then((response) => {
        setContacts(response.data)
        setMeta(response.meta)
      })
      .catch(() => setError('Error loading contacts'))
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Contacts</h1>
          <span className="count-pill">{meta?.total ?? contacts.length}</span>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state">
          <span>No contacts yet</span>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Position</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Client</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="td-name">{contact.name}</td>
                    <td className="td-secondary">{contact.position ?? '—'}</td>
                    <td className="td-secondary">{contact.email ?? '—'}</td>
                    <td className="td-secondary">{contact.phone ?? '—'}</td>
                    <td className="td-secondary">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/clients/${contact.client_id}`)}
                      >
                        {contact.client_name}
                      </button>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => navigate(`/clients/${contact.client_id}/contacts/${contact.id}/edit`)}
                        >
                          Edit
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
              <span className="pagination-info">{page} / {meta.last_page}</span>
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

export default AllContactsPage