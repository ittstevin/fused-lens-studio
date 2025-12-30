import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './admin.css'

const API_URL = 'http://localhost:3001/api'

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
        throw new Error('Server returned empty response. Make sure the backend is running on port 3002.')
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
          <span className="admin-login__icon">◈</span>
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
  const stats = [
    { label: 'Contact Messages', value: data.contacts?.length || 0, icon: '💌', color: 'var(--admin-accent)' },
    { label: 'Photo Comments', value: data.comments?.length || 0, icon: '💭', color: 'var(--admin-success)' },
    { label: 'Portfolio Photos', value: data.photos?.photos?.length || 0, icon: '📷', color: '#8b5cf6' },
    { label: 'Testimonials', value: data.testimonials?.length || 0, icon: '💬', color: '#f59e0b' },
    { label: 'Team Members', value: data.collaborators?.length || 0, icon: '👥', color: '#ec4899' },
    { label: 'Services', value: data.content?.services?.length || 0, icon: '💼', color: '#06b6d4' }
  ]

  return (
    <motion.div 
      className="admin-overview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="admin-stats-grid">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            className="admin-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="admin-stat-card__icon" style={{ color: stat.color }}>
              {stat.icon}
            </div>
            <motion.h3
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.2, type: 'spring', stiffness: 200 }}
            >
              {stat.value}
            </motion.h3>
            <p>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        className="admin-recent-activity"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2>Recent Activity</h2>
        <div className="admin-activity-list">
          {data.contacts?.slice(0, 5).map((contact, index) => (
            <motion.div
              key={contact.id}
              className="admin-activity-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
              whileHover={{ x: 4, backgroundColor: 'rgba(201, 169, 98, 0.05)' }}
            >
              <span>New contact from {contact.name}</span>
              <time>{new Date(contact.submittedAt).toLocaleDateString()}</time>
            </motion.div>
          ))}
          {(!data.contacts || data.contacts.length === 0) && (
            <div className="admin-empty">
              <span>📭</span>
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
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
    <form onSubmit={handleSubmit} className="admin-form">
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
        <motion.button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={saving}
          whileHover={!saving ? { scale: 1.02, y: -2 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              Saving...
            </>
          ) : (
            'Save Studio Info'
          )}
        </motion.button>
      </div>
    </form>
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
    setSlides(prev => prev.map((slide, i) =>
      i === index ? { ...slide, [field]: value } : slide
    ))
  }

  const removeSlide = (index) => {
    setSlides(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(slides)
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-section-header">
        <h3>Hero Slides</h3>
        <motion.button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={addSlide}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Slide
        </motion.button>
      </div>

      {slides.map((slide, index) => (
        <motion.div
          key={slide.id}
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          layout
        >
          <div className="admin-card__header">
            <h4>Slide {index + 1}</h4>
            <motion.button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => removeSlide(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove
            </motion.button>
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
              <label>Image URL</label>
              <input
                type="url"
                value={slide.image}
                onChange={(e) => updateSlide(index, 'image', e.target.value)}
                required
              />
            </div>
          </div>

          {slide.image && (
            <motion.div
              className="admin-image-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={slide.image} alt={slide.title} />
            </motion.div>
          )}
        </motion.div>
      ))}

      <div className="admin-actions">
        <motion.button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={saving}
          whileHover={!saving ? { scale: 1.02, y: -2 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              Saving...
            </>
          ) : (
            'Save Hero Slides'
          )}
        </motion.button>
      </div>
    </form>
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
    <form onSubmit={handleSubmit} className="admin-form">
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
        <motion.button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={saving}
          whileHover={!saving ? { scale: 1.02, y: -2 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              Saving...
            </>
          ) : (
            'Save About Content'
          )}
        </motion.button>
      </div>
    </form>
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
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-section-header">
        <h3>Services</h3>
        <motion.button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={addService}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Service
        </motion.button>
      </div>

      {services.map((service, index) => (
        <motion.div
          key={service.id}
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          layout
        >
          <div className="admin-card__header">
            <h4>Service {index + 1}</h4>
            <motion.button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => removeService(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove
            </motion.button>
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
        </motion.div>
      ))}

      <div className="admin-actions">
        <motion.button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={saving}
          whileHover={!saving ? { scale: 1.02, y: -2 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              Saving...
            </>
          ) : (
            'Save Services'
          )}
        </motion.button>
      </div>
    </form>
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
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-section-header">
        <h3>Testimonials</h3>
        <motion.button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={addTestimonial}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Testimonial
        </motion.button>
      </div>

      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          layout
        >
          <div className="admin-card__header">
            <h4>Testimonial {index + 1}</h4>
            <motion.button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => removeTestimonial(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove
            </motion.button>
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
            <motion.div
              className="admin-image-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={testimonial.image} alt={testimonial.name} />
            </motion.div>
          )}
        </motion.div>
      ))}

      <div className="admin-actions">
        <motion.button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={saving}
          whileHover={!saving ? { scale: 1.02, y: -2 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              Saving...
            </>
          ) : (
            'Save Testimonials'
          )}
        </motion.button>
      </div>
    </form>
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
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-section-header">
        <h3>Team Members</h3>
        <motion.button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={addCollaborator}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Member
        </motion.button>
      </div>

      {collaborators.map((collaborator, index) => (
        <motion.div
          key={collaborator.id}
          className="admin-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          layout
        >
          <div className="admin-card__header">
            <h4>Member {index + 1}</h4>
            <motion.button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--small"
              onClick={() => removeCollaborator(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Remove
            </motion.button>
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
            <motion.div
              className="admin-image-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img src={collaborator.image} alt={collaborator.name} />
            </motion.div>
          )}
        </motion.div>
      ))}

      <div className="admin-actions">
        <motion.button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={saving}
          whileHover={!saving ? { scale: 1.02, y: -2 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              Saving...
            </>
          ) : (
            'Save Team Members'
          )}
        </motion.button>
      </div>
    </form>
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
    setPhotos(prev => prev.map((photo, i) =>
      i === index ? { ...photo, [field]: value } : photo
    ))
  }

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(photos)
  }

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div className="admin-section-header">
        <h3>Portfolio Photos</h3>
        <motion.button
          type="button"
          className="admin-btn admin-btn--secondary"
          onClick={addPhoto}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Photo
        </motion.button>
      </div>

      <div className="admin-photos-grid">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="admin-photo-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            layout
          >
            {photo.src && <img src={photo.src} alt={photo.title} />}

            <div className="admin-photo-card__content">
              <input
                type="text"
                placeholder="Title"
                value={photo.title}
                onChange={(e) => updatePhoto(index, 'title', e.target.value)}
              />

              <input
                type="text"
                placeholder="Category"
                value={photo.category}
                onChange={(e) => updatePhoto(index, 'category', e.target.value)}
              />

              <input
                type="url"
                placeholder="Image URL"
                value={photo.src}
                onChange={(e) => updatePhoto(index, 'src', e.target.value)}
              />

              <textarea
                placeholder="Description"
                value={photo.description}
                onChange={(e) => updatePhoto(index, 'description', e.target.value)}
                rows={2}
              />

              <motion.button
                type="button"
                className="admin-btn admin-btn--danger admin-btn--small"
                onClick={() => removePhoto(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Remove
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="admin-actions">
        <motion.button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={saving}
          whileHover={!saving ? { scale: 1.02, y: -2 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              Saving...
            </>
          ) : (
            'Save Photos'
          )}
        </motion.button>
      </div>
    </form>
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
    <form onSubmit={handleSubmit} className="admin-form">
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
        <motion.button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={saving}
          whileHover={!saving ? { scale: 1.02, y: -2 } : {}}
          whileTap={!saving ? { scale: 0.98 } : {}}
        >
          {saving ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ⏳
              </motion.span>
              Saving...
            </>
          ) : (
            'Save Social Links'
          )}
        </motion.button>
      </div>
    </form>
  )
}

