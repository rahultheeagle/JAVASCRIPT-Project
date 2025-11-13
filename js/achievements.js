// Achievement System - Badge management and unlocking
class AchievementSystem {
    constructor() {
        this.storageManager = window.StorageManager;
        this.achievements = this.initializeAchievements();
        this.unlockedAchievements = this.loadUnlockedAchievements();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAchievements();
    }

    initializeAchievements() {
        return {
            'first-steps': {
                id: 'first-steps',
                title: 'First Steps',
                description: 'Complete your first challenge',
                icon: '🎯',
                category: 'progress',
                condition: { type: 'challenges_completed', value: 1 }
            },
            'speed-demon': {
                id: 'speed-demon',
                title: 'Speed Demon',
                description: 'Complete a challenge in under 2 minutes',
                icon: '⚡',
                category: 'performance',
                condition: { type: 'fast_completion', value: 120000 }
            },
            'persistent': {
                id: 'persistent',
                title: 'Persistent Learner',
                description: 'Complete 10 challenges',
                icon: '🔥',
                category: 'progress',
                condition: { type: 'challenges_completed', value: 10 }
            },
            'perfectionist': {
                id: 'perfectionist',
                title: 'Perfectionist',
                description: 'Complete 5 challenges on first attempt',
                icon: '💎',
                category: 'performance',
                condition: { type: 'first_attempt_streak', value: 5 }
            },
            'time-master': {
                id: 'time-master',
                title: 'Time Master',
                description: 'Spend 2+ hours learning',
                icon: '⏰',
                category: 'dedication',
                condition: { type: 'total_time', value: 7200000 }
            },
            'streak-warrior': {
                id: 'streak-warrior',
                title: 'Streak Warrior',
                description: 'Maintain a 7-day learning streak',
                icon: '🔥',
                category: 'consistency',
                condition: { type: 'learning_streak', value: 7 }
            }
        };
    }

    loadUnlockedAchievements() {
        return this.storageManager?.get('unlocked_achievements') || [];
    }

    saveUnlockedAchievements() {
        this.storageManager?.set('unlocked_achievements', this.unlockedAchievements);
    }

    setupEventListeners() {
        // Listen for challenge completion events
        document.addEventListener('challengeCompleted', (event) => {
            this.onChallengeCompleted(event.detail);
        });

        // Listen for time tracking events
        document.addEventListener('timeTracked', (event) => {
            this.onTimeTracked(event.detail);
        });
    }

    checkAchievements() {
        Object.values(this.achievements).forEach(achievement => {
            if (!this.isUnlocked(achievement.id)) {
                if (this.checkCondition(achievement.condition)) {
                    this.unlockAchievement(achievement.id);
                }
            }
        });
    }

    checkCondition(condition) {
        const progress = this.storageManager?.get('progress') || {};
        const timeTracking = progress.timeTracking || {};

        switch (condition.type) {
            case 'challenges_completed':
                return (progress.challengesCompleted || 0) >= condition.value;
            
            case 'fast_completion':
                const bestTimes = timeTracking.bestTimes || {};
                return Object.values(bestTimes).some(time => time <= condition.value);
            
            case 'first_attempt_streak':
                const attempts = timeTracking.attempts || {};
                const firstAttempts = Object.values(attempts).filter(count => count === 1);
                return firstAttempts.length >= condition.value;
            
            case 'total_time':
                return (timeTracking.totalTime || 0) >= condition.value;
            
            case 'learning_streak':
                // Simplified streak check - would need proper date tracking
                return this.calculateCurrentStreak() >= condition.value;
            
            default:
                return false;
        }
    }

    calculateCurrentStreak() {
        // Simplified streak calculation
        const sessions = this.getSessionData();
        const uniqueDates = [...new Set(sessions.map(s => s.date))].sort();
        
        let streak = 0;
        for (let i = uniqueDates.length - 1; i >= 0; i--) {
            const date = new Date(uniqueDates[i]);
            const daysDiff = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
            
            if (daysDiff <= streak + 1) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    getSessionData() {
        const progress = this.storageManager?.get('progress') || {};
        const challengeTimes = progress.timeTracking?.challengeTimes || {};
        
        const sessions = [];
        Object.values(challengeTimes).forEach(times => {
            times.forEach(time => {
                sessions.push({
                    date: new Date(time.timestamp).toDateString(),
                    timestamp: time.timestamp
                });
            });
        });
        
        return sessions.sort((a, b) => a.timestamp - b.timestamp);
    }

    unlockAchievement(achievementId) {
        if (this.isUnlocked(achievementId)) return;

        this.unlockedAchievements.push({
            id: achievementId,
            unlockedAt: Date.now()
        });

        this.saveUnlockedAchievements();
        this.showAchievementNotification(achievementId);
        this.updateAchievementDisplay();
    }

    isUnlocked(achievementId) {
        return this.unlockedAchievements.some(achievement => achievement.id === achievementId);
    }

    showAchievementNotification(achievementId) {
        const achievement = this.achievements[achievementId];
        if (!achievement) return;

        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-popup">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>Achievement Unlocked!</h4>
                    <p><strong>${achievement.title}</strong></p>
                    <p>${achievement.description}</p>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    updateAchievementDisplay() {
        const container = document.getElementById('achievements-container');
        if (!container) return;

        container.innerHTML = Object.values(this.achievements).map(achievement => {
            const isUnlocked = this.isUnlocked(achievement.id);
            const unlockedData = this.unlockedAchievements.find(a => a.id === achievement.id);
            
            return `
                <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-details">
                        <h4>${achievement.title}</h4>
                        <p>${achievement.description}</p>
                        <span class="achievement-category">${achievement.category}</span>
                        ${isUnlocked ? `<span class="unlock-date">Unlocked: ${new Date(unlockedData.unlockedAt).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    onChallengeCompleted(data) {
        // Trigger achievement checks when challenges are completed
        setTimeout(() => this.checkAchievements(), 100);
    }

    onTimeTracked(data) {
        // Trigger achievement checks when time is tracked
        setTimeout(() => this.checkAchievements(), 100);
    }

    getUnlockedCount() {
        return this.unlockedAchievements.length;
    }

    getTotalCount() {
        return Object.keys(this.achievements).length;
    }

    getProgressPercentage() {
        return Math.round((this.getUnlockedCount() / this.getTotalCount()) * 100);
    }
}

// Initialize achievement system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem = new AchievementSystem();
});