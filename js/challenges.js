// Challenges JavaScript
class ChallengeManager {
    constructor() {
        this.challenges = [];
        this.currentChallenge = null;
        this.init();
    }

    async init() {
        await this.loadChallenges();
        this.setupEventListeners();
        this.renderChallenges();
    }

    async loadChallenges() {
        try {
            const response = await fetch('./data/challenges.json');
            this.challenges = await response.json();
        } catch (error) {
            this.challenges = this.getDefaultChallenges();
        }
    }

    getDefaultChallenges() {
        return [
            {
                id: 1,
                title: "Hello World",
                category: "JavaScript",
                difficulty: "Beginner",
                description: "Create a function that returns 'Hello World'",
                starterCode: "function helloWorld() {\n  // Your code here\n}",
                solution: "function helloWorld() {\n  return 'Hello World';\n}",
                tests: [
                    { input: "", expected: "Hello World" }
                ],
                xp: 50
            },
            {
                id: 2,
                title: "Sum Two Numbers",
                category: "JavaScript",
                difficulty: "Beginner",
                description: "Create a function that adds two numbers",
                starterCode: "function sum(a, b) {\n  // Your code here\n}",
                solution: "function sum(a, b) {\n  return a + b;\n}",
                tests: [
                    { input: [2, 3], expected: 5 },
                    { input: [10, 15], expected: 25 }
                ],
                xp: 75
            }
        ];
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;
                this.filterChallenges(filter);
            });
        });

        // Challenge cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.challenge-card')) {
                const challengeId = parseInt(e.target.closest('.challenge-card').dataset.id);
                this.openChallenge(challengeId);
            }
        });
    }

    renderChallenges() {
        const container = document.getElementById('challenges-container');
        if (!container) return;

        container.innerHTML = this.challenges.map(challenge => `
            <div class="challenge-card" data-id="${challenge.id}">
                <div class="challenge-header">
                    <h3>${challenge.title}</h3>
                    <span class="difficulty ${challenge.difficulty.toLowerCase()}">${challenge.difficulty}</span>
                </div>
                <p class="challenge-description">${challenge.description}</p>
                <div class="challenge-footer">
                    <span class="category">${challenge.category}</span>
                    <span class="xp">+${challenge.xp} XP</span>
                </div>
            </div>
        `).join('');
    }

    filterChallenges(filter) {
        const cards = document.querySelectorAll('.challenge-card');
        cards.forEach(card => {
            const challenge = this.challenges.find(c => c.id === parseInt(card.dataset.id));
            const show = filter === 'all' || 
                        challenge.difficulty.toLowerCase() === filter ||
                        challenge.category.toLowerCase() === filter;
            
            card.style.display = show ? 'block' : 'none';
        });

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }

    openChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (challenge) {
            // Store current challenge and redirect
            StorageManager.set('currentChallenge', challenge);
            window.location.href = 'challenge-detail.html';
        }
    }

    submitSolution(code) {
        if (!this.currentChallenge) return;

        try {
            const result = this.validateSolution(code, this.currentChallenge);
            if (result.passed) {
                this.completedChallenge(this.currentChallenge);
                return { success: true, message: 'Challenge completed!' };
            } else {
                return { success: false, message: result.message };
            }
        } catch (error) {
            return { success: false, message: `Error: ${error.message}` };
        }
    }

    validateSolution(code, challenge) {
        // Simple validation - in real app, use secure sandbox
        try {
            const func = new Function('return ' + code)();
            
            for (const test of challenge.tests) {
                const result = Array.isArray(test.input) ? 
                    func(...test.input) : func(test.input);
                
                if (result !== test.expected) {
                    return {
                        passed: false,
                        message: `Test failed: expected ${test.expected}, got ${result}`
                    };
                }
            }
            
            return { passed: true };
        } catch (error) {
            return { passed: false, message: error.message };
        }
    }

    completedChallenge(challenge) {
        // Add XP and mark as completed
        if (window.app) {
            window.app.addXP(challenge.xp);
        }

        // Save completion
        const completed = StorageManager.get('completedChallenges') || [];
        if (!completed.includes(challenge.id)) {
            completed.push(challenge.id);
            StorageManager.set('completedChallenges', completed);
        }
    }
}

// Initialize challenges when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('challenges-container')) {
        window.challengeManager = new ChallengeManager();
    }
});