import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllContacts, deleteContact } from '../../api/contacts'
import CreateContactModal from '../../components/CreateContactModal/CreateContactModal'
import './AllContactsPage.css'

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

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  a: { bg: '#3b6fd420', text: '#3b6fd4' },
  b: { bg: '#2da86620', text: '#2da866' },
  c: { bg: '#c47f0a20', text: '#c47f0a' },
  d: { bg: '#9b59b620', text: '#9b59b6' },
  e: { bg: '#3b6fd420', text: '#3b6fd4' },
  f: { bg: '#2da86620', text: '#2da866' },
  g: { bg: '#c47f0a20', text: '#c47f0a' },
  h: { bg: '#9b59b620', text: '#9b59b6' },
  i: { bg: '#3b6fd420', text: '#3b6fd4' },
  j: { bg: '#2da86620', text: '#2da866' },
  k: { bg: '#c47f0a20', text: '#c47f0a' },
  l: { bg: '#9b59b620', text: '#9b59b6' },
  m: { bg: '#3b6fd420', text: '#3b6fd4' },
  n: { bg: '#2da86620', text: '#2da866' },
  o: { bg: '#c47f0a20', text: '#c47f0a' },
  p: { bg: '#9b59b620', text: '#9b59b6' },
  q: { bg: '#3b6fd420', text: '#3b6fd4' },
  r: { bg: '#2da86620', text: '#2da866' },
  s: { bg: '#c47f0a20', text: '#c47f0a' },
  t: { bg: '#9b59b620', text: '#9b59b6' },
  u: { bg: '#3b6fd420', text: '#3b6fd4' },
  v: { bg: '#2da86620', text: '#2da866' },
  w: { bg: '#c47f0a20', text: '#c47f0a' },
  x: { bg: '#9b59b620', text: '#9b59b6' },
  y: { bg: '#3b6fd420', text: '#3b6fd4' },
  z: { bg: '#2da86620', text: '#2da866' },
}

function getAvatarColor(name: string) {
  const letter = name.charAt(0).toLowerCase()
  return AVATAR_COLORS[letter] ?? { bg: '#3b6fd420', text: '#3b6fd4' }
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function AllContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
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

  async function handleDelete(clientId: number, id: number) {
    if (!confirm('Are you sure you want to delete this contact?')) return
    try {
      await deleteContact(clientId, id)
      setContacts(contacts.filter((c) => c.id !== id))
      if (meta) setMeta({ ...meta, total: meta.total - 1 })
    } catch {
      alert('Error deleting contact')
    }
  }

  function handleCreated() {
    setShowModal(false)
    setPage(1)
    setLoading(true)
    getAllContacts(1)
      .then((response) => {
        setContacts(response.data)
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
          <h1 className="page-title">Contacts</h1>
          <span className="count-pill">{meta?.total ?? contacts.length}</span>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          New contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state">
          <span>No contacts yet</span>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Create first contact
          </button>
        </div>
      ) : (
        <>
          <div className="contacts-list">
            {contacts.map((contact) => {
              const color = getAvatarColor(contact.name)
              return (
                <div key={contact.id} className="contact-row">
                  <div
                    className="contact-avatar"
                    style={{ background: color.bg, color: color.text }}
                  >
                    {getInitials(contact.name)}
                  </div>
                  <div className="contact-info">
                    <span className="contact-name">{contact.name}</span>
                    <span className="contact-meta">
                      {contact.position ? `${contact.position} · ` : ''}
                      {contact.email ?? '—'}
                    </span>
                  </div>
                  <button
                    className="contact-client-badge"
                    onClick={() => navigate(`/clients/${contact.client_id}`)}
                  >
                    {contact.client_name}
                  </button>
                  <div className="contact-actions">
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => navigate(`/clients/${contact.client_id}/contacts/${contact.id}/edit?from=contacts`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(contact.client_id, contact.id)}
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

      {showModal && (
        <CreateContactModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}

export default AllContactsPage