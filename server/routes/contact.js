import express from 'express'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const contactsPath = join(__dirname, '../data/contacts.json')

// Initialize contacts file if not exists
function initContacts() {
  if (!existsSync(contactsPath)) {
    writeFileSync(contactsPath, JSON.stringify([], null, 2))
  }
}

// Get all contacts (admin only, but for now public)
router.get('/', authenticateToken, (req, res) => {
  try {
    initContacts()
    const contacts = JSON.parse(readFileSync(contactsPath, 'utf8'))
    res.json(contacts)
  } catch (error) {
    console.error('Error reading contacts:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

// Submit contact form
router.post('/', (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    initContacts()
    const contacts = JSON.parse(readFileSync(contactsPath, 'utf8'))

    const newContact = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      service: service || '',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      status: 'unread'
    }

    contacts.push(newContact)
    writeFileSync(contactsPath, JSON.stringify(contacts, null, 2))

    res.status(201).json({ message: 'Contact form submitted successfully', id: newContact.id })
  } catch (error) {
    console.error('Error submitting contact:', error)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router