import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Toast from '../components/Toast'
import Modal from '../components/Modal'
import BookingForm from '../components/BookingForm'
import Reveal from '../components/Reveal'
import {
  deriveBookingStatus,
  formatDate,
  formatCurrency,
  getDayCount,
} from '../services/bookingUtils'

const STATUS_META = {
  active: { label: 'Active', color: 'var(--green)', badge: 'badge-green', icon: '🟢' },
  upcoming: { label: 'Upcoming', color: 'var(--blue)', badge: 'badge-blue', icon: '🔵' },
  completed: { label: 'Completed', color: 'var(--text-muted)', badge: 'badge-orange', icon: '⚪' },
  cancelled: { label: 'Cancelled', color: 'var(--red)', badge: 'badge-red', icon: '🔴' },
}

export default function Dashboard() {
  const { user, getUserBookings, getBikeById, cancelBooking, showToast, bikes } = useApp()
  const [tab, setTab] = useState('current')
  const [rebookBike, setRebookBike] = useState(null)
  const [cancelConfirm, setCancelConfirm] = useState(null)

  const allBookings = getUserBookings()

  const enriched = useMemo(() =>
    allBookings.map((bk) => ({
      ...bk,
      bike: getBikeById(bk.bikeId),
      derivedStatus: bk.status === 'cancelled' ? 'cancelled' : deriveBookingStatus(bk.startDate, bk.endDate),
    }))
      .sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt)),
    [allBookings]
  )

  const current = enriched.filter((b) => ['active', 'upcoming'].includes(b.derivedStatus))
  const past = enriched.filter((b) => ['completed', 'cancelled'].includes(b.derivedStatus))

  const displayed = tab === 'current' ? current : past

  // Stats
  const totalSpent = enriched.filter(b => b.derivedStatus !== 'cancelled').reduce((s, b) => s + b.totalAmount, 0)
  const totalDays = enriched.filter(b => b.derivedStatus !== 'cancelled').reduce((s, b) => s + getDayCount(b.startDate, b.endDate), 0)

  const handleCancel = (bkId) => {
    cancelBooking(bkId)
    setCancelConfirm(null)
    showToast('Booking cancelled successfully', 'info')
  }

  const statCards = [
    { label: 'Total Bookings', value: enriched.length, icon: '📋' },
    { label: 'Active / Upcoming', value: current.length, icon: '🏍️' },
    { label: 'Days Rented', value: totalDays, icon: '📅' },
    { label: 'Total Spent', value: formatCurrency(totalSpent), icon: '💰' },
  ]

  return (
    <>
      <Toast />
      <div className="dashboard-page page-wrapper">
        <div className="container">

          {/* Header */}
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-label">Dashboard</div>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Welcome, {user?.name?.split(' ')[0]} 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
                  {user?.email} · Rider since {new Date(user?.joinedAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <Link to="/" className="btn btn-outline">
                + New Booking
              </Link>
            </div>
          </Reveal>

          {/* Stat Cards */}
          <Reveal>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 16,
                marginBottom: 40,
              }}
            >
              {statCards.map((s, i) => (
                <div
                  key={s.label}
                  className="stat-card"
                  style={{
                    animation: `slideInUp 0.5s ease ${i * 80}ms both`,
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-hover)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>{s.icon}</div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Tabs */}
          <Reveal>
            <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
              {[
                { key: 'current', label: `Current (${current.length})` },
                { key: 'past', label: `History (${past.length})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    background: tab === key ? 'var(--bg-card)' : 'transparent',
                    color: tab === key ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: tab === key ? '0 2px 8px rgba(0,0,0,0.3)' : 'none',
                    transition: 'all var(--transition)',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Booking List */}
          {displayed.length === 0 ? (
            <Reveal>
              <div
                style={{
                  textAlign: 'center',
                  padding: '80px 24px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 12 }}>
                  {tab === 'current' ? '🏍️' : '📋'}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                  {tab === 'current' ? 'No active bookings' : 'No booking history'}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: 24 }}>
                  {tab === 'current'
                    ? 'Ready to ride? Browse our fleet and book your first bike.'
                    : 'Your completed and cancelled bookings will appear here.'}
                </p>
                <Link to="/" className="btn btn-primary">
                  Browse Bikes →
                </Link>
              </div>
            </Reveal>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {displayed.map((bk, i) => {
                const meta = STATUS_META[bk.derivedStatus] || STATUS_META.completed
                const days = getDayCount(bk.startDate, bk.endDate)
                const canCancel = bk.derivedStatus === 'upcoming'

                return (
                  <Reveal key={bk.id} delay={i * 60}>
                    <div
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '20px 24px',
                        display: 'flex',
                        gap: 20,
                        alignItems: 'center',
                        transition: 'all var(--transition)',
                        flexWrap: 'wrap',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-hover)'
                        e.currentTarget.style.transform = 'translateX(2px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.transform = 'translateX(0)'
                      }}
                    >
                      {/* Bike image */}
                      <div
                        style={{
                          width: 96,
                          height: 68,
                          borderRadius: 10,
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: 'var(--bg-secondary)',
                        }}
                      >
                        {bk.bike ? (
                          <img
                            src={bk.bike.image}
                            alt={bk.bike.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>🏍️</div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 180 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 700,
                              fontSize: '1rem',
                              color: 'var(--text-primary)',
                            }}
                          >
                            {bk.bike?.name || 'Bike (removed)'}
                          </span>
                          <span className={`badge ${meta.badge}`}>
                            {meta.icon} {meta.label}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          {formatDate(bk.startDate)} → {formatDate(bk.endDate)} · {days} day{days !== 1 ? 's' : ''}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
                          ID: {bk.id} · Booked {formatDate(bk.bookedAt)}
                        </div>
                      </div>

                      {/* Amount */}
                      <div style={{ textAlign: 'right', minWidth: 100 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 800,
                            fontSize: '1.2rem',
                            color: 'var(--text-primary)',
                          }}
                        >
                          {formatCurrency(bk.totalAmount)}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          ₹{bk.bike?.pricePerDay}/day
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        {canCancel && (
                          <button
                            onClick={() => setCancelConfirm(bk.id)}
                            className="btn btn-sm btn-danger"
                          >
                            Cancel
                          </button>
                        )}
                        {bk.derivedStatus === 'completed' && bk.bike && (
                          <button
                            onClick={() => setRebookBike(bk.bike)}
                            className="btn btn-sm btn-outline"
                          >
                            Rebook
                          </button>
                        )}
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rebook Modal */}
      <Modal
        open={!!rebookBike}
        onClose={() => setRebookBike(null)}
        title={`Rebook · ${rebookBike?.name || ''}`}
      >
        {rebookBike && (
          <BookingForm
            bike={rebookBike}
            onClose={() => setRebookBike(null)}
            onSuccess={() => setRebookBike(null)}
          />
        )}
      </Modal>

      {/* Cancel Confirm Modal */}
      <Modal
        open={!!cancelConfirm}
        onClose={() => setCancelConfirm(null)}
        title="Cancel Booking"
        maxWidth={400}
      >
        <div>
          <div
            style={{
              background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.2)',
              borderRadius: 12,
              padding: 20,
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>⚠️</div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setCancelConfirm(null)} className="btn btn-outline" style={{ flex: 1 }}>
              Keep Booking
            </button>
            <button onClick={() => handleCancel(cancelConfirm)} className="btn btn-danger" style={{ flex: 1 }}>
              Yes, Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
