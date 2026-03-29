import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import {
  checkBookingConflict,
  calculateTotalCost,
  getDayCount,
  validateDates,
  todayISO,
  addDays,
  formatCurrency,
} from '../services/bookingUtils'

export default function BookingForm({ bike, onSuccess, onClose }) {
  const { bookings, addBooking, showToast } = useApp()

  const [startDate, setStartDate] = useState(todayISO())
  const [endDate, setEndDate] = useState(addDays(todayISO(), 1))
  const [errors, setErrors] = useState([])
  const [conflictMsg, setConflictMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1) // 1: dates, 2: confirm

  const days = getDayCount(startDate, endDate)
  const total = calculateTotalCost(bike.pricePerDay, startDate, endDate)

  // Live conflict check
  useEffect(() => {
    if (!startDate || !endDate) return
    const { conflict, conflictingBooking } = checkBookingConflict(
      bike.id, startDate, endDate, bookings
    )
    if (conflict) {
      setConflictMsg(
        `Already booked from ${conflictingBooking.startDate} to ${conflictingBooking.endDate}`
      )
    } else {
      setConflictMsg('')
    }
  }, [startDate, endDate, bike.id, bookings])

  const handleNext = () => {
    const { valid, errors: dateErrors } = validateDates(startDate, endDate)
    if (!valid) {
      setErrors(dateErrors)
      return
    }
    if (conflictMsg) {
      setErrors(['This bike is already booked for the selected dates'])
      return
    }
    setErrors([])
    setStep(2)
  }

  const handleConfirm = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const booking = addBooking({
      bikeId: bike.id,
      startDate,
      endDate,
      totalAmount: total,
    })

    showToast(`Booking confirmed! ID: ${booking.id}`, 'success')
    setLoading(false)
    if (onSuccess) onSuccess(booking)
  }

  return (
    <div>
      {/* Bike Summary */}
      <div
        style={{
          display: 'flex',
          gap: 16,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: 80,
            height: 56,
            borderRadius: 8,
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-secondary)',
          }}
        >
          <img
            src={bike.image}
            alt={bike.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              fontSize: '1rem',
            }}
          >
            {bike.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
            {bike.type} · {bike.fuelType}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: 'var(--accent)',
            }}
          >
            ₹{bike.pricePerDay}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/day</div>
        </div>
      </div>

      {step === 1 && (
        <>
          {/* Date Pickers */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-input"
                value={startDate}
                min={todayISO()}
                onChange={(e) => {
                  setStartDate(e.target.value)
                  if (e.target.value >= endDate) setEndDate(addDays(e.target.value, 1))
                  setErrors([])
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-input"
                value={endDate}
                min={addDays(startDate, 1)}
                onChange={(e) => {
                  setEndDate(e.target.value)
                  setErrors([])
                }}
              />
            </div>
          </div>

          {/* Conflict Warning */}
          {conflictMsg && (
            <div
              style={{
                background: 'rgba(244,63,94,0.1)',
                border: '1px solid rgba(244,63,94,0.25)',
                borderRadius: 10,
                padding: '12px 14px',
                marginBottom: 16,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
                fontSize: '0.85rem',
                color: 'var(--red)',
              }}
            >
              <span>⚠️</span>
              <span>{conflictMsg}</span>
            </div>
          )}

          {/* Validation Errors */}
          {errors.map((err, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(244,63,94,0.08)',
                border: '1px solid rgba(244,63,94,0.2)',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 8,
                fontSize: '0.83rem',
                color: 'var(--red)',
              }}
            >
              {err}
            </div>
          ))}

          {/* Price preview */}
          {!conflictMsg && startDate && endDate && (
            <div
              style={{
                background: 'rgba(249,115,22,0.06)',
                border: '1px solid rgba(249,115,22,0.15)',
                borderRadius: 10,
                padding: '14px 16px',
                marginBottom: 20,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                {days} day{days !== 1 ? 's' : ''} × ₹{bike.pricePerDay}
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '1.3rem',
                  color: 'var(--text-primary)',
                }}
              >
                {formatCurrency(total)}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            {onClose && (
              <button onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
                Cancel
              </button>
            )}
            <button
              onClick={handleNext}
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={!!conflictMsg}
            >
              Review Booking →
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          {/* Confirmation Summary */}
          <div
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: 20,
              marginBottom: 20,
            }}
          >
            <div style={{ marginBottom: 8, fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Booking Summary
            </div>
            {[
              { label: 'Bike', value: bike.name },
              { label: 'From', value: new Date(startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'To', value: new Date(endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) },
              { label: 'Duration', value: `${days} day${days !== 1 ? 's' : ''}` },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: '0.875rem',
                }}
              >
                <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</span>
              </div>
            ))}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 0 0',
                fontSize: '1rem',
              }}
            >
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--accent)' }}>
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(34,211,160,0.06)',
              border: '1px solid rgba(34,211,160,0.15)',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 20,
              fontSize: '0.82rem',
              color: 'var(--green)',
              display: 'flex',
              gap: 8,
              alignItems: 'center',
            }}
          >
            <span>✓</span>
            <span>Full insurance included · Free cancellation within 2h · 24/7 support</span>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>
              ← Back
            </button>
            <button
              onClick={handleConfirm}
              className="btn btn-primary"
              style={{ flex: 2 }}
              disabled={loading}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  Processing...
                </span>
              ) : (
                'Confirm Booking ⚡'
              )}
            </button>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
