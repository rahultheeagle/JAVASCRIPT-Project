// Advanced Timer System - Track time spent on challenges
class TimerSystem {
    constructor() {
        this.timers = new Map();
        this.sessions = [];
        this.isActive = false;
        this.currentChallenge = null;
        this.startTime = null;
        this.pausedTime = 0;
        this.totalTime = 0;
        this.intervals = new Map();
        
        // Load existing data
        this.loadTimerData();
        
        // Auto-save every 30 seconds
        setInterval(() => this.saveTimerData(), 30000);
        
        // Handle page visibility changes
        this.setupVisibilityHandlers();
    }

    // Start timer for a challenge
    startTimer(challengeId, challengeName = '') {
        if (this.isActive && this.currentChallenge !== challengeId) {
            this.pauseTimer();
        }

        this.currentChallenge = challengeId;
        this.startTime = Date.now() - this.pausedTime;
        this.isActive = true;
        this.pausedTime = 0;

        // Create timer entry if doesn't exist
        if (!this.timers.has(challengeId)) {
            this.timers.set(challengeId, {
                id: challengeId,
                name: challengeName,
                totalTime: 0,
                sessions: [],
                bestTime: null,
                averageTime: 0,
                attempts: 0,
                completed: false,
                lastStarted: Date.now(),
                tags: []
            });
        }

        // Update last started time
        const timer = this.timers.get(challengeId);
        timer.lastStarted = Date.now();

        // Start UI update interval
        this.startUIUpdates();

        // Track session start
        this.trackSessionStart(challengeId);

        console.log(`Timer started for challenge: ${challengeId}`);
        this.dispatchEvent('timerStarted', { challengeId, challengeName });
    }

    // Pause timer
    pauseTimer() {
        if (!this.isActive) return;

        this.pausedTime = Date.now() - this.startTime;
        this.isActive = false;

        // Stop UI updates
        this.stopUIUpdates();

        console.log(`Timer paused for challenge: ${this.currentChallenge}`);
        this.dispatchEvent('timerPaused', { 
            challengeId: this.currentChallenge, 
            elapsedTime: this.pausedTime 
        });
    }

    // Resume timer
    resumeTimer() {
        if (this.isActive || !this.currentChallenge) return;

        this.startTime = Date.now() - this.pausedTime;
        this.isActive = true;

        // Restart UI updates
        this.startUIUpdates();

        console.log(`Timer resumed for challenge: ${this.currentChallenge}`);
        this.dispatchEvent('timerResumed', { challengeId: this.currentChallenge });
    }

    // Stop timer and record session
    stopTimer(completed = false) {
        if (!this.isActive || !this.currentChallenge) return;

        const elapsedTime = Date.now() - this.startTime;
        const timer = this.timers.get(this.currentChallenge);

        // Update timer data
        timer.totalTime += elapsedTime;
        timer.attempts++;
        
        if (completed) {
            timer.completed = true;
            if (!timer.bestTime || elapsedTime < timer.bestTime) {
                timer.bestTime = elapsedTime;
            }
        }

        // Calculate average time
        timer.averageTime = timer.totalTime / timer.attempts;

        // Record session
        const session = {
            challengeId: this.currentChallenge,
            startTime: this.startTime,
            endTime: Date.now(),
            duration: elapsedTime,
            completed: completed,
            timestamp: Date.now()
        };

        timer.sessions.push(session);
        this.sessions.push(session);

        // Keep only last 100 sessions per challenge
        if (timer.sessions.length > 100) {
            timer.sessions = timer.sessions.slice(-100);
        }

        // Stop UI updates
        this.stopUIUpdates();

        // Reset state
        const challengeId = this.currentChallenge;
        this.reset();

        // Save data
        this.saveTimerData();

        console.log(`Timer stopped for challenge: ${challengeId}, Time: ${this.formatTime(elapsedTime)}`);
        this.dispatchEvent('timerStopped', { 
            challengeId, 
            elapsedTime, 
            completed,
            session 
        });

        return session;
    }

    // Reset timer state
    reset() {
        this.isActive = false;
        this.currentChallenge = null;
        this.startTime = null;
        this.pausedTime = 0;
        this.totalTime = 0;
        this.stopUIUpdates();
    }

    // Get current elapsed time
    getCurrentTime() {
        if (!this.isActive) return this.pausedTime;
        return Date.now() - this.startTime;
    }

    // Get timer data for a challenge
    getTimerData(challengeId) {
        return this.timers.get(challengeId) || null;
    }

    // Get all timer data
    getAllTimerData() {
        return Array.from(this.timers.values());
    }

    // Get statistics
    getStatistics() {
        const timers = Array.from(this.timers.values());
        const totalChallenges = timers.length;
        const completedChallenges = timers.filter(t => t.completed).length;
        const totalTimeSpent = timers.reduce((sum, t) => sum + t.totalTime, 0);
        const totalAttempts = timers.reduce((sum, t) => sum + t.attempts, 0);
        
        const averageTimePerChallenge = totalChallenges > 0 ? totalTimeSpent / totalChallenges : 0;
        const completionRate = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

        // Get today's activity
        const today = new Date().toDateString();
        const todaySessions = this.sessions.filter(s => 
            new Date(s.timestamp).toDateString() === today
        );
        const todayTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);

