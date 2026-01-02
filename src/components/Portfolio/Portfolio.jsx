import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolioImages, categories } from '../../data/images'
import { Lightbox } from './Lightbox'
import './Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const itemRefs = useRef([])

  const filteredImages = activeCategory === 'all'
    ? portfolioImages
    : portfolioImages.filter(img => img.category === activeCategory)

  // Scroll-triggered staggered animations
  useEffect(() => {
    const items = itemRefs.current.filter(Boolean)
    
    gsap.set(items, { opacity: 0, y: 60, scale: 0.95 })
    
    const animation = gsap.to(items, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: gridRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })

    return () => {
      animation.kill()
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [filteredImages])

  // Tilt effect on hover
  const handleMouseMove = (e, index) => {
    const item = itemRefs.current[index]
    if (!item) return

    const rect = item.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(item, {
      rotateY: x * 10,
      rotateX: -y * 10,
      transformPerspective: 1000,
      duration: 0.3,
      ease: 'power2.out'
    })
  }

  const handleMouseLeave = (index) => {
    const item = itemRefs.current[index]
    if (!item) return

    gsap.to(item, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: 'power2.out'
    })
    setHoveredId(null)
  }

  return (
    <section id="portfolio" className="portfolio section" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">Selected Works</h2>
          <p className="section-subtitle">
            A curated collection of our finest photography, showcasing our passion for visual storytelling.
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="portfolio__filters"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              className={`portfolio__filter ${activeCategory === category.id ? 'portfolio__filter--active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
              {activeCategory === category.id && (
                <motion.span
                  className="portfolio__filter-line"
                  layoutId="filterLine"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Masonry Grid */}
        <div className="portfolio__grid" ref={gridRef}>
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.article
                key={image.id}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`portfolio__item portfolio__item--${image.aspect}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseEnter={() => setHoveredId(image.id)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => setSelectedImage(image)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="portfolio__item-inner">
                  <img
                    src={image.src}
                    alt={image.title}
                    className="portfolio__image"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <motion.div
                    className="portfolio__overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === image.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div
                      className="portfolio__info"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: hoveredId === image.id ? 0 : 20, 
                        opacity: hoveredId === image.id ? 1 : 0 
                      }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <span className="portfolio__category">{image.category}</span>
                      <h3 className="portfolio__title">{image.title}</h3>
                      <span className="portfolio__view">View Project →</span>
                    </motion.div>
                  </motion.div>

                  {/* Shine effect */}
                  <motion.div
                    className="portfolio__shine"
                    initial={{ opacity: 0, x: '-100%' }}
                    animate={{ 
                      opacity: hoveredId === image.id ? 0.15 : 0,
                      x: hoveredId === image.id ? '100%' : '-100%'
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Lightbox */}
      <Lightbox
        image={selectedImage}
        images={filteredImages}
        onClose={() => setSelectedImage(null)}
        onNavigate={setSelectedImage}
      />
    </section>
  )
}

