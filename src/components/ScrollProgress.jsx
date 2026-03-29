import { useScrollProgress } from '../hooks/useScrollSpy'

export default function ScrollProgress() {
  const progress = useScrollProgress()

  return (
    /*
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        height: '3px',
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #f97316, #fb923c, #fbbf24)',
        transition: 'width 0.1s linear',
        boxShadow: '0 0 12px rgba(249, 115, 22, 0.6)',
        borderRadius: '0 2px 2px 0',
      }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />*/<></>
  )
}
