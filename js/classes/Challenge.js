// Challenge Class - Object-oriented challenge management
export class Challenge {
    constructor(id, title, description, options = {}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.difficulty = options.difficulty || 'beginner';
        this.category = options.category || 'javascript';
        this.xp = options.xp || this.calculateXP();
        this.timeEstimate = options.timeEstimate || '10 min';
        this.tags = options.tags || [];
        this.code = options.code || '';
        this.solution = options.solution || '';
        this.tests = options.tests || [];
        this.hints = options.hints || [];
        this.createdAt = options.createdAt || new Date();
        this.isActive = options.isActive !== false;
        this.prerequisites = options.prerequisites || [];
        this.completionCount = options.completionCount || 0;
        this.averageRating = options.averageRating || 0;
        this.ratings = options.ratings || [];
    }

    // XP Calculation
    calculateXP() {
        const baseXP = {
            beginner: 25,
            intermediate: 50,
            advanced: 100,
            expert: 200
        };
        return baseXP[this.difficulty] || 25;
    }

    // Challenge Validation
    validateSolution(userCode) {
        try {
            // This would run the user's code against test cases
            const results = this.runTests(userCode);
            return {
                passed: results.every(test => test.passed),
                results,
                score: this.calculateScore(results)
            };
        } catch (error) {
            return {
                passed: false,
                error: error.message,
                results: [],
                score: 0
            };
        }
    }

    runTests(userCode) {
        return this.tests.map(test => {
            try {
                // Simulate test execution
                const result = this.executeTest(userCode, test);
                return {
                    name: test.name,
                    passed: result === test.expected,
                    expected: test.expected,
                    actual: result,
                    input: test.input
                };
            } catch (error) {
                return {
                    name: test.name,
                    passed: false,
                    error: error.message,
                    expected: test.expected,
                    actual: null,
                    input: test.input
                };
            }
        });
    }

    executeTest(userCode, test) {
        // This would safely execute user code with test input
        // For demo purposes, we'll simulate this
        return test.expected; // Always pass for demo
    }

    calculateScore(results) {
        if (results.length === 0) return 0;
        const passed = results.filter(r => r.passed).length;
        return Math.round((passed / results.length) * 100);
    }

    // Hint System
    getHint(index = 0) {
        if (index >= this.hints.length) {
            return null;
        }
        return {
            text: this.hints[index],
            index,
            hasMore: index < this.hints.length - 1
        };
    }

    getNextHint(currentIndex) {
        return this.getHint(currentIndex + 1);
    }

    // Rating System
    addRating(userId, rating, comment = '') {
        // Remove existing rating from this user
        this.ratings = this.ratings.filter(r => r.userId !== userId);
        
        // Add new rating
        this.ratings.push({
            userId,
            rating: Math.max(1, Math.min(5, rating)), // Clamp between 1-5
            comment,
            createdAt: new Date()
        });

        this.updateAverageRating();
    }

    updateAverageRating() {
        if (this.ratings.length === 0) {
            this.averageRating = 0;
            return;
        }

        const sum = this.ratings.reduce((total, r) => total + r.rating, 0);
        this.averageRating = Math.round((sum / this.ratings.length) * 10) / 10;
    }

    // Challenge Completion
    markCompleted(userId) {
        this.completionCount++;
        
        document.dispatchEvent(new CustomEvent('challenge:completed', {
            detail: { challenge: this, userId }
        }));
    }

    // Prerequisites Check
    checkPrerequisites(completedChallenges) {
        if (this.prerequisites.length === 0) return true;
        
        return this.prerequisites.every(prereqId => 
            completedChallenges.includes(prereqId)
        );
    }

    isUnlocked(completedChallenges) {
        return this.isActive && this.checkPrerequisites(completedChallenges);
    }

    // Challenge Statistics
    getStats() {
        return {
            completionCount: this.completionCount,
            averageRating: this.averageRating,
            totalRatings: this.ratings.length,
            difficulty: this.difficulty,
            xp: this.xp,
            category: this.category
        };
    }

    // Data Export/Import
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            difficulty: this.difficulty,
            category: this.category,
            xp: this.xp,
            timeEstimate: this.timeEstimate,
            tags: this.tags,
            code: this.code,
            solution: this.solution,
            tests: this.tests,
            hints: this.hints,
            createdAt: this.createdAt,
            isActive: this.isActive,
            prerequisites: this.prerequisites,
            completionCount: this.completionCount,
            averageRating: this.averageRating,
            ratings: this.ratings
        };
    }

    static fromJSON(data) {
        return new Challenge(data.id, data.title, data.description, {
            difficulty: data.difficulty,
            category: data.category,
            xp: data.xp,
            timeEstimate: data.timeEstimate,
            tags: data.tags,
            code: data.code,
            solution: data.solution,
            tests: data.tests,
            hints: data.hints,
            createdAt: data.createdAt,
            isActive: data.isActive,
            prerequisites: data.prerequisites,
            completionCount: data.completionCount,
            averageRating: data.averageRating,
            ratings: data.ratings
        });
    }

    // Utility Methods
    getDifficultyColor() {
        const colors = {
            beginner: '#10b981',
            intermediate: '#f59e0b',
            advanced: '#ef4444',
            expert: '#8b5cf6'
        };
        return colors[this.difficulty] || colors.beginner;
    }

    getEstimatedTime() {
        return this.timeEstimate;
    }

    hasTag(tag) {
        return this.tags.includes(tag);
    }

    // Static Methods
    static create(title, description, options = {}) {
        const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
        return new Challenge(id, title, description, options);
    }

    static createFromTemplate(template, customizations = {}) {
        return new Challenge(
            template.id,
            template.title,
            template.description,
            { ...template, ...customizations }
        );
    }

    static validateDifficulty(difficulty) {
        return ['beginner', 'intermediate', 'advanced', 'expert'].includes(difficulty);
    }

    static validateCategory(category) {
        return ['javascript', 'html', 'css', 'react', 'node', 'general'].includes(category);
    }
}