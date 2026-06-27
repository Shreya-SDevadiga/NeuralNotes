const router = require('express').Router();
const auth   = require('../middleware/auth');
const Note   = require('../models/Note');

// ─── GET ALL NOTES FOR LOGGED-IN USER ────────────────────────
// GET /api/notes
router.get('/', auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id })
                            .sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Get notes error:', err.message);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// ─── GET A SINGLE NOTE BY ID ──────────────────────────────────
// GET /api/notes/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      userId: req.user.id       // ensures user can only get their own notes
    });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch note' });
  }
});

// ─── CREATE / SAVE A NEW NOTE ─────────────────────────────────
// POST /api/notes
// Body: { title, content, raw }
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, raw } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const note = await Note.create({
      userId:  req.user.id,
      title,
      content,
      raw: raw || ''
    });
    res.status(201).json(note);
  } catch (err) {
    console.error('Create note error:', err.message);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// ─── UPDATE A NOTE ────────────────────────────────────────────
// PUT /api/notes/:id
// Body: { title, content }
router.put('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body },
      { new: true }             // returns the updated document
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// ─── DELETE A NOTE ────────────────────────────────────────────
// DELETE /api/notes/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id       // user can only delete their own notes
    });
    if (!note) return res.status(404).json({ error: 'Note not found' });
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;