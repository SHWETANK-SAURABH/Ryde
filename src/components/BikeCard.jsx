import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export default function BikeCard({ bike, onBook, showAdminControls = false }) {
  const { user, toggleBikeAvailability, deleteBike, showToast } = useApp()
  const navigate = useNavigate()
  const [imageError, setImageError] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleBook = () => {
    if (!user) {
      navigate('/auth')
      return
    }
    if (!bike.available) return
    if (onBook) onBook(bike)
  }

  const handleToggle = () => {
    toggleBikeAvailability(bike.id)
    showToast(
      `${bike.name} marked as ${bike.available ? 'unavailable' : 'available'}`,
      'info'
    )
  }

  const handleDelete = () => {
    if (!window.confirm(`Delete "${bike.name}"? This cannot be undone.`)) return
    setDeleting(true)
    setTimeout(() => deleteBike(bike.id), 300)
  }

  const fuelColors = {
    Electric: '#22d3a0',
    Petrol: '#f97316',
  }
  const fuelColor = fuelColors[bike.fuelType] || '#8888a0'

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        opacity: deleting ? 0 : 1,
        transition: 'opacity 0.3s ease, transform 0.3s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-hover)'
        e.currentTarget.style.boxShadow = 'var(--shadow-card), 0 0 0 1px rgba(249,115,22,0.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Availability ribbon */}
      {!bike.available && (
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
          }}
        >
          <span className="badge badge-red">Unavailable</span>
        </div>
      )}

      {/* Image */}
      <div className="bike-img-wrap">
        {!imageError ? (
          <img
            src={bike.image}
            alt={bike.name}
            onError={() => setImageError(true)}
            style={{ filter: bike.available ? 'none' : 'grayscale(60%) brightness(0.7)' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-secondary)',
              fontSize: '3rem',
            }}
          >
            🏍️
          </div>
        )}
        {/* Fuel badge */}
        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
          <span
            className="badge"
            style={{
              background: `${fuelColor}18`,
              color: fuelColor,
              border: `1px solid ${fuelColor}30`,
            }}
          >
            <span
              className="dot-pulse"
              style={{ background: fuelColor, width: 6, height: 6 }}
            />
            {bike.fuelType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
        {/* Header */}
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.7rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              marginBottom: 2,
            }}
          >
            {bike.brand} · {bike.type}
          </div>
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            {bike.name}
          </h3>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                style={{
                  fontSize: '0.7rem',
                  color: i < Math.floor(bike.rating) ? '#fbbf24' : 'var(--text-muted)',
                }}
              >
                ★
              </span>
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {bike.rating} ({bike.reviews})
          </span>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
          }}
        >
          {[
            { icon: '⛽', label: bike.mileage },
            { icon: '👥', label: `${bike.seats} seats` },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 8,
                padding: '8px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
              }}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Price + CTA */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 12,
            borderTop: '1px solid var(--border)',
          }}
        >
          <div>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: 'var(--text-primary)',
              }}
            >
              ₹{bike.pricePerDay}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 4 }}>
              /day
            </span>
          </div>

          {!showAdminControls ? (
            <button
              onClick={handleBook}
              className={`btn btn-sm ${bike.available ? 'btn-primary' : 'btn-outline'}`}
              disabled={!bike.available}
              style={{ minWidth: 90 }}
            >
              {bike.available ? 'Book Now' : 'Booked'}
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={handleToggle}
                className={`btn btn-sm ${bike.available ? 'btn-outline' : 'btn-primary'}`}
              >
                {bike.available ? 'Disable' : 'Enable'}
              </button>
              <button onClick={handleDelete} className="btn btn-sm btn-danger">
                ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
