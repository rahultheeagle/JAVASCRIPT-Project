class ErrorHandler {
    constructor() {
        this.errorLog = [];
        this.errorMessages = new Map();
        this.setupGlobalHandlers();
        this.initializeMessages();
    }

    // Initialize user-friendly error messages
    initializeMessages() {
        this.errorMessages.set('NetworkError', 'Connection problem. Please check your internet.');
        this.errorMessages.set('ValidationError', 'Please check your input and try again.');
        this.errorMessages.set('AuthError', 'Please log in to continue.');
        this.errorMessages.set('NotFoundError', 'The requested item was not found.');
        this.errorMessages.set('TimeoutError', 'Request took too long. Please try again.');
        this.errorMessages.set('ServerError', 'Server is having issues. Please try later.');
        this.errorMessages.set('PermissionError', 'You don\'t have permission for this action.');
        this.errorMessages.set('QuotaError', 'Storage limit reached. Please free up space.');
        this.errorMessages.set('SyntaxError', 'Invalid format. Please check your input.');
        this.errorMessages.set('TypeError', 'Unexpected data type. Please try again.');
    }

    // Global error handlers
    setupGlobalHandlers() {
        window.addEventListener('error', (event) => {
            this.handleError(event.error, 'Global Error');
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(event.reason, 'Unhandled Promise');
            event.preventDefault();
        });
    }

    // Main error handling method
    handleError(error, context = 'Unknown') {
        const errorInfo = this.processError(error, context);
        this.logError(errorInfo);
        this.displayError(errorInfo);
        return errorInfo;
    }

    // Process error into standardized format
    processError(error, context) {
        const errorInfo = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            context,
            type: error.name || 'Error',
            message: error.message || 'An unexpected error occurred',
            stack: error.stack,
            userMessage: this.getUserMessage(error)
        };

        return errorInfo;
    }

    // Get user-friendly message
    getUserMessage(error) {
        const errorType = error.name || 'Error';
        
        if (this.errorMessages.has(errorType)) {
            return this.errorMessages.get(errorType);
        }

        // Pattern matching for common errors
        const message = error.message?.toLowerCase() || '';
        
        if (message.includes('network') || message.includes('fetch')) {
            return 'Connection problem. Please check your internet.';
        }
        if (message.includes('timeout')) {
            return 'Request took too long. Please try again.';
        }
        if (message.includes('permission') || message.includes('unauthorized')) {
            return 'You don\'t have permission for this action.';
        }
        if (message.includes('not found') || message.includes('404')) {
            return 'The requested item was not found.';
        }
        if (message.includes('validation') || message.includes('invalid')) {
            return 'Please check your input and try again.';
        }

        return 'Something went wrong. Please try again.';
    }

    // Log error
    logError(errorInfo) {
        this.errorLog.push(errorInfo);
        console.error(`[${errorInfo.context}]`, errorInfo);
        
        // Keep only last 100 errors
        if (this.errorLog.length > 100) {
            this.errorLog.shift();
        }
    }

    // Display error to user
    displayError(errorInfo, options = {}) {
        const { 
            container = document.body, 
            duration = 5000, 
            type = 'error',
            showDetails = false 
        } = options;

        const errorElement = this.createErrorElement(errorInfo, { type, showDetails });
        container.appendChild(errorElement);

        if (duration > 0) {
            setTimeout(() => errorElement.remove(), duration);
        }

        return errorElement;
    }

    // Create error display element
    createErrorElement(errorInfo, options = {}) {
        const { type = 'error', showDetails = false } = options;
        
        const element = document.createElement('div');
        element.className = `error-toast error-${type}`;
        element.innerHTML = `
            <div class="error-content">
                <div class="error-icon">${this.getErrorIcon(type)}</div>
                <div class="error-text">
                    <div class="error-message">${errorInfo.userMessage}</div>
                    ${showDetails ? `<div class="error-details">${errorInfo.message}</div>` : ''}
                </div>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        return element;
    }

    // Get error icon
    getErrorIcon(type) {
        const icons = {
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️',
            success: '✅'
        };
        return icons[type] || icons.error;
    }

    // Async wrapper with error handling
    async safeAsync(asyncFn, options = {}) {
        const { 
            context = 'Async Operation',
            fallback = null,
            showError = true,
            retries = 0,
            retryDelay = 1000
        } = options;

        let lastError;
        
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                return await asyncFn();
            } catch (error) {
                lastError = error;
                
                if (attempt < retries) {
                    await new Promise(resolve => setTimeout(resolve, retryDelay));
                    continue;
                }

                const errorInfo = this.handleError(error, context);
                
                if (showError) {
                    this.displayError(errorInfo);
                }

                if (fallback !== null) {
                    return typeof fallback === 'function' ? fallback(error) : fallback;
                }

                throw error;
            }
        }
    }

    // Sync wrapper with error handling
    safe(fn, options = {}) {
        const { 
            context = 'Operation',
            fallback = null,
            showError = true
        } = options;

        try {
            return fn();
        } catch (error) {
            const errorInfo = this.handleError(error, context);
            
            if (showError) {
                this.displayError(errorInfo);
            }

            if (fallback !== null) {
                return typeof fallback === 'function' ? fallback(error) : fallback;
            }

            throw error;
        }
    }

    // Form validation with error handling
    validateForm(form, rules) {
        const errors = [];
        
        Object.entries(rules).forEach(([field, rule]) => {
            try {
                const input = form.querySelector(`[name="${field}"]`);
                if (!input) return;

                const value = input.value.trim();
                
                if (rule.required && !value) {
                    errors.push({ field, message: `${rule.label || field} is required` });
                    return;
                }

                if (value && rule.pattern && !rule.pattern.test(value)) {
                    errors.push({ field, message: rule.message || `Invalid ${rule.label || field}` });
                }

                if (value && rule.minLength && value.length < rule.minLength) {
                    errors.push({ field, message: `${rule.label || field} must be at least ${rule.minLength} characters` });
                }

                if (value && rule.maxLength && value.length > rule.maxLength) {
                    errors.push({ field, message: `${rule.label || field} must be less than ${rule.maxLength} characters` });
                }

            } catch (error) {
                errors.push({ field, message: 'Validation error occurred' });
            }
        });

        return errors;
    }

    // Display form errors
    displayFormErrors(form, errors) {
        // Clear existing errors
        form.querySelectorAll('.field-error').forEach(el => el.remove());
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        errors.forEach(error => {
            const input = form.querySelector(`[name="${error.field}"]`);
            if (input) {
                input.classList.add('error');
                
                const errorElement = document.createElement('div');
                errorElement.className = 'field-error';
                errorElement.textContent = error.message;
                
                input.parentNode.insertBefore(errorElement, input.nextSibling);
            }
        });
    }

    // API error handler
    handleApiError(response, context = 'API Request') {
        let error;
        
        switch (response.status) {
            case 400:
                error = new Error('Invalid request data');
                error.name = 'ValidationError';
                break;
            case 401:
                error = new Error('Authentication required');
                error.name = 'AuthError';
                break;
            case 403:
                error = new Error('Access denied');
                error.name = 'PermissionError';
                break;
            case 404:
                error = new Error('Resource not found');
                error.name = 'NotFoundError';
                break;
            case 429:
                error = new Error('Too many requests');
                error.name = 'RateLimitError';
                break;
            case 500:
                error = new Error('Server error');
                error.name = 'ServerError';
                break;
            default:
                error = new Error(`Request failed with status ${response.status}`);
                error.name = 'NetworkError';
        }

        return this.handleError(error, context);
    }

    // Storage error handler
    handleStorageError(error, operation = 'storage') {
        if (error.name === 'QuotaExceededError') {
            error.name = 'QuotaError';
        }
        
        return this.handleError(error, `Storage ${operation}`);
    }

    // Get error statistics
    getErrorStats() {
        const stats = {
            total: this.errorLog.length,
            byType: {},
            byContext: {},
            recent: this.errorLog.slice(-10)
        };

        this.errorLog.forEach(error => {
            stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
            stats.byContext[error.context] = (stats.byContext[error.context] || 0) + 1;
        });

        return stats;
    }

    // Clear error log
    clearErrors() {
        this.errorLog = [];
    }

    // Add custom error message
    addErrorMessage(errorType, message) {
        this.errorMessages.set(errorType, message);
    }
}

// Global instance
const errorHandler = new ErrorHandler();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}