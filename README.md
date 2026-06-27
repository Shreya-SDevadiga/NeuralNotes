# NeuralNotes
AI-powered note-taking app for students using React, Node.js, and Groq AI

# NeuralNotes 🧠

An AI-powered note-taking app for students. Upload lectures, generate notes, create flashcards, and visualize concepts.

## Features
- 📝 AI-generated notes from lectures
- 🃏 Flashcard generator
- 🗺️ Concept map visualization
- 📊 Analytics dashboard
- 🎙️ Live lecture transcription
- 📤 Export notes to PDF

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas
- **AI:** Groq API, Anthropic Claude

## Getting Started

### 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/NeuralNotes.git

### 2. Setup Server
cd server
npm install
# Add your .env file with MONGO_URI, JWT_SECRET, GROQ_API_KEY
node index.js

### 3. Setup Client
cd client
npm install
npm start

## Environment Variables
Create a `.env` file in the `/server` folder:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
GROQ_API_KEY=your_groq_key