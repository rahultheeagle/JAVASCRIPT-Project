// Custom events implementation
export class CustomEvents {
    constructor() {
        this.listeners = new Map();
    }

    // Event creation utilities
    static createEvent(type, detail = {}, options = {}) {
        return new CustomEvent(type, {
            detail,
            bubbles: options.bubbles || false,
            cancelable: options.cancelable || false,
            composed: options.composed || false
        });
    }

    // Event dispatcher
    static dispatch(target, eventType, detail = {}, options = {}) {
        const event = this.createEvent(eventType, detail, options);
        target.dispatchEvent(event);
        return event;
    }

    // Global event bus
    static on(eventType, callback, options = {}) {
        document.addEventListener(eventType, callback, options);
        return () => document.removeEventListener(eventType, callback);
    }

    static off(eventType, callback) {
        document.removeEventListener(eventType, callback);
    }

    static emit(eventType, detail = {}, options = {}) {
        return this.dispatch(document, eventType, detail, options);
    }

    // Instance-based event system
    addEventListener(eventType, callback) {
        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, []);
        }
        this.listeners.get(eventType).push(callback);
    }

    removeEventListener(eventType, callback) {
        if (this.listeners.has(eventType)) {
            const callbacks = this.listeners.get(eventType);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    dispatchEvent(eventType, detail = {}) {
        if (this.listeners.has(eventType)) {
            const callbacks = this.listeners.get(eventType);
            const event = { type: eventType, detail, target: this };
            callbacks.forEach(callback => callback(event));
        }
    }

    // Common application events
    static userEvents = {
        LOGIN: 'user:login',
        LOGOUT: 'user:logout',
        PROFILE_UPDATE: 'user:profile-update',
        LEVEL_UP: 'user:level-up',
        ACHIEVEMENT_UNLOCK: 'user:achievement-unlock'
    };

    static gameEvents = {
        CHALLENGE_START: 'game:challenge-start',
        CHALLENGE_COMPLETE: 'game:challenge-complete',
        SCORE_UPDATE: 'game:score-update',
        GAME_OVER: 'game:over',
        NEW_HIGH_SCORE: 'game:new-high-score'
    };

    static appEvents = {
        THEME_CHANGE: 'app:theme-change',
        LANGUAGE_CHANGE: 'app:language-change',
        NOTIFICATION: 'app:notification',
        ERROR: 'app:error',
        LOADING: 'app:loading'
    };

    // Event helpers for common patterns
    static notifySuccess(message, data = {}) {
        return this.emit(this.appEvents.NOTIFICATION, {
            type: 'success',
            message,
            ...data
        });
    }

    static notifyError(message, error = null) {
        return this.emit(this.appEvents.ERROR, {
            message,
            error,
            timestamp: Date.now()
        });
    }

    static notifyLoading(isLoading, message = '') {
        return this.emit(this.appEvents.LOADING, {
            isLoading,
            message
        });
    }

    static userLogin(user) {
        return this.emit(this.userEvents.LOGIN, { user });
    }

    static userLogout() {
        return this.emit(this.userEvents.LOGOUT, {});
    }

    static userLevelUp(level, xp) {
        return this.emit(this.userEvents.LEVEL_UP, { level, xp });
    }

    static challengeComplete(challengeId, score, time) {
        return this.emit(this.gameEvents.CHALLENGE_COMPLETE, {
            challengeId,
            score,
            time,
            timestamp: Date.now()
        });
    }

    // Event delegation helper
    static delegate(container, eventType, selector, callback) {
        container.addEventListener(eventType, (e) => {
            const target = e.target.closest(selector);
            if (target && container.contains(target)) {
                callback.call(target, e, target);
            }
        });
    }

    // Debounced events
    static debounce(callback, delay = 300) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => callback(...args), delay);
        };
    }

    // Throttled events
    static throttle(callback, limit = 100) {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                callback(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Event once (auto-remove after first trigger)
    static once(eventType, callback) {
        const onceCallback = (event) => {
            callback(event);
            document.removeEventListener(eventType, onceCallback);
        };
        document.addEventListener(eventType, onceCallback);
        return () => document.removeEventListener(eventType, onceCallback);
    }

    // Event promise (convert event to promise)
    static waitFor(eventType, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                document.removeEventListener(eventType, handler);
                reject(new Error(`Event ${eventType} timeout`));
            }, timeout);

            const handler = (event) => {
                clearTimeout(timeoutId);
                document.removeEventListener(eventType, handler);
                resolve(event);
            };

            document.addEventListener(eventType, handler);
        });
    }
}

export default CustomEvents;