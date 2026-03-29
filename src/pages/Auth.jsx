import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function Auth() {
  const { login, showToast } = useApp()
  const navigate = useNavigate()

  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (mode === 'signup' && !form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Minimum 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))

    if (mode === 'login') {
      const result = login(form.email, form.password)
      if (result.success) {
        showToast(`Welcome back, ${result.user.name.split(' ')[0]}! 👋`, 'success')
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard')
      } else {
        setErrors({ general: result.error })
      }
    } else {
      // Mock signup — just log them in as the demo user
      showToast('Account created! Signing you in...', 'success')
      const result = login('arjun@ryde.in', '123456')
      if (result.success) navigate('/dashboard')
    }
    setLoading(false)
  }

  const demoAccounts = [
    { label: 'Rider Demo', email: 'arjun@ryde.in', password: '123456', icon: '🏍️' },
    { label: 'Admin Demo', email: 'admin@ryde.in', password: 'admin123', icon: '⚙️' },
  ]

  const fillDemo = (acc) => {
    setForm((f) => ({ ...f, email: acc.email, password: acc.password }))
    setErrors({})
  }

  return (
    <div className="auth-page">
      {/* Background effects */}
      <div
        className="glow-blob auth-glow"
        style={{
          width: 'min(500px, 90vw)',
          height: 'min(500px, 90vw)',
          background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 440,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.6rem',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              letterSpacing: '-0.03em',
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                background: 'var(--accent)',
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ⚡
            </span>
            Ryde
          </Link>
          <p style={{ marginTop: 8, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            {mode === 'login' ? 'Sign in to your rider account' : 'Join 12,000+ gig workers on Ryde'}
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Mode Toggle */}
          <div className="tabs" style={{ marginBottom: 24 }}>
            <button
              className={`tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setErrors({}) }}
            >
              Sign In
            </button>
            <button
              className={`tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => { setMode('signup'); setErrors({}) }}
            >
              Sign Up
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div
              style={{
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.25)',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 20,
                fontSize: '0.875rem',
                color: 'var(--red)',
                display: 'flex',
                gap: 8,
              }}
            >
              <span>⚠️</span> {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Arjun Mehta"
                  value={form.name}
                  onChange={set('name')}
                  autoComplete="name"
                />
                {errors.name && <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>{errors.name}</span>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                autoComplete="email"
              />
              {errors.email && <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    fontSize: '0.9rem',
                    lineHeight: 1,
                  }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: '0.78rem', color: 'var(--red)' }}>{errors.password}</span>}
            </div>

            {mode === 'signup' && (
              <div className="form-group">
                <label className="form-label">Phone (optional)</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={set('phone')}
                />
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: 4, height: 48, fontSize: '0.95rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                  <span style={{
                    width: 18,
                    height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In →' : 'Create Account →'
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Try demo accounts</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Demo Accounts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => fillDemo(acc)}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.background = 'var(--accent-dim)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                }}
              >
                <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{acc.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.82rem' }}>
                  {acc.label}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>
                  {acc.email}
                </div>
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          By continuing, you agree to our{' '}
          <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Terms</span> &{' '}
          <span style={{ color: 'var(--accent)', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
