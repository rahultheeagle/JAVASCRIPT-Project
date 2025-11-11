// Achievement Class - Object-oriented achievement system
export class Achievement {
    constructor(id, name, description, options = {}) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.icon = options.icon || '🏆';
        this.category = options.category || 'general';
        this.rarity = options.rarity || 'common';
        this.xpReward = options.xpReward || this.calculateXPReward();
        this.condition = options.condition || (() => false);
        this.isSecret = options.isSecret || false;
        this.prerequisites = options.prerequisites || [];
        this.createdAt = options.createdAt || new Date();
        this.isActive = options.isActive !== false;
        this.unlockCount = options.unlockCount || 0;
        this.metadata = options.metadata || {};
    }

    // XP Reward Calculation
    calculateXPReward() {
        const baseRewards = {
            common: 10,
            uncommon: 25,
            rare: 50,
            epic: 100,
            legendary: 250
        };
        return baseRewards[this.rarity] || 10;
    }

    // Achievement Checking
    checkCondition(user, context = {}) {
        try {
            return this.condition(user, context);
        } catch (error) {
            console.error(`Error checking achievement ${this.id}:`, error);
            return false;
        }
    }

    canUnlock(user, unlockedAchievements = []) {
        if (!this.isActive) return false;
        if (unlockedAchievements.includes(this.id)) return false;
        
        // Check prerequisites
        const hasPrerequisites = this.prerequisites.every(prereqId => 
            unlockedAchievements.includes(prereqId)
        );
        
        return hasPrerequisites && this.checkCondition(user);
    }

    // Achievement Unlocking
    unlock(user) {
        if (!this.canUnlock(user, user.achievements.map(a => a.id))) {
            return false;
        }

        this.unlockCount++;
        
        // Award XP to user
        if (this.xpReward > 0) {
            user.addXP(this.xpReward);
        }

        document.dispatchEvent(new CustomEvent('achievement:unlocked', {
            detail: { achievement: this, user }
        }));

        return true;
    }

    // Display Methods
    getDisplayInfo(isUnlocked = false) {
        return {
            id: this.id,
            name: this.name,
            description: this.isSecret && !isUnlocked ? '???' : this.description,
            icon: this.icon,
            category: this.category,
            rarity: this.rarity,
            xpReward: this.xpReward,
            isSecret: this.isSecret,
            isUnlocked
        };
    }

    getRarityColor() {
        const colors = {
            common: '#6b7280',
            uncommon: '#10b981',
            rare: '#3b82f6',
            epic: '#8b5cf6',
            legendary: '#f59e0b'
        };
        return colors[this.rarity] || colors.common;
    }

    // Statistics
    getStats() {
        return {
            unlockCount: this.unlockCount,
            rarity: this.rarity,
            xpReward: this.xpReward,
            category: this.category,
            unlockRate: this.calculateUnlockRate()
        };
    }

    calculateUnlockRate() {
        // This would calculate based on total users vs unlocks
        // For demo, return a simulated rate
        const rates = {
            common: 0.8,
            uncommon: 0.5,
            rare: 0.2,
            epic: 0.05,
            legendary: 0.01
        };
        return rates[this.rarity] || 0.1;
    }

    // Data Export/Import
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            icon: this.icon,
            category: this.category,
            rarity: this.rarity,
            xpReward: this.xpReward,
            isSecret: this.isSecret,
            prerequisites: this.prerequisites,
            createdAt: this.createdAt,
            isActive: this.isActive,
            unlockCount: this.unlockCount,
            metadata: this.metadata
        };
    }

    static fromJSON(data) {
        return new Achievement(data.id, data.name, data.description, {
            icon: data.icon,
            category: data.category,
            rarity: data.rarity,
            xpReward: data.xpReward,
            isSecret: data.isSecret,
            prerequisites: data.prerequisites,
            createdAt: data.createdAt,
            isActive: data.isActive,
            unlockCount: data.unlockCount,
            metadata: data.metadata
        });
    }

    // Static Factory Methods
    static createChallengeAchievement(challengeCount, options = {}) {
        const id = `challenge-${challengeCount}`;
        const name = `Challenge Master ${challengeCount}`;
        const description = `Complete ${challengeCount} challenges`;
        
        return new Achievement(id, name, description, {
            icon: '🎯',
            category: 'challenges',
            rarity: challengeCount >= 100 ? 'legendary' : challengeCount >= 50 ? 'epic' : 'rare',
            condition: (user) => user.completedChallenges.length >= challengeCount,
            ...options
        });
    }

    static createStreakAchievement(streakDays, options = {}) {
        const id = `streak-${streakDays}`;
        const name = `${streakDays}-Day Streak`;
        const description = `Maintain a ${streakDays}-day learning streak`;
        
        return new Achievement(id, name, description, {
            icon: '🔥',
            category: 'engagement',
            rarity: streakDays >= 30 ? 'legendary' : streakDays >= 14 ? 'epic' : 'rare',
            condition: (user) => user.streak >= streakDays,
            ...options
        });
    }

    static createLevelAchievement(level, options = {}) {
        const id = `level-${level}`;
        const name = `Level ${level} Reached`;
        const description = `Reach level ${level}`;
        
        return new Achievement(id, name, description, {
            icon: '⭐',
            category: 'progression',
            rarity: level >= 50 ? 'legendary' : level >= 25 ? 'epic' : 'rare',
            condition: (user) => user.level >= level,
            ...options
        });
    }

    static createSpeedAchievement(timeLimit, options = {}) {
        const id = `speed-${timeLimit}`;
        const name = 'Speed Demon';
        const description = `Complete a challenge in under ${timeLimit} minutes`;
        
        return new Achievement(id, name, description, {
            icon: '⚡',
            category: 'skill',
            rarity: 'epic',
            condition: (user, context) => {
                return context.completionTime && context.completionTime < timeLimit * 60000;
            },
            ...options
        });
    }

    static createPerfectAchievement(options = {}) {
        return new Achievement('perfectionist', 'Perfectionist', 'Complete a challenge without using hints', {
            icon: '💎',
            category: 'skill',
            rarity: 'rare',
            condition: (user, context) => {
                return context.hintsUsed === 0 && context.challengeCompleted;
            },
            ...options
        });
    }

    // Static Utility Methods
    static validateRarity(rarity) {
        return ['common', 'uncommon', 'rare', 'epic', 'legendary'].includes(rarity);
    }

    static validateCategory(category) {
        return ['general', 'challenges', 'engagement', 'progression', 'skill', 'social'].includes(category);
    }

    static sortByRarity(achievements) {
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
        return achievements.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity]);
    }

    static filterByCategory(achievements, category) {
        return achievements.filter(achievement => achievement.category === category);
    }

    static getUnlockedAchievements(achievements, user) {
        return achievements.filter(achievement => 
            user.achievements.some(userAchievement => userAchievement.id === achievement.id)
        );
    }

    static getAvailableAchievements(achievements, user) {
        const unlockedIds = user.achievements.map(a => a.id);
        return achievements.filter(achievement => 
            achievement.canUnlock(user, unlockedIds)
        );
    }
}