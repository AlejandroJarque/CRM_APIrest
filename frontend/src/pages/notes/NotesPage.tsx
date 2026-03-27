import { useEffect, useState } from 'react'
import { getNotes, createNote, updateNote, deleteNote } from '../../api/notes'
import './NotesPage.css'

interface Note {
  id: number
  title: string
  body: string
  notable_type: string | null
  notable_id: number | null
  created_at: string
}

const NOTABLE_LABEL: Record<string, string> = {
  'App\\Models\\Client':   'Client',
  'App\\Models\\Contact':  'Contact',
  'App\\Models\\Activity': 'Activity',
}

const NOTABLE_TYPE_OPTIONS = [
  { value: '',           label: 'No association' },
  { value: 'clients',    label: 'Client' },
  { value: 'contacts',   label: 'Contact' },
  { value: 'activities', label: 'Activity' },
]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

function NotesPage() {
  const [notes, setNotes]           = useState<Note[]>([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState<string | null>(null)
  const [panelOpen, setPanelOpen]   = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)

  const [title, setTitle]           = useState('')
  const [body, setBody]             = useState('')
  const [notableType, setNotableType] = useState('')
  const [notableId, setNotableId]   = useState('')
  const [saving, setSaving]         = useState(false)
  const [formError, setFormError]   = useState<string | null>(null)

  useEffect(() => {
    loadNotes()
  }, [])

  function loadNotes() {
    setLoading(true)
    getNotes()
      .then((res) => setNotes(res.data))
      .catch(() => setError('Error loading notes'))
      .finally(() => setLoading(false))
  }

  function openCreatePanel() {
    setEditingNote(null)
    setTitle('')
    setBody('')
    setNotableType('')
    setNotableId('')
    setFormError(null)
    setPanelOpen(true)
  }

  function openEditPanel(note: Note) {
    setEditingNote(note)
    setTitle(note.title)
    setBody(note.body)
    setNotableType('')
    setNotableId('')
    setFormError(null)
    setPanelOpen(true)
  }

  function closePanel() {
    setPanelOpen(false)
    setEditingNote(null)
  }

  async function handleSubmit() {
    if (!title.trim() || !body.trim()) {
      setFormError('Title and body are required')
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      if (editingNote) {
        const res = await updateNote(editingNote.id, { title, body })
        setNotes(notes.map((n) => n.id === editingNote.id ? res.data : n))
      } else {
        const payload: {
          title: string
          body: string
          notable_type?: string
          notable_id?: number
        } = { title, body }

        if (notableType && notableId) {
          payload.notable_type = notableType
          payload.notable_id   = Number(notableId)
        }

        const res = await createNote(payload)
        setNotes([res.data, ...notes])
      }
      closePanel()
    } catch {
      setFormError('Error saving note')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Are you sure you want to delete this note?')) return
    try {
      await deleteNote(id)
      setNotes(notes.filter((n) => n.id !== id))
    } catch {
      alert('Error deleting note')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error)   return <div className="error-msg">{error}</div>

  return (
    <div className={`notes-layout ${panelOpen ? 'notes-layout--panel-open' : ''}`}>

      <div className="notes-main">
        <div className="page-header">
          <div className="page-title-group">
            <h1 className="page-title">Notes</h1>
            <span className="count-pill">{notes.length}</span>
          </div>
          <button className="btn btn-primary" onClick={openCreatePanel}>
            New note
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="empty-state">
            <span>No notes yet</span>
            <button className="btn btn-primary" onClick={openCreatePanel}>
              Create first note
            </button>
          </div>
        ) : (
          <div className="notes-list">
            {notes.map((note) => (
              <div key={note.id} className="note-card">
                <div className="note-card-accent" />
                <div className="note-card-content">
                  <div className="note-card-header">
                    <span className="note-card-title">{note.title}</span>
                    <span className="note-card-date">{formatDate(note.created_at)}</span>
                  </div>
                  <p className="note-card-body">{note.body}</p>
                  {note.notable_type && (
                    <span className="note-card-badge">
                      {NOTABLE_LABEL[note.notable_type] ?? note.notable_type}
                      {note.notable_id ? ` · #${note.notable_id}` : ''}
                    </span>
                  )}
                </div>
                <div className="note-card-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => openEditPanel(note)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(note.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {panelOpen && (
        <aside className="notes-panel">
          <div className="notes-panel-header">
            <span className="notes-panel-title">
              {editingNote ? 'Edit note' : 'New note'}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={closePanel}>
              ✕
            </button>
          </div>

          <div className="notes-panel-body">
            <div className="input-group">
              <label className="input-label">Title</label>
              <input
                className="input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Body</label>
              <textarea
                className="textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your note here..."
                rows={6}
              />
            </div>

            {!editingNote && (
              <>
                <div className="input-group">
                  <label className="input-label">Link to resource (optional)</label>
                  <select
                    className="select"
                    value={notableType}
                    onChange={(e) => { setNotableType(e.target.value); setNotableId('') }}
                  >
                    {NOTABLE_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {notableType && (
                  <div className="input-group">
                    <label className="input-label">Resource ID</label>
                    <input
                      className="input"
                      type="number"
                      value={notableId}
                      onChange={(e) => setNotableId(e.target.value)}
                      placeholder="Enter ID"
                      min={1}
                    />
                  </div>
                )}
              </>
            )}

            {formError && (
              <span className="input-hint error">{formError}</span>
            )}
          </div>

          <div className="notes-panel-footer">
            <button className="btn btn-ghost" onClick={closePanel}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? 'Saving...' : editingNote ? 'Save changes' : 'Create note'}
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}

export default NotesPage