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

      // Check if response is ok before parsing JSON
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

// Dashboard Component
function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('studio')
  const [content, setContent] = useState(null)
  const [photos, setPhotos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [contentRes, photosRes] = await Promise.all([
        fetch(`${API_URL}/content`),
        fetch(`${API_URL}/photos`)
      ])

      if (contentRes.ok) {
        setContent(await contentRes.json())
      }
      if (photosRes.ok) {
        setPhotos(await photosRes.json())
      }
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 3000)
  }

  const saveStudio = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/content/studio`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(content.studio)
      })
      if (res.ok) {
        showMessage('Studio info saved!')
      } else {
        showMessage('Failed to save', 'error')
      }
    } catch (error) {
      showMessage('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const saveSocial = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/content/social`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(content.social)
      })
      if (res.ok) {
        showMessage('Social links saved!')
      } else {
        showMessage('Failed to save', 'error')
      }
    } catch (error) {
      showMessage('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const saveMission = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/content/mission`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ mission: content.mission })
      })
      if (res.ok) {
        showMessage('Mission statement saved!')
      } else {
        showMessage('Failed to save', 'error')
      }
    } catch (error) {
      showMessage('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const saveHero = async () => {
    setSaving(true)
    try {
      const res = await fetch(`${API_URL}/content/hero`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ slides: content.heroSlides })
      })
      if (res.ok) {
        showMessage('Hero slides saved!')
      } else {
        showMessage('Failed to save', 'error')
      }
    } catch (error) {
      showMessage('Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  const deletePhoto = async (id) => {
    if (!confirm('Delete this photo?')) return
    
    try {
      const res = await fetch(`${API_URL}/photos/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      })
      if (res.ok) {
        setPhotos(prev => ({
          ...prev,
          photos: prev.photos.filter(p => p.id !== id)
        }))
        showMessage('Photo deleted!')
      } else {
        showMessage('Failed to delete', 'error')
      }
    } catch (error) {
      showMessage('Failed to delete', 'error')
    }
  }

  if (loading) {
    return <div className="admin-loading">Loading...</div>
  }

  const tabs = [
    { id: 'studio', label: 'Studio Info', icon: '🏠' },
    { id: 'social', label: 'Social Links', icon: '🔗' },
    { id: 'hero', label: 'Hero Section', icon: '🎬' },
    { id: 'photos', label: 'Photos', icon: '📷' },
    { id: 'services', label: 'Services', icon: '💼' }
  ]

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
          
          <AnimatePresence>
            {message && (
              <motion.div
                className={`admin-message admin-message--${message.type}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        <div className="admin-content">
          {/* Studio Info */}
          {activeTab === 'studio' && content && (
            <div className="admin-section">
              <div className="admin-grid">
                <div className="admin-input-group">
                  <label>Studio Name</label>
                  <input
                    type="text"
                    value={content.studio.name}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      studio: { ...prev.studio, name: e.target.value }
                    }))}
                  />
                </div>

                <div className="admin-input-group">
                  <label>Tagline</label>
                  <input
                    type="text"
                    value={content.studio.tagline}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      studio: { ...prev.studio, tagline: e.target.value }
                    }))}
                  />
                </div>

                <div className="admin-input-group admin-input-group--full">
                  <label>Description</label>
                  <textarea
                    value={content.studio.description}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      studio: { ...prev.studio, description: e.target.value }
                    }))}
                    rows={3}
                  />
                </div>

                <div className="admin-input-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={content.studio.location}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      studio: { ...prev.studio, location: e.target.value }
                    }))}
                  />
                </div>

                <div className="admin-input-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={content.studio.address}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      studio: { ...prev.studio, address: e.target.value }
                    }))}
                  />
                </div>

                <div className="admin-input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={content.studio.email}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      studio: { ...prev.studio, email: e.target.value }
                    }))}
                  />
                </div>

                <div className="admin-input-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    value={content.studio.phone}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      studio: { ...prev.studio, phone: e.target.value }
                    }))}
                  />
                </div>

                <div className="admin-input-group">
                  <label>WhatsApp</label>
                  <input
                    type="text"
                    value={content.studio.whatsapp}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      studio: { ...prev.studio, whatsapp: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="admin-input-group admin-input-group--full">
                <label>Mission Statement</label>
                <textarea
                  value={content.mission}
                  onChange={(e) => setContent(prev => ({
                    ...prev,
                    mission: e.target.value
                  }))}
                  rows={5}
                />
              </div>

              <div className="admin-actions">
                <button 
                  className="admin-btn admin-btn--primary" 
                  onClick={() => { saveStudio(); saveMission(); }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          )}

          {/* Social Links */}
          {activeTab === 'social' && content && (
            <div className="admin-section">
              <div className="admin-grid">
                {Object.entries(content.social).map(([platform, url]) => (
                  <div key={platform} className="admin-input-group">
                    <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}</label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setContent(prev => ({
                        ...prev,
                        social: { ...prev.social, [platform]: e.target.value }
                      }))}
                    />
                  </div>
                ))}
              </div>

              <div className="admin-actions">
                <button 
                  className="admin-btn admin-btn--primary" 
                  onClick={saveSocial}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Social Links'}
                </button>
              </div>
            </div>
          )}

          {/* Hero Section */}
          {activeTab === 'hero' && content && (
            <div className="admin-section">
              <p className="admin-hint">Manage hero slider images and text</p>
              
              {content.heroSlides.map((slide, index) => (
                <div key={slide.id} className="admin-card">
                  <div className="admin-card__preview">
                    <img src={slide.image} alt={slide.title} />
                  </div>
                  <div className="admin-card__content">
                    <div className="admin-grid">
                      <div className="admin-input-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const updated = [...content.heroSlides]
                            updated[index].title = e.target.value
                            setContent(prev => ({ ...prev, heroSlides: updated }))
                          }}
                        />
                      </div>
                      <div className="admin-input-group">
                        <label>Subtitle</label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => {
                            const updated = [...content.heroSlides]
                            updated[index].subtitle = e.target.value
                            setContent(prev => ({ ...prev, heroSlides: updated }))
                          }}
                        />
                      </div>
                      <div className="admin-input-group admin-input-group--full">
                        <label>Image URL</label>
                        <input
                          type="url"
                          value={slide.image}
                          onChange={(e) => {
                            const updated = [...content.heroSlides]
                            updated[index].image = e.target.value
                            setContent(prev => ({ ...prev, heroSlides: updated }))
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="admin-actions">
                <button 
                  className="admin-btn admin-btn--primary" 
                  onClick={saveHero}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Hero Slides'}
                </button>
              </div>
            </div>
          )}

          {/* Photos */}
          {activeTab === 'photos' && photos && (
            <div className="admin-section">
              <p className="admin-hint">Manage portfolio photos. Click on a photo to edit or delete.</p>
              
              <div className="admin-photos-grid">
                {photos.photos.map(photo => (
                  <div key={photo.id} className="admin-photo-card">
                    <img src={photo.src} alt={photo.title} />
                    <div className="admin-photo-card__overlay">
                      <span className="admin-photo-card__title">{photo.title}</span>
                      <span className="admin-photo-card__category">{photo.category}</span>
                      <button 
                        className="admin-photo-card__delete"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {activeTab === 'services' && content && (
            <div className="admin-section">
              <p className="admin-hint">Edit service offerings and descriptions</p>
              
              {content.services.map((service, index) => (
                <div key={service.id} className="admin-card admin-card--horizontal">
                  <div className="admin-card__content">
                    <div className="admin-grid">
                      <div className="admin-input-group">
                        <label>Title</label>
                        <input
                          type="text"
                          value={service.title}
                          onChange={(e) => {
                            const updated = [...content.services]
                            updated[index].title = e.target.value
                            setContent(prev => ({ ...prev, services: updated }))
                          }}
                        />
                      </div>
                      <div className="admin-input-group admin-input-group--full">
                        <label>Description</label>
                        <textarea
                          value={service.description}
                          onChange={(e) => {
                            const updated = [...content.services]
                            updated[index].description = e.target.value
                            setContent(prev => ({ ...prev, services: updated }))
                          }}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="admin-actions">
                <button 
                  className="admin-btn admin-btn--primary" 
                  onClick={async () => {
                    setSaving(true)
                    try {
                      const res = await fetch(`${API_URL}/content/services`, {
                        method: 'PUT',
                        headers: authHeaders,
                        body: JSON.stringify({ services: content.services })
                      })
                      if (res.ok) {
                        showMessage('Services saved!')
                      } else {
                        showMessage('Failed to save', 'error')
                      }
                    } catch (error) {
                      showMessage('Failed to save', 'error')
                    } finally {
                      setSaving(false)
                    }
                  }}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Services'}
                </button>
              </div>
            </div>
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
