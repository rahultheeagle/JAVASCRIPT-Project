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
                xpReward: 50,
                condition: { type: 'challenges_completed', value: 1 }
            },
            'speed-demon': {
                id: 'speed-demon',
                title: 'Speed Demon',
                description: 'Complete a challenge in under 2 minutes',
                icon: '⚡',
                category: 'performance',
                xpReward: 100,
                condition: { type: 'fast_completion', value: 120000 }
            },
            'persistent': {
                id: 'persistent',
                title: 'Persistent Learner',
                description: 'Complete 10 challenges',
                icon: '🔥',
                category: 'progress',
                xpReward: 200,
                condition: { type: 'challenges_completed', value: 10 }
            },
            'perfectionist': {
                id: 'perfectionist',
                title: 'Perfectionist',
                description: 'Complete 5 challenges on first attempt',
                icon: '💎',
                category: 'performance',
                xpReward: 150,
                condition: { type: 'first_attempt_streak', value: 5 }
            },
            'time-master': {
                id: 'time-master',
                title: 'Time Master',
                description: 'Spend 2+ hours learning',
                icon: '⏰',
                category: 'dedication',
                xpReward: 300,
                condition: { type: 'total_time', value: 7200000 }
            },
            'streak-warrior': {
                id: 'streak-warrior',
                title: 'Streak Warrior',
                description: 'Maintain a 7-day learning streak',
                icon: '🔥',
                category: 'consistency',
                xpReward: 250,
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

        // Listen for lesson completion events
        document.addEventListener('lessonCompleted', (event) => {
            this.onLessonCompleted(event.detail);
        });

        // Listen for streak events
        document.addEventListener('streakUpdated', (event) => {
            this.onStreakUpdated(event.detail);
        });

        // Listen for fast completion events
        document.addEventListener('fastCompletion', (event) => {
            this.onFastCompletion(event.detail);
        });

        // Listen for first attempt success
        document.addEventListener('firstAttemptSuccess', (event) => {
            this.onFirstAttemptSuccess(event.detail);
        });

        // Listen for time tracking events
        document.addEventListener('timeTracked', (event) => {
            this.onTimeTracked(event.detail);
        });

        // Listen for XP gained events
        document.addEventListener('xpGained', (event) => {
            this.onXpGained(event.detail);
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

        const achievement = this.achievements[achievementId];
        if (!achievement) return;

        this.unlockedAchievements.push({
            id: achievementId,
            unlockedAt: Date.now()
        });

        // Award XP for the achievement
        this.awardXP(achievement.xpReward, `Achievement: ${achievement.title}`);
        
        // Award badge
        this.awardBadge(achievementId);

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
                    <p class="xp-reward">+${achievement.xpReward} XP</p>
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
                        <span class="xp-value">+${achievement.xpReward} XP</span>
                        ${isUnlocked ? `<span class="unlock-date">Unlocked: ${new Date(unlockedData.unlockedAt).toLocaleDateString()}</span>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    onChallengeCompleted(data) {
        console.log('Challenge completed:', data);
        
        // Check for fast completion
        if (data.completionTime && data.completionTime <= 120000) { // 2 minutes
            this.dispatchEvent('fastCompletion', data);
        }
        
        // Check for first attempt
        if (data.attempts === 1) {
            this.dispatchEvent('firstAttemptSuccess', data);
        }
        
        this.checkAchievements();
    }

    onLessonCompleted(data) {
        console.log('Lesson completed:', data);
        this.checkAchievements();
    }

    onStreakUpdated(data) {
        console.log('Streak updated:', data);
        this.checkAchievements();
    }

    onFastCompletion(data) {
        console.log('Fast completion detected:', data);
        this.checkAchievements();
    }

    onFirstAttemptSuccess(data) {
        console.log('First attempt success:', data);
        this.checkAchievements();
    }

    onTimeTracked(data) {
        console.log('Time tracked:', data);
        this.checkAchievements();
    }

    onXpGained(data) {
        console.log('XP gained:', data);
        this.checkAchievements();
    }

    dispatchEvent(eventType, data) {
        const event = new CustomEvent(eventType, { detail: data });
        document.dispatchEvent(event);
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

    // Helper methods to trigger events from other parts of the app
    static triggerChallengeCompleted(challengeData) {
        const event = new CustomEvent('challengeCompleted', { 
            detail: {
                challengeId: challengeData.id,
                completionTime: challengeData.time,
                attempts: challengeData.attempts,
                score: challengeData.score,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    static triggerLessonCompleted(lessonData) {
        const event = new CustomEvent('lessonCompleted', { 
            detail: {
                lessonId: lessonData.id,
                category: lessonData.category,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    static triggerStreakUpdated(streakData) {
        const event = new CustomEvent('streakUpdated', { 
            detail: {
                currentStreak: streakData.current,
                longestStreak: streakData.longest,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    static triggerTimeTracked(timeData) {
        const event = new CustomEvent('timeTracked', { 
            detail: {
                sessionTime: timeData.session,
                totalTime: timeData.total,
                challengeTime: timeData.challenge,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    static triggerXpGained(xpData) {
        const event = new CustomEvent('xpGained', { 
            detail: {
                amount: xpData.amount,
                source: xpData.source,
                totalXp: xpData.total,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    awardXP(amount, source) {
        if (!this.storageManager) return;
        
        const currentXP = this.storageManager.get('totalXP') || 0;
        const newXP = currentXP + amount;
        
        this.storageManager.set('totalXP', newXP);
        
        // Trigger XP gained event
        AchievementSystem.triggerXpGained({
            amount: amount,
            source: source,
            total: newXP
        });
        
        // Show XP notification
        this.showXPNotification(amount, source);
        
        // Check for level up
        this.checkLevelUp(currentXP, newXP);
    }

    awardBadge(achievementId) {
        const badges = this.storageManager?.get('badges') || [];
        
        if (!badges.includes(achievementId)) {
            badges.push(achievementId);
            this.storageManager?.set('badges', badges);
        }
    }

    showXPNotification(amount, source) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `
            <div class="xp-popup">
                <div class="xp-icon">⭐</div>
                <div class="xp-info">
                    <h4>+${amount} XP</h4>
                    <p>${source}</p>
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
        }, 2000);
    }

    checkLevelUp(oldXP, newXP) {
        const oldLevel = this.calculateLevel(oldXP);
        const newLevel = this.calculateLevel(newXP);
        
        if (newLevel > oldLevel) {
            this.showLevelUpNotification(newLevel);
        }
    }

    calculateLevel(xp) {
        return Math.floor(xp / 100) + 1;
    }

    showLevelUpNotification(level) {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-popup">
                <div class="level-icon">🎉</div>
                <div class="level-info">
                    <h4>Level Up!</h4>
                    <p>You reached Level ${level}!</p>
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
        }, 3000);
    }

    getTotalXP() {
        return this.storageManager?.get('totalXP') || 0;
    }

    getBadges() {
        return this.storageManager?.get('badges') || [];
    }
}

// Initialize achievement system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem = new AchievementSystem();
});