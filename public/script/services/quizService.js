import API_CONFIG from '../config/api.js';

class QuizService {
    async getQuestions() {
        try {
            const response = await fetch(`${API_CONFIG.baseURL}${API_CONFIG.endpoints.questions}`);
            if (!response.ok) throw new Error('Failed to fetch questions');
            return await response.json();
        } catch (error) {
            console.error('Quiz service error:', error);
            return this.getFallbackQuestions();
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