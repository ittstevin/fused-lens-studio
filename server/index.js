import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import authRoutes from './routes/auth.js'
import contentRoutes from './routes/content.js'
import photoRoutes from './routes/photos.js'
import collectionsRoutes from './routes/collections.js'
import contactRoutes from './routes/contact.js'
import commentsRoutes from './routes/comments.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/photos', photoRoutes)
app.use('/api/collections', collectionsRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/comments', commentsRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Fused Lens API is running' })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})

