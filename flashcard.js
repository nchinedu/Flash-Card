document.addEventListener('DOMContentLoaded', () => {
    fetchFlashcards();

    document.getElementById('showFlashcardsButton').addEventListener('click', () => {
        fetchFlashcards();
    });
});

async function fetchFlashcards() {
    const flashcardContainer = document.getElementById('flashcardContainer');
    flashcardContainer.innerHTML = '';

    try {
        const response = await fetch('/api/flashcards');
        const data = await response.json();

        if (data.success) {
            const flashcards = data.flashcards;
            flashcards.forEach(flashcard => {
                const cardElement = createFlashcardElement(flashcard);
                flashcardContainer.appendChild(cardElement);
            });
        } else {
            console.error('Failed to fetch flashcards:', data.error);
        }
    } catch (error) {
        console.error('Error fetching flashcards:', error.message);
    }
}

function createFlashcardElement(flashcard) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('flashcard');

    const questionElement = document.createElement('p');
    questionElement.textContent = `Question: ${flashcard.question}`;

    const answerElement = document.createElement('p');
    answerElement.textContent = `Answer: ${flashcard.answer}`;

    cardElement.appendChild(questionElement);
    cardElement.appendChild(answerElement);

    return cardElement;
}
