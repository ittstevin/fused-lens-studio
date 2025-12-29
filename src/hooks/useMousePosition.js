import { useState, useEffect, useRef } from 'react'

export function useMousePosition(elementRef) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [normalizedPosition, setNormalizedPosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const element = elementRef?.current
    
    const handleMouseMove = (e) => {
      if (element) {
        const rect = element.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        
        setPosition({ x, y })
        setNormalizedPosition({
          x: (x / rect.width - 0.5) * 2,
          y: (y / rect.height - 0.5) * 2
        })
      } else {
        setPosition({ x: e.clientX, y: e.clientY })
        setNormalizedPosition({
          x: (e.clientX / window.innerWidth - 0.5) * 2,
          y: (e.clientY / window.innerHeight - 0.5) * 2
        })
      }
    }
    
    const target = element || window
    target.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => target.removeEventListener('mousemove', handleMouseMove)
  }, [elementRef])
  
  return { position, normalizedPosition }
}

