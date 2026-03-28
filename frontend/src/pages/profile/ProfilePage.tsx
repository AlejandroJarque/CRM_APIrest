import { useEffect, useState } from 'react'
import { getProfile, updateProfile, updatePassword } from '../../api/profile'
import './ProfilePage.css'

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

  function getInitials(name: string) {
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  }

  if (loading) return <div className="loading">Loading...</div>
  if (!profile) return null

  return (
    <div className="profile-page">
      <div className="profile-outer-card">

        <div className="profile-hero">
          <div className="profile-avatar">
            {getInitials(profile.name)}
          </div>
          <div className="profile-hero-info">
            <span className="profile-hero-name">{profile.name}</span>
            <div className="profile-hero-meta">
              <span className="profile-role-badge">{profile.role}</span>
              <span className="profile-hero-date">Member since {profile.created_at.split('T')[0]}</span>
            </div>
          </div>
        </div>

        {error && <div className="auth-error" style={{ margin: '0 20px' }}>{error}</div>}
        {success && <div className="profile-success" style={{ margin: '0 20px' }}>{success}</div>}

        <div className="profile-grid">

          <div className="profile-inner-card">
            <div className="profile-section-header">
              <div className="profile-accent profile-accent--blue"></div>
              <span className="profile-section-label">Personal info</span>
            </div>
            <form className="profile-section-body" onSubmit={handleUpdateProfile}>
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
              <div className="profile-section-footer">
                <button type="submit" className="btn btn-primary">
                  Save changes
                </button>
              </div>
            </form>
          </div>

          <div className="profile-inner-card">
            <div className="profile-section-header">
              <div className="profile-accent profile-accent--red"></div>
              <span className="profile-section-label">Change password</span>
            </div>
            <form className="profile-section-body" onSubmit={handleUpdatePassword}>
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
              <div className="profile-section-footer">
                <button type="submit" className="btn btn-danger-solid">
                  Change password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProfilePage