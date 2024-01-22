let currentCardIndex = 0;
// Load flashcards when the page loads
window.onload = loadFlashcardsFromServer;

function moveNext() {
    const cardList = document.getElementById('cardList');
    if (currentCardIndex < cardList.children.length - 1) {
        currentCardIndex++;
        updateCardVisibility();
    }
}

function movePrevious() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        updateCardVisibility();
    }
}

function updateCardVisibility() {
    const cards = document.querySelectorAll('.flashcard');

    cards.forEach((card, index) => {
        if (index === currentCardIndex) {
            card.classList.add('visible');
        } else {
            card.classList.remove('visible');
        }
    });
}

async function loadFlashcardsFromServer() {
    try {
        const response = await fetch('/api/flashcards');
        if (!response.ok) {
            throw new Error(`Error fetching flashcards: ${response.statusText}`);
        }

        const flashcards = await response.json();
        console.log('Flashcards from server:', flashcards);
        const cardList = document.getElementById('cardList');

        // Clear existing cards
        cardList.innerHTML = '';

        flashcards.forEach(card => {
            const cardElement = createCard(card.front, card.back);
            cardList.appendChild(cardElement);
        });

        // Ensure the correct card is visible
        updateCardVisibility();
    } catch (error) {
        console.error(error);
    }
}

function createCard(frontContent, backContent) {
    const card = document.createElement('div');
    card.className = 'flashcard';

    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';

    const front = document.createElement('div');
    front.className = 'front';
    front.innerHTML = `<p>${frontContent}</p>`;

    const back = document.createElement('div');
    back.className = 'back';
    back.innerHTML = `<p>${backContent}</p>`;

    cardInner.appendChild(front);
    cardInner.appendChild(back);

    card.appendChild(cardInner);

    card.addEventListener('click', function () {
        this.classList.toggle('flipped');
    });

    return card;
}




function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);

    // Toggle dropdown visibility
    dropdown.style.display = (dropdown.style.display === 'none' || dropdown.style.display === '') ? 'block' : 'none';

    // Get the dropdown and window dimensions
    const dropdownRect = dropdown.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    // Check if the dropdown goes beyond the right side of the screen
    if (dropdownRect.right > windowWidth) {
        // Calculate the adjusted left position to keep the dropdown within the screen
        const adjustedLeft = windowWidth - dropdownRect.width;

        // Ensure the adjusted left position is not negative
        dropdown.style.left = `${Math.max(adjustedLeft, 0)}px`;
    } else {
        // Reset left position if the dropdown is within the screen
        dropdown.style.left = '';
    }
}
