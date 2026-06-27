const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Only load routes that actually exist right now
app.use('/api/auth', require('./routes/auth'));

// ⏳ Uncomment these as you build them:
app.use('/api/notes',      require('./routes/notes'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/generate',   require('./routes/generate'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000,
      () => console.log('Server running on port 5000'));
    console.log('MongoDB connected');
  })
  .catch(err => console.error(err));