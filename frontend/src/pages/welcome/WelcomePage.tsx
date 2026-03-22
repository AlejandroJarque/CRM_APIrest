import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './WelcomePage.css'

function WelcomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    document.documentElement.removeAttribute('data-theme')
    return () => {
      const saved = localStorage.getItem('nexora-theme')
      if (saved === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
      }
    }
  }, [])

  return (
    <div className="welcome">

      <nav className="welcome-nav">
        <div className="welcome-logo" onClick={() => navigate('/')}>
          <div className="logo-mark">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <text
                x="7.5" y="12"
                textAnchor="middle"
                fontFamily="Inter, -apple-system, sans-serif"
                fontWeight="800"
                fontSize="12"
                fill="white"
              >N</text>
            </svg>
          </div>
          <span className="logo-wordmark">
            NEX<span className="logo-accent">ORA</span>
          </span>
        </div>
        <div className="welcome-nav-actions">
          <button className="btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
          <button className="btn-primary" onClick={() => navigate('/register')}>Get started</button>
        </div>
      </nav>

      <section className="welcome-hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="hero-tag">CRM · Built for freelancers</span>
          <h1 className="hero-title">
            Your clients,<br />
            <span className="hero-title--accent">under control.</span>
          </h1>
          <p className="hero-desc">
            Nexora is a CRM designed to manage clients, contacts and activities
            without friction. Everything in one place, nothing in the way.
          </p>
          <div className="hero-actions">
            <button className="btn-primary btn-large" onClick={() => navigate('/register')}>
              Start now
            </button>
            <button className="btn-ghost btn-large" onClick={() => navigate('/login')}>
              I already have an account
            </button>
          </div>
        </div>
      </section>

      <section className="welcome-features">
        <div className="feature-card">
          <span className="feature-icon feature-icon--blue" />
          <h3 className="feature-title">Clients</h3>
          <p className="feature-desc">Centralise all your client information. No more scattered spreadsheets.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon feature-icon--lime" />
          <h3 className="feature-title">Activities</h3>
          <p className="feature-desc">Track calls, meetings and tasks. Know what's pending at a glance.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon feature-icon--amber" />
          <h3 className="feature-title">Contacts</h3>
          <p className="feature-desc">Associate contacts to clients and keep every relationship organised.</p>
        </div>
      </section>

      <footer className="welcome-footer">
        <span>NEXORA CRM · {new Date().getFullYear()}</span>
      </footer>

    </div>
  )
}

export default WelcomePage