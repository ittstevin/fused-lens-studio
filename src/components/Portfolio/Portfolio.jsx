import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { photoCollections, categories } from '../../data/images'
import { CollectionLightbox } from './CollectionLightbox'
import './Portfolio.css'

gsap.registerPlugin(ScrollTrigger)

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedCollection, setSelectedCollection] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const itemRefs = useRef([])

  const filteredCollections = activeCategory === 'all'
    ? photoCollections
    : photoCollections.filter(col => col.category === activeCategory)

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
  }, [filteredCollections])

  // Tilt effect on hover
  const handleMouseMove = (e, index) => {
    const item = itemRefs.current[index]
    if (!item) return

    const rect = item.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(item, {
      rotateY: x * 8,
      rotateX: -y * 8,
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
          <h2 className="section-title">Our Collections</h2>
          <p className="section-subtitle">
            Explore our curated photo collections. Each project tells a unique story through carefully crafted imagery.
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

        {/* Collections Grid */}
        <div className="portfolio__grid" ref={gridRef}>
          <AnimatePresence mode="popLayout">
            {filteredCollections.map((collection, index) => (
              <motion.article
                key={collection.id}
                ref={(el) => (itemRefs.current[index] = el)}
                className="portfolio__collection"
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseEnter={() => setHoveredId(collection.id)}
                onMouseLeave={() => handleMouseLeave(index)}
                onClick={() => setSelectedCollection(collection)}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="portfolio__collection-inner">
                  {/* Cover Image */}
                  <div className="portfolio__collection-cover">
                    <img
                      src={collection.coverImage}
                      alt={collection.title}
                      loading="lazy"
                    />
                    
                    {/* Photo count badge */}
                    <span className="portfolio__collection-count">
                      {collection.photos.length} Photos
                    </span>
                  </div>
                  
                  {/* Hover Overlay */}
                  <motion.div
                    className="portfolio__collection-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: hoveredId === collection.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Preview thumbnails */}
                    <div className="portfolio__collection-preview">
                      {collection.photos.slice(0, 3).map((photo, i) => (
                        <motion.div
                          key={photo.id}
                          className="portfolio__collection-thumb"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ 
                            opacity: hoveredId === collection.id ? 1 : 0, 
                            y: hoveredId === collection.id ? 0 : 20 
                          }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        >
                          <img src={photo.src} alt="" />
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      className="portfolio__collection-info"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ 
                        y: hoveredId === collection.id ? 0 : 20, 
                        opacity: hoveredId === collection.id ? 1 : 0 
                      }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <span className="portfolio__collection-category">{collection.category}</span>
                      <h3 className="portfolio__collection-title">{collection.title}</h3>
                      <p className="portfolio__collection-location">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        {collection.location}
                      </p>
                      <span className="portfolio__collection-view">
                        View Collection →
                      </span>
                    </motion.div>
                  </motion.div>

                  {/* Shine effect */}
                  <motion.div
                    className="portfolio__collection-shine"
                    initial={{ opacity: 0, x: '-100%' }}
                    animate={{ 
                      opacity: hoveredId === collection.id ? 0.15 : 0,
                      x: hoveredId === collection.id ? '100%' : '-100%'
                    }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                {/* Collection Meta (always visible) */}
                <div className="portfolio__collection-meta">
                  <span className="portfolio__collection-date">{collection.date}</span>
                  <h3 className="portfolio__collection-name">{collection.title}</h3>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Collection Lightbox */}
      {selectedCollection && (
        <CollectionLightbox
          collection={selectedCollection}
          onClose={() => setSelectedCollection(null)}
        />
      )}
    </section>
  )
}
