const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');

router.get('/questions', async (req, res) => {
    try {
        const questions = await Quiz.find();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;