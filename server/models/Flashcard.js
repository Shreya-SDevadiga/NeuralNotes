const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', default: null },
  q:      { type: String, required: true },
  a:      { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Flashcard', flashcardSchema);
