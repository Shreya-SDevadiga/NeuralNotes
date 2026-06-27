const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
  userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title:   { type: String, required: true },
  content: { type: String },
  raw:     { type: String },
}, { timestamps: true });
module.exports = mongoose.model('Note', noteSchema);