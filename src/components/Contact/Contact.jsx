import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { studioInfo } from '../../data/content'
import './Contact.css'

gsap.registerPlugin(ScrollTrigger)

// Social Icons
const SocialIcon = ({ platform }) => {
  const icons = {
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    twitter: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    behance: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.338.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.48.348-1.05.6-1.67.767-.61.165-1.252.254-1.91.254H0V4.51h6.938v-.007zM6.545 9.85c.558 0 1.02-.155 1.38-.455.36-.3.54-.748.54-1.33 0-.325-.06-.605-.183-.832-.122-.226-.29-.41-.505-.543-.214-.132-.47-.228-.758-.285-.29-.058-.598-.086-.936-.086H3.01v3.53h3.536zm.196 5.97c.382 0 .733-.04 1.056-.124.32-.083.6-.21.827-.375.227-.166.407-.386.536-.654.13-.27.193-.6.193-1 0-.786-.23-1.36-.69-1.72-.462-.36-1.08-.54-1.852-.54H3.01v4.413h3.73zM15.954 4.503h6.062v1.712h-6.062zM22.86 14.46c-.252.806-.653 1.49-1.196 2.038-.544.55-1.197.97-1.96 1.26-.764.292-1.623.44-2.574.44-.93 0-1.78-.14-2.54-.405-.764-.27-1.42-.667-1.97-1.19-.554-.524-.983-1.17-1.29-1.93-.304-.762-.456-1.636-.456-2.62 0-.96.155-1.822.467-2.58.31-.76.738-1.405 1.286-1.936.546-.53 1.196-.935 1.953-1.22.758-.283 1.588-.424 2.492-.424.984 0 1.856.18 2.614.54.76.358 1.395.858 1.91 1.5.52.64.91 1.4 1.178 2.278.268.88.382 1.84.35 2.885H15.11c.038.68.26 1.254.667 1.72.407.467.97.7 1.696.7.514 0 .94-.12 1.282-.373.34-.254.594-.61.76-1.074h3.345v-.01zm-3.32-3.68c-.063-.587-.29-1.056-.69-1.41-.4-.35-.89-.528-1.48-.528-.403 0-.747.07-1.03.216-.284.143-.52.327-.71.55-.19.22-.33.47-.426.75-.096.28-.15.55-.17.82h4.505z" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    whatsapp: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    )
  }
  return icons[platform] || null
}

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [focusedField, setFocusedField] = useState(null)
  
  const sectionRef = useRef(null)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrors({})
    
    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', service: '', message: '' })
      } else {
        setSubmitStatus('error')
        setErrors({ submit: data.error || 'Failed to submit form' })
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <section id="contact" className="contact section" ref={sectionRef}>
      <div className="container">
        <motion.div
          className="section-heading"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Contact</span>
          <h2 className="section-title">Let's Create Together</h2>
          <p className="section-subtitle">
            Ready to bring your vision to life? Get in touch and let's discuss your project.
          </p>
        </motion.div>

        <div className="contact__layout">
          {/* Contact Info */}
          <motion.div
            className="contact__info"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {/* Map */}
            <motion.div className="contact__map" variants={itemVariants}>
              <div className="contact__map-visual">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819!2d36.783!3d-1.283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172b28c0c5%3A0x3e2a010c9d118e0!2sKirigiti%2C%20Kenya!5e0!3m2!1sen!2sus!4v1690000000000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fused Lens Studio Location"
                ></iframe>
              </div>
              <div className="contact__location">
                <h3>{studioInfo.location}</h3>
                <p>{studioInfo.address}</p>
              </div>
            </motion.div>

            {/* Contact Details */}
            <motion.div className="contact__details" variants={itemVariants}>
              <a href={`mailto:${studioInfo.email}`} className="contact__detail clickable">
                <span className="contact__detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <span className="contact__detail-label">Email</span>
                  <span className="contact__detail-value">{studioInfo.email}</span>
                </div>
              </a>
              
              <a href={`tel:${studioInfo.phone.replace(/\s/g, '')}`} className="contact__detail clickable">
                <span className="contact__detail-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <div>
                  <span className="contact__detail-label">Phone</span>
                  <span className="contact__detail-value">{studioInfo.phone}</span>
                </div>
              </a>
            </motion.div>

            {/* Quick Action Buttons */}
            <motion.div className="contact__quick-actions" variants={itemVariants}>
              <motion.a
                href={`https://wa.me/${studioInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__quick-btn contact__quick-btn--whatsapp clickable"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <SocialIcon platform="whatsapp" />
                <span>Chat on WhatsApp</span>
              </motion.a>
              
              <motion.a
                href={`tel:${studioInfo.phone.replace(/\s/g, '')}`}
                className="contact__quick-btn contact__quick-btn--call clickable"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>Call Now</span>
              </motion.a>
            </motion.div>

            {/* Social Links */}
            <motion.div className="contact__social" variants={itemVariants}>
              <span className="contact__social-label">Follow Us</span>
              <div className="contact__social-links">
                {Object.entries(studioInfo.social).map(([platform, url]) => (
                  <motion.a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__social-link clickable"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SocialIcon platform={platform} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            className="contact__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="form-row">
              <div className={`form-group ${focusedField === 'name' ? 'form-group--focused' : ''} ${errors.name ? 'form-group--error' : ''}`}>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  className="form-input"
                  placeholder=" "
                />
                <label htmlFor="name" className="form-label">Your Name</label>
                <span className="form-line" />
                <AnimatePresence>
                  {errors.name && (
                    <motion.span
                      className="form-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {errors.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              <div className={`form-group ${focusedField === 'email' ? 'form-group--focused' : ''} ${errors.email ? 'form-group--error' : ''}`}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="form-input"
                  placeholder=" "
                />
                <label htmlFor="email" className="form-label">Email Address</label>
                <span className="form-line" />
                <AnimatePresence>
                  {errors.email && (
                    <motion.span
                      className="form-error"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {errors.email}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${focusedField === 'phone' ? 'form-group--focused' : ''}`}>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className="form-input"
                  placeholder=" "
                />
                <label htmlFor="phone" className="form-label">Phone (optional)</label>
                <span className="form-line" />
              </div>

              <div className={`form-group ${focusedField === 'service' ? 'form-group--focused' : ''}`}>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('service')}
                  onBlur={() => setFocusedField(null)}
                  className="form-input form-select"
                >
                  <option value="">Select a service</option>
                  <option value="wedding">Wedding Photography</option>
                  <option value="portrait">Portrait Session</option>
                  <option value="commercial">Commercial Project</option>
                  <option value="event">Event Coverage</option>
                  <option value="other">Other</option>
                </select>
                <label htmlFor="service" className="form-label form-label--select">Service Interest</label>
                <span className="form-line" />
              </div>
            </div>

            <div className={`form-group ${focusedField === 'message' ? 'form-group--focused' : ''} ${errors.message ? 'form-group--error' : ''}`}>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                className="form-input form-textarea"
                rows="4"
                placeholder=" "
              />
              <label htmlFor="message" className="form-label">Your Message</label>
              <span className="form-line" />
              <AnimatePresence>
                {errors.message && (
                  <motion.span
                    className="form-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.message}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              className="form-submit clickable"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isSubmitting ? (
                  <motion.span
                    key="loading"
                    className="form-submit__loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <span className="form-submit__spinner" />
                    Sending...
                  </motion.span>
                ) : (
                  <motion.span
                    key="text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    Send Message
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span
                className="form-submit__pulse"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            {/* Submit Error */}
            <AnimatePresence>
              {errors.submit && (
                <motion.div
                  className="form-status form-status--error"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <span className="form-status__icon">✕</span>
                  <span>{errors.submit}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success/Error Messages */}
            <AnimatePresence>
              {submitStatus && (
                <motion.div
                  className={`form-status form-status--${submitStatus}`}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  {submitStatus === 'success' ? (
                    <>
                      <span className="form-status__icon">✓</span>
                      <span>Thank you! We'll be in touch soon.</span>
                    </>
                  ) : (
                    <>
                      <span className="form-status__icon">✕</span>
                      <span>Something went wrong. Please try again.</span>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
