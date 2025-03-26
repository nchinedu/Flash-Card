const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const mongoURI =
  'mongodb+srv://nduluechinedu:1234@testcluster.9slnzsa.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI, { tls: true,               // Enable TLS
  tlsAllowInvalidCertificates: true,
  ssl: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Flashcard Schema
const flashcardSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

const Flashcard = mongoose.model('Flashcard', flashcardSchema);

// Get all flashcards
app.get('/api/flashcards', async (req, res) => {
  try {
    const flashcards = await Flashcard.find();
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new flashcard
app.post('/api/flashcards', async (req, res) => {
  try {
    const newFlashcard = await Flashcard.create(req.body);
    res.status(201).json(newFlashcard);
  } catch (error) {
    console.error('Error adding flashcard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
