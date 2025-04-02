import { CardStorage } from '../utils/storage.js';
import { DeckManager } from './deck.js';
import { ProgressTracker } from '../utils/progress.js';

export class FlashCard {
    constructor() {
        this.deckManager = new DeckManager();
        this.progressTracker = new ProgressTracker();
        this.currentDeckId = 'default';
        this.currentIndex = 0;
        this.container = document.querySelector('.flash-card-container');
        this.init();
    }

    init() {
        this.createCardInterface();
        this.bindEvents();
        this.updateCardDisplay();
    }

    createCardInterface() {
        const cardUI = `
            <div class="progress-stats">
                <div class="stats-container">
                    <span class="stats-label">Cards Studied:</span>
                    <span class="stats-value" id="cards-studied">0</span>
                </div>
                <div class="stats-container">
                    <span class="stats-label">Accuracy:</span>
                    <span class="stats-value" id="accuracy">0%</span>
                </div>
            </div>
            ${this.existingCardInterface}
            <div class="rating-buttons" style="display: none;">
                <button class="rate-btn" data-value="wrong">❌ Incorrect</button>
                <button class="rate-btn" data-value="correct">✅ Correct</button>
            </div>
        `;
        this.container.innerHTML = cardUI;
        this.updateStats();
    }

    bindEvents() {
        const addBtn = this.container.querySelector('.add-card');
        const editBtn = this.container.querySelector('.edit-card');
        const deleteBtn = this.container.querySelector('.delete-card');
        const flipBtn = this.container.querySelector('.flip-btn');
        const prevBtn = this.container.querySelector('.prev-btn');
        const nextBtn = this.container.querySelector('.next-btn');
        const saveBtn = this.container.querySelector('.save-card');
        const cancelBtn = this.container.querySelector('.cancel-card');
        
        addBtn.addEventListener('click', () => this.showAddCardForm());
        editBtn.addEventListener('click', () => this.showEditCardForm());
        deleteBtn.addEventListener('click', () => this.deleteCurrentCard());
        flipBtn.addEventListener('click', () => this.flipCard());
        prevBtn.addEventListener('click', () => this.showPreviousCard());
        nextBtn.addEventListener('click', () => this.showNextCard());
        saveBtn.addEventListener('click', () => this.saveCard());
        cancelBtn.addEventListener('click', () => {
            this.container.querySelector('.card-form').style.display = 'none';
        });
        
        const deckSelector = this.container.querySelector('.deck-selector');
        const newDeckBtn = this.container.querySelector('.new-deck');
        
        deckSelector.addEventListener('change', (e) => {
            this.currentDeckId = e.target.value;
            this.currentIndex = 0;
            this.updateCardDisplay();
        });
        
        newDeckBtn.addEventListener('click', () => this.showNewDeckForm());
    }

    showNewDeckForm() {
        const name = prompt('Enter deck name:');
        if (name) {
            const deckId = this.deckManager.createDeck(name);
            this.currentDeckId = deckId;
            this.updateDeckSelector();
            this.updateCardDisplay();
        }
    }

    showAddCardForm() {
        const form = this.container.querySelector('.card-form');
        form.style.display = 'block';
        this.isEditing = false;
    }

    showEditCardForm() {
        if (this.cards.length === 0) return;
        
        const form = this.container.querySelector('.card-form');
        const questionInput = form.querySelector('.question-input');
        const answerInput = form.querySelector('.answer-input');
        
        questionInput.value = this.cards[this.currentIndex].question;
        answerInput.value = this.cards[this.currentIndex].answer;
        
        form.style.display = 'block';
        this.isEditing = true;
    }

    saveCard() {
        const form = this.container.querySelector('.card-form');
        const question = form.querySelector('.question-input').value;
        const answer = form.querySelector('.answer-input').value;

        if (!question || !answer) return;

        const card = { question, answer };
        const currentDeck = this.deckManager.getDeck(this.currentDeckId);

        if (this.isEditing) {
            currentDeck.cards[this.currentIndex] = card;
        } else {
            currentDeck.cards.push(card);
            this.currentIndex = currentDeck.cards.length - 1;
        }

        this.deckManager.saveDecks();
        form.style.display = 'none';
        this.updateCardDisplay();
    }

    updateCardDisplay() {
        const currentDeck = this.deckManager.getDeck(this.currentDeckId);
        const cards = currentDeck.cards;
        
        const front = this.container.querySelector('.card-front .card-text');
        const back = this.container.querySelector('.card-back .card-text');

        if (cards.length === 0) {
            front.textContent = 'Click "Add Card" to begin';
            back.textContent = 'Answer will appear here';
            return;
        }

        const currentCard = cards[this.currentIndex];
        front.textContent = currentCard.question;
        back.textContent = currentCard.answer;
    }

    recordAnswer(isCorrect) {
        this.progressTracker.recordCardReview(this.currentDeckId, isCorrect);
        this.updateStats();
        
        // Auto-advance to next card after rating
        setTimeout(() => {
            this.showNextCard();
            this.container.querySelector('.rating-buttons').style.display = 'none';
        }, 500);
    }

    updateStats() {
        const progress = this.progressTracker.getOverallProgress();
        document.getElementById('cards-studied').textContent = progress.totalStudied;
        document.getElementById('accuracy').textContent = `${progress.accuracy}%`;
    }
}

export function FlashCards() {
    new FlashCard();
}
