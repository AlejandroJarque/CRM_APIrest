import apiClient from './client'

export async function getProfile() {
  const response = await apiClient.get('/profile')
  return response.data
}

export async function updateProfile(data: { name?: string; email?: string }) {
  const response = await apiClient.patch('/profile', data)
  return response.data
}

export async function updatePassword(data: {
  current_password: string
  password: string
  password_confirmation: string
}) {
  const response = await apiClient.patch('/profile/password', data)
  return response.data
}