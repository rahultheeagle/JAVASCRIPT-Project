// Progress Tracking - Calculate completion percentage
class ProgressTracker {
    constructor() {
        this.categories = {
            html: { total: 4, completed: 0 },
            css: { total: 5, completed: 0 },
            js: { total: 8, completed: 0 },
            advanced: { total: 6, completed: 0 }
        };
        
        this.totals = {
            lessons: 12,
            challenges: 25,
            tutorials: 8
        };
        
        this.timeTracking = {
            challengeTimes: {},
            sessionStart: null,
            currentChallenge: null,
            challengeStart: null,
            totalTime: 0
        };
        
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.calculateAllProgress();
        this.startSessionTimer();
        this.updateTimeDisplay();
    }

    setupEventListeners() {
        document.getElementById('simulate-progress').addEventListener('click', () => {
            this.simulateProgress();
        });

        document.getElementById('reset-progress').addEventListener('click', () => {
            this.resetProgress();
        });

        document.getElementById('calculate-progress').addEventListener('click', () => {
            this.calculateAllProgress();
        });

        // Time tracking event listeners
        document.getElementById('start-timer').addEventListener('click', () => {
            this.startChallengeTimer();
        });

        document.getElementById('stop-timer').addEventListener('click', () => {
            this.stopChallengeTimer();
        });
    }

    loadProgress() {
        // Load from localStorage or use defaults
        const savedProgress = StorageManager?.get('progress') || {};
        
        // Load category progress
        Object.keys(this.categories).forEach(category => {
            if (savedProgress[category]) {
                this.categories[category].completed = savedProgress[category].completed || 0;
            }
        });

        // Load completed counts
        this.completedCounts = {
            lessons: savedProgress.lessonsCompleted || 0,
            challenges: savedProgress.challengesCompleted || 0,
            tutorials: savedProgress.tutorialsCompleted || 0
        };

        // Load time tracking data
        if (savedProgress.timeTracking) {
            this.timeTracking = {
                ...this.timeTracking,
                ...savedProgress.timeTracking,
                sessionStart: null, // Reset session on page load
                challengeStart: null
            };
        }
    }

    saveProgress() {
        const progressData = {
            ...this.categories,
            lessonsCompleted: this.completedCounts.lessons,
            challengesCompleted: this.completedCounts.challenges,
            tutorialsCompleted: this.completedCounts.tutorials,
            timeTracking: this.timeTracking,
            lastUpdated: Date.now()
        };

        if (window.StorageManager) {
            StorageManager.set('progress', progressData);
        }
    }

