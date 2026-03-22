import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/client'
import './GlobalSearch.css'

interface SearchResults {
  clients:    { id: number; name: string }[]
  contacts:   { id: number; name: string; client_id: number }[]
  activities: { id: number; title: string; status: string }[]
}

export default function GlobalSearch() {
  const [query, setQuery]     = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [open, setOpen]       = useState(false)

  const inputRef    = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigate = useNavigate()

  
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query === '') {
      setResults(null)
      setOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await apiClient.get('/search', { params: { q: query } })
        setResults(response.data)
        setOpen(true)
      } catch {
        setResults(null)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSelect(path: string) {
    setQuery('')
    setResults(null)
    setOpen(false)
    navigate(path)
  }

  const isEmpty =
    results &&
    results.clients.length === 0 &&
    results.contacts.length === 0 &&
    results.activities.length === 0

  return (
    <div className="gsearch" ref={containerRef}>
      <div className="gsearch-input-wrap">
        <svg className="gsearch-icon" width="13" height="13" viewBox="0 0 13 13" fill="none">
          <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M9 9l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          className="gsearch-input"
          type="text"
          placeholder="Search clients, acticities, contacts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results) setOpen(true) }}
        />
        {loading && <span className="gsearch-spinner" />}
      </div>

      {open && results && (
        <div className="gsearch-dropdown">
          {isEmpty ? (
            <div className="gsearch-empty">No results for "{query}"</div>
          ) : (
            <>
              {results.clients.length > 0 && (
                <div className="gsearch-group">
                  <span className="gsearch-group-label">Clients</span>
                  {results.clients.map(client => (
                    <button
                      key={client.id}
                      className="gsearch-item"
                      onClick={() => handleSelect(`/clients/${client.id}`)}
                    >
                      <span className="gsearch-item-icon">👤</span>
                      <span className="gsearch-item-name">{client.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.contacts.length > 0 && (
                <div className="gsearch-group">
                  <span className="gsearch-group-label">Contacts</span>
                  {results.contacts.map(contact => (
                    <button
                      key={contact.id}
                      className="gsearch-item"
                      onClick={() => handleSelect(`/clients/${contact.client_id}/contacts/${contact.id}/edit`)}
                    >
                      <span className="gsearch-item-icon">🧑</span>
                      <span className="gsearch-item-name">{contact.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {results.activities.length > 0 && (
                <div className="gsearch-group">
                  <span className="gsearch-group-label">Activities</span>
                  {results.activities.map(activity => (
                    <button
                      key={activity.id}
                      className="gsearch-item"
                      onClick={() => handleSelect(`/activities/${activity.id}`)}
                    >
                      <span className="gsearch-item-icon">⚡</span>
                      <span className="gsearch-item-name">{activity.title}</span>
                      <span className="gsearch-item-status">{activity.status}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}