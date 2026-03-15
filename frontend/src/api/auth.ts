import apiClient from './client'

export async function login(email: string, password: string) {
  const response = await apiClient.post('/login', { email, password })
  return response.data
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
  const response = await apiClient.post('/register', { name, email, password, password_confirmation })
  return response.data
}

export async function me() {
  const response = await apiClient.get('/me')
  return response.data
}