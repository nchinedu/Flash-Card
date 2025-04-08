export default class Quiz {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.score = 0;
        this.timer = null;
        this.timeRemaining = 60;
        this.difficulty = 'medium';
        
        this.elements = {
            container: document.getElementById('quiz-container'),
            question: document.getElementById('question-text'),
            options: document.getElementById('options-section'),
            timer: document.getElementById('time-remaining'),
            difficultySelector: document.getElementById('difficulty-selector'),
            progressBar: document.getElementById('progress-bar')
        };

        this.bindEvents();
    }

    bindEvents() {
        this.elements.difficultySelector.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
            this.resetQuiz();
        });
    }

    async initialize() {
        try {
            const response = await fetch('http://localhost:3000/api/quiz/questions');
            const questions = await response.json();
            this.questions = this.shuffleArray(questions);
            this.displayQuestion();
            this.startTimer();
        } catch (error) {
            document.getElementById('error-message').textContent = 'Failed to load questions';
        }
    }

    displayQuestion() {
        const question = this.questions[this.currentIndex];
        if (!question) return;

        this.elements.question.textContent = question.question;
        this.elements.options.innerHTML = '';
        
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => this.handleAnswer(option));
            this.elements.options.appendChild(button);
        });

        this.updateProgressBar();
    }

    handleAnswer(selectedOption) {
        const question = this.questions[this.currentIndex];
        const isCorrect = selectedOption === question.correctAnswer;
        
        if (isCorrect) this.score++;
        
        this.showFeedback(isCorrect);
        setTimeout(() => this.moveToNext(), 1000);
    }

    moveToNext() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            this.displayQuestion();
        } else {
            this.showResults();
        }
    }

    updateProgressBar() {
        const progress = ((this.currentIndex + 1) / this.questions.length) * 100;
        this.elements.progressBar.style.width = `${progress}%`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}