    calculateCategoryPercentage(category) {
        const { completed, total } = this.categories[category];
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    calculateOverallPercentage() {
        const totalItems = Object.values(this.categories).reduce((sum, cat) => sum + cat.total, 0);
        const completedItems = Object.values(this.categories).reduce((sum, cat) => sum + cat.completed, 0);
        
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }

    calculateLessonPercentage() {
        return Math.round((this.completedCounts.lessons / this.totals.lessons) * 100);
    }

    calculateChallengePercentage() {
        return Math.round((this.completedCounts.challenges / this.totals.challenges) * 100);
    }

    calculateTutorialPercentage() {
        return Math.round((this.completedCounts.tutorials / this.totals.tutorials) * 100);
    }

    calculateAllProgress() {
        // Calculate overall percentage
        const overallPercentage = this.calculateOverallPercentage();
        
        // Update overall display
        document.getElementById('overall-percentage').textContent = `${overallPercentage}%`;
        document.getElementById('overall-progress').style.width = `${overallPercentage}%`;
        
        // Update completion counts
        document.getElementById('lessons-completed').textContent = this.completedCounts.lessons;
        document.getElementById('challenges-completed').textContent = this.completedCounts.challenges;
        document.getElementById('tutorials-completed').textContent = this.completedCounts.tutorials;
        
        // Update category progress
        Object.keys(this.categories).forEach(category => {
            const percentage = this.calculateCategoryPercentage(category);
            const { completed, total } = this.categories[category];
            
            document.getElementById(`${category}-percentage`).textContent = `${percentage}%`;
            document.getElementById(`${category}-progress`).style.width = `${percentage}%`;
            document.getElementById(`${category}-completed`).textContent = completed;
            document.getElementById(`${category}-total`).textContent = total;
            
            // Update progress bar color based on completion
            const progressBar = document.getElementById(`${category}-progress`);
            progressBar.className = `progress-fill ${this.getProgressClass(percentage)}`;
        });

        // Update overall progress bar color
        const overallProgressBar = document.getElementById('overall-progress');
        overallProgressBar.className = `progress-fill ${this.getProgressClass(overallPercentage)}`;
        
        this.saveProgress();
    }

    getProgressClass(percentage) {
        if (percentage === 100) return 'complete';
        if (percentage >= 75) return 'high';
        if (percentage >= 50) return 'medium';
        if (percentage >= 25) return 'low';
        return 'minimal';
    }

    simulateProgress() {
        // Simulate random progress for demonstration
        Object.keys(this.categories).forEach(category => {
            const maxIncrease = Math.min(2, this.categories[category].total - this.categories[category].completed);
            const increase = Math.floor(Math.random() * (maxIncrease + 1));
            this.categories[category].completed = Math.min(
                this.categories[category].total,
                this.categories[category].completed + increase
            );
        });

        // Simulate lesson/challenge/tutorial progress
        this.completedCounts.lessons = Math.min(this.totals.lessons, 
            this.completedCounts.lessons + Math.floor(Math.random() * 3));
        this.completedCounts.challenges = Math.min(this.totals.challenges, 
            this.completedCounts.challenges + Math.floor(Math.random() * 5));
        this.completedCounts.tutorials = Math.min(this.totals.tutorials, 
            this.completedCounts.tutorials + Math.floor(Math.random() * 2));

        this.calculateAllProgress();
        this.showMessage('Progress updated!', 'success');
    }

    resetProgress() {
        if (confirm('Reset all progress? This cannot be undone.')) {
            Object.keys(this.categories).forEach(category => {
                this.categories[category].completed = 0;
            });

            this.completedCounts = {
                lessons: 0,
                challenges: 0,
                tutorials: 0
            };

            this.calculateAllProgress();
            this.showMessage('Progress reset!', 'info');
        }
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
            z-index: 1000;
            animation: fadeIn 0.5s ease;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    // Public method to update progress from other parts of the app
    updateProgress(type, category = null, increment = 1) {
        switch (type) {
            case 'lesson':
                this.completedCounts.lessons = Math.min(this.totals.lessons, 
                    this.completedCounts.lessons + increment);
                break;
            case 'challenge':
                this.completedCounts.challenges = Math.min(this.totals.challenges, 
                    this.completedCounts.challenges + increment);
                break;
            case 'tutorial':
                this.completedCounts.tutorials = Math.min(this.totals.tutorials, 
                    this.completedCounts.tutorials + increment);
                break;
            case 'category':
                if (category && this.categories[category]) {
                    this.categories[category].completed = Math.min(
                        this.categories[category].total,
                        this.categories[category].completed + increment
                    );
                }
                break;
        }
        
        this.calculateAllProgress();
    }

    // Time tracking methods
    startSessionTimer() {
        this.timeTracking.sessionStart = Date.now();
        
        // Update session time every minute
        setInterval(() => {
            this.updateTimeDisplay();
        }, 60000);
    }

    startChallengeTimer() {
        const challengeSelect = document.getElementById('challenge-selector');
        const selectedChallenge = challengeSelect.value;
        
        if (!selectedChallenge) {
            this.showMessage('Please select a challenge first!', 'error');
            return;
        }

        this.timeTracking.currentChallenge = selectedChallenge;
        this.timeTracking.challengeStart = Date.now();
        
        // Update UI
        document.getElementById('start-timer').disabled = true;
        document.getElementById('stop-timer').disabled = false;
        challengeSelect.disabled = true;
        
        this.showMessage(`Timer started for ${selectedChallenge}`, 'success');
    }

    stopChallengeTimer() {
        if (!this.timeTracking.challengeStart || !this.timeTracking.currentChallenge) {
            return;
        }

        const timeSpent = Date.now() - this.timeTracking.challengeStart;
        const challengeName = this.timeTracking.currentChallenge;
        
        // Store time for this challenge
        if (!this.timeTracking.challengeTimes[challengeName]) {
            this.timeTracking.challengeTimes[challengeName] = [];
        }
        
        this.timeTracking.challengeTimes[challengeName].push({
            duration: timeSpent,
            timestamp: Date.now()
        });
        
        // Update total time
        this.timeTracking.totalTime += timeSpent;
        
        // Reset challenge timer
        this.timeTracking.challengeStart = null;
        this.timeTracking.currentChallenge = null;
        
        // Update UI
        document.getElementById('start-timer').disabled = false;
        document.getElementById('stop-timer').disabled = true;
        document.getElementById('challenge-selector').disabled = false;
        
        this.updateTimeDisplay();
        this.saveProgress();
        
        const timeStr = this.formatTime(timeSpent);
        this.showMessage(`Challenge completed in ${timeStr}!`, 'success');
    }

    updateTimeDisplay() {
        // Update total time
        const totalTimeStr = this.formatTime(this.timeTracking.totalTime);
        document.getElementById('total-time').textContent = totalTimeStr;
        
        // Update session time
        const sessionTime = this.timeTracking.sessionStart ? 
            Date.now() - this.timeTracking.sessionStart : 0;
        const sessionTimeStr = this.formatTime(sessionTime);
        document.getElementById('session-time').textContent = sessionTimeStr;
        
        // Update average time
        const totalChallenges = Object.values(this.timeTracking.challengeTimes)
            .reduce((sum, times) => sum + times.length, 0);
        const averageTime = totalChallenges > 0 ? 
            this.timeTracking.totalTime / totalChallenges : 0;
        const averageTimeStr = this.formatTime(averageTime);
        document.getElementById('average-time').textContent = averageTimeStr;
        
        // Update challenge time list
        this.updateChallengeTimeList();
    }

    updateChallengeTimeList() {
        const container = document.getElementById('challenge-time-list');
        
        if (Object.keys(this.timeTracking.challengeTimes).length === 0) {
            container.innerHTML = '<p class="no-times">No challenge times recorded yet.</p>';
            return;
        }
        
        const timeEntries = [];
        Object.entries(this.timeTracking.challengeTimes).forEach(([challenge, times]) => {
            const totalTime = times.reduce((sum, time) => sum + time.duration, 0);
            const bestTime = Math.min(...times.map(time => time.duration));
            const attempts = times.length;
            
            timeEntries.push({
                challenge,
                totalTime,
                bestTime,
                attempts,
                averageTime: totalTime / attempts
            });
        });
        
        container.innerHTML = timeEntries.map(entry => `
            <div class="time-entry">
                <div class="time-entry-header">
                    <span class="challenge-name">${entry.challenge}</span>
                    <span class="attempts-count">${entry.attempts} attempt${entry.attempts > 1 ? 's' : ''}</span>
                </div>
                <div class="time-entry-stats">
                    <span class="time-stat">
                        <label>Best:</label> ${this.formatTime(entry.bestTime)}
                    </span>
                    <span class="time-stat">
                        <label>Average:</label> ${this.formatTime(entry.averageTime)}
                    </span>
                    <span class="time-stat">
                        <label>Total:</label> ${this.formatTime(entry.totalTime)}
                    </span>
                </div>
            </div>
        `).join('');
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        
        if (hours > 0) {
            return `${hours}h ${minutes % 60}m`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else {
            return `${seconds}s`;
        }
    }
}

// Initialize progress tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new ProgressTracker();
});