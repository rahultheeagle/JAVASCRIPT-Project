// Achievements System JavaScript
class AchievementSystem {
    constructor() {
        this.achievements = this.getAchievementDefinitions();
        this.earned = StorageManager.get('achievements', []);
        this.init();
    }

    init() {
        this.checkAchievements();
        this.renderAchievements();
    }

    getAchievementDefinitions() {
        return [
            {
                id: 'first-lesson',
                title: 'First Steps',
                description: 'Complete your first lesson',
                icon: '🎯',
                condition: () => this.getCompletedLessons() >= 1,
                xp: 50
            },
            {
                id: 'early-bird',
                title: 'Early Bird',
                description: 'Complete 3 lessons',
                icon: '🌅',
                condition: () => this.getCompletedLessons() >= 3,
                xp: 100
            },
            {
                id: 'dedicated',
                title: 'Dedicated Learner',
                description: 'Complete 5 lessons',
                icon: '💪',
                condition: () => this.getCompletedLessons() >= 5,
                xp: 150
            },
            {
                id: 'streak-master',
                title: '10-Day Streak Master',
                description: 'Maintain a 10-day learning streak',
                icon: '🔥',
                condition: () => this.getCurrentStreak() >= 10,
                xp: 300
            },
            {
                id: 'first-challenge',
                title: 'First Challenge',
                description: 'Complete your first coding challenge',
                icon: '🎯',
                condition: () => this.getCompletedChallenges() >= 1,
                xp: 75
            },
            {
                id: 'js-ninja',
                title: 'JavaScript Ninja',
                description: 'Complete 15 JavaScript challenges',
                icon: '🥷',
                condition: () => this.getJSChallenges() >= 15,
                xp: 500
            },
            {
                id: 'perfectionist',
                title: 'Perfectionist',
                description: 'Complete challenge without hints',
                icon: '💎',
                condition: () => this.getPerfectChallenges() >= 1,
                xp: 200
            },
            {
                id: 'xp-collector',
                title: 'XP Collector',
                description: 'Earn 5000 total XP',
                icon: '⭐',
                condition: () => this.getTotalXP() >= 5000,
                xp: 250
            }
        ];
    }

    checkAchievements() {
        this.achievements.forEach(achievement => {
            if (!this.isEarned(achievement.id) && achievement.condition()) {
                this.earnAchievement(achievement);
            }
        });
    }

    earnAchievement(achievement) {
        this.earned.push({
            id: achievement.id,
            earnedAt: Date.now()
        });
        
        StorageManager.set('achievements', this.earned);
        this.showAchievementNotification(achievement);
        
        // Award XP
        if (window.app) {
            window.app.addXP(achievement.xp);
        }
    }

    isEarned(achievementId) {
        return this.earned.some(earned => earned.id === achievementId);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-content">
                <h4>Achievement Unlocked!</h4>
                <p>${achievement.title}</p>
                <small>+${achievement.xp} XP</small>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 1000;
            animation: slideIn 0.5s ease, fadeOut 0.5s ease 4s;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
    }

    renderAchievements() {
        const container = document.querySelector('.badges-container');
        if (!container) return;

        container.innerHTML = this.achievements.map(achievement => {
            const earned = this.isEarned(achievement.id);
            return `
                <div class="badge ${earned ? 'earned' : ''}" data-badge="${achievement.id}">
                    <div class="badge-icon">${achievement.icon}</div>
                    <div class="badge-info">
                        <h4>${achievement.title}</h4>
                        <p>${achievement.description}</p>
                        ${earned ? '<small class="earned-text">✓ Earned</small>' : `<small>+${achievement.xp} XP</small>`}
                    </div>
                </div>
            `;
        }).join('');
    }

    // Helper methods to check conditions
    getCompletedLessons() {
        const progress = StorageManager.get('progress', {});
        return Object.values(progress).filter(Boolean).length;
    }

    getCurrentStreak() {
        const profile = StorageManager.get('profile', {});
        return profile.streak || 0;
    }

    getCompletedChallenges() {
        const completed = StorageManager.get('completedChallenges', []);
        return completed.length;
    }

    getJSChallenges() {
        // This would need to be implemented based on challenge data
        return 0;
    }

    getPerfectChallenges() {
        const perfect = StorageManager.get('perfectChallenges', []);
        return perfect.length;
    }

    getTotalXP() {
        const profile = StorageManager.get('profile', {});
        return profile.xp || 0;
    }

    // Public methods
    triggerCheck() {
        this.checkAchievements();
        this.renderAchievements();
    }

    getEarnedAchievements() {
        return this.earned.map(earned => {
            const achievement = this.achievements.find(a => a.id === earned.id);
            return { ...achievement, ...earned };
        });
    }

    getProgress() {
        const total = this.achievements.length;
        const earned = this.earned.length;
        return {
            total,
            earned,
            percentage: Math.round((earned / total) * 100)
        };
    }
}

// Initialize achievement system
document.addEventListener('DOMContentLoaded', () => {
    window.achievementSystem = new AchievementSystem();
});