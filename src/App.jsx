import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import {
  Navigation,
  Hero,
  Portfolio,
  About,
  Services,
  Contact,
  Footer,
  FloatingParticles,
  CursorGlow
} from './components'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

function App() {
  useEffect(() => {
    // Initialize smooth scroll behavior
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse'
    })

    // Refresh ScrollTrigger after initial load
    const timeout = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)

    // Handle window resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  return (
    <div className="app" style={{ minHeight: '100vh', background: '#0a0a0a' }}>
      {/* Global Effects */}
      <FloatingParticles count={25} />
      <CursorGlow />
      
      <Navigation />
      
      <main>
        <Hero />
        <Portfolio />
        <About />
        <Services />
        <Contact />
      </main>
      
      <Footer />
    </div>
  )
}

export default App
