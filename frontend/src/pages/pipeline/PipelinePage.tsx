import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPipeline, updateClient } from '../../api/clients'
import './PipelinePage.css'

interface PipelineClient {
  id: number
  name: string
  email: string
  status: string
}

interface Pipeline {
  lead:     PipelineClient[]
  active:   PipelineClient[]
  inactive: PipelineClient[]
  lost:     PipelineClient[]
}

const COLUMNS: { key: keyof Pipeline; label: string; next: keyof Pipeline | null; prev: keyof Pipeline | null }[] = [
  { key: 'lead',     label: 'Lead',     prev: null,       next: 'active'   },
  { key: 'active',   label: 'Active',   prev: 'lead',     next: 'inactive' },
  { key: 'inactive', label: 'Inactive', prev: 'active',   next: 'lost'     },
  { key: 'lost',     label: 'Lost',     prev: 'inactive', next: null       },
]

const COLUMN_CLASS: Record<keyof Pipeline, string> = {
  lead:     'pipeline-col--lead',
  active:   'pipeline-col--active',
  inactive: 'pipeline-col--inactive',
  lost:     'pipeline-col--lost',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function PipelinePage() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const navigate                = useNavigate()

  useEffect(() => {
    getPipeline()
      .then((res) => setPipeline(res.data))
      .catch(() => setError('Error loading pipeline'))
      .finally(() => setLoading(false))
  }, [])

  async function handleMove(client: PipelineClient, newStatus: keyof Pipeline) {
    if (!pipeline) return

    const oldStatus = client.status as keyof Pipeline

    setPipeline({
      ...pipeline,
      [oldStatus]: pipeline[oldStatus].filter((c) => c.id !== client.id),
      [newStatus]: [...pipeline[newStatus], { ...client, status: newStatus }],
    })

    try {
      await updateClient(client.id, { status: newStatus })
    } catch {
      setPipeline(pipeline)
      alert('Error moving client')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error)   return <div className="error-msg">{error}</div>
  if (!pipeline) return null

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Pipeline</h1>
        </div>
      </div>

      <div className="pipeline-board">
        {COLUMNS.map((col) => (
          <div key={col.key} className={`pipeline-col ${COLUMN_CLASS[col.key]}`}>

            <div className="pipeline-col-header">
              <span className="pipeline-col-label">{col.label}</span>
              <span className="pipeline-col-count">{pipeline[col.key].length}</span>
            </div>

            <div className="pipeline-col-body">
              {pipeline[col.key].length === 0 ? (
                <div className="pipeline-empty">No clients</div>
              ) : (
                pipeline[col.key].map((client) => (
                  <div key={client.id} className="pipeline-card">
                    <div className="pipeline-card-top">
                      <div className="pipeline-card-avatar">
                        {getInitials(client.name)}
                      </div>
                      <div className="pipeline-card-info">
                        <span className="pipeline-card-name">{client.name}</span>
                        <span className="pipeline-card-email">{client.email ?? '—'}</span>
                      </div>
                    </div>

                    <div className="pipeline-card-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => navigate(`/clients/${client.id}`)}
                      >
                        View
                      </button>
                      {col.prev && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleMove(client, col.prev!)}
                        >
                          ← {col.prev}
                        </button>
                      )}
                      {col.next && (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => handleMove(client, col.next!)}
                        >
                          {col.next} →
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}

export default PipelinePage