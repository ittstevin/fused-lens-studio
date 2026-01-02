import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './admin.css'

const API_URL = 'http://localhost:3001/api'

// Helper function to convert Google Drive link to direct image URL
const convertGoogleDriveLink = (url) => {
  if (!url) return ''
  
  // If it's already a direct image URL, return as is
  if (url.includes('drive.google.com/uc?') || url.includes('lh3.googleusercontent.com')) {
    return url
  }
  
  // Convert Google Drive sharing link to direct image URL
  // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileIdMatch) {
    const fileId = fileIdMatch[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  
  // Format: https://drive.google.com/open?id=FILE_ID
  const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
  if (openIdMatch) {
    const fileId = openIdMatch[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }
  
  return url
}

// Login Component
function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      const text = await res.text()
      if (!text) {
        throw new Error('Server returned empty response. Make sure the backend is running on port 3001.')
      }

      let data
      try {
        data = JSON.parse(text)
      } catch (parseError) {
        throw new Error('Invalid server response. Make sure the backend is running.')
      }

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('adminToken', data.token)
      onLogin(data.token)
    } catch (err) {
      if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to server. Make sure the backend is running: cd server && node index.js')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <motion.div
        className="admin-login__card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="admin-login__header">
          <img src="/camlogo.png" alt="Fused Lens Studio" className="admin-login__icon" />
          <h1>Fused Lens Studio</h1>
          <p>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login__form">
          <div className="admin-input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="admin-input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          {error && <div className="admin-error">{error}</div>}

          <button type="submit" className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="admin-login__hint">Default: admin / admin123</p>
      </motion.div>
    </div>
  )
}

