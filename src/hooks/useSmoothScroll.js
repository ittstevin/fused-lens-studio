import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useSmoothScroll() {
  const scrollRef = useRef(null)
  
  useEffect(() => {
    // Refresh ScrollTrigger on load and resize
    ScrollTrigger.refresh()
    
    const handleResize = () => {
      ScrollTrigger.refresh()
    }
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])
  
  return scrollRef
}

export function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.scrollY - headerOffset
    
    gsap.to(window, {
      duration: 1.2,
      scrollTo: { y: offsetPosition, autoKill: false },
      ease: 'power3.inOut'
    })
  }
}

