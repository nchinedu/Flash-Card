const flashcards = [
  {
    question: "Flashcard Question 1",
    answer: "Answer 1"
  },
  {
    question: "Flashcard Question 2",
    answer: "Answer 2"
  },
  
];


const width = window.screen.width;
const height = window.screen.height;
const body = document.querySelector('body');
body.style.backgroundImage = `url(https://source.unsplash.com/random/${width}x${height}?study`;


// Function to update flashcard content
function updateFlashcard(index) {
  const flashcardFront = document.querySelector('.flashcard-front p');
  const flashcardBack = document.querySelector('.flashcard-back p');

  flashcardFront.textContent = flashcards[index].question;
  flashcardBack.textContent = flashcards[index].answer;
}

let currentCardIndex = 0;

// Function to show the next flashcard
function nextCard() {
  currentCardIndex = (currentCardIndex + 1) % flashcards.length;
  updateFlashcard(currentCardIndex);
}

// Function to show the previous flashcard
function prevCard() {
  currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
  updateFlashcard(currentCardIndex);
}

// Function to open the add card modal
function openAddCardModal() {
  const addCardModal = document.getElementById('addCardModal');
  addCardModal.style.display = addCardModal.style.display === 'none' ? 'block' : 'none';
  
}

function closeAddCardModal() {
  const addCardModal = document.getElementById('addCardModal');
  addCardModal.style.display = 'none';
}

async function addCard() {
  const question = document.getElementById('questionInput').value;
  const answer = document.getElementById('answerInput').value;

  if (question && answer) {
    try {
      // Create an object with question and answer properties
      const newFlashcard = { question, answer };

      // Save the new flashcard to the MongoDB database
      const savedFlashcard = await fetch('/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFlashcard),
      }).then((response) => response.json());

      // Update the local flashcards array
      flashcards.push(newFlashcard);

      closeAddCardModal();
      updateFlashcard(currentCardIndex);
    } catch (error) {
      console.error('Error saving flashcard:', error);
    }
  }
}


async function fetchFlashcards() {
  try {
    // Fetch flashcards from the MongoDB database
    const response = await fetch('/api/flashcards');
    const fetchedFlashcards = await response.json();
    console.log('Response:', response); // Log the entire response
    console.log('Fetched Flashcards:', fetchedFlashcards);
    // Update the local flashcards array
    flashcards.splice(0, flashcards.length, ...fetchedFlashcards);

    // Update the displayed flashcard
    updateFlashcard(currentCardIndex);
    console.log('Fetched Flashcards:', fetchedFlashcards);
  } catch (error) {
    console.error('Error fetching flashcards:', error);
  }
}

// Fetch flashcards when the page is loaded
window.addEventListener('load', fetchFlashcards);

