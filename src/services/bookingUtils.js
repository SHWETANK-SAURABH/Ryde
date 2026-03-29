/**
 * Check if two date ranges overlap
 * @param {string} start1 - ISO date string
 * @param {string} end1 - ISO date string
 * @param {string} start2 - ISO date string
 * @param {string} end2 - ISO date string
 * @returns {boolean}
 */
export function datesOverlap(start1, end1, start2, end2) {
  const s1 = new Date(start1)
  const e1 = new Date(end1)
  const s2 = new Date(start2)
  const e2 = new Date(end2)
  // Overlap if start1 < end2 AND start2 < end1
  return s1 < e2 && s2 < e1
}

/**
 * Check if a bike has conflicting bookings for given dates
 * @param {string} bikeId
 * @param {string} startDate
 * @param {string} endDate
 * @param {Array} bookings - all bookings in system
 * @param {string|null} excludeBookingId - booking to exclude (for edits)
 * @returns {{ conflict: boolean, conflictingBooking: object|null }}
 */
export function checkBookingConflict(bikeId, startDate, endDate, bookings, excludeBookingId = null) {
  const activeStatuses = ['active', 'upcoming', 'confirmed']
  const conflictingBooking = bookings.find(
    (bk) =>
      bk.bikeId === bikeId &&
      bk.id !== excludeBookingId &&
      activeStatuses.includes(bk.status) &&
      datesOverlap(startDate, endDate, bk.startDate, bk.endDate)
  )
  return {
    conflict: Boolean(conflictingBooking),
    conflictingBooking: conflictingBooking || null,
  }
}

/**
 * Calculate total rental cost
 * @param {number} pricePerDay
 * @param {string} startDate
 * @param {string} endDate
 * @returns {number}
 */
export function calculateTotalCost(pricePerDay, startDate, endDate) {
  const msPerDay = 1000 * 60 * 60 * 24
  const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / msPerDay))
  return pricePerDay * days
}

/**
 * Get number of days between two dates
 */
export function getDayCount(startDate, endDate) {
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / msPerDay))
}

/**
 * Determine booking status based on dates
 * @param {string} startDate
 * @param {string} endDate
 * @returns {'active'|'upcoming'|'completed'}
 */
export function deriveBookingStatus(startDate, endDate) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (now > end) return 'completed'
  if (now >= start && now <= end) return 'active'
  return 'upcoming'
}

/**
 * Format date for display
 */
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Format currency INR
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Get today's date as ISO string (YYYY-MM-DD)
 */
export function todayISO() {
  return new Date().toISOString().split('T')[0]
}

/**
 * Add days to a date
 */
export function addDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

/**
 * Validate booking dates
 */
export function validateDates(startDate, endDate) {
  const errors = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (!startDate) errors.push('Start date is required')
  if (!endDate) errors.push('End date is required')
  if (start < today) errors.push('Start date cannot be in the past')
  if (end <= start) errors.push('End date must be after start date')
  if (getDayCount(startDate, endDate) > 365) errors.push('Booking cannot exceed 365 days')

  return { valid: errors.length === 0, errors }
}

/**
 * Generate unique booking ID
 */
export function generateBookingId() {
  return 'bk' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
}

/**
 * Sort bookings: active first, then upcoming, then completed
 */
export function sortBookings(bookings) {
  const order = { active: 0, upcoming: 1, completed: 2 }
  return [...bookings].sort((a, b) => {
    const aStatus = deriveBookingStatus(a.startDate, a.endDate)
    const bStatus = deriveBookingStatus(b.startDate, b.endDate)
    if (order[aStatus] !== order[bStatus]) return order[aStatus] - order[bStatus]
    return new Date(b.bookedAt) - new Date(a.bookedAt)
  })
}
