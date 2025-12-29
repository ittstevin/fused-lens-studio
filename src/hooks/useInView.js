import { useState, useEffect, useRef } from 'react'

export function useInView(options = {}) {
  const ref = useRef(null)
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  
  const { threshold = 0.1, rootMargin = '0px', once = true } = options
  
  useEffect(() => {
    const element = ref.current
    if (!element) return
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsInView(inView)
        
        if (inView && !hasBeenInView) {
          setHasBeenInView(true)
          if (once) {
            observer.unobserve(element)
          }
        }
      },
      { threshold, rootMargin }
    )
    
    observer.observe(element)
    
    return () => observer.disconnect()
  }, [threshold, rootMargin, once, hasBeenInView])
  
  return { ref, isInView, hasBeenInView }
}

