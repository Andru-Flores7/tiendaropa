import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Login.css'

export default function Login() {
  const { user, isAdmin, loading, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && isAdmin) return <Navigate to="/admin" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) {
      setError('Correo o contraseña incorrectos.')
      setSubmitting(false)
      return
    }
    navigate('/admin')
  }

  return (
    <div className="login-shell">
      <form className="login-card" onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <Link to="/" className="btn btn-ghost" style={{ fontSize: '0.8rem' }}>← Volver al inicio</Link>
        </div>
        <h1>Russo Indumentaria</h1>
        <p>Acceso de administración</p>

        <div className="field">
          <label htmlFor="email">Correo</label>
          <input id="email" type="email" className="input" required
            value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
        </div>
        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" className="input" required
            value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        {error && <p className="field-error">{error}</p>}

        <button className="btn btn-primary btn-full" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
