export class QuizError extends Error {
    constructor(message, type = 'general') {
        super(message);
        this.type = type;
        this.timestamp = new Date();
    }
}

export const handleError = (error, errorElement) => {
    console.error('Quiz Error:', error);
    const message = error instanceof QuizError 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
        setTimeout(() => {
            errorElement.classList.remove('show');
        }, 5000);
    }
};