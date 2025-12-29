import express from 'express'
import multer from 'multer'
import { readFileSync, writeFileSync, existsSync, mkdirSync, unlinkSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, extname } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const photosPath = join(__dirname, '../data/photos.json')
const uploadsPath = join(__dirname, '../uploads')

// Ensure uploads directory exists
if (!existsSync(uploadsPath)) {
  mkdirSync(uploadsPath, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsPath)
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.'))
    }
  }
})

function readPhotos() {
  return JSON.parse(readFileSync(photosPath, 'utf8'))
}

function writePhotos(data) {
  writeFileSync(photosPath, JSON.stringify(data, null, 2))
}

// Get all photos (public)
router.get('/', (req, res) => {
  try {
    const data = readPhotos()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load photos' })
  }
})

// Get photos by category (public)
router.get('/category/:category', (req, res) => {
  try {
    const data = readPhotos()
    const { category } = req.params
    
    const filtered = category === 'all' 
      ? data.photos 
      : data.photos.filter(p => p.category === category)
    
    res.json(filtered.sort((a, b) => a.order - b.order))
  } catch (error) {
    res.status(500).json({ error: 'Failed to load photos' })
  }
})

// Get categories (public)
router.get('/categories', (req, res) => {
  try {
    const data = readPhotos()
    res.json(data.categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to load categories' })
  }
})

// Add photo (protected)
router.post('/', authenticateToken, upload.single('photo'), (req, res) => {
  try {
    const data = readPhotos()
    const { title, category, aspect } = req.body
    
    // Get max order
    const maxOrder = data.photos.reduce((max, p) => Math.max(max, p.order || 0), 0)
    
    const newPhoto = {
      id: uuidv4(),
      src: req.file ? `/uploads/${req.file.filename}` : req.body.src,
      srcLarge: req.file ? `/uploads/${req.file.filename}` : req.body.srcLarge,
      title: title || 'Untitled',
      category: category || 'portrait',
      aspect: aspect || 'landscape',
      order: maxOrder + 1
    }
    
    data.photos.push(newPhoto)
    writePhotos(data)
    
    res.status(201).json(newPhoto)
  } catch (error) {
    console.error('Error adding photo:', error)
    res.status(500).json({ error: 'Failed to add photo' })
  }
})

// Update photo (protected)
router.put('/:id', authenticateToken, (req, res) => {
  try {
    const data = readPhotos()
    const { id } = req.params
    const index = data.photos.findIndex(p => p.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Photo not found' })
    }
    
    data.photos[index] = { ...data.photos[index], ...req.body }
    writePhotos(data)
    
    res.json(data.photos[index])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update photo' })
  }
})

// Delete photo (protected)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const data = readPhotos()
    const { id } = req.params
    const index = data.photos.findIndex(p => p.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Photo not found' })
    }
    
    // Delete file if it's a local upload
    const photo = data.photos[index]
    if (photo.src.startsWith('/uploads/')) {
      const filePath = join(__dirname, '..', photo.src)
      if (existsSync(filePath)) {
        unlinkSync(filePath)
      }
    }
    
    data.photos.splice(index, 1)
    writePhotos(data)
    
    res.json({ message: 'Photo deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' })
  }
})

// Reorder photos (protected)
router.put('/reorder/batch', authenticateToken, (req, res) => {
  try {
    const data = readPhotos()
    const { order } = req.body // Array of { id, order }
    
    order.forEach(item => {
      const photo = data.photos.find(p => p.id === item.id)
      if (photo) {
        photo.order = item.order
      }
    })
    
    writePhotos(data)
    res.json({ message: 'Photos reordered' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to reorder photos' })
  }
})

// Manage categories (protected)
router.post('/categories', authenticateToken, (req, res) => {
  try {
    const data = readPhotos()
    const { id, label } = req.body
    
    if (data.categories.some(c => c.id === id)) {
      return res.status(400).json({ error: 'Category already exists' })
    }
    
    data.categories.push({ id, label })
    writePhotos(data)
    
    res.status(201).json(data.categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add category' })
  }
})

router.delete('/categories/:id', authenticateToken, (req, res) => {
  try {
    const data = readPhotos()
    const { id } = req.params
    
    if (id === 'all') {
      return res.status(400).json({ error: 'Cannot delete "all" category' })
    }
    
    data.categories = data.categories.filter(c => c.id !== id)
    writePhotos(data)
    
    res.json(data.categories)
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

export default router

