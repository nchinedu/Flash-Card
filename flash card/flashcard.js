document.addEventListener('DOMContentLoaded', function () {
    const flashcard = document.getElementById('flashcard');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const hideAnswerBtn = document.getElementById('hide-answer-btn');
    const nextCardBtn = document.getElementById('next-card-btn');
    const addCardBtn = document.getElementById('add-card-btn');
    const questionInput = document.getElementById('question-input');
    const answerInput = document.getElementById('answer-input');
    const answer = document.getElementById('answer');

    let flashcards = [
        { question: 'What is HTML?', answer: 'Hypertext Markup Language' },
        // Add more initial flashcards as needed
    ];

    let currentCardIndex = 0;

    showAnswerBtn.addEventListener('click', function () {
        answer.style.display = 'block';
    });

    hideAnswerBtn.addEventListener('click', function () {
        answer.style.display = 'none';
    });

    nextCardBtn.addEventListener('click', function () {
        currentCardIndex = (currentCardIndex + 1) % flashcards.length;
        updateFlashcard(flashcards[currentCardIndex]);
    });

    addCardBtn.addEventListener('click', function () {
        const newCard = {
            question: questionInput.value,
            answer: answerInput.value,
        };

        flashcards.push(newCard);
        updateFlashcard(newCard);

        questionInput.value = '';
        answerInput.value = '';
    });

    function updateFlashcard(currentCard) {
        document.getElementById('question').textContent = currentCard.question;
        document.getElementById('answer').textContent = currentCard.answer;
        answer.style.display = 'none';
    }

    // Initial display
    updateFlashcard(flashcards[currentCardIndex]);
});
