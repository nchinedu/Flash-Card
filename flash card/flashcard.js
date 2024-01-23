document.addEventListener('DOMContentLoaded', function () {
    const flashcard = document.getElementById('flashcard');
    const showAnswerBtn = document.getElementById('show-answer-btn');
    const hideAnswerBtn = document.getElementById('hide-answer-btn');
    const nextCardBtn = document.getElementById('next-card-btn');
    const addCardBtn = document.getElementById('add-card-btn');
    const questionInput = document.getElementById('question-input');
    const answerInput = document.getElementById('answer-input');
    const answer = document.getElementById('answer');

    let currentCardIndex = 0;

    showAnswerBtn.addEventListener('click', function () {
        answer.style.display = 'block';
    });

    hideAnswerBtn.addEventListener('click', function () {
        answer.style.display = 'none';
    });

    nextCardBtn.addEventListener('click', function () {
        // Handle fetching the next flashcard from the server
        fetch('/api/flashcards')  // Update the URL to match the server endpoint
            .then(response => response.json())
            .then(flashcards => {
                currentCardIndex = (currentCardIndex + 1) % flashcards.length;
                updateFlashcard(flashcards[currentCardIndex]);
            })
            .catch(error => console.error('Error fetching flashcards:', error));
    });
    
    
    addCardBtn.addEventListener('click', function () {
        const newCard = {
            question: questionInput.value,
            answer: answerInput.value,
        };
    
        // Handle sending the new flashcard to the server
        fetch('/api/flashcards', {  // Update the URL to match the server endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCard),
        })
            .then(response => response.json())
            .then(addedCard => {
                console.log('Flashcard added:', addedCard);
            })
            .catch(error => console.error('Error adding flashcard:', error));
    
        questionInput.value = '';
        answerInput.value = '';
    });
    

    function updateFlashcard(currentCard) {
        document.getElementById('question').textContent = currentCard.question;
        document.getElementById('answer').textContent = currentCard.answer;
        answer.style.display = 'none';
    }
});
