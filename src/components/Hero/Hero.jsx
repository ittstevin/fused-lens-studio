import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { studioInfo as defaultStudioInfo } from '../../data/content'
import './Hero.css'

const API_URL = import.meta.env.DEV ? '/api' : 'http://localhost:3001/api'

export function Hero() {
  // Initialize with default data immediately
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(true)
  const [heroSlides, setHeroSlides] = useState([
    { id: 1, image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1920&q=90', title: 'Timeless', subtitle: 'Memories' },
    { id: 2, image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=90', title: 'Your Story', subtitle: 'Beautifully Told' }
  ])
  const [studioInfo, setStudioInfo] = useState({
    tagline: defaultStudioInfo.tagline,
    description: defaultStudioInfo.description
  })
  const heroRef = useRef(null)
  const imageRefs = useRef([])

  useEffect(() => {
    // Try to fetch updated data from API
    Promise.all([
      fetch(`${API_URL}/content/hero`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null)
        .then(data => {
          // Handle both formats: { slides: [...] } or [...]
          if (data?.slides && data.slides.length > 0) return data.slides
          if (Array.isArray(data) && data.length > 0) return data
          return null
        }),
      fetch(`${API_URL}/content/studio`)
        .then(res => res.ok ? res.json() : null)
        .catch(() => null)
    ]).then(([slides, studio]) => {
      if (slides && slides.length > 0) {
        setHeroSlides(slides)
      }
      if (studio && (studio.tagline || studio.description)) {
        setStudioInfo({
          tagline: studio.tagline || 'Timeless Memories',
          description: studio.description || 'Crafting visual stories that transcend time. Every frame, a masterpiece.'
        })
      }
    }).catch(err => {
      console.error('Failed to load hero data:', err)
      // Already have fallback data, so just log the error
    })
  }, [])

  // Preload images
  useEffect(() => {
    if (heroSlides.length === 0) return
    
    const loadImages = async () => {
      const promises = heroSlides.map((slide) => {
        return new Promise((resolve) => {
          const img = new Image()
          img.src = slide.image
          img.onload = resolve
          img.onerror = resolve
        })
      })
      
      await Promise.all(promises)
      setIsLoaded(true)
    }
    
    loadImages()
  }, [heroSlides])

  // Ken Burns effect on images
  useEffect(() => {
    if (!isLoaded || heroSlides.length === 0) return

    const currentImage = imageRefs.current[currentSlide]
    if (currentImage) {
      // Reset and animate Ken Burns
      gsap.set(currentImage, { scale: 1, x: 0, y: 0 })
      gsap.to(currentImage, {
        scale: 1.15,
        x: currentSlide % 2 === 0 ? '3%' : '-3%',
        y: currentSlide % 2 === 0 ? '-2%' : '2%',
        duration: 8,
        ease: 'none'
      })
    }
  }, [currentSlide, isLoaded, heroSlides.length])

  // Auto-advance slides
  useEffect(() => {
    if (heroSlides.length === 0 || !isLoaded) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [heroSlides.length, isLoaded])

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY
        const parallaxValue = scrollY * 0.4
        heroRef.current.style.transform = `translateY(${parallaxValue}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToPortfolio = () => {
    const portfolio = document.getElementById('portfolio')
    if (portfolio) {
      portfolio.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="home" className="hero" ref={heroRef}>
      {/* Background Slides */}
      <div className="hero__slides">
        {heroSlides.length > 0 ? (
          <AnimatePresence mode="wait">
            {heroSlides.map((slide, index) => (
              index === currentSlide && (
                <motion.div
                  key={slide.id}
                  className="hero__slide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img
                    ref={(el) => (imageRefs.current[index] = el)}
                    src={slide.image}
                    alt={`${slide.title} ${slide.subtitle}`}
                    className="hero__image"
                  />
                </motion.div>
              )
            ))}
          </AnimatePresence>
        ) : (
          <div className="hero__slide">
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-silver)'
            }}>
              Loading...
            </div>
          </div>
        )}
        
        {/* Gradient Overlays */}
        <div className="hero__overlay hero__overlay--gradient" />
        <div className="hero__overlay hero__overlay--vignette" />
      </div>

      {/* Content */}
      <div className="hero__content">
        <motion.div
          className="hero__text"
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {/* Studio Name */}
          {/* <motion.div
            className="hero__studio-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <span className="hero__studio-icon">◈</span>
            {studioInfo.name}
          </motion.div> */}

          {/* Animated Tagline - Simple version */}
          <motion.h1 
            className="hero__tagline"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {studioInfo.tagline}
          </motion.h1>

          <div className="hero__title-wrapper">
            <AnimatePresence mode="wait">
              <motion.h2
                key={currentSlide}
                className="hero__title"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="hero__title-line">{heroSlides[currentSlide].title}</span>
                <span className="hero__title-line hero__title-line--accent">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </motion.h2>
            </AnimatePresence>
          </div>

          <motion.p
            className="hero__description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {studioInfo.description}
          </motion.p>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <motion.button
              className="hero__btn hero__btn--primary"
              onClick={scrollToPortfolio}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>View Portfolio</span>
            </motion.button>
            <motion.a
              href="#contact"
              className="hero__btn hero__btn--outline"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get in Touch
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Slide Indicators */}
        <motion.div
          className="hero__indicators"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero__indicator ${index === currentSlide ? 'hero__indicator--active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <span className="hero__indicator-fill" />
            </button>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="hero__scroll"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
          onClick={scrollToPortfolio}
        >
          <span className="hero__scroll-text">Scroll</span>
          <motion.div
            className="hero__scroll-line"
            animate={{ scaleY: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* Decorative Elements */}
      <div className="hero__decorative">
        <motion.div
          className="hero__corner hero__corner--tl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2, duration: 1 }}
        />
        <motion.div
          className="hero__corner hero__corner--br"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
        />
      </div>
    </section>
  )
}
