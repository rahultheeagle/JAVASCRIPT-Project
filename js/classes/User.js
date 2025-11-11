// User Class - Object-oriented user management
export class User {
    constructor(id, name, email, options = {}) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.level = options.level || 1;
        this.xp = options.xp || 0;
        this.achievements = options.achievements || [];
        this.completedChallenges = options.completedChallenges || [];
        this.streak = options.streak || 0;
        this.lastActivity = options.lastActivity || null;
        this.createdAt = options.createdAt || new Date();
        this.preferences = {
            theme: 'light',
            notifications: true,
            ...options.preferences
        };
    }

    // XP and Level Management
    addXP(amount) {
        this.xp += amount;
        this.checkLevelUp();
        this.updateLastActivity();
        return this.xp;
    }

    checkLevelUp() {
        const newLevel = Math.floor(this.xp / 100) + 1;
        if (newLevel > this.level) {
            const oldLevel = this.level;
            this.level = newLevel;
            this.onLevelUp(oldLevel, newLevel);
        }
    }

    onLevelUp(oldLevel, newLevel) {
        console.log(`${this.name} leveled up from ${oldLevel} to ${newLevel}!`);
        // Trigger level up event
        document.dispatchEvent(new CustomEvent('user:levelup', {
            detail: { user: this, oldLevel, newLevel }
        }));
    }

    getXPForNextLevel() {
        return (this.level * 100) - this.xp;
    }

    getProgress() {
        const currentLevelXP = (this.level - 1) * 100;
        const nextLevelXP = this.level * 100;
        const progress = ((this.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
        return Math.min(100, Math.max(0, progress));
    }

    // Challenge Management
    completeChallenge(challenge) {
        if (this.hasCompletedChallenge(challenge.id)) {
            return false;
        }

        this.completedChallenges.push({
            id: challenge.id,
            completedAt: new Date(),
            xpEarned: challenge.xp
        });

        this.addXP(challenge.xp);
        this.updateStreak();
        
        // Check for achievements
        this.checkAchievements();

        document.dispatchEvent(new CustomEvent('user:challengeComplete', {
            detail: { user: this, challenge }
        }));

        return true;
    }

    hasCompletedChallenge(challengeId) {
        return this.completedChallenges.some(c => c.id === challengeId);
    }

    getChallengeStats() {
        const total = this.completedChallenges.length;
        const totalXP = this.completedChallenges.reduce((sum, c) => sum + c.xpEarned, 0);
        
        return {
            total,
            totalXP,
            averageXP: total > 0 ? Math.round(totalXP / total) : 0,
            completionRate: total > 0 ? (total / 100) * 100 : 0 // Assuming 100 total challenges
        };
    }

    // Achievement Management
    unlockAchievement(achievement) {
        if (this.hasAchievement(achievement.id)) {
            return false;
        }

        this.achievements.push({
            id: achievement.id,
            unlockedAt: new Date()
        });

        document.dispatchEvent(new CustomEvent('user:achievementUnlocked', {
            detail: { user: this, achievement }
        }));

        return true;
    }

    hasAchievement(achievementId) {
        return this.achievements.some(a => a.id === achievementId);
    }

    checkAchievements() {
        // This would typically check against a list of available achievements
        const stats = this.getChallengeStats();
        
        // Example achievement checks
        if (stats.total >= 1 && !this.hasAchievement('first-challenge')) {
            // Would unlock first challenge achievement
        }
        
        if (stats.total >= 10 && !this.hasAchievement('challenge-master')) {
            // Would unlock challenge master achievement
        }
    }

    // Streak Management
    updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.lastActivity ? new Date(this.lastActivity).toDateString() : null;
        
        if (lastActivity === today) {
            // Already active today, no change
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastActivity === yesterday.toDateString()) {
            // Consecutive day
            this.streak++;
        } else if (lastActivity !== today) {
            // Streak broken
            this.streak = 1;
        }
        
        this.updateLastActivity();
    }

    updateLastActivity() {
        this.lastActivity = new Date();
    }

    // Profile Management
    updateProfile(updates) {
        const allowedFields = ['name', 'email', 'preferences'];
        
        Object.keys(updates).forEach(key => {
            if (allowedFields.includes(key)) {
                if (key === 'preferences') {
                    this.preferences = { ...this.preferences, ...updates[key] };
                } else {
                    this[key] = updates[key];
                }
            }
        });

        document.dispatchEvent(new CustomEvent('user:profileUpdated', {
            detail: { user: this, updates }
        }));
    }

    // Data Export/Import
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            level: this.level,
            xp: this.xp,
            achievements: this.achievements,
            completedChallenges: this.completedChallenges,
            streak: this.streak,
            lastActivity: this.lastActivity,
            createdAt: this.createdAt,
            preferences: this.preferences
        };
    }

    static fromJSON(data) {
        return new User(data.id, data.name, data.email, {
            level: data.level,
            xp: data.xp,
            achievements: data.achievements,
            completedChallenges: data.completedChallenges,
            streak: data.streak,
            lastActivity: data.lastActivity,
            createdAt: data.createdAt,
            preferences: data.preferences
        });
    }

    // Utility Methods
    getDisplayName() {
        return this.name || `User ${this.id}`;
    }

    isActive() {
        if (!this.lastActivity) return false;
        
        const daysSinceActivity = Math.floor(
            (new Date() - new Date(this.lastActivity)) / (1000 * 60 * 60 * 24)
        );
        
        return daysSinceActivity <= 7; // Active within last week
    }

    getRank() {
        // Simple ranking based on XP
        if (this.xp >= 5000) return 'Expert';
        if (this.xp >= 2000) return 'Advanced';
        if (this.xp >= 500) return 'Intermediate';
        return 'Beginner';
    }

    // Static Methods
    static create(name, email) {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        return new User(id, name, email);
    }

    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}