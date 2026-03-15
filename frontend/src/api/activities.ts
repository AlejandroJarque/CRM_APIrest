import apiClient from './client'

export async function getActivities() {
  const response = await apiClient.get('/activities')
  return response.data
}

export async function getActivity(id: number) {
  const response = await apiClient.get(`/activities/${id}`)
  return response.data
}

export async function createActivity(data: {
  title: string
  description?: string
  status?: string
  date: string
  client_id: number
  contact_id?: number
}) {
  const response = await apiClient.post('/activities', data)
  return response.data
}

export async function updateActivity(id: number, data: {
  title?: string
  description?: string
  status?: string
  date?: string
}) {
  const response = await apiClient.patch(`/activities/${id}`, data)
  return response.data
}

export async function deleteActivity(id: number) {
  const response = await apiClient.delete(`/activities/${id}`)
  return response.data
}