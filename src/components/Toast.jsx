import { useApp } from '../context/AppContext'

export default function Toast() {
  const { toast } = useApp()
  if (!toast) return null

  const icons = { success: '✓', error: '✕', info: '⚡' }
  const colors = { success: 'var(--green)', error: 'var(--red)', info: 'var(--accent)' }

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type}`}>
        <span style={{ color: colors[toast.type], fontWeight: 700, fontSize: '1rem' }}>
          {icons[toast.type]}
        </span>
        <span style={{ color: 'var(--text-primary)' }}>{toast.message}</span>
      </div>
    </div>
  )
}
