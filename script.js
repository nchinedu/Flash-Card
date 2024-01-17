const quizQuestions = [
    // Medical Questions
    {
        category: 'Medical',
        difficulty: 'Medium',
        question: 'What is the powerhouse of the cell?',
        options: ['Mitochondria', 'Nucleus', 'Endoplasmic Reticulum', 'Golgi Apparatus'],
        correctAnswer: 'Mitochondria'
    },
    // ... (Other Medical Questions)

    // General Knowledge Questions
    {
        category: 'General Knowledge',
        difficulty: 'Easy',
        question: 'Which planet is known as the Red Planet?',
        options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
        correctAnswer: 'Mars'
    },
    // ... (Other General Knowledge Questions)

    // Psychological Questions
    {
        category: 'Psychological',
        difficulty: 'Hard',
        question: 'Who developed the stages of cognitive development theory?',
        options: ['Jean Piaget', 'Sigmund Freud', 'Erik Erikson', 'Abraham Maslow'],
        correctAnswer: 'Jean Piaget'
    },
    // ... (Other Psychological Questions)

    // Anime Questions
    {
        category: 'Anime',
        difficulty: 'Medium',
        question: 'Who is the main protagonist in "Naruto"?',
        options: ['Sasuke Uchiha', 'Hinata Hyuga', 'Naruto Uzumaki', 'Sakura Haruno'],
        correctAnswer: 'Naruto Uzumaki'
    },
    // ... (Other Anime Questions)

    // Web-Based/Internet Programming Questions
    {
        category: 'Web-Based/Internet Programming',
        difficulty: 'Easy',
        question: 'What does CSS stand for?',
        options: ['Counter Strike: Source', 'Cascading Style Sheet', 'Computer Style Sheet', 'Creative Style System'],
        correctAnswer: 'Cascading Style Sheet'
    },
    // ... (Other Web-Based/Internet Programming Questions)
];


let currentQuestionIndex = 0;
let userScore = 0;

document.getElementById('next-button').addEventListener('click', () => {
    moveToNextQuestion();
});

document.querySelector('.close').addEventListener('click', closeModal);

function displayQuestion() {
    try {
        const currentQuestion = quizQuestions[currentQuestionIndex];

        if (!currentQuestion) {
            throw new Error('No more questions available.');
        }

        document.getElementById('question-text').innerHTML = `<h2>${currentQuestion.question}</h2>`;

        const optionsContainer = document.getElementById('options-section');
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach((option) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => handleUserInput(option));
            optionsContainer.appendChild(optionButton);
        });
    } catch (error) {
        console.error('Error displaying question:', error.message);
        document.getElementById('error-message').textContent = 'Error loading question. Please try again.';
    }
}

function handleUserInput(selectedOption) {
    try {
        const currentQuestion = quizQuestions[currentQuestionIndex];

        if (selectedOption === currentQuestion.correctAnswer) {
            userScore++;
        }

        const feedbackSection = document.getElementById('feedback-section');
        feedbackSection.textContent = selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Incorrect!';

        setTimeout(() => {
            feedbackSection.textContent = '';
            moveToNextQuestion();
        }, 1000);
    } catch (error) {
        console.error('Error handling user input:', error.message);
        document.getElementById('error-message').textContent = 'Error processing your answer. Please try again.';
    }
}

function moveToNextQuestion() {
    currentQuestionIndex++;

    if (currentQuestionIndex < quizQuestions.length) {
        displayQuestion();
    } else {
        openModal();
        document.getElementById('user-score').textContent = userScore;
    }
    updateProgressBar();
}

function updateProgressBar() {
    const progress = (currentQuestionIndex / quizQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function openModal() {
    const modal = document.getElementById('quiz-completion-modal');
    modal.style.display = 'block';

    // Display the user's score in the modal
    document.getElementById('user-score').textContent = userScore;

    // Add buttons for trying again and exiting
    const modalContent = document.querySelector('.modal-content');
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('buttons-container');

    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try Again';
    tryAgainButton.addEventListener('click', tryAgain);

    const exitButton = document.createElement('button');
    exitButton.textContent = 'Exit';
    exitButton.addEventListener('click', exitQuiz);

    buttonsContainer.appendChild(tryAgainButton);
    buttonsContainer.appendChild(exitButton);
    modalContent.appendChild(buttonsContainer);

    // Add a class to indicate completion
    document.getElementById('quiz-container').classList.add('completed');
    modal.classList.add('completed');
}


function closeModal() {
    const modal = document.getElementById('quiz-completion-modal');
    modal.style.display = 'none';

    currentQuestionIndex = 0;
    userScore = 0;

    document.getElementById('quiz-container').classList.remove('completed');
    modal.classList.remove('completed');
}

function tryAgain() {
    closeModal();
    resetQuiz();
    displayQuestion();
}

function resetQuiz() {
    currentQuestionIndex = 0;
    userScore = 0;

    // Remove highlighting and progress bar
    document.querySelectorAll('.options button').forEach(button => {
        button.classList.remove('correct', 'incorrect');
    });
    document.getElementById('progress-bar').style.width = '0%';

    // Clear feedback
    document.getElementById('feedback-section').textContent = '';

    // Remove buttons in modal
    const buttonsContainer = document.querySelector('.buttons-container');
    if (buttonsContainer) {
        buttonsContainer.parentNode.removeChild(buttonsContainer);
    }

    // Remove completion class
    document.getElementById('quiz-container').classList.remove('completed');
    document.getElementById('quiz-completion-modal').classList.remove('completed');
}


function exitQuiz() {
    // Redirect to a blank page or any desired destination
    window.location.href = 'results.html';
}

// Initial display
displayQuestion();
