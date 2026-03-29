import { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import BikeCard from '../components/BikeCard'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import Reveal from '../components/Reveal'
import { formatCurrency, formatDate, deriveBookingStatus } from '../services/bookingUtils'

const BIKE_TYPES = ['Scooter', 'Motorcycle', 'Electric Scooter', 'Sports', 'Commuter']
const FUEL_TYPES = ['Petrol', 'Electric', 'CNG']
const BRANDS = ['Honda', 'Bajaj', 'TVS', 'Hero', 'Royal Enfield', 'Yamaha', 'Ola Electric', 'Ather', 'Other']

const emptyForm = {
  name: '',
  brand: BRANDS[0],
  type: BIKE_TYPES[0],
  fuelType: FUEL_TYPES[0],
  pricePerDay: '',
  mileage: '',
  seats: 2,
  year: new Date().getFullYear(),
  description: '',
  image: '',
  features: '',
}

export default function Admin() {
  const { bikes, bookings, addBike, toggleBikeAvailability, showToast } = useApp()
  const [tab, setTab] = useState('bikes')
  const [showAddModal, setShowAddModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Required'
    if (!form.pricePerDay || isNaN(form.pricePerDay) || Number(form.pricePerDay) <= 0)
      errs.pricePerDay = 'Enter a valid price'
    if (!form.mileage.trim()) errs.mileage = 'Required'
    if (!form.description.trim()) errs.description = 'Required'
    return errs
  }

  const handleAddBike = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))

    const featuresArr = form.features
      ? form.features.split(',').map((s) => s.trim()).filter(Boolean)
      : []

    const bike = addBike({
      ...form,
      features: featuresArr,
      seats: Number(form.seats),
      year: Number(form.year),
      image: form.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
      color: '#f97316',
      rating: 4.5,
      reviews: 0,
    })

    showToast(`${bike.name} added to fleet! 🏍️`, 'success')
    setForm(emptyForm)
    setShowAddModal(false)
    setSaving(false)
  }

  const filteredBikes = useMemo(() => {
    if (!search) return bikes
    const q = search.toLowerCase()
    return bikes.filter(
      (b) => b.name.toLowerCase().includes(q) || b.brand.toLowerCase().includes(q) || b.type.toLowerCase().includes(q)
    )
  }, [bikes, search])

  // Analytics
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((s, b) => s + b.totalAmount, 0)

  const activeBookings = bookings.filter(
    (b) => deriveBookingStatus(b.startDate, b.endDate) === 'active' && b.status !== 'cancelled'
  )

  const enrichedBookings = bookings.map((bk) => ({
    ...bk,
    bike: bikes.find((b) => b.id === bk.bikeId),
    derivedStatus: bk.status === 'cancelled' ? 'cancelled' : deriveBookingStatus(bk.startDate, bk.endDate),
  })).sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt))

  const statCards = [
    { label: 'Total Fleet', value: bikes.length, icon: '🏍️', color: '#f97316' },
    { label: 'Available', value: bikes.filter((b) => b.available).length, icon: '✅', color: '#22d3a0' },
    { label: 'Total Bookings', value: bookings.length, icon: '📋', color: '#60a5fa' },
    { label: 'Revenue', value: formatCurrency(totalRevenue), icon: '💰', color: '#fbbf24' },
  ]

  const STATUS_META = {
    active: { label: 'Active', badge: 'badge-green' },
    upcoming: { label: 'Upcoming', badge: 'badge-blue' },
    completed: { label: 'Completed', badge: 'badge-orange' },
    cancelled: { label: 'Cancelled', badge: 'badge-red' },
  }

  return (
    <>
      <Toast />
      <div className="admin-page page-wrapper">
        <div className="container">

          {/* Header */}
          <Reveal style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-label">Admin Panel</div>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Fleet Management
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: 4 }}>
                  Manage bikes, view bookings, track revenue
                </p>
              </div>
              <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
                + Add Bike
              </button>
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
                    borderLeft: `3px solid ${s.color}`,
                    transition: 'all var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = `0 8px 24px ${s.color}18`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{s.icon}</div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Tabs */}
          <Reveal>
            <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, border: '1px solid var(--border)', width: 'fit-content' }}>
              {[
                { key: 'bikes', label: `🏍️ Bikes (${bikes.length})` },
                { key: 'bookings', label: `📋 Bookings (${bookings.length})` },
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

          {/* BIKES TAB */}
          {tab === 'bikes' && (
            <>
              {/* Search */}
              <Reveal>
                <div style={{ marginBottom: 24 }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search bikes by name, brand or type..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: 380 }}
                  />
                </div>
              </Reveal>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                {filteredBikes.map((bike, i) => (
                  <Reveal key={bike.id} delay={i * 50}>
                    <BikeCard bike={bike} showAdminControls />
                  </Reveal>
                ))}
              </div>

              {filteredBikes.length === 0 && (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                  No bikes match "{search}"
                </div>
              )}
            </>
          )}

          {/* BOOKINGS TAB */}
          {tab === 'bookings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {enrichedBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
                  No bookings yet
                </div>
              ) : (
                enrichedBookings.map((bk, i) => {
                  const meta = STATUS_META[bk.derivedStatus] || STATUS_META.completed
                  return (
                    <Reveal key={bk.id} delay={i * 40}>
                      <div
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-lg)',
                          padding: '18px 22px',
                          display: 'flex',
                          gap: 16,
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          transition: 'all var(--transition)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-hover)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border)'
                        }}
                      >
                        {/* Bike thumb */}
                        <div style={{ width: 72, height: 52, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                          {bk.bike && (
                            <img src={bk.bike.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => { e.target.style.display = 'none' }}
                            />
                          )}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: 140 }}>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                            {bk.bike?.name || 'Unknown Bike'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                            {formatDate(bk.startDate)} → {formatDate(bk.endDate)}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>
                            Booking #{bk.id}
                          </div>
                        </div>

                        <span className={`badge ${meta.badge}`}>{meta.label}</span>

                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', minWidth: 80, textAlign: 'right' }}>
                          {formatCurrency(bk.totalAmount)}
                        </div>
                      </div>
                    </Reveal>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Bike Modal */}
      <Modal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setForm(emptyForm); setErrors({}) }}
        title="Add New Bike"
        maxWidth={560}
      >
        <form onSubmit={handleAddBike} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Row 1 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Bike Name *</label>
              <input type="text" className="form-input" placeholder="Honda Activa 6G" value={form.name} onChange={set('name')} />
              {errors.name && <span style={{ fontSize: '0.75rem', color: 'var(--red)' }}>{errors.name}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Brand</label>
              <select className="form-input" value={form.brand} onChange={set('brand')}>
                {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input" value={form.type} onChange={set('type')}>
                {BIKE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <select className="form-input" value={form.fuelType} onChange={set('fuelType')}>
                {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Price / Day (₹) *</label>
              <input type="number" className="form-input" placeholder="299" value={form.pricePerDay} onChange={set('pricePerDay')} min="1" />
              {errors.pricePerDay && <span style={{ fontSize: '0.75rem', color: 'var(--red)' }}>{errors.pricePerDay}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Mileage *</label>
              <input type="text" className="form-input" placeholder="60 km/l" value={form.mileage} onChange={set('mileage')} />
              {errors.mileage && <span style={{ fontSize: '0.75rem', color: 'var(--red)' }}>{errors.mileage}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Seats</label>
              <select className="form-input" value={form.seats} onChange={set('seats')}>
                {[1, 2].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Year</label>
              <input type="number" className="form-input" value={form.year} onChange={set('year')} min="2010" max="2025" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Brief description of the bike..."
              value={form.description}
              onChange={set('description')}
              style={{ resize: 'vertical', minHeight: 80 }}
            />
            {errors.description && <span style={{ fontSize: '0.75rem', color: 'var(--red)' }}>{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Image URL (optional)</label>
            <input type="url" className="form-input" placeholder="https://..." value={form.image} onChange={set('image')} />
          </div>

          <div className="form-group">
            <label className="form-label">Features (comma-separated)</label>
            <input type="text" className="form-input" placeholder="GPS Tracking, USB Charging, ABS" value={form.features} onChange={set('features')} />
          </div>

          {/* Preview */}
          {form.image && (
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 12, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Image Preview</div>
              <img
                src={form.image}
                alt="preview"
                style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8 }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button
              type="button"
              onClick={() => { setShowAddModal(false); setForm(emptyForm); setErrors({}) }}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={saving}>
              {saving ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                  Adding...
                </span>
              ) : '+ Add to Fleet'}
            </button>
          </div>
        </form>

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          select.form-input option { background: #111118; }
        `}</style>
      </Modal>
    </>
  )
}
