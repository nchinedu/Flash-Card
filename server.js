const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const mongoDBConnectionString = 'mongodb+srv://nduluechinedu:1234@testcluster.9slnzsa.mongodb.net/test';

mongoose.connect(mongoDBConnectionString, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB!');
});

app.use(cors());

const flashcardSchema = new mongoose.Schema({
    question: String,
    answer: String
})

const Flashcard = mongoose.model('flashcards', flashcardSchema);
app.use(bodyParser.json());
app.post('/api/flashcards', async (req, res) => {
    try {
        const {question, answer} = req.body;
        const flashcard = new Flashcard({question, answer});
        await flashcard.save();
        res.json({success: true, flashcard});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

app.get('/api/flashcards', async (req, res) => {
    try {
        const flashcards = await Flashcard.find();
        res.json({success: true, flashcards});
    } catch (error) {
        res.status(500).json({success: false, error: error.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});