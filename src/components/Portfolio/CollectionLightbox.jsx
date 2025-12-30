import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './CollectionLightbox.css'

const API_URL = import.meta.env.DEV ? '/api' : 'http://localhost:3001/api'

export function CollectionLightbox({ collection, onClose }) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('photos') // photos, about, comments
  const [newComment, setNewComment] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [comments, setComments] = useState(collection?.comments || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const thumbnailsRef = useRef(null)

  const minSwipeDistance = 50

  const goToPrev = useCallback(() => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1)
    }
  }, [currentPhotoIndex])

  const goToNext = useCallback(() => {
    if (collection && currentPhotoIndex < collection.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1)
    }
  }, [currentPhotoIndex, collection])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!collection) return
      
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
  }, [collection, onClose, goToPrev, goToNext])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (collection) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [collection])

  // Scroll thumbnail into view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const thumbnail = thumbnailsRef.current.children[currentPhotoIndex]
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      }
    }
  }, [currentPhotoIndex])

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

    if (isLeftSwipe) goToNext()
    if (isRightSwipe) goToPrev()
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim()) return

    setIsSubmitting(true)
    
    try {
      // Try to post to backend first
      const response = await fetch(`${API_URL}/collections/${collection.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: authorName.trim(),
          text: newComment.trim()
        })
      })

      if (response.ok) {
        const savedComment = await response.json()
        setComments(prev => [...prev, savedComment])
      } else {
        // Fallback to local state if backend is not available
        const comment = {
          id: Date.now(),
          author: authorName.trim(),
          text: newComment.trim(),
          date: new Date().toISOString().split('T')[0]
        }
        setComments(prev => [...prev, comment])
      }
      
      setNewComment('')
      setAuthorName('')
    } catch (error) {
      // Fallback to local state if backend is not reachable
      const comment = {
        id: Date.now(),
        author: authorName.trim(),
        text: newComment.trim(),
        date: new Date().toISOString().split('T')[0]
      }
      setComments(prev => [...prev, comment])
      setNewComment('')
      setAuthorName('')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!collection) return null

  const currentPhoto = collection.photos[currentPhotoIndex]

  return (
    <AnimatePresence>
      <motion.div
        className="collection-lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Backdrop */}
        <motion.div
          className="collection-lightbox__backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Main Container */}
        <div className="collection-lightbox__container">
          {/* Close Button */}
          <motion.button
            className="collection-lightbox__close"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Left Side - Photo Viewer */}
          <div className="collection-lightbox__viewer">
            {/* Main Image */}
            <div
              className="collection-lightbox__main-image"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentPhoto.id}
                  src={currentPhoto.srcLarge}
                  alt={currentPhoto.caption}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>

              {/* Navigation Arrows */}
              {currentPhotoIndex > 0 && (
                <motion.button
                  className="collection-lightbox__nav collection-lightbox__nav--prev"
                  onClick={goToPrev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </motion.button>
              )}

              {currentPhotoIndex < collection.photos.length - 1 && (
                <motion.button
                  className="collection-lightbox__nav collection-lightbox__nav--next"
                  onClick={goToNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </motion.button>
              )}

              {/* Photo Caption */}
              <motion.div
                className="collection-lightbox__caption"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {currentPhoto.caption}
              </motion.div>
            </div>

            {/* Thumbnails */}
            <div className="collection-lightbox__thumbnails" ref={thumbnailsRef}>
              {collection.photos.map((photo, index) => (
                <motion.button
                  key={photo.id}
                  className={`collection-lightbox__thumbnail ${index === currentPhotoIndex ? 'collection-lightbox__thumbnail--active' : ''}`}
                  onClick={() => setCurrentPhotoIndex(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={photo.src} alt={photo.caption} />
                </motion.button>
              ))}
            </div>

            {/* Photo Counter */}
            <div className="collection-lightbox__counter">
              {currentPhotoIndex + 1} / {collection.photos.length}
            </div>
          </div>

          {/* Right Side - Info Panel */}
          <div className="collection-lightbox__panel">
            {/* Collection Header */}
            <div className="collection-lightbox__header">
              <span className="collection-lightbox__category">{collection.category}</span>
              <h2 className="collection-lightbox__title">{collection.title}</h2>
              <div className="collection-lightbox__meta">
                <span>{collection.date}</span>
                <span>•</span>
                <span>{collection.location}</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="collection-lightbox__tabs">
              <button
                className={`collection-lightbox__tab ${activeTab === 'photos' ? 'collection-lightbox__tab--active' : ''}`}
                onClick={() => setActiveTab('photos')}
              >
                Photos ({collection.photos.length})
              </button>
              <button
                className={`collection-lightbox__tab ${activeTab === 'about' ? 'collection-lightbox__tab--active' : ''}`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
              <button
                className={`collection-lightbox__tab ${activeTab === 'comments' ? 'collection-lightbox__tab--active' : ''}`}
                onClick={() => setActiveTab('comments')}
              >
                Comments ({comments.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="collection-lightbox__content">
              <AnimatePresence mode="wait">
                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <motion.div
                    key="photos"
                    className="collection-lightbox__photos-grid"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {collection.photos.map((photo, index) => (
                      <motion.div
                        key={photo.id}
                        className={`collection-lightbox__photo-item ${index === currentPhotoIndex ? 'collection-lightbox__photo-item--active' : ''}`}
                        onClick={() => setCurrentPhotoIndex(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <img src={photo.src} alt={photo.caption} />
                        <span>{photo.caption}</span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    className="collection-lightbox__about"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="collection-lightbox__description">
                      <h3>About This Project</h3>
                      <p>{collection.description}</p>
                    </div>

                    {collection.collaborators && collection.collaborators.length > 0 && (
                      <div className="collection-lightbox__collaborators">
                        <h3>Collaborators</h3>
                        <div className="collection-lightbox__collab-list">
                          {collection.collaborators.map((collab, index) => (
                            <div key={index} className="collection-lightbox__collab-item">
                              <div className="collection-lightbox__collab-avatar">
                                {collab.name.charAt(0)}
                              </div>
                              <div>
                                <span className="collection-lightbox__collab-name">{collab.name}</span>
                                <span className="collection-lightbox__collab-role">{collab.role}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="collection-lightbox__details">
                      <h3>Details</h3>
                      <dl>
                        <dt>Date</dt>
                        <dd>{collection.date}</dd>
                        <dt>Location</dt>
                        <dd>{collection.location}</dd>
                        <dt>Category</dt>
                        <dd>{collection.category}</dd>
                        <dt>Photos</dt>
                        <dd>{collection.photos.length} images</dd>
                      </dl>
                    </div>
                  </motion.div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                  <motion.div
                    key="comments"
                    className="collection-lightbox__comments"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {/* Comment Form */}
                    <form className="collection-lightbox__comment-form" onSubmit={handleAddComment}>
                      <input
                        type="text"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="Your name"
                        className="collection-lightbox__author-input"
                      />
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Leave a comment..."
                        rows={3}
                      />
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!newComment.trim() || !authorName.trim() || isSubmitting}
                      >
                        {isSubmitting ? 'Posting...' : 'Post Comment'}
                      </motion.button>
                    </form>

                    {/* Comments List */}
                    <div className="collection-lightbox__comments-list">
                      {comments.length === 0 ? (
                        <p className="collection-lightbox__no-comments">
                          No comments yet. Be the first to share your thoughts!
                        </p>
                      ) : (
                        comments.map((comment) => (
                          <motion.div
                            key={comment.id}
                            className="collection-lightbox__comment"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <div className="collection-lightbox__comment-header">
                              <div className="collection-lightbox__comment-avatar">
                                {comment.author.charAt(0)}
                              </div>
                              <div>
                                <span className="collection-lightbox__comment-author">{comment.author}</span>
                                <span className="collection-lightbox__comment-date">{comment.date}</span>
                              </div>
                            </div>
                            <p className="collection-lightbox__comment-text">{comment.text}</p>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

