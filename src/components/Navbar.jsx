import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useScrollSpy, useSmoothScroll } from '../hooks/useScrollSpy'

const NAV_SECTIONS = ['hero', 'features', 'bikes', 'testimonials']

export default function Navbar() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  const activeSection = useScrollSpy(isHome ? NAV_SECTIONS : [], { offset: 100 })
  const scrollTo = useSmoothScroll(76)

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavLink = (section) => {
    setMenuOpen(false)
    if (isHome) {
      scrollTo(section)
    } else {
      navigate('/')
      setTimeout(() => scrollTo(section), 400)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const navLinks = [
    { label: 'Features', section: 'features' },
    { label: 'Bikes', section: 'bikes' },
    { label: 'Reviews', section: 'testimonials' },
  ]

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          background: scrolled
            ? 'rgba(6, 6, 8, 0.92)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'all 0.3s ease',
        }}
      >
        <div className="container" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              letterSpacing: '-0.03em',
            }}
          >
            <span
              style={{
                width: 32,
                height: 32,
                background: 'var(--accent)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              ⚡
            </span>
            Ryde
          </Link>

          {/* Desktop Nav */}
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
            className="desktop-nav"
          >
            {navLinks.map(({ label, section }) => {
              const isActive = isHome && activeSection === section
              return (
                <button
                  key={section}
                  onClick={() => handleNavLink(section)}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--accent-dim)' : 'transparent',
                    transition: 'all var(--transition)',
                    letterSpacing: '0.01em',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.target.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.target.style.color = 'var(--text-secondary)'
                  }}
                >
                  {label}
                </button>
              )
            })}

            {user && (
              <Link
                to="/dashboard"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: location.pathname === '/dashboard' ? 'var(--accent)' : 'var(--text-secondary)',
                  background: location.pathname === '/dashboard' ? 'var(--accent-dim)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all var(--transition)',
                }}
              >
                Dashboard
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: location.pathname === '/admin' ? 'var(--accent)' : 'var(--text-secondary)',
                  background: location.pathname === '/admin' ? 'var(--accent-dim)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all var(--transition)',
                }}
              >
                Admin
              </Link>
            )}

            <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />

            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), #c2410c)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    color: '#fff',
                  }}
                >
                  {user.avatar}
                </div>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">
                  Sign out
                </button>
              </div>
            ) : (
              <Link to="/auth" className="btn btn-primary btn-sm">
                Get Started →
              </Link>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '8px 10px',
              cursor: 'pointer',
              display: 'none',
              flexDirection: 'column',
              gap: '4px',
            }}
            aria-label="Toggle menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: 'block',
                  width: 20,
                  height: 2,
                  background: 'var(--text-primary)',
                  borderRadius: 1,
                  transition: 'all 0.2s ease',
                  transform:
                    menuOpen
                      ? i === 0 ? 'rotate(45deg) translate(4px, 4px)' : i === 2 ? 'rotate(-45deg) translate(4px, -4px)' : 'opacity(0)'
                      : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 72,
            left: 0,
            right: 0,
            background: 'rgba(6,6,8,0.98)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            zIndex: 899,
            padding: '16px 24px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            animation: 'slideInUp 0.2s ease',
          }}
        >
          {navLinks.map(({ label, section }) => (
            <button
              key={section}
              onClick={() => handleNavLink(section)}
              style={{
                background: activeSection === section ? 'var(--accent-dim)' : 'transparent',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                padding: '14px 16px',
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: '1rem',
                color: activeSection === section ? 'var(--accent)' : 'var(--text-primary)',
                textAlign: 'left',
                transition: 'all var(--transition)',
              }}
            >
              {label}
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: '14px 16px',
                  borderRadius: 10,
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                }}
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '14px 16px',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 600,
                  fontSize: '1rem',
                  color: 'var(--red)',
                  textAlign: 'left',
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="btn btn-primary"
              onClick={() => setMenuOpen(false)}
              style={{ marginTop: 8 }}
            >
              Get Started →
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
