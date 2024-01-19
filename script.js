// Shuffle function to randomize the order of questions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function shuffleOptions(question) {
    if (selectedCategory === 'all' || question.category === selectedCategory) {
        shuffleArray(question.options);
    }
}

const quizQuestions = [
    {
        category: 'Medical',
        difficulty: 'Medium',
        question: 'What is the name of the cell\'s powerhouse?',
        options: ['Nucleus', 'Mitochondria', 'Endoplasmic Reticulum', 'Golgi Apparatus'],
        correctAnswer: 'Mitochondria'
    },
    {
        category: 'General Knowledge',
        difficulty: 'Easy',
        question: 'Which planet, known as the Red Planet, is the fourth planet from the Sun and has a reddish appearance?',
        options: ['Earth', 'Mars', 'Venus', 'Jupiter'],
        correctAnswer: 'Mars'
    },
    {
        category: 'Psychological',
        difficulty: 'Hard',
        question: 'Who developed the stages of cognitive development theory, including sensorimotor, preoperational, concrete operational, and formal operational stages?',
        options: ['Jean Piaget', 'Sigmund Freud', 'Erik Erikson', 'Abraham Maslow'],
        correctAnswer: 'Jean Piaget'
    },
    {
        category: 'Anime',
        difficulty: 'Medium',
        question: 'Who is the main protagonist in the anime "Naruto"?',
        options: ['Sasuke Uchiha', 'Hinata Hyuga', 'Naruto Uzumaki', 'Sakura Haruno'],
        correctAnswer: 'Naruto Uzumaki'
    },
    {
        category: 'Web-Based/Internet Programming',
        difficulty: 'Easy',
        question: 'What does CSS stand for in the context of web development?',
        options: ['Counter Strike: Source', 'Cascading Style Sheet', 'Computer Style Sheet', 'Creative Style System'],
        correctAnswer: 'Cascading Style Sheet'
    },
];

let selectedCategory = 'all';
let currentQuestionIndex = 0;
let userScore = 0;
shuffleArray(quizQuestions);

document.querySelector('.close').addEventListener('click', closeModal);

function changeCategory() {
    selectedCategory = document.getElementById('category-dropdown').value;
    currentQuestionIndex = 0; // Reset question index when changing category
    displayQuestion();
}

function displayQuestion() {
    const filteredQuestions = selectedCategory === 'all'
        ? quizQuestions
        : quizQuestions.filter(question => question.category === selectedCategory);
    try {
        const currentQuestion = quizQuestions[currentQuestionIndex];

        if (!currentQuestion) {
            throw new Error('No more questions available.');
        }

        shuffleOptions(currentQuestion);
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
        const optionsContainer = document.getElementById('options-section');
        optionsContainer.querySelectorAll('button').forEach(button => {
            button.disabled = true;
        });
        const selectedOptionIndex = currentQuestion.options.indexOf(selectedOption);
        if (selectedOption === currentQuestion.correctAnswer) {
            userScore++;
            optionsContainer.querySelector(`button:nth-child(${selectedOptionIndex + 1})`).classList.add('correct');
        } else {
            optionsContainer.querySelector(`button:nth-child(${selectedOptionIndex + 1})`).classList.add('incorrect');
            const correctOptionIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
            optionsContainer.querySelector(`button:nth-child(${correctOptionIndex + 1})`).classList.add('correct');
        }
        optionsContainer.querySelectorAll('button').forEach(button => {
            button.disabled = true;
        });

        setTimeout(() => {
            optionsContainer.querySelectorAll('button').forEach(button => {
                button.classList.remove('correct', 'incorrect');
                button.disabled = false; // Re-enable buttons for the next question
            });

            moveToNextQuestion(); // Automatically move to the next question
        }, 1000); // 1000 milliseconds (1 second) delay, adjust as needed
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
    const filteredQuestions = selectedCategory === 'all'
        ? quizQuestions
        : quizQuestions.filter(question => question.category === selectedCategory);

    const progress = (currentQuestionIndex / filteredQuestions.length) * 100;
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
    displayScoreChart();
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
    shuffleArray(quizQuestions);
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
    shuffleArray(quizQuestions);
}

function exitQuiz() {
    // Check if already on the results page
    if (window.location.pathname.includes('results.html')) {
        return;  // Exit the function to avoid continuous execution
    }

    // Create chart data
    const correctPercentage = (userScore / quizQuestions.length) * 100;
    const incorrectPercentage = 100 - correctPercentage;

    // Redirect to the results page with URL parameters
    const resultsUrl = './results.html';
    window.location.href = resultsUrl + '?correctPercentage=' + correctPercentage + '&incorrectPercentage=' + incorrectPercentage;
}

function displayScoreChart() {
    const canvas = document.getElementById('scoreChart');
    const ctx = canvas.getContext('2d');

    const correctPercentage = (userScore / quizQuestions.length) * 100;
    const incorrectPercentage = 100 - correctPercentage;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Correct', 'Incorrect'],
            datasets: [{
                data: [correctPercentage, incorrectPercentage],
                backgroundColor: ['#4caf50', '#f44336'],
            }],
        },
        options: {
            title: {
                display: true,
                text: 'Quiz Results',
                fontSize: 16, // Adjust title font size
            },
            legend: {
                display: true,
                position: 'bottom', // Position of the legend
            },
            responsive: true, // Enable responsiveness
            maintainAspectRatio: false, // Disable default aspect ratio
        },
    });

    const buttonsContainer = document.querySelector('.buttons-container');
    if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
    }
}

displayQuestion();