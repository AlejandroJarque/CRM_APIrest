import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile, updatePassword } from '../../api/profile'

interface Profile {
  id: number
  name: string
  email: string
  role: string
  created_at: string
}

function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    getProfile()
      .then((response) => {
        setProfile(response.data)
        setName(response.data.name)
        setEmail(response.data.email)
      })
      .catch(() => setError('Error al cargar el perfil'))
      .finally(() => setLoading(false))
  }, [])

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      await updateProfile({ name, email })
      setSuccess('Perfil actualizado correctamente')
    } catch {
      setError('Error al actualizar el perfil')
    }
  }

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      await updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: newPasswordConfirmation,
      })
      setSuccess('Contraseña actualizada correctamente')
      setCurrentPassword('')
      setNewPassword('')
      setNewPasswordConfirmation('')
    } catch {
      setError('Error al actualizar la contraseña')
    }
  }

  if (loading) return <p>Cargando...</p>
  if (!profile) return null

  return (
    <div>
      <h1>Mi perfil</h1>
      <p><strong>Rol:</strong> {profile.role}</p>
      <p><strong>Miembro desde:</strong> {profile.created_at.split('T')[0]}</p>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <h2>Datos personales</h2>
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Guardar cambios</button>
      </form>

      <h2>Cambiar contraseña</h2>
      <form onSubmit={handleUpdatePassword}>
        <div>
          <label>Contraseña actual</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Confirmar nueva contraseña</label>
          <input
            type="password"
            value={newPasswordConfirmation}
            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Cambiar contraseña</button>
      </form>

      <button onClick={() => navigate('/dashboard')}>Volver</button>
    </div>
  )
}

export default ProfilePage