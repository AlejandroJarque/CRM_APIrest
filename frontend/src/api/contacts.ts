import apiClient from './client'

export async function getContacts(clientId: number) {
  const response = await apiClient.get(`/clients/${clientId}/contacts`)
  return response.data
}

export async function getContact(clientId: number, id: number) {
  const response = await apiClient.get(`/clients/${clientId}/contacts/${id}`)
  return response.data
}

export async function createContact(clientId: number, data: { name: string; email?: string; phone?: string }) {
  const response = await apiClient.post(`/clients/${clientId}/contacts`, data)
  return response.data
}

export async function updateContact(clientId: number, id: number, data: { name?: string; email?: string; phone?: string }) {
  const response = await apiClient.patch(`/clients/${clientId}/contacts/${id}`, data)
  return response.data
}

export async function deleteContact(clientId: number, id: number) {
  const response = await apiClient.delete(`/clients/${clientId}/contacts/${id}`)
  return response.data
}

export async function getAllContacts(page: number = 1) {
  const response = await apiClient.get('/contacts', { params: { page } })
  return response.data
}

