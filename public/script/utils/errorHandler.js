export class QuizError extends Error {
    constructor(message, type = 'general') {
        super(message);
        this.type = type;
        this.timestamp = new Date();
        this.recoveryAttempts = 0;
    }
}

export const ErrorTypes = {
    NETWORK: 'network',
    DATA: 'data',
    STATE: 'state',
    VALIDATION: 'validation',
    TIMEOUT: 'timeout'
};

export const handleError = (error, errorElement) => {
    console.error('Quiz Error:', error);
    const message = error instanceof QuizError ? error.message : 'An unexpected error occurred.';
    
    if (errorElement) {
        const recoveryUI = createRecoveryUI(error);
        errorElement.innerHTML = '';
        errorElement.appendChild(recoveryUI);
        errorElement.classList.add('show');
    }
};

function createRecoveryUI(error) {
    const container = document.createElement('div');
    container.className = 'error-recovery-container';

    const messageEl = document.createElement('p');
    messageEl.textContent = error.message;
    container.appendChild(messageEl);

    const actions = document.createElement('div');
    actions.className = 'recovery-actions';

    // Retry button
    const retryBtn = createActionButton('Retry', () => {
        error.recoveryAttempts++;
        window.location.reload();
    });

    // Skip button
    const skipBtn = createActionButton('Skip Question', () => {
        document.dispatchEvent(new CustomEvent('quiz-skip-question'));
    });

    // Offline Mode button
    const offlineBtn = createActionButton('Continue Offline', () => {
        localStorage.setItem('quiz-offline-mode', 'true');
        window.location.reload();
    });

    // Help button
    const helpBtn = createActionButton('Get Help', () => {
        showHelpModal(error);
    });

    actions.append(retryBtn, skipBtn, offlineBtn, helpBtn);
    container.appendChild(actions);

    return container;
}

function createActionButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'recovery-action-btn';
    button.addEventListener('click', onClick);
    return button;
}

function showHelpModal(error) {
    const modal = document.createElement('div');
    modal.className = 'help-modal';
    modal.innerHTML = `
        <div class="help-content">
            <h3>Error Details</h3>
            <p>Type: ${error.type}</p>
            <p>Time: ${error.timestamp.toLocaleString()}</p>
            <p>Recovery Attempts: ${error.recoveryAttempts}</p>
            <div class="help-actions">
                <button onclick="window.location.href='/support'">Contact Support</button>
                <button onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

export const clearError = (errorElement) => {
    if (errorElement) {
        errorElement.innerHTML = '';
        errorElement.classList.remove('show');
    }
};