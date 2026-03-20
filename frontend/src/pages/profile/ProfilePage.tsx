import { useEffect, useState } from 'react'
import { getProfile, updateProfile, updatePassword } from '../../api/profile'
import './ProfilePage.css'
import '../clients/ClientCreatePage.css'

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

  useEffect(() => {
    getProfile()
      .then((response) => {
        setProfile(response.data)
        setName(response.data.name)
        setEmail(response.data.email)
      })
      .catch(() => setError('Error loading profile'))
      .finally(() => setLoading(false))
  }, [])

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      await updateProfile({ name, email })
      setSuccess('Profile updated successfully')
    } catch {
      setError('Error updating profile')
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
      setSuccess('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setNewPasswordConfirmation('')
    } catch {
      setError('Error updating password')
    }
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!profile) return null

  return (
    <div className="page">

      <div className="profile-body">

        <div className="profile-card">
          <div className="profile-avatar">
            {profile.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
          </div>
          <div className="profile-info">
            <span className="profile-name">{profile.name}</span>
            <span className="profile-meta">{profile.role} · Member since {profile.created_at.split('T')[0]}</span>
          </div>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="profile-success">{success}</div>}

        <form className="form-card" onSubmit={handleUpdateProfile}>
          <h2 className="form-section-title">Personal info</h2>

          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>

        <form className="form-card" onSubmit={handleUpdatePassword}>
          <h2 className="form-section-title">Change password</h2>

          <div className="input-group">
            <label className="input-label">Current password</label>
            <input
              className="input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">New password</label>
            <input
              className="input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm new password</label>
            <input
              className="input"
              type="password"
              value={newPasswordConfirmation}
              onChange={(e) => setNewPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Change password
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default ProfilePage