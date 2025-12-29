import express from 'express'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { authenticateToken } from '../middleware/auth.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()
const collectionsPath = path.join(__dirname, '../data/collections.json')

// Helper function to read collections
async function getCollections() {
  const data = await fs.readFile(collectionsPath, 'utf-8')
  return JSON.parse(data)
}

// Helper function to write collections
async function saveCollections(data) {
  await fs.writeFile(collectionsPath, JSON.stringify(data, null, 2))
}

// GET all collections (public)
router.get('/', async (req, res) => {
  try {
    const data = await getCollections()
    res.json(data.collections)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collections' })
  }
})

// GET single collection by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const data = await getCollections()
    const collection = data.collections.find(c => c.id === req.params.id)
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' })
    }
    res.json(collection)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch collection' })
  }
})

// POST new comment to a collection (public - guests can comment)
router.post('/:id/comments', async (req, res) => {
  try {
    const { author, text } = req.body
    if (!author || !text) {
      return res.status(400).json({ error: 'Author and text are required' })
    }

    const data = await getCollections()
    const collectionIndex = data.collections.findIndex(c => c.id === req.params.id)
    
    if (collectionIndex === -1) {
      return res.status(404).json({ error: 'Collection not found' })
    }

    const newComment = {
      id: Date.now(),
      author: author.trim(),
      text: text.trim(),
      date: new Date().toISOString().split('T')[0]
    }

    data.collections[collectionIndex].comments.push(newComment)
    await saveCollections(data)

    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' })
  }
})

// DELETE comment (admin only)
router.delete('/:id/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const data = await getCollections()
    const collectionIndex = data.collections.findIndex(c => c.id === req.params.id)
    
    if (collectionIndex === -1) {
      return res.status(404).json({ error: 'Collection not found' })
    }

    const commentIndex = data.collections[collectionIndex].comments.findIndex(
      c => c.id === parseInt(req.params.commentId)
    )

    if (commentIndex === -1) {
      return res.status(404).json({ error: 'Comment not found' })
    }

    data.collections[collectionIndex].comments.splice(commentIndex, 1)
    await saveCollections(data)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete comment' })
  }
})

// POST new collection (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const data = await getCollections()
    const newCollection = {
      ...req.body,
      id: req.body.id || `collection-${Date.now()}`,
      comments: []
    }
    data.collections.push(newCollection)
    await saveCollections(data)
    res.status(201).json(newCollection)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create collection' })
  }
})

// PUT update collection (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const data = await getCollections()
    const index = data.collections.findIndex(c => c.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Collection not found' })
    }

    // Preserve comments when updating
    const existingComments = data.collections[index].comments
    data.collections[index] = { ...req.body, comments: existingComments }
    await saveCollections(data)

    res.json(data.collections[index])
  } catch (error) {
    res.status(500).json({ error: 'Failed to update collection' })
  }
})

// DELETE collection (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const data = await getCollections()
    const index = data.collections.findIndex(c => c.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Collection not found' })
    }

    data.collections.splice(index, 1)
    await saveCollections(data)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete collection' })
  }
})

// POST add photo to collection (admin only)
router.post('/:id/photos', authenticateToken, async (req, res) => {
  try {
    const data = await getCollections()
    const index = data.collections.findIndex(c => c.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Collection not found' })
    }

    const newPhoto = {
      ...req.body,
      id: req.body.id || `photo-${Date.now()}`
    }

    data.collections[index].photos.push(newPhoto)
    await saveCollections(data)

    res.status(201).json(newPhoto)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add photo' })
  }
})

// DELETE photo from collection (admin only)
router.delete('/:id/photos/:photoId', authenticateToken, async (req, res) => {
  try {
    const data = await getCollections()
    const collectionIndex = data.collections.findIndex(c => c.id === req.params.id)
    
    if (collectionIndex === -1) {
      return res.status(404).json({ error: 'Collection not found' })
    }

    const photoIndex = data.collections[collectionIndex].photos.findIndex(
      p => p.id === req.params.photoId
    )

    if (photoIndex === -1) {
      return res.status(404).json({ error: 'Photo not found' })
    }

    data.collections[collectionIndex].photos.splice(photoIndex, 1)
    await saveCollections(data)

    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete photo' })
  }
})

// POST add collaborator to collection (admin only)
router.post('/:id/collaborators', authenticateToken, async (req, res) => {
  try {
    const { name, role } = req.body
    if (!name || !role) {
      return res.status(400).json({ error: 'Name and role are required' })
    }

    const data = await getCollections()
    const index = data.collections.findIndex(c => c.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Collection not found' })
    }

    const newCollaborator = { name: name.trim(), role: role.trim() }
    data.collections[index].collaborators.push(newCollaborator)
    await saveCollections(data)

    res.status(201).json(newCollaborator)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add collaborator' })
  }
})

export default router
