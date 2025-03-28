export class ProgressTracker {
    constructor() {
        this.stats = this.loadStats();
    }

    loadStats() {
        const stats = localStorage.getItem('flashcard-stats');
        return stats ? JSON.parse(stats) : {
            cardsStudied: 0,
            correctAnswers: 0,
            studyTime: 0,
            lastStudied: null,
            deckProgress: {}
        };
    }

    saveStats() {
        localStorage.setItem('flashcard-stats', JSON.stringify(this.stats));
    }

    recordCardReview(deckId, isCorrect) {
        this.stats.cardsStudied++;
        if (isCorrect) this.stats.correctAnswers++;
        
        if (!this.stats.deckProgress[deckId]) {
            this.stats.deckProgress[deckId] = {
                totalCards: 0,
                mastered: 0
            };
        }
        
        this.stats.lastStudied = new Date().toISOString();
        this.saveStats();
    }

    getProgress(deckId) {
        return this.stats.deckProgress[deckId] || { totalCards: 0, mastered: 0 };
    }

    getOverallProgress() {
        return {
            totalStudied: this.stats.cardsStudied,
            accuracy: this.stats.cardsStudied ? 
                (this.stats.correctAnswers / this.stats.cardsStudied * 100).toFixed(1) : 0,
            lastStudied: this.stats.lastStudied
        };
    }
}