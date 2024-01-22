let flashcards = [];

function addCard() {
    const frontInput = document.getElementById('frontInput');
    const backInput = document.getElementById('backInput');

    const newCard = {
        front: frontInput.value,
        back: backInput.value
    };

    flashcards.push(newCard);

    // Save flashcards to server
    saveFlashcardsToServer();

    // Clear input fields
    frontInput.value = '';
    backInput.value = '';
}

async function saveFlashcardsToServer() {
    try {
        const response = await fetch('/api/flashcards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ flashcards }),
        });

        if (!response.ok) {
            throw new Error(`Error saving flashcards: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Flashcards saved to server:', data);
    } catch (error) {
        console.error('Error saving flashcards:', error);
    }
}

async function loadFlashcardsFromServer() {
    try {
        const response = await fetch('/api/flashcards');
        
        if (!response.ok) {
            throw new Error(`Error fetching flashcards: ${response.statusText}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
            flashcards = data;
            updateCardSlider();
        } else {
            console.error('Invalid response format:', data);
        }
    } catch (error) {
        console.error('Error fetching flashcards:', error);
    }
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
