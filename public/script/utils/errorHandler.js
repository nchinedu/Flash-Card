export class QuizError extends Error {
    constructor(message, type = 'general') {
        super(message);
        this.type = type;
        this.timestamp = new Date();
        this.recoveryAttempts = 0;
        this.animationState = 'initial';
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
    container.className = 'error-recovery-container animate-slide-in';

    const messageEl = document.createElement('p');
    messageEl.textContent = error.message;
    messageEl.className = 'error-message animate-fade-in';
    container.appendChild(messageEl);

    const actions = document.createElement('div');
    actions.className = 'recovery-actions animate-scale-in';

    // Enhanced buttons with animations
    const retryBtn = createActionButton('Retry', () => {
        animateButtonClick(retryBtn);
        setTimeout(() => {
            error.recoveryAttempts++;
            window.location.reload();
        }, 300);
    });

    const skipBtn = createActionButton('Skip Question', () => {
        animateButtonClick(skipBtn);
        setTimeout(() => {
            document.dispatchEvent(new CustomEvent('quiz-skip-question'));
        }, 300);
    });

    const offlineBtn = createActionButton('Continue Offline', () => {
        animateButtonClick(offlineBtn);
        setTimeout(() => {
            localStorage.setItem('quiz-offline-mode', 'true');
            window.location.reload();
        }, 300);
    });

    const helpBtn = createActionButton('Get Help', () => {
        animateButtonClick(helpBtn);
        showHelpModal(error);
    });

    actions.append(retryBtn, skipBtn, offlineBtn, helpBtn);
    container.appendChild(actions);

    return container;
}

function animateButtonClick(button) {
    button.classList.add('animate-click');
    setTimeout(() => button.classList.remove('animate-click'), 300);
}

function showHelpModal(error) {
    const modal = document.createElement('div');
    modal.className = 'help-modal animate-modal';
    modal.innerHTML = `
        <div class="help-content animate-content">
            <h3 class="animate-title">Error Details</h3>
            <div class="error-info animate-info">
                <p>Type: ${error.type}</p>
                <p>Time: ${error.timestamp.toLocaleString()}</p>
                <p>Recovery Attempts: ${error.recoveryAttempts}</p>
            </div>
            <div class="help-actions animate-actions">
                <button class="support-btn" onclick="window.location.href='/support'">Contact Support</button>
                <button class="close-btn" onclick="this.closest('.help-modal').classList.add('animate-modal-out'); setTimeout(() => this.closest('.help-modal').remove(), 300)">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

export const clearError = (errorElement) => {
    if (errorElement) {
        errorElement.classList.add('animate-fade-out');
        setTimeout(() => {
            errorElement.innerHTML = '';
            errorElement.classList.remove('show', 'animate-fade-out');
        }, 300);
    }
};

function createActionButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'recovery-action-btn';
    button.addEventListener('click', onClick);
    return button;
}