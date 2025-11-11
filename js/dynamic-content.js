// Dynamic Content - Generate challenge cards via JavaScript
class DynamicContent {
    constructor() {
        this.challenges = [
            {
                id: 1,
                title: "Hello World",
                description: "Create your first JavaScript program",
                difficulty: "Beginner",
                xp: 50,
                category: "JavaScript",
                timeEstimate: "5 min",
                completed: false
            },
            {
                id: 2,
                title: "Variables & Data Types",
                description: "Learn about JavaScript variables and data types",
                difficulty: "Beginner",
                xp: 75,
                category: "JavaScript",
                timeEstimate: "10 min",
                completed: false
            },
            {
                id: 3,
                title: "CSS Flexbox Layout",
                description: "Master flexbox for responsive layouts",
                difficulty: "Intermediate",
                xp: 100,
                category: "CSS",
                timeEstimate: "15 min",
                completed: false
            },
            {
                id: 4,
                title: "DOM Manipulation",
                description: "Change HTML elements with JavaScript",
                difficulty: "Intermediate",
                xp: 125,
                category: "JavaScript",
                timeEstimate: "20 min",
                completed: false
            },
            {
                id: 5,
                title: "Responsive Design",
                description: "Create mobile-friendly web pages",
                difficulty: "Advanced",
                xp: 150,
                category: "CSS",
                timeEstimate: "25 min",
                completed: false
            },
            {
                id: 6,
                title: "API Integration",
                description: "Fetch data from external APIs",
                difficulty: "Advanced",
                xp: 200,
                category: "JavaScript",
                timeEstimate: "30 min",
                completed: false
            }
        ];
    }

    // Generate challenge card HTML
    generateChallengeCard(challenge) {
        const difficultyClass = challenge.difficulty.toLowerCase();
        const completedClass = challenge.completed ? 'completed' : '';
        
        return `
            <div class="challenge-card ${difficultyClass} ${completedClass}" data-id="${challenge.id}">
                <div class="challenge-header">
                    <div class="challenge-category">${challenge.category}</div>
                    <div class="challenge-difficulty ${difficultyClass}">${challenge.difficulty}</div>
                </div>
                <div class="challenge-content">
                    <h3 class="challenge-title">${challenge.title}</h3>
                    <p class="challenge-description">${challenge.description}</p>
                </div>
                <div class="challenge-footer">
                    <div class="challenge-meta">
                        <span class="challenge-xp">+${challenge.xp} XP</span>
                        <span class="challenge-time">⏱️ ${challenge.timeEstimate}</span>
                    </div>
                    <button class="challenge-btn ${challenge.completed ? 'completed' : 'start'}" 
                            onclick="dynamicContent.startChallenge(${challenge.id})">
                        ${challenge.completed ? '✓ Completed' : 'Start Challenge'}
                    </button>
                </div>
            </div>
        `;
    }

    // Render all challenges
    renderChallenges(container, filter = 'all') {
        const targetContainer = typeof container === 'string' ? 
            document.querySelector(container) : container;
        
        if (!targetContainer) return;

        let filteredChallenges = this.challenges;
        
        if (filter !== 'all') {
            filteredChallenges = this.challenges.filter(challenge => 
                challenge.category.toLowerCase() === filter.toLowerCase() ||
                challenge.difficulty.toLowerCase() === filter.toLowerCase()
            );
        }

        targetContainer.innerHTML = filteredChallenges
            .map(challenge => this.generateChallengeCard(challenge))
            .join('');
    }

    // Start a challenge
    startChallenge(id) {
        const challenge = this.challenges.find(c => c.id === id);
        if (!challenge) return;

        if (challenge.completed) {
            alert(`You've already completed "${challenge.title}"!`);
            return;
        }

        // Simulate challenge start
        const confirmed = confirm(`Start "${challenge.title}"?\n\nDifficulty: ${challenge.difficulty}\nReward: +${challenge.xp} XP\nEstimated time: ${challenge.timeEstimate}`);
        
        if (confirmed) {
            // Mark as completed for demo
            challenge.completed = true;
            
            // Re-render to show updated state
            this.renderChallenges('#challenges-container');
            
            // Show success message
            if (window.toastSystem) {
                window.toastSystem.show(`Challenge "${challenge.title}" completed! +${challenge.xp} XP`, 'success');
            } else {
                alert(`Challenge completed! You earned ${challenge.xp} XP!`);
            }
        }
    }

    // Filter challenges
    filterChallenges(container, category) {
        this.renderChallenges(container, category);
    }

    // Add new challenge
    addChallenge(challengeData) {
        const newId = Math.max(...this.challenges.map(c => c.id)) + 1;
        const newChallenge = {
            id: newId,
            completed: false,
            ...challengeData
        };
        
        this.challenges.push(newChallenge);
        return newChallenge;
    }

    // Get challenges by category
    getChallengesByCategory(category) {
        return this.challenges.filter(c => 
            c.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Get challenges by difficulty
    getChallengesByDifficulty(difficulty) {
        return this.challenges.filter(c => 
            c.difficulty.toLowerCase() === difficulty.toLowerCase()
        );
    }
}

// Global instance
window.dynamicContent = new DynamicContent();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DynamicContent;
}