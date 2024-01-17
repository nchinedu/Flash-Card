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


// Quiz State
let currentQuestionIndex = 0;
let userScore = 0;

// Event listener for the "Next" button
document.getElementById('next-button').addEventListener('click', () => {
    moveToNextQuestion();
});

// Event listener for the modal close button
document.querySelector('.close').addEventListener('click', closeModal);

// Function to display the current question
function displayQuestion() {
    try {
        // Fetch the current question from the quizQuestions array
        const currentQuestion = quizQuestions[currentQuestionIndex];

        // Check if the current question is undefined (out of bounds)
        if (!currentQuestion) {
            throw new Error('No more questions available.');
        }

        // Update the question text on the UI
        document.getElementById('question-text').innerHTML = `
        <p>Category: ${currentQuestion.category}</p>
        <p>Difficulty: ${currentQuestion.difficulty}</p>
        <h2>${currentQuestion.question}</h2>
    `;
        // Update the options on the UI
        const optionsContainer = document.getElementById('options-section');
        optionsContainer.innerHTML = ''; // Clear previous options

        currentQuestion.options.forEach((option, index) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;
            optionButton.addEventListener('click', () => handleUserInput(option));
            optionsContainer.appendChild(optionButton);
        });
    } catch (error) {
        console.error('Error displaying question:', error.message);
        // Display an error message to the user on the UI
        document.getElementById('error-message').textContent = 'Error loading question. Please try again.';
    }
}

// Function to handle user input
function handleUserInput(selectedOption) {
    try {
        const currentQuestion = quizQuestions[currentQuestionIndex];

        const selectedOptionIndex = currentQuestion.options.indexOf(selectedOption);

        if (selectedOption === currentQuestion.correctAnswer) {
            // Update user score for correct answer
            userScore++;
        }

        document.querySelectorAll('.options button')[selectedOptionIndex].classList.add(selectedOption === currentQuestion.correctAnswer ? 'correct' : 'incorrect');
        if (selectedOption !== currentQuestion.correctAnswer) {
            const correctAnswerIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
            document.querySelectorAll('.options button')[correctAnswerIndex].classList.add('correct');
        }
        // Move to the next question after a brief delay
        setTimeout(() => {
            // Clear feedback
            document.querySelectorAll('.options button').forEach(button => {
                button.classList.remove('correct', 'incorrect');
            });
            // Move to the next question
            moveToNextQuestion();
        }, 1000); // 1000 milliseconds (1 second) delay, adjust as needed
    } catch (error) {
        console.error('Error handling user input:', error.message);
        // Optionally, display an error message to the user on the UI
        document.getElementById('error-message').textContent = 'Error processing your answer. Please try again.';
    }
}

// Function to move to the next question
function moveToNextQuestion() {
    // Move to the next question index
    currentQuestionIndex++;

    // Check if the quiz is completed
    if (currentQuestionIndex < quizQuestions.length) {
        // Display the next question
        displayQuestion();
    } else {
        // The quiz is completed, show the completion modal
        openModal();
        // Display the user's score in the modal
        document.getElementById('user-score').textContent = userScore;
    }
    updateProgressBar();
}


function updateProgressBar() {
    const progress = (currentQuestionIndex / quizQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

// Function to open the completion modal
function openModal() {
    const modal = document.getElementById('quiz-completion-modal');
    modal.style.display = 'block';

    // Optionally, you can perform additional actions when the modal opens

    // Add a class to indicate completion
    document.getElementById('quiz-container').classList.add('completed');
    modal.classList.add('completed');
}

// Function to close the completion modal
function closeModal() {
    const modal = document.getElementById('quiz-completion-modal');
    modal.style.display = 'none';

    // Reset the quiz state for a new quiz
    currentQuestionIndex = 0;
    userScore = 0;

    // Remove the class for completion
    document.getElementById('quiz-container').classList.remove('completed');
    modal.classList.remove('completed');

    // Optionally, you can perform additional actions when the modal closes
}
