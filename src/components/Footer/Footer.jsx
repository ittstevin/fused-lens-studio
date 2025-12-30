import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { navLinks } from '../../data/content'
import './Footer.css'

import { studioInfo as defaultStudioInfo } from '../../data/content'

const API_URL = import.meta.env.DEV ? '/api' : 'http://localhost:3001/api'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [studioInfo, setStudioInfo] = useState({
    name: defaultStudioInfo.name,
    tagline: defaultStudioInfo.tagline,
    location: defaultStudioInfo.location,
    email: defaultStudioInfo.email,
    phone: defaultStudioInfo.phone,
    social: defaultStudioInfo.social
  })

  useEffect(() => {
    // Try to fetch updated studio info from API
    fetch(`${API_URL}/content/studio`)
      .then(res => res.ok ? res.json() : null)
      .catch(() => null)
      .then(data => {
        if (data) {
          setStudioInfo({
            name: data.name || defaultStudioInfo.name,
            tagline: data.tagline || defaultStudioInfo.tagline,
            location: data.location || defaultStudioInfo.location,
            email: data.email || defaultStudioInfo.email,
            phone: data.phone || defaultStudioInfo.phone,
            social: data.social || defaultStudioInfo.social
          })
        }
      })
      .catch(err => console.error('Failed to load studio info:', err))
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <motion.a
              href="#home"
              className="footer__logo clickable"
              onClick={(e) => {
                e.preventDefault()
                scrollToSection('home')
              }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="footer__logo-icon">◈</span>
              <span className="footer__logo-text">{studioInfo.name}</span>
            </motion.a>
            <p className="footer__tagline">{studioInfo.tagline}</p>
            <p className="footer__description">
              Creating timeless visual stories that capture the essence of every moment.
            </p>
          </div>

          {/* Navigation */}
          <div className="footer__nav">
            <h4 className="footer__heading">Navigation</h4>
            <nav className="footer__links">
              {navLinks.map((link) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  className="footer__link clickable"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.id)
                  }}
                  whileHover={{ x: 4 }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div className="footer__services">
            <h4 className="footer__heading">Services</h4>
            <nav className="footer__links">
              <a href="#services" className="footer__link clickable" onClick={(e) => { e.preventDefault(); scrollToSection('services') }}>Wedding Photography</a>
              <a href="#services" className="footer__link clickable" onClick={(e) => { e.preventDefault(); scrollToSection('services') }}>Portrait Sessions</a>
              <a href="#services" className="footer__link clickable" onClick={(e) => { e.preventDefault(); scrollToSection('services') }}>Commercial Work</a>
              <a href="#services" className="footer__link clickable" onClick={(e) => { e.preventDefault(); scrollToSection('services') }}>Event Coverage</a>
            </nav>
          </div>

          {/* Contact */}
          <div className="footer__contact">
            <h4 className="footer__heading">Get in Touch</h4>
            <div className="footer__contact-info">
              <p>{studioInfo.location}</p>
              <a href={`mailto:${studioInfo.email}`} className="clickable">{studioInfo.email}</a>
              <a href={`tel:${studioInfo.phone.replace(/\s/g, '')}`} className="clickable">{studioInfo.phone}</a>
            </div>
            
            {/* Social */}
            <div className="footer__social">
              {Object.entries(studioInfo.social).map(([platform, url]) => (
                <motion.a
                  key={platform}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link clickable"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={platform}
                >
                  {platform.charAt(0).toUpperCase()}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {currentYear} {studioInfo.name}. All rights reserved.
          </p>
          <p className="footer__credit">
            Crafted with passion for visual excellence.
          </p>
        </div>
      </div>
    </footer>
  )
}
