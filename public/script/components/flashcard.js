import { CardStorage } from '../utils/storage.js';

export class FlashCard {
    constructor() {
        this.cards = CardStorage.getCards();
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
            <div class="controls">
                <button class="add-card">Add Card</button>
                <button class="edit-card">Edit Current</button>
                <button class="delete-card">Delete Current</button>
            </div>
            <div class="card">
                <div class="card-inner">
                    <div class="card-front">
                        <p class="card-text">Click "Add Card" to begin</p>
                    </div>
                    <div class="card-back">
                        <p class="card-text">Answer will appear here</p>
                    </div>
                </div>
            </div>
            <div class="navigation">
                <button class="prev-btn">Previous</button>
                <button class="flip-btn">Flip</button>
                <button class="next-btn">Next</button>
            </div>
            <div class="card-form" style="display: none;">
                <input type="text" class="question-input" placeholder="Enter question">
                <input type="text" class="answer-input" placeholder="Enter answer">
                <button class="save-card">Save</button>
                <button class="cancel-card">Cancel</button>
            </div>
        `;
        this.container.innerHTML = cardUI;
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

        if (this.isEditing) {
            CardStorage.updateCard(this.currentIndex, card);
            this.cards[this.currentIndex] = card;
        } else {
            CardStorage.addCard(card);
            this.cards.push(card);
            this.currentIndex = this.cards.length - 1;
        }

        form.style.display = 'none';
        this.updateCardDisplay();
    }

    deleteCurrentCard() {
        if (this.cards.length === 0) return;

        CardStorage.deleteCard(this.currentIndex);
        this.cards = CardStorage.getCards();
        
        if (this.currentIndex >= this.cards.length) {
            this.currentIndex = Math.max(0, this.cards.length - 1);
        }
        
        this.updateCardDisplay();
    }

    updateCardDisplay() {
        const front = this.container.querySelector('.card-front .card-text');
        const back = this.container.querySelector('.card-back .card-text');

        if (this.cards.length === 0) {
            front.textContent = 'Click "Add Card" to begin';
            back.textContent = 'Answer will appear here';
            return;
        }

        const currentCard = this.cards[this.currentIndex];
        front.textContent = currentCard.question;
        back.textContent = currentCard.answer;
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
    }

    flipCard() {
        const cardInner = this.container.querySelector('.card-inner');
        cardInner.classList.toggle('flipped');
    }

    showPreviousCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCardDisplay();
        }
    }

    showNextCard() {
        if (this.currentIndex < this.cards.length - 1) {
            this.currentIndex++;
            this.updateCardDisplay();
        }
    }
}

export function initializeFlashCards() {
    new FlashCard();
}
