import apiClient from './client'

export async function getUsers() {
  const response = await apiClient.get('/users')
  return response.data
}

export async function getUser(id: number) {
  const response = await apiClient.get(`/users/${id}`)
  return response.data
}