import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * useNavbarEntrance – slide the navbar down from the top on mount.
 * @returns {React.RefObject} ref – attach to the <nav> element
 */
export function useNavbarEntrance() {
  const ref = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        y: -80,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        delay: 0.1,
      })
    })
    return () => ctx.revert()
  }, [])

  return ref
}
