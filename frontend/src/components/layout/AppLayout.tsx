import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import './AppLayout.css'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const GENERAL_NAV: NavItem[] = [
  { label: 'Dashboard',  path: '/dashboard',  icon: <IconDashboard /> },
  { label: 'Clients',    path: '/clients',    icon: <IconClients /> },
  { label: 'Activities', path: '/activities', icon: <IconActivities /> },
  { label: 'Contacts',   path: '/contacts',   icon: <IconContacts /> },
]

const ACCOUNT_NAV: NavItem[] = [
  { label: 'Profile', path: '/profile', icon: <IconProfile /> },
]

const ADMIN_NAV: NavItem[] = [
  { label: 'Users', path: '/admin/users', icon: <IconUsers /> },
]

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  actions?: React.ReactNode
}

export default function AppLayout({ children, title, actions }: AppLayoutProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  function isActive(path: string) {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
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

        <nav className="sidebar-nav">
          <span className="nav-section-label">General</span>
          {GENERAL_NAV.map(item => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <nav className="sidebar-nav">
          <span className="nav-section-label">Account</span>
          {ACCOUNT_NAV.map(item => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          {user?.role === 'admin' && ADMIN_NAV.map(item => (
            <button
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button className="theme-toggle" onClick={toggleTheme}>
            <span className="nav-icon">
              {theme === 'dark' ? <IconSun /> : <IconMoon />}
            </span>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          <div className="user-pill" onClick={() => navigate('/profile')}>
            <div className="avatar">
              {user ? getInitials(user.name) : '?'}
            </div>
            <div className="user-info">
              <span className="user-name">{user?.name ?? '—'}</span>
              <span className="user-role">{user?.role ?? '—'}</span>
            </div>
          </div>
        </div>
      </aside>

      <div className="app-main">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          {actions && (
            <div className="topbar-actions">{actions}</div>
          )}
        </header>

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}

function IconDashboard() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="8" y="1" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="1" y="8" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="8" y="8" width="5" height="5" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  )
}

function IconClients() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M2 12c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconActivities() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7h2.5l2-5 2.5 8 2-4.5H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function IconContacts() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="5.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M4 11c0-1.657 1.343-2.5 3-2.5s3 .843 3 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconProfile() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="7" cy="5" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M3 12c0-2 1.79-3 4-3s4 1 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconUsers() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="5" cy="4" r="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M1 11c0-2 1.79-3 4-3s4 1 4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="10.5" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M13 11c0-1.5-1.12-2.5-2.5-2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconSun() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.93 2.93l1.06 1.06M10.01 10.01l1.06 1.06M2.93 11.07l1.06-1.06M10.01 3.99l1.06-1.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M12 8.5A5.5 5.5 0 015.5 2a5.5 5.5 0 100 10A5.5 5.5 0 0012 8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}