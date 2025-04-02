export class CardStorage {
    static getCards() {
        const cards = localStorage.getItem('flashcards');
        return cards ? JSON.parse(cards) : [];
    }

    static saveCards(cards) {
        localStorage.setItem('flashcards', JSON.stringify(cards));
    }

    static addCard(card) {
        const cards = this.getCards();
        cards.push(card);
        this.saveCards(cards);
    }

    static deleteCard(index) {
        const cards = this.getCards();
        cards.splice(index, 1);
        this.saveCards(cards);
    }

    static updateCard(index, updatedCard) {
        const cards = this.getCards();
        cards[index] = updatedCard;
        this.saveCards(cards);
    }
}