require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Flashcard = require('./public/models/flashcard');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    ssl: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Middleware to parse JSON request body

// Updated /api/flashcards endpoint to fetch and serve flashcards
app.get('/api/flashcards', async (req, res) => {
  try {
    // Fetch flashcards from MongoDB
    const flashcards = await Flashcard.find();
    res.json(flashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Updated endpoint to handle creating a new card
app.post('/api/flashcards', async (req, res) => {
  try {
    // Assuming the new card data is sent in the request body
    const newFlashcard = await Flashcard.create(req.body);

    // Respond with the newly created flashcard
    res.status(201).json(newFlashcard);
  } catch (error) {
    console.error('Error creating flashcard:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Updated endpoint to handle viewing cards created by a specific user
app.get('/api/user/:userId/flashcards', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Assuming each flashcard has a 'userId' field
    const userFlashcards = await Flashcard.find({ userId });
    res.json(userFlashcards);
  } catch (error) {
    console.error('Error fetching user flashcards:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

