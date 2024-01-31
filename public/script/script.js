let quizQuestions;

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

async function fetchQuizQuestions() {
    try {
        const response = await fetch('https://flashcard-backend-beryl.vercel.app/db/first-cluster/questions');
        return await response.json();
    } catch (e) {
        console.error('Error fetching quiz questions', e);
        throw e;
    }
}

async function initializeQuiz() {
    try {
        quizQuestions = await fetchQuizQuestions();
        console.log(quizQuestions)
        shuffleArray(quizQuestions);
        displayQuestion();
    } catch (e) {
        console.error('Error initializing quiz:', e);
    }
}

let selectedCategory = 'all';
let currentQuestionIndex = 0;
let userScore = 0;

document.querySelector('.close').addEventListener('click', closeModal);


function displayQuestion() {
    try {
        const currentQuestion = quizQuestions[currentQuestionIndex];

        if (!currentQuestion) {
            throw new Error('No more questions available.');
        }

        shuffleOptions(currentQuestion);

        // Check if the question has been answered before
        const answeredCorrectly = currentQuestion.answeredCorrectly === true;
        const answeredIncorrectly = currentQuestion.answeredCorrectly === false;

        document.getElementById('question-text').innerHTML = `<h2>${currentQuestion.question}</h2>`;

        const optionsContainer = document.getElementById('options-section');
        optionsContainer.innerHTML = '';

        currentQuestion.options.forEach((option) => {
            const optionButton = document.createElement('button');
            optionButton.textContent = option;

            // Add classes based on the previous answer
            if (answeredCorrectly) {
                optionButton.classList.add('correct');
            } else if (answeredIncorrectly && option === currentQuestion.correctAnswer) {
                optionButton.classList.add('correct');
            } else if (answeredIncorrectly && option === currentQuestion.userAnswer) {
                optionButton.classList.add('incorrect');
            }

            optionButton.addEventListener('click', () => handleUserInput(option));
            optionsContainer.appendChild(optionButton);
        });
    } catch (e) {

    }
}


function handleUserInput(selectedOption) {
    try {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const optionsContainer = document.getElementById('options-section');
        optionsContainer.querySelectorAll('button').forEach(button => {
            button.disabled = true;
        });
        currentQuestion.userAnswer = selectedOption;
        currentQuestion.answeredCorrectly = selectedOption === currentQuestion.correctAnswer;

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

function displayIncorrectAnswers() {
    const modalContent = document.querySelector('.modal-content');
    const incorrectAnswersContainer = document.createElement('div');
    incorrectAnswersContainer.classList.add('incorrect-answers-container');

    // Filter questions that were answered incorrectly
    const incorrectQuestions = quizQuestions.filter(question => question.answeredCorrectly === false);

    incorrectQuestions.forEach((question, index) => {
        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');

        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${question.question}`;
        questionContainer.appendChild(questionText);

        const userAnswer = document.createElement('p');
        userAnswer.textContent = `Your Answer: ${question.userAnswer}`;
        questionContainer.appendChild(userAnswer);

        const correctAnswer = document.createElement('p');
        correctAnswer.textContent = `Correct Answer: ${question.correctAnswer}`;
        questionContainer.appendChild(correctAnswer);

        // incorrectAnswersContainer.appendChild(questionContainer);
    });

    modalContent.appendChild(incorrectAnswersContainer);
}

function openModal() {
    const modal = document.getElementById('quiz-completion-modal');
    const body = document.body;
    body.classList.add('modal-open');
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

    // Display incorrect answers
    displayIncorrectAnswers();
    displayScoreChart();
}

function closeModal() {
    const modal = document.getElementById('quiz-completion-modal');
    const body = document.body;
    body.classList.remove('modal-open')

    currentQuestionIndex = 0;
    userScore = 0;
    document.getElementById('quiz-container').classList.remove('completed');

    modal.classList.remove('completed');
    modal.style.display = 'none';
    window.location.href = '../../index.html';
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

function tryAgain() {
    closeModal();
    resetQuiz();
    shuffleArray(quizQuestions);
    displayQuestion();
    location.reload();
}

function resetQuiz() {
    currentQuestionIndex = 0;
    userScore = 0;

    // Remove highlighting and progress bar
    document.querySelectorAll('#options-section button').forEach(button => {
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
    quizQuestions.forEach(question => {
        question.userAnswerIndex = -1;
    });
}

function exitQuiz() {
    // Check if already on the results page
    // if (window.location.pathname.includes('results.html')) {
    //     return;  // Exit the function to avoid continuous execution
    // }

    // Create chart data
    const correctPercentage = (userScore / quizQuestions.length) * 100;
    const incorrectPercentage = 100 - correctPercentage;

    // Redirect to the results page with URL parameters
    // const resultsUrl = './results.html';
    window.location.href = resultsUrl + '?correctPercentage=' + correctPercentage + '&incorrectPercentage=' + incorrectPercentage;
}

function displayScoreChart() {
    const modalContent = document.querySelector('.modal-content');

    // Create a container for the grid layout
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');

    // Create a container for the chart and add it to the grid
    const chartContainer = document.createElement('div');
    chartContainer.classList.add('chart-container');
    // gridContainer.appendChild(chartContainer);

    const canvas = document.createElement('canvas');
    canvas.id = 'scoreChart';
    chartContainer.appendChild(canvas);
    gridContainer.appendChild(chartContainer);
    // Iterate through quiz questions to display feedback
    quizQuestions.forEach((question, index) => {
        const feedbackItem = document.createElement('div');
        feedbackItem.classList.add('feedback-item');

        // Display question text
        const questionText = document.createElement('p');
        questionText.textContent = `${index + 1}. ${question.question}`;
        feedbackItem.appendChild(questionText);

        // Create a container for options
        const optionsContainer = document.createElement('ul');
        optionsContainer.classList.add('options-container');

        // Iterate through options to display them
        question.options.forEach((option, optionIndex) => {
            const optionElement = document.createElement('li');
            optionElement.classList.add('option');

            // Display the option text
            const optionText = document.createElement('span');
            optionText.classList.add('option-text');
            optionText.textContent = option;
            optionElement.appendChild(optionText);

            // Display (❌) or (✔) based on correctness
            if (question.userAnswer === option) {
                optionElement.classList.add(question.userAnswer === question.correctAnswer ? 'correct-answer' : 'incorrect-answer');
            } else if (option === question.correctAnswer) {
                optionElement.classList.add('correct-answer');
            }

            optionsContainer.appendChild(optionElement);
        });

        feedbackItem.appendChild(optionsContainer);
        gridContainer.appendChild(feedbackItem);
    });

    // Add the grid container to the modal content
    modalContent.appendChild(gridContainer);


    // const canvas = document.getElementById('scoreChart');
    const ctx = canvas.getContext('2d');
    const correctPercentage = (userScore / quizQuestions.length) * 100;
    const incorrectPercentage = 100 - correctPercentage;

    new Chart(ctx, {
        type: 'pie',
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
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[0];
                        const currentValue = dataset.data[tooltipItem.index];
                        return currentValue.toFixed(2) + '%';
                    },
                },
            },
        },
    });

    const buttonsContainer = document.querySelector('.buttons-container');
    if (buttonsContainer) {
        buttonsContainer.style.display = 'none';
    }
}

displayQuestion();
initializeQuiz();