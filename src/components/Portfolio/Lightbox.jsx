import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Lightbox.css'

export function Lightbox({ image, images, onClose, onNavigate }) {
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const currentIndex = images.findIndex(img => img?.id === image?.id)
  const minSwipeDistance = 50

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(images[currentIndex - 1])
    }
  }, [currentIndex, images, onNavigate])

  const goToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      onNavigate(images[currentIndex + 1])
    }
  }, [currentIndex, images, onNavigate])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!image) return
      
      switch (e.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          goToPrev()
          break
        case 'ArrowRight':
          goToNext()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [image, onClose, goToPrev, goToNext])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (image) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [image])

  // Touch handlers for swipe gestures
  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNext()
    }
    if (isRightSwipe) {
      goToPrev()
    }
  }

  return (
    <AnimatePresence>
      {image && (
        <motion.div
          className="lightbox"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          {/* Background */}
          <motion.div
            className="lightbox__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content */}
          <div
            className="lightbox__content"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={image.id}
                className="lightbox__image-wrapper"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <img
                  src={image.srcLarge}
                  alt={image.title}
                  className="lightbox__image"
                />
              </motion.div>
            </AnimatePresence>

            {/* Image Info */}
            <motion.div
              className="lightbox__info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="lightbox__category">{image.category}</span>
              <h3 className="lightbox__title">{image.title}</h3>
              <span className="lightbox__counter">
                {currentIndex + 1} / {images.length}
              </span>
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <motion.button
              className="lightbox__nav lightbox__nav--prev"
              onClick={(e) => {
                e.stopPropagation()
                goToPrev()
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </motion.button>
          )}

          {currentIndex < images.length - 1 && (
            <motion.button
              className="lightbox__nav lightbox__nav--next"
              onClick={(e) => {
                e.stopPropagation()
                goToNext()
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </motion.button>
          )}

          {/* Close Button */}
          <motion.button
            className="lightbox__close"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

