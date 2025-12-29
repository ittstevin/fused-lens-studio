import express from 'express'
import bcrypt from 'bcryptjs'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { generateToken, authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const adminPath = join(__dirname, '../data/admin.json')

// Initialize admin if not exists
function initAdmin() {
  try {
    // Check if file exists
    if (!existsSync(adminPath)) {
      const defaultAdmin = {
        admin: {
          username: 'admin',
          password: bcrypt.hashSync('admin123', 10)
        }
      }
      writeFileSync(adminPath, JSON.stringify(defaultAdmin, null, 2))
      return defaultAdmin
    }

    const data = JSON.parse(readFileSync(adminPath, 'utf8'))
    
    // Hash the default password if not already hashed
    if (!data.admin.password.startsWith('$2a$') && !data.admin.password.startsWith('$2b$')) {
      data.admin.password = bcrypt.hashSync('admin123', 10)
      writeFileSync(adminPath, JSON.stringify(data, null, 2))
    }
    return data
  } catch (error) {
    console.error('Error initializing admin:', error)
    const defaultAdmin = {
      admin: {
        username: 'admin',
        password: bcrypt.hashSync('admin123', 10)
      }
    }
    writeFileSync(adminPath, JSON.stringify(defaultAdmin, null, 2))
    return defaultAdmin
  }
}

// Initialize on load
initAdmin()

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const data = initAdmin()
    
    if (username !== data.admin.username) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const validPassword = await bcrypt.compare(password, data.admin.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken({ username, role: 'admin' })
    res.json({ token, username })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Verify token
router.get('/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user })
})

// Change password
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' })
    }

    const data = initAdmin()
    const validPassword = await bcrypt.compare(currentPassword, data.admin.password)
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    data.admin.password = await bcrypt.hash(newPassword, 10)
    writeFileSync(adminPath, JSON.stringify(data, null, 2))
    
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
