import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './Effects.css'

export function CursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleMouseOver = (e) => {
      const target = e.target
      const isClickable = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('clickable') ||
        target.closest('.clickable')
      
      setIsHovering(isClickable)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null
  }

  return (
    <>
      {/* Main cursor glow */}
      <motion.div
        className="cursor-glow"
        animate={{
          x: position.x - 150,
          y: position.y - 150,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 1.5 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 15,
          mass: 0.1
        }}
      />
      
      {/* Cursor dot */}
      <motion.div
        className={`cursor-dot ${isHovering ? 'cursor-dot--hover' : ''}`}
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 2 : 1
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28
        }}
      />
    </>
  )
}

