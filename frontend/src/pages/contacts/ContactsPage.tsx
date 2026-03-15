import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getContacts, deleteContact } from '../../api/contacts'

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
      .catch(() => setError('Error al cargar los contactos'))
      .finally(() => setLoading(false))
  }, [clientId])

  async function handleDelete(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este contacto?')) return
    try {
      await deleteContact(Number(clientId), id)
      setContacts(contacts.filter((c) => c.id !== id))
    } catch {
      alert('Error al eliminar el contacto')
    }
  }

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1>Contactos</h1>
      <button onClick={() => navigate(`/clients/${clientId}/contacts/create`)}>
        Nuevo contacto
      </button>
      <button onClick={() => navigate(`/clients/${clientId}`)}>
        Volver al cliente
      </button>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                <button onClick={() => navigate(`/clients/${clientId}/contacts/${contact.id}/edit`)}>
                  Editar
                </button>
                <button onClick={() => handleDelete(contact.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ContactsPage