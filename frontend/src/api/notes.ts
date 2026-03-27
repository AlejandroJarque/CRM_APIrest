import apiClient from './client'

export async function getNotes() {
  const response = await apiClient.get('/notes')
  return response.data
}

export async function createNote(data: {
  title: string
  body: string
  notable_type?: string
  notable_id?: number
}) {
  const response = await apiClient.post('/notes', data)
  return response.data
}

export async function updateNote(noteId: number, data: {
  title?: string
  body?: string
}) {
  const response = await apiClient.patch(`/notes/${noteId}`, data)
  return response.data
}

export async function deleteNote(noteId: number) {
  const response = await apiClient.delete(`/notes/${noteId}`)
  return response.data
}

export async function getNotesForResource(notableType: string, notableId: number) {
  const response = await apiClient.get(`/${notableType}/${notableId}/notes`)
  return response.data
}

export async function createNoteForResource(notableType: string, notableId: number, data: {
  title: string
  body: string
}) {
  const response = await apiClient.post(`/${notableType}/${notableId}/notes`, data)
  return response.data
}