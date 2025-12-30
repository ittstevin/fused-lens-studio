import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '../../data/content'
import './Services.css'

gsap.registerPlugin(ScrollTrigger)

// Service Icons
const ServiceIcon = ({ type }) => {
  const icons = {
    portrait: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="32" cy="24" r="10" />
        <path d="M16 54c0-8.8 7.2-16 16-16s16 7.2 16 16" />
      </svg>
    ),
    wedding: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M32 12l4 8 8 1-6 5 2 8-8-4-8 4 2-8-6-5 8-1z" />
        <path d="M20 36c0 8 5 16 12 16s12-8 12-16" />
      </svg>
    ),
    commercial: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="12" y="16" width="40" height="32" rx="2" />
        <circle cx="32" cy="32" r="8" />
        <circle cx="32" cy="32" r="4" />
        <path d="M48 20h4M12 20h4" />
      </svg>
    ),
    art: (
      <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="8" y="12" width="48" height="40" rx="2" />
        <rect x="14" y="18" width="36" height="28" rx="1" />
        <path d="M14 38l10-8 8 6 14-12" />
        <circle cx="40" cy="26" r="4" />
      </svg>
    )
  }

  return icons[type] || icons.portrait
}

export function Services() {
  const [flippedCard, setFlippedCard] = useState(null)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [testimonials, setTestimonials] = useState([])
  const sectionRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    // Fetch testimonials
    fetch('/api/content/testimonials')
      .then(res => res.json())
      .then(data => setTestimonials(data))
      .catch(err => console.error('Failed to load testimonials:', err))
  }, [])

  // Staggered card animation
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean)
    
    gsap.fromTo(cards,
      { opacity: 0, y: 60, rotateX: -15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleCardClick = (id) => {
    setFlippedCard(flippedCard === id ? null : id)
  }

  return (
    <section id="services" className="services section section--dark" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Services</span>
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle">
            Comprehensive photography services tailored to capture your unique vision with excellence.
          </p>
        </motion.div>

        {/* Service Cards */}
        <div className="services__grid">
          {services.map((service, index) => (
            <div
              key={service.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`service-card ${flippedCard === service.id ? 'service-card--flipped' : ''}`}
              onClick={() => handleCardClick(service.id)}
              style={{ perspective: '1000px' }}
            >
              <div className="service-card__inner">
                {/* Front */}
                <div className="service-card__front">
                  <div className="service-card__icon">
                    <ServiceIcon type={service.icon} />
                  </div>
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__description">{service.description}</p>
                  <span className="service-card__hint">Click to learn more</span>
                </div>

                {/* Back */}
                <div className="service-card__back">
                  <h3 className="service-card__title">{service.title}</h3>
                  <ul className="service-card__features">
                    {service.features.map((feature, i) => (
                      <li key={i} className="service-card__feature">
                        <span className="service-card__feature-icon">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    className="service-card__cta"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          className="testimonials"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          <h3 className="testimonials__title">What Clients Say</h3>
          
          <div className="testimonials__slider">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                className="testimonial"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <blockquote className="testimonial__quote">
                  "{testimonials[activeTestimonial]?.content}"
                </blockquote>
                <div className="testimonial__author">
                  <img
                    src={testimonials[activeTestimonial]?.image}
                    alt={testimonials[activeTestimonial]?.name}
                    className="testimonial__avatar"
                  />
                  <div className="testimonial__info">
                    <span className="testimonial__name">{testimonials[activeTestimonial]?.name}</span>
                    <span className="testimonial__role">{testimonials[activeTestimonial]?.role}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="testimonials__dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`testimonials__dot ${index === activeTestimonial ? 'testimonials__dot--active' : ''}`}
                onClick={() => setActiveTestimonial(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

