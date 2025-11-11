// Progress tracking feature module
import storage from '../services/storage.js';
import helpers from '../utils/helpers.js';

export class ProgressFeature {
    constructor() {
        this.xp = 0;
        this.level = 1;
        this.streak = 0;
        this.achievements = [];
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.render();
    }

    loadProgress() {
        const progress = storage.get('user_progress', {});
        this.xp = progress.xp || 0;
        this.level = progress.level || 1;
        this.streak = progress.streak || 0;
        this.achievements = progress.achievements || [];
    }

    saveProgress() {
        storage.set('user_progress', {
            xp: this.xp,
            level: this.level,
            streak: this.streak,
            achievements: this.achievements
        });
    }

    setupEventListeners() {
        document.addEventListener('challengeCompleted', (e) => {
            this.addXP(100);
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-add-xp]')) {
                const xp = parseInt(e.target.dataset.addXp);
                this.addXP(xp);
            }
        });
    }

    addXP(amount) {
        this.xp += amount;
        this.checkLevelUp();
        this.saveProgress();
        this.render();
        
        // Show XP notification
        this.showXPNotification(amount);
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.xp / 1000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.showLevelUpNotification();
        }
    }

    showXPNotification(amount) {
        const notification = helpers.createElement('div', { 
            className: 'xp-notification' 
        }, `+${amount} XP`);
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    showLevelUpNotification() {
        const notification = helpers.createElement('div', { 
            className: 'level-up-notification' 
        }, `Level Up! You are now level ${this.level}`);
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    addAchievement(achievement) {
        if (!this.achievements.includes(achievement)) {
            this.achievements.push(achievement);
            this.saveProgress();
            this.showAchievementNotification(achievement);
        }
    }

    showAchievementNotification(achievement) {
        const notification = helpers.createElement('div', { 
            className: 'achievement-notification' 
        }, `Achievement Unlocked: ${achievement}`);
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
    }

    render() {
        this.renderXPBar();
        this.renderLevel();
        this.renderStreak();
    }

    renderXPBar() {
        const xpBar = helpers.$('[data-xp-bar]');
        if (xpBar) {
            const currentLevelXP = this.xp % 1000;
            const percentage = (currentLevelXP / 1000) * 100;
            xpBar.style.width = `${percentage}%`;
        }

        const xpText = helpers.$('[data-xp-text]');
        if (xpText) {
            xpText.textContent = `${this.xp % 1000} / 1000 XP`;
        }
    }

    renderLevel() {
        const levelDisplay = helpers.$('[data-level-display]');
        if (levelDisplay) {
            levelDisplay.textContent = `Level ${this.level}`;
        }
    }

    renderStreak() {
        const streakDisplay = helpers.$('[data-streak-display]');
        if (streakDisplay) {
            streakDisplay.textContent = `${this.streak} day streak`;
        }
    }

    getStats() {
        return {
            xp: this.xp,
            level: this.level,
            streak: this.streak,
            achievements: this.achievements.length
        };
    }
}

export default new ProgressFeature();