// Overview Component
function Overview({ data }) {
  return (
    <div className="admin-overview">
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <h3>{data.contacts?.length || 0}</h3>
          <p>Contact Messages</p>
        </div>
        <div className="admin-stat-card">
          <h3>{data.comments?.length || 0}</h3>
          <p>Photo Comments</p>
        </div>
        <div className="admin-stat-card">
          <h3>{data.photos?.photos?.length || 0}</h3>
          <p>Portfolio Photos</p>
        </div>
        <div className="admin-stat-card">
          <h3>{data.testimonials?.length || 0}</h3>
          <p>Testimonials</p>
        </div>
        <div className="admin-stat-card">
          <h3>{data.collaborators?.length || 0}</h3>
          <p>Team Members</p>
        </div>
        <div className="admin-stat-card">
          <h3>{data.content?.services?.length || 0}</h3>
          <p>Services</p>
        </div>
      </div>

      <div className="admin-recent-activity">
        <h2>Recent Activity</h2>
        <div className="admin-activity-list">
          {data.contacts?.slice(0, 5).map(contact => (
            <div key={contact.id} className="admin-activity-item">
              <span>New contact from {contact.name}</span>
              <time>{new Date(contact.submittedAt).toLocaleDateString()}</time>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Studio Editor Component
function StudioEditor({ data, onSave, saving }) {
  const [formData, setFormData] = useState(data || {})

  useEffect(() => {
    setFormData(data || {})
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h2>Studio Information</h2>
          <p>Update your studio details and contact information</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-grid">
        <div className="admin-input-group">
          <label>Studio Name</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="admin-input-group">
          <label>Tagline</label>
          <input
            type="text"
            value={formData.tagline || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
          />
        </div>

        <div className="admin-input-group admin-input-group--full">
          <label>Description</label>
          <textarea
            value={formData.description || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="admin-input-group">
          <label>Location</label>
          <input
            type="text"
            value={formData.location || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
          />
        </div>

        <div className="admin-input-group">
          <label>Address</label>
          <input
            type="text"
            value={formData.address || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>

        <div className="admin-input-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="admin-input-group">
          <label>Phone</label>
          <input
            type="text"
            value={formData.phone || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        <div className="admin-input-group">
          <label>WhatsApp</label>
          <input
            type="text"
            value={formData.whatsapp || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
          />
        </div>
      </div>

        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Studio Info'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Hero Editor Component
function HeroEditor({ data, onSave, saving }) {
  const [slides, setSlides] = useState(data || [])

  useEffect(() => {
    setSlides(data || [])
  }, [data])

  const addSlide = () => {
    setSlides(prev => [...prev, {
      id: Date.now(),
      title: '',
      subtitle: '',
      image: ''
    }])
  }

  const updateSlide = (index, field, value) => {
    setSlides(prev => prev.map((slide, i) => {
      if (i === index) {
        const updated = { ...slide, [field]: value }
        // Auto-convert Google Drive links when pasted
        if (field === 'image' && value.includes('drive.google.com')) {
          updated.image = convertGoogleDriveLink(value)
        }
        return updated
      }
      return slide
    }))
  }

  const removeSlide = (index) => {
    setSlides(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(slides)
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Hero Slides</h2>
            <p>Add slides for the homepage hero section</p>
          </div>
          <button type="button" className="admin-btn admin-btn--secondary" onClick={addSlide}>
            + Add Slide
          </button>
        </div>
      </div>

      {slides.length === 0 ? (
        <div className="admin-empty">
          <span>🎬</span>
          <p>No slides yet. Click "Add Slide" to get started.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {slides.map((slide, index) => (
            <div key={slide.id} className="admin-card">
              <div className="admin-card__header">
                <h4>Slide {index + 1}</h4>
                <button
                  type="button"
                  className="admin-btn admin-btn--danger admin-btn--small"
                  onClick={() => removeSlide(index)}
                >
                  Remove
                </button>
              </div>

              <div className="admin-grid">
                <div className="admin-input-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={slide.title}
                    onChange={(e) => updateSlide(index, 'title', e.target.value)}
                    required
                  />
                </div>

                <div className="admin-input-group">
                  <label>Subtitle</label>
                  <input
                    type="text"
                    value={slide.subtitle}
                    onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                  />
                </div>

                <div className="admin-input-group admin-input-group--full">
                  <label>Google Drive Link or Image URL</label>
                  <input
                    type="url"
                    value={slide.image}
                    onChange={(e) => updateSlide(index, 'image', e.target.value)}
                    placeholder="Paste Google Drive link or image URL"
                    required
                  />
                  <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Paste your Google Drive sharing link - it will be converted automatically
                  </small>
                </div>
              </div>

              {slide.image && (
                <div className="admin-image-preview">
                  <img src={slide.image} alt={slide.title} onError={(e) => {
                    e.target.style.opacity = '0.5'
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="admin-actions">
        <button type="button" className="admin-btn admin-btn--primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Hero Slides'}
        </button>
      </div>
    </div>
  )
}

// About Editor Component
function AboutEditor({ data, onSave, saving }) {
  const [formData, setFormData] = useState(data || {})

  useEffect(() => {
    setFormData(data || {})
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h2>About Page Content</h2>
          <p>Update the about section content</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-grid">
          <div className="admin-input-group admin-input-group--full">
            <label>Title</label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="admin-input-group admin-input-group--full">
            <label>Content</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={6}
            />
          </div>

          <div className="admin-input-group admin-input-group--full">
            <label>Story</label>
            <textarea
              value={formData.story || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, story: e.target.value }))}
              rows={6}
            />
          </div>

          <div className="admin-input-group admin-input-group--full">
            <label>Values (one per line)</label>
            <textarea
              value={formData.values?.join('\n') || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                values: e.target.value.split('\n').filter(v => v.trim())
              }))}
              rows={4}
              placeholder="Creativity&#10;Excellence&#10;Innovation"
            />
          </div>
        </div>

        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save About Content'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Services Editor Component
function ServicesEditor({ data, onSave, saving }) {
  const [services, setServices] = useState(data || [])

  useEffect(() => {
    setServices(data || [])
  }, [data])

  const addService = () => {
    setServices(prev => [...prev, {
      id: Date.now(),
      title: '',
      description: ''
    }])
  }

  const updateService = (index, field, value) => {
    setServices(prev => prev.map((service, i) =>
      i === index ? { ...service, [field]: value } : service
    ))
  }

  const removeService = (index) => {
    setServices(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(services)
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Services</h2>
            <p>Manage your photography services</p>
          </div>
          <button type="button" className="admin-btn admin-btn--secondary" onClick={addService}>
            + Add Service
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>

      {services.map((service, index) => (
        <div key={service.id} className="admin-card">
          <div className="admin-card__header">
            <h4>Service {index + 1}</h4>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => removeService(index)}
            >
              Remove
            </button>
          </div>

          <div className="admin-grid">
            <div className="admin-input-group admin-input-group--full">
              <label>Title</label>
              <input
                type="text"
                value={service.title}
                onChange={(e) => updateService(index, 'title', e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group admin-input-group--full">
              <label>Description</label>
              <textarea
                value={service.description}
                onChange={(e) => updateService(index, 'description', e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>
        </div>
      ))}

        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Services'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Testimonials Editor Component
function TestimonialsEditor({ data, onSave, saving }) {
  const [testimonials, setTestimonials] = useState(data || [])

  useEffect(() => {
    setTestimonials(data || [])
  }, [data])

  const addTestimonial = () => {
    setTestimonials(prev => [...prev, {
      id: Date.now(),
      name: '',
      role: '',
      content: '',
      image: '',
      rating: 5
    }])
  }

  const updateTestimonial = (index, field, value) => {
    setTestimonials(prev => prev.map((testimonial, i) =>
      i === index ? { ...testimonial, [field]: value } : testimonial
    ))
  }

  const removeTestimonial = (index) => {
    setTestimonials(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(testimonials)
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Testimonials</h2>
            <p>Manage client testimonials</p>
          </div>
          <button type="button" className="admin-btn admin-btn--secondary" onClick={addTestimonial}>
            + Add Testimonial
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>

      {testimonials.map((testimonial, index) => (
        <div key={testimonial.id} className="admin-card">
          <div className="admin-card__header">
            <h4>Testimonial {index + 1}</h4>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => removeTestimonial(index)}
            >
              Remove
            </button>
          </div>

          <div className="admin-grid">
            <div className="admin-input-group">
              <label>Name</label>
              <input
                type="text"
                value={testimonial.name}
                onChange={(e) => updateTestimonial(index, 'name', e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Role</label>
              <input
                type="text"
                value={testimonial.role}
                onChange={(e) => updateTestimonial(index, 'role', e.target.value)}
              />
            </div>

            <div className="admin-input-group">
              <label>Rating (1-5)</label>
              <input
                type="number"
                min="1"
                max="5"
                value={testimonial.rating}
                onChange={(e) => updateTestimonial(index, 'rating', parseInt(e.target.value))}
              />
            </div>

            <div className="admin-input-group">
              <label>Image URL</label>
              <input
                type="url"
                value={testimonial.image}
                onChange={(e) => updateTestimonial(index, 'image', e.target.value)}
              />
            </div>

            <div className="admin-input-group admin-input-group--full">
              <label>Content</label>
              <textarea
                value={testimonial.content}
                onChange={(e) => updateTestimonial(index, 'content', e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>

          {testimonial.image && (
            <div className="admin-image-preview">
              <img src={testimonial.image} alt={testimonial.name} />
            </div>
          )}
        </div>
      ))}

        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Testimonials'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Collaborators Editor Component
function CollaboratorsEditor({ data, onSave, saving }) {
  const [collaborators, setCollaborators] = useState(data || [])

  useEffect(() => {
    setCollaborators(data || [])
  }, [data])

  const addCollaborator = () => {
    setCollaborators(prev => [...prev, {
      id: Date.now(),
      name: '',
      role: '',
      bio: '',
      image: '',
      social: {
        instagram: '',
        linkedin: '',
        behance: ''
      }
    }])
  }

  const updateCollaborator = (index, field, value) => {
    setCollaborators(prev => prev.map((collaborator, i) =>
      i === index ? { ...collaborator, [field]: value } : collaborator
    ))
  }

  const updateSocial = (index, platform, value) => {
    setCollaborators(prev => prev.map((collaborator, i) =>
      i === index ? {
        ...collaborator,
        social: { ...collaborator.social, [platform]: value }
      } : collaborator
    ))
  }

  const removeCollaborator = (index) => {
    setCollaborators(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(collaborators)
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Team Members</h2>
            <p>Manage your team and collaborators</p>
          </div>
          <button type="button" className="admin-btn admin-btn--secondary" onClick={addCollaborator}>
            + Add Member
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>

      {collaborators.map((collaborator, index) => (
        <div key={collaborator.id} className="admin-card">
          <div className="admin-card__header">
            <h4>Member {index + 1}</h4>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => removeCollaborator(index)}
            >
              Remove
            </button>
          </div>

          <div className="admin-grid">
            <div className="admin-input-group">
              <label>Name</label>
              <input
                type="text"
                value={collaborator.name}
                onChange={(e) => updateCollaborator(index, 'name', e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Role</label>
              <input
                type="text"
                value={collaborator.role}
                onChange={(e) => updateCollaborator(index, 'role', e.target.value)}
                required
              />
            </div>

            <div className="admin-input-group">
              <label>Image URL</label>
              <input
                type="url"
                value={collaborator.image}
                onChange={(e) => updateCollaborator(index, 'image', e.target.value)}
              />
            </div>

            <div className="admin-input-group admin-input-group--full">
              <label>Bio</label>
              <textarea
                value={collaborator.bio}
                onChange={(e) => updateCollaborator(index, 'bio', e.target.value)}
                rows={3}
              />
            </div>

            <div className="admin-input-group">
              <label>Instagram</label>
              <input
                type="url"
                value={collaborator.social?.instagram || ''}
                onChange={(e) => updateSocial(index, 'instagram', e.target.value)}
              />
            </div>

            <div className="admin-input-group">
              <label>LinkedIn</label>
              <input
                type="url"
                value={collaborator.social?.linkedin || ''}
                onChange={(e) => updateSocial(index, 'linkedin', e.target.value)}
              />
            </div>

            <div className="admin-input-group">
              <label>Behance</label>
              <input
                type="url"
                value={collaborator.social?.behance || ''}
                onChange={(e) => updateSocial(index, 'behance', e.target.value)}
              />
            </div>
          </div>

          {collaborator.image && (
            <div className="admin-image-preview">
              <img src={collaborator.image} alt={collaborator.name} />
            </div>
          )}
        </div>
      ))}

        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Team Members'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Photos Editor Component
function PhotosEditor({ data, onSave, saving }) {
  const [photos, setPhotos] = useState(data || [])

  useEffect(() => {
    setPhotos(data || [])
  }, [data])

  const addPhoto = () => {
    setPhotos(prev => [...prev, {
      id: Date.now(),
      title: '',
      category: '',
      src: '',
      description: ''
    }])
  }

  const updatePhoto = (index, field, value) => {
    setPhotos(prev => prev.map((photo, i) => {
      if (i === index) {
        const updated = { ...photo, [field]: value }
        // Auto-convert Google Drive links when pasted
        if (field === 'src' && value.includes('drive.google.com')) {
          updated.src = convertGoogleDriveLink(value)
        }
        return updated
      }
      return photo
    }))
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(photos)
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Portfolio Photos</h2>
            <p>Add photos by pasting Google Drive links or direct image URLs</p>
          </div>
          <button type="button" className="admin-btn admin-btn--secondary" onClick={addPhoto}>
            + Add Photo
          </button>
        </div>
      </div>

      {photos.length === 0 ? (
        <div className="admin-empty">
          <span>📷</span>
          <p>No photos yet. Click "Add Photo" to get started.</p>
        </div>
      ) : (
        <div className="admin-photos-list">
          {photos.map((photo, index) => (
            <div key={photo.id} className="admin-photo-item">
              <div className="admin-photo-item__preview">
                {photo.src ? (
                  <img src={photo.src} alt={photo.title || 'Photo'} onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.nextSibling.style.display = 'flex'
                  }} />
                  <div className="admin-photo-item__error" style={{ display: 'none' }}>
                    <span>⚠️</span>
                    <p>Image failed to load</p>
                  </div>
                ) : (
                  <div className="admin-photo-item__placeholder">
                    <span>📷</span>
                    <p>No image</p>
                  </div>
                )}
              </div>

              <div className="admin-photo-item__form">
                <div className="admin-grid">
                  <div className="admin-input-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={photo.title}
                      onChange={(e) => updatePhoto(index, 'title', e.target.value)}
                      placeholder="Photo title"
                    />
                  </div>

                  <div className="admin-input-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={photo.category}
                      onChange={(e) => updatePhoto(index, 'category', e.target.value)}
                      placeholder="e.g., Wedding, Portrait"
                    />
                  </div>

                  <div className="admin-input-group admin-input-group--full">
                    <label>Google Drive Link or Image URL</label>
                    <input
                      type="url"
                      value={photo.src}
                      onChange={(e) => updatePhoto(index, 'src', e.target.value)}
                      placeholder="Paste Google Drive link or image URL"
                    />
                    <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                      Paste your Google Drive sharing link - it will be converted automatically
                    </small>
                  </div>

                  <div className="admin-input-group admin-input-group--full">
                    <label>Description (Optional)</label>
                    <textarea
                      value={photo.description}
                      onChange={(e) => updatePhoto(index, 'description', e.target.value)}
                      rows={3}
                      placeholder="Photo description"
                    />
                  </div>
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="admin-btn admin-btn--danger admin-btn--small"
                    onClick={() => removePhoto(index)}
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="admin-actions">
        <button type="button" className="admin-btn admin-btn--secondary" onClick={() => setPhotos([])}>
          Clear All
        </button>
        <button type="button" className="admin-btn admin-btn--primary" onClick={handleSubmit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Photos'}
        </button>
      </div>
    </div>
  )
}

// Social Editor Component
function SocialEditor({ data, onSave, saving }) {
  const [social, setSocial] = useState(data || {})

  useEffect(() => {
    setSocial(data || {})
  }, [data])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(social)
  }

  const platforms = [
    { key: 'instagram', label: 'Instagram', icon: '📷' },
    { key: 'facebook', label: 'Facebook', icon: '👥' },
    { key: 'twitter', label: 'Twitter/X', icon: '🐦' },
    { key: 'linkedin', label: 'LinkedIn', icon: '💼' },
    { key: 'behance', label: 'Behance', icon: '🎨' },
    { key: 'youtube', label: 'YouTube', icon: '📺' },
    { key: 'tiktok', label: 'TikTok', icon: '🎵' },
    { key: 'website', label: 'Website', icon: '🌐' }
  ]

  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h2>Social Media Links</h2>
          <p>Add your social media profiles</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="admin-grid">
          {platforms.map(platform => (
            <div key={platform.key} className="admin-input-group">
              <label>
                <span>{platform.icon}</span>
                {platform.label}
              </label>
              <input
                type="url"
                value={social[platform.key] || ''}
                onChange={(e) => setSocial(prev => ({ ...prev, [platform.key]: e.target.value }))}
                placeholder={`https://${platform.key}.com/...`}
              />
            </div>
          ))}
        </div>

        <div className="admin-actions">
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Social Links'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Contact Editor Component
function ContactEditor({ data, onSave, saving }) {
  return <StudioEditor data={data} onSave={onSave} saving={saving} />
}

// Messages Viewer Component
function MessagesViewer({ data }) {
  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h2>Contact Messages</h2>
          <p>View and manage contact form submissions</p>
        </div>
      </div>
      <div className="admin-messages">
        {data?.length === 0 ? (
          <div className="admin-empty">
            <span>📭</span>
            <p>No contact messages yet</p>
          </div>
        ) : (
          data?.map(contact => (
            <div key={contact.id} className="admin-message-card">
              <div className="admin-message__header">
                <div className="admin-message__info">
                  <h3>{contact.name}</h3>
                  <p>{contact.email}</p>
                  {contact.phone && <p>{contact.phone}</p>}
                </div>
                <div className="admin-message__meta">
                  <span className={`admin-status admin-status--${contact.status || 'new'}`}>
                    {contact.status || 'New'}
                  </span>
                  <time>{new Date(contact.submittedAt).toLocaleString()}</time>
                </div>
              </div>

              {contact.service && (
                <div className="admin-message__service">
                  <strong>Service:</strong> {contact.service}
                </div>
              )}

              <div className="admin-message__content">
                <strong>Message:</strong>
                <p>{contact.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Comments Manager Component
function CommentsManager({ data, onApprove, onDelete }) {
  return (
    <div className="admin-section">
      <div className="admin-section__header">
        <div>
          <h2>Photo Comments</h2>
          <p>Manage comments on portfolio photos</p>
        </div>
      </div>
      <div className="admin-comments">
        {data?.length === 0 ? (
          <div className="admin-empty">
            <span>💭</span>
            <p>No comments yet</p>
          </div>
        ) : (
          data?.map(comment => (
            <div key={comment.id} className="admin-comment-card">
              <div className="admin-comment__header">
                <div className="admin-comment__info">
                  <h4>{comment.name}</h4>
                  <p>{comment.email}</p>
                  <small>Photo ID: {comment.photoId}</small>
                </div>
                <div className="admin-comment__status">
                  <span className={`admin-status ${comment.approved ? 'admin-status--approved' : 'admin-status--pending'}`}>
                    {comment.approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
              </div>

              <div className="admin-comment__content">
                <p>{comment.comment}</p>
              </div>

              <div className="admin-comment__actions">
                {!comment.approved && (
                  <button
                    className="admin-btn admin-btn--success admin-btn--small"
                    onClick={() => onApprove(comment.id)}
                  >
                    Approve
                  </button>
                )}
                <button
                  className="admin-btn admin-btn--danger admin-btn--small"
                  onClick={() => onDelete(comment.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Main Dashboard Component
function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = async () => {
    try {
      const [
        contentRes,
        photosRes,
        contactsRes,
        testimonialsRes,
        collaboratorsRes,
        aboutRes,
        commentsRes
      ] = await Promise.all([
        fetch(`${API_URL}/content`),
        fetch(`${API_URL}/photos`),
        fetch(`${API_URL}/contact`, { headers: authHeaders }),
        fetch(`${API_URL}/content/testimonials`),
        fetch(`${API_URL}/content/collaborators`),
        fetch(`${API_URL}/content/about`),
        fetch(`${API_URL}/comments`, { headers: authHeaders })
      ])

      const newData = {}

      if (contentRes.ok) newData.content = await contentRes.json()
      if (photosRes.ok) newData.photos = await photosRes.json()
      if (contactsRes.ok) newData.contacts = await contactsRes.json()
      if (testimonialsRes.ok) newData.testimonials = await testimonialsRes.json()
      if (collaboratorsRes.ok) newData.collaborators = await collaboratorsRes.json()
      if (aboutRes.ok) newData.about = await aboutRes.json()
      if (commentsRes.ok) newData.comments = await commentsRes.json()

      setData(newData)
    } catch (error) {
      console.error('Failed to load data:', error)
      showMessage('Failed to load data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const saveSection = async (section, endpoint, dataToSave) => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(dataToSave)
      })
      if (res.ok) {
        showMessage(`${section} saved successfully!`)
        loadAllData() // Refresh data
      } else {
        showMessage(`Failed to save ${section}`, 'error')
      }
    } catch (error) {
      showMessage(`Failed to save ${section}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleApproveComment = async (commentId) => {
    try {
      const res = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ approved: true })
      })
      if (res.ok) {
        showMessage('Comment approved!')
        loadAllData()
      } else {
        showMessage('Failed to approve comment', 'error')
      }
    } catch (error) {
      showMessage('Failed to approve comment', 'error')
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return
    try {
      const res = await fetch(`${API_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: authHeaders
      })
      if (res.ok) {
        showMessage('Comment deleted!')
        loadAllData()
      } else {
        showMessage('Failed to delete comment', 'error')
      }
    } catch (error) {
      showMessage('Failed to delete comment', 'error')
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'studio', label: 'Studio Info', icon: '🏠' },
    { id: 'hero', label: 'Hero Section', icon: '🎬' },
    { id: 'about', label: 'About Page', icon: '📖' },
    { id: 'services', label: 'Services', icon: '💼' },
    { id: 'testimonials', label: 'Testimonials', icon: '💬' },
    { id: 'collaborators', label: 'Team', icon: '👥' },
    { id: 'photos', label: 'Portfolio', icon: '📷' },
    { id: 'social', label: 'Social Links', icon: '🔗' },
    { id: 'contact', label: 'Contact Info', icon: '📞' },
    { id: 'messages', label: 'Messages', icon: '💌' },
    { id: 'comments', label: 'Comments', icon: '💭' }
  ]

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <img src="/camlogo.png" alt="Fused Lens Studio" className="admin-sidebar__icon" />
          <span>Fused Lens</span>
        </div>

        <nav className="admin-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`admin-nav__item ${activeTab === tab.id ? 'admin-nav__item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={onLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>{tabs.find(t => t.id === activeTab)?.label}</h1>
        </header>

        <div className="admin-content">
          {/* Message */}
          <AnimatePresence>
            {message && (
              <motion.div
                className={`admin-message admin-message--${message.type}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overview Tab */}
          {activeTab === 'overview' && <Overview data={data} />}

          {/* Studio Info Tab */}
          {activeTab === 'studio' && data.content && (
            <StudioEditor
              data={data.content.studio}
              onSave={(studioData) => saveSection('Studio Info', '/content/studio', studioData)}
              saving={saving}
            />
          )}

          {/* Hero Section Tab */}
          {activeTab === 'hero' && data.content && (
            <HeroEditor
              data={data.content.heroSlides}
              onSave={(slides) => saveSection('Hero', '/content/hero', { slides })}
              saving={saving}
            />
          )}

          {/* About Tab */}
          {activeTab === 'about' && data.about && (
            <AboutEditor
              data={data.about}
              onSave={(aboutData) => saveSection('About', '/content/about', { about: aboutData })}
              saving={saving}
            />
          )}

          {/* Services Tab */}
          {activeTab === 'services' && data.content && (
            <ServicesEditor
              data={data.content.services}
              onSave={(services) => saveSection('Services', '/content/services', { services })}
              saving={saving}
            />
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && data.testimonials && (
            <TestimonialsEditor
              data={data.testimonials}
              onSave={(testimonials) => saveSection('Testimonials', '/content/testimonials', { testimonials })}
              saving={saving}
            />
          )}

          {/* Collaborators Tab */}
          {activeTab === 'collaborators' && data.collaborators && (
            <CollaboratorsEditor
              data={data.collaborators}
              onSave={(collaborators) => saveSection('Collaborators', '/content/collaborators', { collaborators })}
              saving={saving}
            />
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && data.photos && (
            <PhotosEditor
              data={data.photos.photos}
              onSave={(photos) => saveSection('Photos', '/photos', { photos })}
              saving={saving}
            />
          )}

          {/* Social Links Tab */}
          {activeTab === 'social' && data.content && (
            <SocialEditor
              data={data.content.social}
              onSave={(social) => saveSection('Social Links', '/content/social', social)}
              saving={saving}
            />
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && data.content && (
            <ContactEditor
              data={data.content.studio}
              onSave={(studioData) => saveSection('Contact Info', '/content/studio', studioData)}
              saving={saving}
            />
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && data.contacts && (
            <MessagesViewer data={data.contacts} />
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && data.comments && (
            <CommentsManager
              data={data.comments}
              onApprove={handleApproveComment}
              onDelete={handleDeleteComment}
            />
          )}
        </div>
      </main>
    </div>
  )
}

// Main Admin App
export default function AdminApp() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'))

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
  }

  if (!token) {
    return <Login onLogin={setToken} />
  }

  return <Dashboard token={token} onLogout={handleLogout} />
}
