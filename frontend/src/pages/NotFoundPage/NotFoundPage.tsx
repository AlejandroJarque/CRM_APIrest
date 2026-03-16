import { useNavigate } from 'react-router-dom'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="not-found">
      <span className="not-found__code">404</span>
      <span className="not-found__message">Esta página no existe</span>
      <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
        Volver al dashboard
      </button>
    </div>
  )
}