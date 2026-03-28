import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPipeline, updateClient } from '../../api/clients'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { useDroppable, useDraggable } from '@dnd-kit/core'
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
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
}

function DroppableColumn({ col, pipeline, onMove, navigate }: {
  col: typeof COLUMNS[0]
  pipeline: Pipeline
  onMove: (client: PipelineClient, newStatus: keyof Pipeline) => void
  navigate: (path: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: col.key })

  return (
    <div className={`pipeline-col ${COLUMN_CLASS[col.key]} ${isOver ? 'pipeline-col--over' : ''}`}>
      <div className="pipeline-col-header">
        <span className="pipeline-col-label">{col.label}</span>
        <span className="pipeline-col-count">{pipeline[col.key].length}</span>
      </div>
      <div className="pipeline-col-body" ref={setNodeRef}>
        {pipeline[col.key].length === 0 ? (
          <div className="pipeline-empty">No clients</div>
        ) : (
          pipeline[col.key].map((client) => (
            <DraggableCard
              key={client.id}
              client={client}
              col={col}
              onMove={onMove}
              navigate={navigate}
            />
          ))
        )}
      </div>
    </div>
  )
}

function DraggableCard({ client, col, onMove, navigate }: {
  client: PipelineClient
  col: typeof COLUMNS[0]
  onMove: (client: PipelineClient, newStatus: keyof Pipeline) => void
  navigate: (path: string) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: client.id,
    data: { client, fromStatus: col.key },
  })

  return (
    <div
      ref={setNodeRef}
      className={`pipeline-card ${isDragging ? 'pipeline-card--dragging' : ''}`}
      {...attributes}
    >
      <div className="pipeline-card-top">
        <div
          className="pipeline-card-drag-handle"
          {...listeners}
          title="Drag to move"
        >
          <IconGrip />
        </div>
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
            onClick={() => onMove(client, col.prev!)}
          >
            ← {col.prev}
          </button>
        )}
        {col.next && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => onMove(client, col.next!)}
          >
            {col.next} →
          </button>
        )}
      </div>
    </div>
  )
}

function IconGrip() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <circle cx="4" cy="3" r="1" fill="currentColor"/>
      <circle cx="8" cy="3" r="1" fill="currentColor"/>
      <circle cx="4" cy="6" r="1" fill="currentColor"/>
      <circle cx="8" cy="6" r="1" fill="currentColor"/>
      <circle cx="4" cy="9" r="1" fill="currentColor"/>
      <circle cx="8" cy="9" r="1" fill="currentColor"/>
    </svg>
  )
}

function PipelinePage() {
  const [pipeline, setPipeline] = useState<Pipeline | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)
  const [activeClient, setActiveClient] = useState<PipelineClient | null>(null)
  const navigate = useNavigate()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const client = active.data.current?.client as PipelineClient
    setActiveClient(client)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveClient(null)

    if (!over || !pipeline) return

    const client    = active.data.current?.client as PipelineClient
    const newStatus = over.id as keyof Pipeline

    if (client.status === newStatus) return

    handleMove(client, newStatus)
  }

  if (loading) return <div className="loading">Loading...</div>
  if (error)   return <div className="error-msg">{error}</div>
  if (!pipeline) return null

  return (
    <div className="page">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="pipeline-board">
          {COLUMNS.map((col) => (
            <DroppableColumn
              key={col.key}
              col={col}
              pipeline={pipeline}
              onMove={handleMove}
              navigate={navigate}
            />
          ))}
        </div>

        <DragOverlay>
          {activeClient && (
            <div className="pipeline-card pipeline-card--overlay">
              <div className="pipeline-card-top">
                <div className="pipeline-card-avatar">
                  {getInitials(activeClient.name)}
                </div>
                <div className="pipeline-card-info">
                  <span className="pipeline-card-name">{activeClient.name}</span>
                  <span className="pipeline-card-email">{activeClient.email ?? '—'}</span>
                </div>
              </div>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default PipelinePage