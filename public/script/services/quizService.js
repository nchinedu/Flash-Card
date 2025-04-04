import API_CONFIG from '../config/api.js';

class QuizService {
    async fetchQuestions() {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.questions}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching questions:', error);
            return this.getFallbackQuestions();
        }
    }

    async saveStats(stats) {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.stats}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(stats)
            });
            return await response.json();
        } catch (error) {
            console.error('Error saving stats:', error);
            return null;
        }
    }

    getFallbackQuestions() {
        return [
            {
                question: "What is HTML?",
                options: ["Hypertext Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "None of these"],
                correctAnswer: "Hypertext Markup Language"
            },
            {
                question: "What is CSS?",
                options: ["Cascading Style Sheets", "Computer Style Sheets", "Creative Style System", "None of these"],
                correctAnswer: "Cascading Style Sheets"
            }
        ];
    }
}

export default new QuizService();