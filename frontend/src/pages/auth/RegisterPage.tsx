import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as registerApi } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import '../auth/LoginPage.css'

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await registerApi(name, email, password, passwordConfirmation)
      await login(response.data.token)
      navigate('/dashboard')
    } catch {
      setError('Error registering user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="logo-mark">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <text
                x="7.5" y="12"
                textAnchor="middle"
                fontFamily="Inter, -apple-system, sans-serif"
                fontWeight="800"
                fontSize="12"
                fill="white"
              >
                N
              </text>
            </svg>
          </div>
          <span className="logo-wordmark">
            NEX<span className="logo-accent">ORA</span>
          </span>
        </div>

        <div className="auth-header">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Fill in your details to register</p>
        </div>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
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
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Confirm password</label>
            <input
              className="input"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            {loading ? 'Loading...' : 'Create account'}
          </button>
        </form>

        <p className="auth-footer">
          ¿Already have an account? <span className="auth-link" onClick={() => navigate('/login')}>Sign in</span>
        </p>

      </div>
    </div>
  )
}

export default RegisterPage