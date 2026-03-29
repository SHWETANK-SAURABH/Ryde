import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * useScrollSpy — tracks which section is currently visible
 * @param {string[]} sectionIds - array of element IDs to observe
 * @param {object} options
 * @returns {string} activeSection - ID of the currently active section
 */
export function useScrollSpy(sectionIds, options = {}) {
  const { threshold = 0.3, offset = 80 } = options
  const [activeSection, setActiveSection] = useState(sectionIds[0] || '')
  const observerRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!sectionIds.length) return

    const handleIntersect = (entries) => {
      // Find the entry that is most visible
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

      if (visible.length > 0) {
        setActiveSection(visible[0].target.id)
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: `-${offset}px 0px -40% 0px`,
      threshold: [0, 0.1, 0.2, 0.3, 0.5],
    })

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observerRef.current.observe(el)
    })

    return () => {
      if (observerRef.current) observerRef.current.disconnect()
    }
  }, [sectionIds.join(','), offset])

  return activeSection
}

/**
 * useScrollProgress — tracks document scroll percentage (0-100)
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const el = document.documentElement
      const scrollTop = window.scrollY || el.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return progress
}

/**
 * useIntersectionReveal — returns a ref and whether element has been revealed
 */
export function useIntersectionReveal(options = {}) {
  const { threshold = 0.15, once = true } = options
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setRevealed(false)
        }
      },
      { threshold, rootMargin: '0px 0px -60px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once])

  return [ref, revealed]
}

/**
 * useSmoothScroll — returns a scroll-to-section function
 */
export function useSmoothScroll(offset = 80) {
  const scrollTo = useCallback(
    (id) => {
      const el = document.getElementById(id)
      if (!el) return
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: 'smooth' })
    },
    [offset]
  )
  return scrollTo
}
