export class DeckManager {
    constructor() {
        this.decks = this.loadDecks();
        this.currentDeck = null;
    }

    loadDecks() {
        const decks = localStorage.getItem('flashcard-decks');
        return decks ? JSON.parse(decks) : {
            'Default': { id: 'default', name: 'Default', cards: [] }
        };
    }

    saveDecks() {
        localStorage.setItem('flashcard-decks', JSON.stringify(this.decks));
    }

    createDeck(name) {
        const id = name.toLowerCase().replace(/\s+/g, '-');
        this.decks[id] = { id, name, cards: [] };
        this.saveDecks();
        return id;
    }

    getDeck(id) {
        return this.decks[id];
    }

    addCardToDeck(deckId, card) {
        this.decks[deckId].cards.push(card);
        this.saveDecks();
    }
}