const router    = require('express').Router();  // ← this line is missing!
const auth      = require('../middleware/auth');
const Flashcard = require('../models/Flashcard');

// ─── GET ALL FLASHCARDS FOR USER ─────────────────────────────
router.get('/', auth, async (req, res) => {
  try {
    const cards = await Flashcard.find({ userId: req.user.id })
                                 .sort({ createdAt: -1 });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

// ─── GET FLASHCARDS FOR A SPECIFIC NOTE ──────────────────────
router.get('/note/:noteId', auth, async (req, res) => {
  try {
    const cards = await Flashcard.find({
      userId: req.user.id,
      noteId: req.params.noteId
    });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch flashcards' });
  }
});

// ─── SAVE MULTIPLE FLASHCARDS AT ONCE ────────────────────────
router.post('/bulk', auth, async (req, res) => {
  try {
    const { noteId, cards } = req.body;
    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({ error: 'cards must be an array' });
    }
    const docs = cards.map(card => ({
      userId: req.user.id,
      noteId: noteId || null,
      q: card.q,
      a: card.a
    }));
    const saved = await Flashcard.insertMany(docs);
    res.status(201).json(saved);
  } catch (err) {
    console.error('Bulk flashcard error:', err.message);
    res.status(500).json({ error: 'Failed to save flashcards' });
  }
});

// ─── SAVE A SINGLE FLASHCARD ──────────────────────────────────
router.post('/', auth, async (req, res) => {
  try {
    const { noteId, q, a } = req.body;
    if (!q || !a) return res.status(400).json({ error: 'q and a are required' });
    const card = await Flashcard.create({
      userId: req.user.id,
      noteId: noteId || null,
      q, a
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save flashcard' });
  }
});

// ─── DELETE A FLASHCARD ───────────────────────────────────────
router.delete('/:id', auth, async (req, res) => {
  try {
    await Flashcard.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete flashcard' });
  }
});

module.exports = router;  // ← this line must be at the bottom!