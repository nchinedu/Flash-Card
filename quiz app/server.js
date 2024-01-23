const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
    console.log("Database connected");
});

mongoose.connection.on("error", (error) => {
    console.error('Error connecting to the database:', error);
});

mongoose.connection.on("disconnected", () => {
    console.log("Database disconnected");
});

const quizQuestionSchema = new mongoose.Schema({
    category: String,
    difficulty: String,
    question: String,
    options: [String],
    correctAnswer: String,
});

const QuizQuestion = mongoose.model('questions', quizQuestionSchema);

app.use(cors());
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/db/questions', async (req, res) => {
    try {
        const questions = await QuizQuestion.find();
        res.json(questions);
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
