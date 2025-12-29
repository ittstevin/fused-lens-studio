import { useEffect, useRef } from 'react'
import './Effects.css'

export function FloatingParticles({ count = 30, color = 'rgba(201, 169, 98, 0.15)' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create particles
    const particles = []
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div')
      particle.className = 'particle'
      
      // Random properties
      const size = Math.random() * 4 + 1
      const x = Math.random() * 100
      const y = Math.random() * 100
      const duration = Math.random() * 20 + 15
      const delay = Math.random() * -20
      
      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}%;
        top: ${y}%;
        background: ${color};
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
      `
      
      container.appendChild(particle)
      particles.push(particle)
    }

    return () => {
      particles.forEach(p => p.remove())
    }
  }, [count, color])

  return <div ref={containerRef} className="floating-particles" />
}

