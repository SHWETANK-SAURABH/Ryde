import { createContext, useContext, useReducer, useCallback } from 'react'
import { BIKES, INITIAL_BOOKINGS, MOCK_USERS } from '../services/data'
import { generateBookingId, deriveBookingStatus } from '../services/bookingUtils'

const AppContext = createContext(null)

// ─── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  user: null,
  bikes: BIKES,
  bookings: INITIAL_BOOKINGS,
  toast: null,
}

// ─── Reducer ─────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload }

    case 'LOGOUT':
      return { ...state, user: null }

    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] }

    case 'CANCEL_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === action.payload ? { ...b, status: 'cancelled' } : b
        ),
      }

    case 'ADD_BIKE':
      return { ...state, bikes: [...state.bikes, action.payload] }

    case 'TOGGLE_BIKE_AVAILABILITY':
      return {
        ...state,
        bikes: state.bikes.map((b) =>
          b.id === action.payload ? { ...b, available: !b.available } : b
        ),
      }

    case 'DELETE_BIKE':
      return { ...state, bikes: state.bikes.filter((b) => b.id !== action.payload) }

    case 'UPDATE_BIKE':
      return {
        ...state,
        bikes: state.bikes.map((b) => (b.id === action.payload.id ? { ...b, ...action.payload } : b)),
      }

    case 'SHOW_TOAST':
      return { ...state, toast: action.payload }

    case 'HIDE_TOAST':
      return { ...state, toast: null }

    default:
      return state
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Auth
  const login = useCallback((email, password) => {
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (found) {
      dispatch({ type: 'LOGIN', payload: found })
      return { success: true, user: found }
    }
    return { success: false, error: 'Invalid email or password' }
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  // Bookings
  const addBooking = useCallback(({ bikeId, startDate, endDate, totalAmount }) => {
    const booking = {
      id: generateBookingId(),
      bikeId,
      userId: state.user?.id,
      startDate,
      endDate,
      status: deriveBookingStatus(startDate, endDate),
      totalAmount,
      bookedAt: new Date().toISOString(),
    }
    dispatch({ type: 'ADD_BOOKING', payload: booking })
    return booking
  }, [state.user])

  const cancelBooking = useCallback((bookingId) => {
    dispatch({ type: 'CANCEL_BOOKING', payload: bookingId })
  }, [])

  // Bikes (admin)
  const addBike = useCallback((bikeData) => {
    const bike = {
      id: 'b' + Date.now().toString(36),
      rating: 4.5,
      reviews: 0,
      available: true,
      ...bikeData,
      pricePerDay: Number(bikeData.pricePerDay),
    }
    dispatch({ type: 'ADD_BIKE', payload: bike })
    return bike
  }, [])

  const toggleBikeAvailability = useCallback((bikeId) => {
    dispatch({ type: 'TOGGLE_BIKE_AVAILABILITY', payload: bikeId })
  }, [])

  const deleteBike = useCallback((bikeId) => {
    dispatch({ type: 'DELETE_BIKE', payload: bikeId })
  }, [])

  // Toast notifications
  const showToast = useCallback((message, type = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type, id: Date.now() } })
    setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 4000)
  }, [])

  // Computed selectors
  const getUserBookings = useCallback(() => {
    return state.bookings.filter((b) => b.userId === state.user?.id)
  }, [state.bookings, state.user])

  const getBikeById = useCallback((id) => {
    return state.bikes.find((b) => b.id === id)
  }, [state.bikes])

  const getActiveBookingsForBike = useCallback((bikeId) => {
    return state.bookings.filter(
      (b) =>
        b.bikeId === bikeId &&
        ['active', 'upcoming'].includes(deriveBookingStatus(b.startDate, b.endDate)) &&
        b.status !== 'cancelled'
    )
  }, [state.bookings])

  const value = {
    // State
    user: state.user,
    bikes: state.bikes,
    bookings: state.bookings,
    toast: state.toast,
    // Auth
    login,
    logout,
    // Bookings
    addBooking,
    cancelBooking,
    getUserBookings,
    getActiveBookingsForBike,
    // Bikes
    addBike,
    toggleBikeAvailability,
    deleteBike,
    getBikeById,
    // UI
    showToast,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
