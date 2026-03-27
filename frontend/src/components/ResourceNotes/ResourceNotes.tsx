import { useEffect, useState } from 'react'
import { getNotesForResource, createNoteForResource, deleteNote } from '../../api/notes'
import './ResourceNotes.css'

interface Note {
  id: number
  title: string
  body: string
  created_at: string
}

interface Props {
  notableType: string
  notableId: number
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day:   '2-digit',
    month: 'short',
    year:  'numeric',
  })
}

function ResourceNotes({ notableType, notableId }: Props) {
  const [notes, setNotes]         = useState<Note[]>([])
  const [loading, setLoading]     = useState(true)
  const [title, setTitle]         = useState('')
  const [body, setBody]           = useState('')
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showForm, setShowForm]   = useState(false)

  useEffect(() => {
    getNotesForResource(notableType, notableId)
      .then((res) => setNotes(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [notableType, notableId])

  async function handleCreate() {
    if (!title.trim() || !body.trim()) {
      setFormError('Title and body are required')
      return
    }

    setSaving(true)
    setFormError(null)

    try {
      const res = await createNoteForResource(notableType, notableId, { title, body })
      setNotes([res.data, ...notes])
      setTitle('')
      setBody('')
      setShowForm(false)
    } catch {
      setFormError('Error saving note')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this note?')) return
    try {
      await deleteNote(id)
      setNotes(notes.filter((n) => n.id !== id))
    } catch {
      alert('Error deleting note')
    }
  }

  return (
    <div className="resource-notes">
      <div className="resource-notes-header">
        <span className="resource-notes-title">
          Notes
          {notes.length > 0 && (
            <span className="count-pill">{notes.length}</span>
          )}
        </span>
        {!showForm && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowForm(true)}
          >
            + Add note
          </button>
        )}
      </div>

      {showForm && (
        <div className="resource-notes-form">
          <div className="input-group">
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title"
            />
          </div>
          <div className="input-group">
            <textarea
              className="textarea"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your note..."
              rows={3}
            />
          </div>
          {formError && (
            <span className="input-hint error">{formError}</span>
          )}
          <div className="resource-notes-form-actions">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => { setShowForm(false); setTitle(''); setBody(''); setFormError(null) }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCreate}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save note'}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="resource-notes-empty">Loading...</div>
      ) : notes.length === 0 && !showForm ? (
        <div className="resource-notes-empty">No notes yet</div>
      ) : (
        <div className="resource-notes-list">
          {notes.map((note) => (
            <div key={note.id} className="resource-note-item">
              <div className="resource-note-accent" />
              <div className="resource-note-content">
                <div className="resource-note-header">
                  <span className="resource-note-title">{note.title}</span>
                  <span className="resource-note-date">{formatDate(note.created_at)}</span>
                </div>
                <p className="resource-note-body">{note.body}</p>
              </div>
              <button
                className="btn btn-danger btn-sm resource-note-delete"
                onClick={() => handleDelete(note.id)}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ResourceNotes