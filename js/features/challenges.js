// Challenges feature module
import storage from '../services/storage.js';
import api from '../services/api.js';
import helpers from '../utils/helpers.js';

export class ChallengesFeature {
    constructor() {
        this.challenges = [];
        this.currentChallenge = null;
        this.completedChallenges = new Set();
    }

    init() {
        this.loadChallenges();
        this.loadProgress();
        this.setupEventListeners();
    }

    async loadChallenges() {
        try {
            this.challenges = await api.mockRequest('/challenges');
            this.render();
        } catch (error) {
            console.error('Failed to load challenges:', error);
        }
    }

    loadProgress() {
        const completed = storage.get('completed_challenges', []);
        this.completedChallenges = new Set(completed);
    }

    saveProgress() {
        storage.set('completed_challenges', Array.from(this.completedChallenges));
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-challenge-id]')) {
                const id = parseInt(e.target.dataset.challengeId);
                this.startChallenge(id);
            }
            if (e.target.matches('[data-challenge-complete]')) {
                const id = parseInt(e.target.dataset.challengeComplete);
                this.completeChallenge(id);
            }
        });
    }

    startChallenge(id) {
        this.currentChallenge = this.challenges.find(c => c.id === id);
        if (this.currentChallenge) {
            this.showChallengeModal();
        }
    }

    completeChallenge(id) {
        this.completedChallenges.add(id);
        this.saveProgress();
        this.render();
        
        // Dispatch completion event
        document.dispatchEvent(new CustomEvent('challengeCompleted', {
            detail: { challengeId: id }
        }));
    }

    showChallengeModal() {
        const modal = helpers.createElement('div', { className: 'challenge-modal' });
        modal.innerHTML = `
            <div class="modal-content">
                <h3>${this.currentChallenge.title}</h3>
                <p>${this.currentChallenge.description || 'Complete this challenge'}</p>
                <div class="challenge-actions">
                    <button data-challenge-complete="${this.currentChallenge.id}">Complete</button>
                    <button onclick="this.closest('.challenge-modal').remove()">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    render() {
        const container = helpers.$('[data-challenges-container]');
        if (!container) return;

        container.innerHTML = '';
        
        this.challenges.forEach(challenge => {
            const isCompleted = this.completedChallenges.has(challenge.id);
            const card = helpers.createElement('div', { 
                className: `challenge-card ${isCompleted ? 'completed' : ''}` 
            });
            
            card.innerHTML = `
                <h4>${challenge.title}</h4>
                <p>Difficulty: ${challenge.difficulty || 'Medium'}</p>
                <button data-challenge-id="${challenge.id}" ${isCompleted ? 'disabled' : ''}>
                    ${isCompleted ? 'Completed' : 'Start Challenge'}
                </button>
            `;
            
            container.appendChild(card);
        });
    }

    getStats() {
        return {
            total: this.challenges.length,
            completed: this.completedChallenges.size,
            remaining: this.challenges.length - this.completedChallenges.size
        };
    }
}

export default new ChallengesFeature();