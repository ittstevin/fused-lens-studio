import { useState, useEffect } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? scrollTop / docHeight : 0
      setProgress(Math.min(scrollProgress, 1))
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])
  
  return progress
}

