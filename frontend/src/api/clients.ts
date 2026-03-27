import apiClient from './client'

export async function getClients(page = 1, status?: string) {
  const response = await apiClient.get('/clients', { params: { page, status } })
  return response.data
}

export async function getClient(id: number) {
  const response = await apiClient.get(`/clients/${id}`)
  return response.data
}

export async function createClient(data: {
  name: string
  email: string
  phone?: string
  address?: string
  status?: string
}) {
  const response = await apiClient.post('/clients', data)
  return response.data
}

export async function updateClient(id: number, data: {
  name?: string
  email?: string
  phone?: string
  address?: string
  status?: string
}) {
  const response = await apiClient.patch(`/clients/${id}`, data)
  return response.data
}

export async function deleteClient(id: number) {
  const response = await apiClient.delete(`/clients/${id}`)
  return response.data
}

export async function getClientStats(id: number) {
  const response = await apiClient.get(`/clients/${id}/stats`)
  return response.data
}

export async function exportClients() {
  const response = await apiClient.get('/clients/export', {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'clients.csv')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export async function getPipeline() {
  const response = await apiClient.get('/clients/pipeline')
  return response.data
}