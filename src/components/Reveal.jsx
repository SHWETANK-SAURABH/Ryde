import { useRef, useEffect, useState } from 'react'

/**
 * Reveal — wraps children and applies fade-in + upward motion
 * when the element enters the viewport.
 *
 * Props:
 *  delay      — CSS transition-delay in ms (e.g. 100, 200, 300)
 *  threshold  — IntersectionObserver threshold (0–1)
 *  className  — additional class names
 *  as         — element tag (default 'div')
 *  once       — only animate once (default true)
 */
export default function Reveal({
  children,
  delay = 0,
  threshold = 0.12,
  className = '',
  as: Tag = 'div',
  once = true,
  style = {},
  ...props
}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -48px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} ${className}`}
      style={{
        transitionDelay: delay ? `${delay}ms` : '0ms',
        ...style,
      }}
      {...props}
    >
      {children}
    </Tag>
  )
}
