import express from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const contentPath = join(__dirname, '../data/content.json')

function readContent() {
  return JSON.parse(readFileSync(contentPath, 'utf8'))
}

function writeContent(data) {
  writeFileSync(contentPath, JSON.stringify(data, null, 2))
}

// Get all content (public)
router.get('/', (req, res) => {
  try {
    const content = readContent()
    res.json(content)
  } catch (error) {
    console.error('Error reading content:', error)
    res.status(500).json({ error: 'Failed to load content' })
  }
})

// Get studio info (public)
router.get('/studio', (req, res) => {
  try {
    const content = readContent()
    res.json({
      ...content.studio,
      social: content.social,
      mission: content.mission
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to load studio info' })
  }
})

// Update studio info (protected)
router.put('/studio', authenticateToken, (req, res) => {
  try {
    const content = readContent()
    const { name, tagline, description, location, address, email, phone, whatsapp } = req.body
    
    content.studio = {
      ...content.studio,
      name: name || content.studio.name,
      tagline: tagline || content.studio.tagline,
      description: description || content.studio.description,
      location: location || content.studio.location,
      address: address || content.studio.address,
      email: email || content.studio.email,
      phone: phone || content.studio.phone,
      whatsapp: whatsapp || content.studio.whatsapp
    }
    
    writeContent(content)
    res.json(content.studio)
  } catch (error) {
    console.error('Error updating studio:', error)
    res.status(500).json({ error: 'Failed to update studio info' })
  }
})

// Update social links (protected)
router.put('/social', authenticateToken, (req, res) => {
  try {
    const content = readContent()
    content.social = { ...content.social, ...req.body }
    writeContent(content)
    res.json(content.social)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update social links' })
  }
})

// Update mission statement (protected)
router.put('/mission', authenticateToken, (req, res) => {
  try {
    const content = readContent()
    content.mission = req.body.mission
    writeContent(content)
    res.json({ mission: content.mission })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update mission' })
  }
})

// Get/Update hero slides (protected for updates)
router.get('/hero', (req, res) => {
  try {
    const content = readContent()
    res.json(content.heroSlides)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load hero slides' })
  }
})

router.put('/hero', authenticateToken, (req, res) => {
  try {
    const content = readContent()
    content.heroSlides = req.body.slides
    writeContent(content)
    res.json(content.heroSlides)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hero slides' })
  }
})

// Get/Update services
router.get('/services', (req, res) => {
  try {
    const content = readContent()
    res.json(content.services)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load services' })
  }
})

router.put('/services', authenticateToken, (req, res) => {
  try {
    const content = readContent()
    content.services = req.body.services
    writeContent(content)
    res.json(content.services)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update services' })
  }
})

// Get/Update testimonials
router.get('/testimonials', (req, res) => {
  try {
    const content = readContent()
    res.json(content.testimonials)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load testimonials' })
  }
})

router.put('/testimonials', authenticateToken, (req, res) => {
  try {
    const content = readContent()
    content.testimonials = req.body.testimonials
    writeContent(content)
    res.json(content.testimonials)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update testimonials' })
  }
})

// Get/Update stats
router.get('/stats', (req, res) => {
  try {
    const content = readContent()
    res.json(content.stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load stats' })
  }
})

router.put('/stats', authenticateToken, (req, res) => {
  try {
    const content = readContent()
    content.stats = req.body.stats
    writeContent(content)
    res.json(content.stats)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stats' })
  }
})

export default router