        // Get this week's activity
        const weekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
        const weekSessions = this.sessions.filter(s => s.timestamp > weekAgo);
        const weekTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);

        return {
            totalChallenges,
            completedChallenges,
            totalTimeSpent,
            totalAttempts,
            averageTimePerChallenge,
            completionRate,
            todayTime,
            weekTime,
            todaySessions: todaySessions.length,
            weekSessions: weekSessions.length,
            bestTimes: this.getBestTimes(),
            recentActivity: this.getRecentActivity()
        };
    }

    // Get best times across all challenges
    getBestTimes() {
        return Array.from(this.timers.values())
            .filter(t => t.bestTime !== null)
            .sort((a, b) => a.bestTime - b.bestTime)
            .slice(0, 10)
            .map(t => ({
                challengeId: t.id,
                challengeName: t.name,
                bestTime: t.bestTime,
                bestTimeFormatted: this.formatTime(t.bestTime)
            }));
    }

    // Get recent activity
    getRecentActivity(limit = 10) {
        return this.sessions
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)
            .map(s => ({
                ...s,
                durationFormatted: this.formatTime(s.duration),
                timeAgo: this.getTimeAgo(s.timestamp)
            }));
    }

    // Format time to readable string
    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }

    // Get time ago string
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    // Start UI updates
    startUIUpdates() {
        this.stopUIUpdates(); // Clear any existing interval
        
        this.intervals.set('ui', setInterval(() => {
            if (this.isActive) {
                this.updateTimerDisplay();
            }
        }, 1000));
    }

    // Stop UI updates
    stopUIUpdates() {
        if (this.intervals.has('ui')) {
            clearInterval(this.intervals.get('ui'));
            this.intervals.delete('ui');
        }
    }

    // Update timer display
    updateTimerDisplay() {
        const currentTime = this.getCurrentTime();
        const formattedTime = this.formatTime(currentTime);
        
        // Update timer displays
        const timerDisplays = document.querySelectorAll('.timer-display');
        timerDisplays.forEach(display => {
            display.textContent = formattedTime;
        });

        // Update progress indicators
        this.dispatchEvent('timerTick', { 
            challengeId: this.currentChallenge, 
            elapsedTime: currentTime,
            formattedTime 
        });
    }

    // Handle page visibility changes
    setupVisibilityHandlers() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Page is hidden, pause timer
                if (this.isActive) {
                    this.pauseTimer();
                    this.wasActiveBefore = true;
                }
            } else {
                // Page is visible, resume if was active
                if (this.wasActiveBefore && !this.isActive) {
                    this.resumeTimer();
                    this.wasActiveBefore = false;
                }
            }
        });

        // Handle beforeunload
        window.addEventListener('beforeunload', () => {
            if (this.isActive) {
                this.pauseTimer();
                this.saveTimerData();
            }
        });
    }

    // Track session start
    trackSessionStart(challengeId) {
        // Store in storage manager if available
        if (typeof StorageManager !== 'undefined') {
            const timerSessions = StorageManager.get('timerSessions') || [];
            timerSessions.push({
                challengeId,
                startTime: Date.now(),
                type: 'start'
            });
            StorageManager.set('timerSessions', timerSessions);
        }
    }

    // Save timer data
    saveTimerData() {
        const data = {
            timers: Array.from(this.timers.entries()),
            sessions: this.sessions,
            currentState: {
                isActive: this.isActive,
                currentChallenge: this.currentChallenge,
                startTime: this.startTime,
                pausedTime: this.pausedTime
            }
        };

        if (typeof StorageManager !== 'undefined') {
            StorageManager.set('timerSystem', data);
        } else {
            localStorage.setItem('codequest_timer_system', JSON.stringify(data));
        }
    }

    // Load timer data
    loadTimerData() {
        let data = null;
        
        if (typeof StorageManager !== 'undefined') {
            data = StorageManager.get('timerSystem');
        } else {
            const stored = localStorage.getItem('codequest_timer_system');
            data = stored ? JSON.parse(stored) : null;
        }

        if (data) {
            // Restore timers
            if (data.timers) {
                this.timers = new Map(data.timers);
            }

            // Restore sessions
            if (data.sessions) {
                this.sessions = data.sessions;
            }

            // Restore current state (but don't auto-resume)
            if (data.currentState && data.currentState.currentChallenge) {
                this.currentChallenge = data.currentState.currentChallenge;
                this.pausedTime = data.currentState.pausedTime || 0;
                // Don't auto-resume, let user manually start
            }
        }
    }

    // Dispatch custom events
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`timer${eventName.charAt(0).toUpperCase() + eventName.slice(1)}`, {
            detail
        });
        window.dispatchEvent(event);
    }

    // Export timer data
    exportData() {
        const data = {
            timers: Array.from(this.timers.entries()),
            sessions: this.sessions,
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `codequest-timer-data-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import timer data
    importData(data) {
        try {
            if (data.timers) {
                this.timers = new Map(data.timers);
            }
            if (data.sessions) {
                this.sessions = data.sessions;
            }
            this.saveTimerData();
            return true;
        } catch (error) {
            console.error('Timer data import failed:', error);
            return false;
        }
    }

    // Clear all timer data
    clearAllData() {
        this.reset();
        this.timers.clear();
        this.sessions = [];
        this.saveTimerData();
        
        this.dispatchEvent('timerDataCleared', {});
    }
}

// Global timer instance
window.TimerSystem = new TimerSystem();

// Helper functions for easy integration
window.startChallengeTimer = (challengeId, challengeName) => {
    window.TimerSystem.startTimer(challengeId, challengeName);
};

window.stopChallengeTimer = (completed = false) => {
    return window.TimerSystem.stopTimer(completed);
};

window.pauseChallengeTimer = () => {
    window.TimerSystem.pauseTimer();
};

window.resumeChallengeTimer = () => {
    window.TimerSystem.resumeTimer();
};

window.getChallengeTimerData = (challengeId) => {
    return window.TimerSystem.getTimerData(challengeId);
};

window.getTimerStatistics = () => {
    return window.TimerSystem.getStatistics();
};