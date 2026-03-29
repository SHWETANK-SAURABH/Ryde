import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useSmoothScroll } from '../hooks/useScrollSpy'
import BikeCard from '../components/BikeCard'
import BookingForm from '../components/BookingForm'
import Modal from '../components/Modal'
import Reveal from '../components/Reveal'
import Toast from '../components/Toast'
import { FEATURES, STATS, TESTIMONIALS } from '../services/data'

export default function Home() {
  const { bikes, user } = useApp()
  const navigate = useNavigate()
  const scrollTo = useSmoothScroll(76)

  const [selectedBike, setSelectedBike] = useState(null)
  const [filterType, setFilterType] = useState('All')
  const [filterFuel, setFilterFuel] = useState('All')

  const bikeTypes = ['All', ...new Set(bikes.map((b) => b.type))]
  const fuelTypes = ['All', ...new Set(bikes.map((b) => b.fuelType))]

  const filteredBikes = bikes.filter((b) => {
    const typeMatch = filterType === 'All' || b.type === filterType
    const fuelMatch = filterFuel === 'All' || b.fuelType === filterFuel
    return typeMatch && fuelMatch
  })

  const handleBook = (bike) => {
    if (!user) { navigate('/auth'); return }
    setSelectedBike(bike)
  }

  return (
    <>
      <Toast />
      <div style={{ minHeight: '100vh' }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section
          id="hero"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden',
            paddingTop: 72,
          }}
        >
          {/* Grid bg */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(249,115,22,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }} />

          {/* Glow */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: 60, paddingBottom: 80 }}>
            <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>

              {/* Pill badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'rgba(249,115,22,0.1)',
                  border: '1px solid rgba(249,115,22,0.25)',
                  borderRadius: 100,
                  padding: '6px 16px',
                  marginBottom: 32,
                  animation: 'slideInUp 0.5s ease',
                }}
              >
                <span className="dot-pulse" style={{ background: 'var(--accent)', width: 7, height: 7 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent)', letterSpacing: '0.05em' }}>
                  Now live in 28 cities across India
                </span>
              </div>

              {/* Headline */}
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(2.4rem, 7vw, 5rem)',
                  lineHeight: 1.05,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.03em',
                  marginBottom: 24,
                  animation: 'slideInUp 0.6s ease 0.1s both',
                }}
              >
                The bike platform
                <br />
                built for{' '}
                <span
                  style={{
                    color: 'var(--accent)',
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  gig workers
                  <svg
                    viewBox="0 0 200 12"
                    style={{
                      position: 'absolute',
                      bottom: -4,
                      left: 0,
                      width: '100%',
                      height: 8,
                    }}
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M2 8 Q50 2 100 8 Q150 14 198 8"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  </svg>
                </span>
              </h1>

              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
                  lineHeight: 1.7,
                  maxWidth: 540,
                  margin: '0 auto 40px',
                  animation: 'slideInUp 0.6s ease 0.2s both',
                }}
              >
                Rent reliable bikes by the day. No EMI traps, no ownership hassles.
                Just ride, deliver, and earn more with Ryde.
              </p>

              {/* CTA Buttons */}
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  animation: 'slideInUp 0.6s ease 0.3s both',
                }}
              >
                <button
                  onClick={() => scrollTo('bikes')}
                  className="btn btn-primary btn-lg"
                >
                  Browse Bikes ↓
                </button>
                <button
                  onClick={() => scrollTo('features')}
                  className="btn btn-outline btn-lg"
                >
                  How it works
                </button>
              </div>

              {/* Mini stats */}
              <div
                style={{
                  display: 'flex',
                  gap: 32,
                  justifyContent: 'center',
                  marginTop: 56,
                  flexWrap: 'wrap',
                  animation: 'slideInUp 0.6s ease 0.4s both',
                }}
              >
                {STATS.map((s) => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.5rem',
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                      }}
                    >
                      {s.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              position: 'absolute',
              bottom: 32,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              animation: 'float 2.5s ease-in-out infinite',
            }}
          >
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>Scroll</span>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--accent), transparent)' }} />
          </div>

          <style>{`
            @keyframes float {
              0%,100% { transform: translateX(-50%) translateY(0); }
              50% { transform: translateX(-50%) translateY(-8px); }
            }
          `}</style>
        </section>

        {/* ── FEATURES ─────────────────────────────────────────── */}
        <section
          id="features"
          style={{ padding: '100px 0', position: 'relative' }}
        >
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(249,115,22,0.05) 0%, transparent 100%)',
            pointerEvents: 'none',
          }} />

          <div className="container" style={{ position: 'relative' }}>
            <Reveal style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>Why Ryde</div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                  marginBottom: 12,
                }}
              >
                Everything a gig worker needs
              </h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                We built Ryde by talking to 500+ delivery partners. Every feature solves a real problem.
              </p>
            </Reveal>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20,
              }}
            >
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 80}>
                  <div
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 28,
                      transition: 'all var(--transition)',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = f.color + '40'
                      e.currentTarget.style.boxShadow = `0 8px 32px ${f.color}12`
                      e.currentTarget.style.transform = 'translateY(-3px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.boxShadow = 'none'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: f.color + '18',
                        border: `1px solid ${f.color}25`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.4rem',
                        marginBottom: 16,
                      }}
                    >
                      {f.icon}
                    </div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--text-primary)',
                        marginBottom: 8,
                      }}
                    >
                      {f.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.65 }}>
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── BIKES LISTING ─────────────────────────────────────── */}
        <section
          id="bikes"
          style={{ padding: '100px 0', background: 'var(--bg-secondary)' }}
        >
          <div className="container">
            <Reveal style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div>
                  <div className="section-label">Fleet</div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Available Bikes
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', marginTop: 8, fontSize: '0.9rem' }}>
                    {filteredBikes.filter((b) => b.available).length} of {filteredBikes.length} available now
                  </p>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {/* Type Filter */}
                  <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
                    {bikeTypes.map((t) => (
                      <button
                        key={t}
                        onClick={() => setFilterType(t)}
                        style={{
                          background: filterType === t ? 'var(--accent)' : 'transparent',
                          border: 'none',
                          borderRadius: 7,
                          padding: '7px 14px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          color: filterType === t ? '#fff' : 'var(--text-muted)',
                          transition: 'all var(--transition)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {/* Fuel filter */}
                  <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
                    {fuelTypes.map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilterFuel(f)}
                        style={{
                          background: filterFuel === f ? 'var(--bg-card)' : 'transparent',
                          border: 'none',
                          borderRadius: 7,
                          padding: '7px 14px',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: '0.78rem',
                          color: filterFuel === f ? 'var(--text-primary)' : 'var(--text-muted)',
                          transition: 'all var(--transition)',
                          whiteSpace: 'nowrap',
                          boxShadow: filterFuel === f ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                        }}
                      >
                        {f === 'Electric' ? '⚡ ' : f === 'Petrol' ? '⛽ ' : ''}{f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {filteredBikes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
                <p>No bikes match your filters.</p>
                <button
                  onClick={() => { setFilterType('All'); setFilterFuel('All') }}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: 16 }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                  gap: 20,
                }}
              >
                {filteredBikes.map((bike, i) => (
                  <Reveal key={bike.id} delay={i * 60}>
                    <BikeCard bike={bike} onBook={handleBook} />
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────── */}
        <section
          id="testimonials"
          style={{ padding: '100px 0', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 600,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.08) 0%, transparent 70%)',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }} />

          <div className="container" style={{ position: 'relative' }}>
            <Reveal style={{ textAlign: 'center', marginBottom: 60 }}>
              <div className="section-label" style={{ justifyContent: 'center' }}>Reviews</div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                Riders love Ryde
              </h2>
            </Reveal>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 20,
              }}
            >
              {TESTIMONIALS.map((t, i) => (
                <Reveal key={t.name} delay={i * 100}>
                  <div
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 28,
                      transition: 'all var(--transition)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249,115,22,0.25)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {/* Stars */}
                    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <span key={j} style={{ color: '#fbbf24', fontSize: '0.9rem' }}>★</span>
                      ))}
                    </div>
                    <p
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        lineHeight: 1.7,
                        fontStyle: 'italic',
                        marginBottom: 20,
                      }}
                    >
                      "{t.text}"
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent), #c2410c)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          color: '#fff',
                          flexShrink: 0,
                        }}
                      >
                        {t.avatar}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                          {t.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {t.role} · {t.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ────────────────────────────────────────── */}
        <Reveal>
          <section style={{ padding: '80px 0' }}>
            <div className="container">
              <div
                style={{
                  background: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(194,65,12,0.08) 100%)',
                  border: '1px solid rgba(249,115,22,0.25)',
                  borderRadius: 24,
                  padding: 'clamp(40px, 6vw, 72px)',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: -60,
                  right: -60,
                  width: 300,
                  height: 300,
                  background: 'radial-gradient(circle, rgba(249,115,22,0.15), transparent)',
                  borderRadius: '50%',
                  pointerEvents: 'none',
                }} />
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom: 16,
                  }}
                >
                  Start riding in 60 seconds
                </h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.7 }}>
                  No deposit. No paperwork. Pick your bike, choose your dates, and hit the road.
                </p>
                <button
                  onClick={() => scrollTo('bikes')}
                  className="btn btn-primary btn-lg"
                  style={{ fontSize: '1rem' }}
                >
                  Get Started Free →
                </button>
              </div>
            </div>
          </section>
        </Reveal>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <footer
          style={{
            borderTop: '1px solid var(--border)',
            padding: '40px 0',
          }}
        >
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span style={{ background: 'var(--accent)', borderRadius: 6, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>⚡</span>
                Ryde
              </div>
              <div style={{ display: 'flex', gap: 24 }}>
                {['Features', 'Pricing', 'Cities', 'Blog', 'Support'].map((item) => (
                  <span key={item} style={{ fontSize: '0.83rem', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color var(--transition)' }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                © 2025 Ryde Technologies Pvt. Ltd.
              </div>
            </div>
          </div>
        </footer>

      </div>

      {/* Booking Modal */}
      <Modal
        open={!!selectedBike}
        onClose={() => setSelectedBike(null)}
        title={`Book · ${selectedBike?.name || ''}`}
      >
        {selectedBike && (
          <BookingForm
            bike={selectedBike}
            onClose={() => setSelectedBike(null)}
            onSuccess={() => setSelectedBike(null)}
          />
        )}
      </Modal>
    </>
  )
}
