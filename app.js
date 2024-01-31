// app.js

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('flashcardForm').addEventListener('submit', addFlashcard);
});

async function addFlashcard(event) {
    event.preventDefault();

    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;

    try {
        const response = await fetch('http://localhost:3000/api/flashcards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({question, answer}),
        });

        const data = await response.json();

        if (data.success) {
            console.log('Flashcard added successfully:', data.flashcard);
            // Optionally, you can reset the form or provide user feedback here
        } else {
            console.error('Failed to add flashcard:', data.error);
        }
    } catch (error) {
        console.error('Error adding flashcard:', error.message);
    }
}