// Contact Editor Component
function ContactEditor({ data, onSave, saving }) {
  return <StudioEditor data={data} onSave={onSave} saving={saving} />
}

// Messages Viewer Component
function MessagesViewer({ data }) {
  return (
    <div className="admin-messages">
      {data?.length === 0 ? (
        <div className="admin-empty">
          <span>📭</span>
          <p>No contact messages yet</p>
        </div>
      ) : (
        data?.map((contact, index) => (
          <motion.div
            key={contact.id}
            className="admin-message-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ x: 4 }}
          >
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
          </motion.div>
        ))
      )}
    </div>
  )
}

// Comments Manager Component
function CommentsManager({ data, onApprove, onDelete }) {
  return (
    <div className="admin-comments">
      {data?.length === 0 ? (
        <div className="admin-empty">
          <span>💭</span>
          <p>No comments yet</p>
        </div>
      ) : (
        data?.map((comment, index) => (
          <motion.div
            key={comment.id}
            className="admin-comment-card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ x: 4 }}
          >
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
                <motion.button
                  className="admin-btn admin-btn--success admin-btn--small"
                  onClick={() => onApprove(comment.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Approve
                </motion.button>
              )}
              <motion.button
                className="admin-btn admin-btn--danger admin-btn--small"
                onClick={() => onDelete(comment.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))
      )}
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
      <motion.div 
        className="admin-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="admin-loading__spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading admin panel...
        </motion.p>
      </motion.div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <span className="admin-sidebar__icon">◈</span>
          <span>Fused Lens</span>
        </div>

        <nav className="admin-nav">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              className={`admin-nav__item ${activeTab === tab.id ? 'admin-nav__item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
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
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                className={`admin-message admin-message--${message.type}`}
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                >
                  {message.type === 'success' ? '✓' : '✕'}
                </motion.span>
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Content with Smooth Transitions */}
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <Overview data={data} />
              </motion.div>
            )}

            {/* Studio Info Tab */}
            {activeTab === 'studio' && data.content && (
              <motion.div
                key="studio"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <StudioEditor
                  data={data.content.studio}
                  onSave={(studioData) => saveSection('Studio Info', '/content/studio', studioData)}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* Hero Section Tab */}
            {activeTab === 'hero' && data.content && (
              <motion.div
                key="hero"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <HeroEditor
                  data={data.content.heroSlides}
                  onSave={(slides) => saveSection('Hero', '/content/hero', { slides })}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && data.about && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <AboutEditor
                  data={data.about}
                  onSave={(aboutData) => saveSection('About', '/content/about', { about: aboutData })}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && data.content && (
              <motion.div
                key="services"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ServicesEditor
                  data={data.content.services}
                  onSave={(services) => saveSection('Services', '/content/services', { services })}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* Testimonials Tab */}
            {activeTab === 'testimonials' && data.testimonials && (
              <motion.div
                key="testimonials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <TestimonialsEditor
                  data={data.testimonials}
                  onSave={(testimonials) => saveSection('Testimonials', '/content/testimonials', { testimonials })}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* Collaborators Tab */}
            {activeTab === 'collaborators' && data.collaborators && (
              <motion.div
                key="collaborators"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <CollaboratorsEditor
                  data={data.collaborators}
                  onSave={(collaborators) => saveSection('Collaborators', '/content/collaborators', { collaborators })}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* Photos Tab */}
            {activeTab === 'photos' && data.photos && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <PhotosEditor
                  data={data.photos.photos}
                  onSave={(photos) => saveSection('Photos', '/photos', { photos })}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* Social Links Tab */}
            {activeTab === 'social' && data.content && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <SocialEditor
                  data={data.content.social}
                  onSave={(social) => saveSection('Social Links', '/content/social', social)}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* Contact Info Tab */}
            {activeTab === 'contact' && data.content && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <ContactEditor
                  data={data.content.studio}
                  onSave={(studioData) => saveSection('Contact Info', '/content/studio', studioData)}
                  saving={saving}
                />
              </motion.div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && data.contacts && (
              <motion.div
                key="messages"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <MessagesViewer data={data.contacts} />
              </motion.div>
            )}

            {/* Comments Tab */}
            {activeTab === 'comments' && data.comments && (
              <motion.div
                key="comments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <CommentsManager
                  data={data.comments}
                  onApprove={handleApproveComment}
                  onDelete={handleDeleteComment}
                />
              </motion.div>
            )}
          </AnimatePresence>
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
