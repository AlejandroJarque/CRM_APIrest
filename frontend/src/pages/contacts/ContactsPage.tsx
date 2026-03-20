import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getContacts, deleteContact } from '../../api/contacts'
import '../clients/ClientsPage.css'

interface Contact {
  id: number
  client_id: number
  name: string
  email: string
  phone: string
}

function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { clientId } = useParams()

  useEffect(() => {
    getContacts(Number(clientId))
      .then((response) => setContacts(response.data))
      .catch(() => setError('Error loading contact'))
      .finally(() => setLoading(false))
  }, [clientId])

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this contact?')) return
    try {
      await deleteContact(Number(clientId), id)
      setContacts(contacts.filter((c) => c.id !== id))
    } catch {
      alert('Error deleting contact')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error) return <div className="error-msg">{error}</div>

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => navigate(`/clients/${clientId}`)}
          >
            ← Back
          </button>
          <h1 className="page-title">Contacts</h1>
          <span className="count-pill">{contacts.length}</span>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate(`/clients/${clientId}/contacts/create`)}
        >
          New contact
        </button>
      </div>

      {contacts.length === 0 ? (
        <div className="empty-state">
          <span>No contacts for this client</span>
          <button
            className="btn btn-primary"
            onClick={() => navigate(`/clients/${clientId}/contacts/create`)}
          >
            Create first contact
          </button>
        </div>
      ) : (
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
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="td-name">{contact.name}</td>
                  <td className="td-secondary">{contact.email}</td>
                  <td className="td-secondary">{contact.phone}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/clients/${clientId}/contacts/${contact.id}/edit`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(contact.id)}
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
      )}
    </div>
  )
}

export default ContactsPage