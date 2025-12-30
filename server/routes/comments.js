import express from 'express'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const commentsPath = join(__dirname, '../data/comments.json')

// Initialize comments file if not exists
function initComments() {
  if (!existsSync(commentsPath)) {
    writeFileSync(commentsPath, JSON.stringify([], null, 2))
  }
}

// Get all comments (public for viewing)
router.get('/', (req, res) => {
  try {
    initComments()
    const comments = JSON.parse(readFileSync(commentsPath, 'utf8'))
    res.json(comments)
  } catch (error) {
    console.error('Error reading comments:', error)
    res.status(500).json({ error: 'Failed to load comments' })
  }
})

// Get comments for a specific photo
router.get('/:photoId', (req, res) => {
  try {
    initComments()
    const comments = JSON.parse(readFileSync(commentsPath, 'utf8'))
    const photoComments = comments.filter(c => c.photoId === req.params.photoId)
    res.json(photoComments)
  } catch (error) {
    console.error('Error reading comments:', error)
    res.status(500).json({ error: 'Failed to load comments' })
  }
})

// Add a comment (public)
router.post('/:photoId', (req, res) => {
  try {
    const { name, email, comment } = req.body

    if (!name || !email || !comment) {
      return res.status(400).json({ error: 'Name, email, and comment are required' })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    initComments()
    const comments = JSON.parse(readFileSync(commentsPath, 'utf8'))

    const newComment = {
      id: Date.now().toString(),
      photoId: req.params.photoId,
      name: name.trim(),
      email: email.trim(),
      comment: comment.trim(),
      approved: false,
      createdAt: new Date().toISOString()
    }

    comments.push(newComment)
    writeFileSync(commentsPath, JSON.stringify(comments, null, 2))

    res.status(201).json(newComment)
  } catch (error) {
    console.error('Error adding comment:', error)
    res.status(500).json({ error: 'Failed to add comment' })
  }
})

// Approve/reject comment (admin only)
router.put('/:commentId', authenticateToken, (req, res) => {
  try {
    const { approved } = req.body
    initComments()
    const comments = JSON.parse(readFileSync(commentsPath, 'utf8'))
    const commentIndex = comments.findIndex(c => c.id === req.params.commentId)

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    comments[commentIndex].approved = approved
    writeFileSync(commentsPath, JSON.stringify(comments, null, 2))

    res.json(comments[commentIndex])
  } catch (error) {
    console.error('Error updating comment:', error)
    res.status(500).json({ error: 'Failed to update comment' })
  }
})

// Delete comment (admin only)
router.delete('/:commentId', authenticateToken, (req, res) => {
  try {
    initComments()
    const comments = JSON.parse(readFileSync(commentsPath, 'utf8'))
    const filteredComments = comments.filter(c => c.id !== req.params.commentId)

    if (filteredComments.length === comments.length) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    writeFileSync(commentsPath, JSON.stringify(filteredComments, null, 2))
    res.json({ message: 'Comment deleted' })
  } catch (error) {
    console.error('Error deleting comment:', error)
    res.status(500).json({ error: 'Failed to delete comment' })
  }
})

export default router