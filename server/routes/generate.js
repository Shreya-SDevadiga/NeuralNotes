const router = require('express').Router();
const auth   = require('../middleware/auth');
const Groq   = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── GENERATE NOTES ───────────────────────────────────────────
router.post('/notes', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide lecture text' });
    }

    console.log('Generating notes — text length:', text.length);

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: 'You are a smart note-taking assistant for students. Always respond with well-structured notes only.'
        },
        {
          role: 'user',
          content: `Convert this lecture into clean structured notes.
Rules:
- Use ### for main headings
- Use ## for sub-headings
- Use bullet points (- ) for details
- Remove ALL filler words: "um", "uh", "basically", "you know", "like", "so"
- Keep it concise and student-friendly
- No introduction sentence — start directly with the notes

LECTURE TEXT:
${text.slice(0, 4000)}`
        }
      ]
    });

    const result = response.choices[0].message.content;
    res.json({ result });

  } catch (err) {
    console.error('Generate notes error:', err.message);
    res.status(500).json({ error: 'Failed to generate notes', detail: err.message });
  }
});

// ─── GENERATE FLASHCARDS ──────────────────────────────────────
router.post('/flashcards', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || notes.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide note content' });
    }

    console.log('Generating flashcards...');

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: 'You are a flashcard generator. Return ONLY a valid JSON array. No markdown backticks, no explanation, no extra text before or after. Just the raw JSON array starting with [ and ending with ].'
        },
        {
          role: 'user',
          content: `Generate 8 flashcards from these lecture notes.
Focus on: definitions, key concepts, important facts.
Return ONLY this exact format:
[{"q":"question here","a":"answer here"},{"q":"question here","a":"answer here"}]

NOTES:
${notes.slice(0, 3000)}`
        }
      ]
    });

    let raw = response.choices[0].message.content
                  .replace(/```json?|```/g, '')
                  .trim();

                  // Sometimes the model adds text before the JSON — extract just the array
                const startIdx = raw.indexOf('[');
                const endIdx   = raw.lastIndexOf(']');
                if (startIdx !== -1 && endIdx !== -1) {
                raw = raw.slice(startIdx, endIdx + 1);
                }

    const flashcards = JSON.parse(raw);
    console.log('Flashcards generated:', flashcards.length);
    res.json({ flashcards });

  } catch (err) {
    console.error('Generate flashcards error:', err.message);
    res.status(500).json({ error: 'Failed to generate flashcards', detail: err.message });
  }
});

// ─── GENERATE CONCEPT MAP ─────────────────────────────────────
router.post('/concept-map', auth, async (req, res) => {
  try {
    const { notes } = req.body;

    if (!notes || notes.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide note content' });
    }

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        {
          role: 'system',
          content: 'Return ONLY valid JSON, no backticks, no explanation, no extra text.'
        },
        {
          role: 'user',
          content: `Create a concept map from these notes.
Return ONLY this exact JSON format:
{"nodes":[{"id":"1","label":"Main Topic","type":"main"},{"id":"2","label":"Subtopic","type":"sub"}],
 "edges":[{"from":"1","to":"2","label":"includes"}]}
Rules:
- Maximum 10 nodes
- Types must be: main, sub, or detail
- Keep labels short (max 3 words)

NOTES:
${notes.slice(0, 2000)}`
        }
      ]
    });

    let raw = response.choices[0].message.content
                  .replace(/```json?|```/g, '')
                  .trim();
    const conceptMap = JSON.parse(raw);
    res.json(conceptMap);

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate concept map', detail: err.message });
  }
});

// ─── CHAT WITH NOTES ─────────────────────────────────────────
// POST /api/generate/chat
// Body: { messages, system }
router.post('/chat', auth, async (req, res) => {
  try {
    const { messages, system } = req.body;

    const response = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: system || 'You are a helpful study assistant.' },
        ...messages
      ]
    });

    res.json({ result: response.choices[0].message.content });

  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'Chat failed', detail: err.message });
  }
});

module.exports = router;