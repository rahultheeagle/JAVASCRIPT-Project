// Custom Challenges System - Let users create and share challenges
class CustomChallengesSystem {
    constructor() {
        this.storageManager = window.StorageManager;
        this.init();
    }

    init() {
        this.createChallengePanel();
        this.setupEventListeners();
    }

    createChallengePanel() {
        if (document.getElementById('custom-challenge-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'custom-challenge-panel';
        panel.className = 'custom-challenge-panel';
        panel.innerHTML = `
            <div class="challenge-header">
                <h4>🎯 Custom Challenges</h4>
                <button id="toggle-challenge-panel" class="toggle-btn">−</button>
            </div>
            <div class="challenge-content">
                <div class="challenge-actions">
                    <button id="create-challenge-btn" class="challenge-btn primary">✨ Create Challenge</button>
                    <button id="browse-challenges-btn" class="challenge-btn secondary">📚 Browse Challenges</button>
                    <button id="my-challenges-btn" class="challenge-btn secondary">👤 My Challenges</button>
                </div>
                <div id="challenge-display" class="challenge-display">
                    <p class="welcome-message">🚀 Create your own coding challenges and share them with others!</p>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.setupPanelListeners();
    }

    setupEventListeners() {
        // Auto-save challenge drafts
        document.addEventListener('input', (e) => {
            if (e.target.matches('.challenge-input')) {
                this.autoSaveDraft();
            }
        });
    }

    setupPanelListeners() {
        document.getElementById('toggle-challenge-panel').addEventListener('click', () => {
            const panel = document.getElementById('custom-challenge-panel');
            panel.classList.toggle('collapsed');
        });

        document.getElementById('create-challenge-btn').addEventListener('click', () => this.showCreateForm());
        document.getElementById('browse-challenges-btn').addEventListener('click', () => this.browseChallenges());
        document.getElementById('my-challenges-btn').addEventListener('click', () => this.showMyChallenges());
    }

    showCreateForm() {
        const display = document.getElementById('challenge-display');
        display.innerHTML = `
            <div class="create-form">
                <h4>✨ Create New Challenge</h4>
                <form id="challenge-form">
                    <div class="form-group">
                        <label>Challenge Title:</label>
                        <input type="text" id="challenge-title" class="challenge-input" placeholder="e.g., Build a Calculator" required>
                    </div>
                    
                    <div class="form-group">
                        <label>Description:</label>
                        <textarea id="challenge-description" class="challenge-input" placeholder="Describe what users need to build..." rows="3" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Difficulty:</label>
                        <select id="challenge-difficulty" class="challenge-input" required>
                            <option value="">Select difficulty</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Category:</label>
                        <select id="challenge-category" class="challenge-input" required>
                            <option value="">Select category</option>
                            <option value="html">HTML</option>
                            <option value="css">CSS</option>
                            <option value="javascript">JavaScript</option>
                            <option value="mixed">HTML + CSS + JS</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label>Requirements (one per line):</label>
                        <textarea id="challenge-requirements" class="challenge-input" placeholder="- Create a button that changes color on click&#10;- Use CSS Grid for layout&#10;- Add form validation" rows="4" required></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Starter Code (HTML):</label>
                        <textarea id="starter-html" class="challenge-input code-textarea" placeholder="<!DOCTYPE html>&#10;<html>&#10;<head>&#10;    <title>Challenge</title>&#10;</head>&#10;<body>&#10;    <!-- Your HTML here -->&#10;</body>&#10;</html>" rows="4"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Starter Code (CSS):</label>
                        <textarea id="starter-css" class="challenge-input code-textarea" placeholder="/* Your CSS here */" rows="3"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Starter Code (JavaScript):</label>
                        <textarea id="starter-js" class="challenge-input code-textarea" placeholder="// Your JavaScript here" rows="3"></textarea>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">🚀 Create Challenge</button>
                        <button type="button" id="preview-challenge" class="preview-btn">👀 Preview</button>
                        <button type="button" id="cancel-create" class="cancel-btn">❌ Cancel</button>
                    </div>
                </form>
            </div>
        `;

        this.setupFormListeners();
    }

    setupFormListeners() {
        document.getElementById('challenge-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createChallenge();
        });

        document.getElementById('preview-challenge').addEventListener('click', () => this.previewChallenge());
        document.getElementById('cancel-create').addEventListener('click', () => this.showWelcome());
    }

    createChallenge() {
        const formData = this.getFormData();
        if (!this.validateForm(formData)) return;

        const challenge = {
            id: 'custom_' + Date.now().toString(36),
            ...formData,
            author: this.getAuthorName(),
            createdAt: Date.now(),
            attempts: 0,
            completions: 0,
            rating: 0,
            reviews: []
        };

        this.saveChallenge(challenge);
        this.showChallengeCreated(challenge);
    }

    getFormData() {
        return {
            title: document.getElementById('challenge-title').value.trim(),
            description: document.getElementById('challenge-description').value.trim(),
            difficulty: document.getElementById('challenge-difficulty').value,
            category: document.getElementById('challenge-category').value,
            requirements: document.getElementById('challenge-requirements').value.trim().split('\n').filter(r => r.trim()),
            starterCode: {
                html: document.getElementById('starter-html').value.trim(),
                css: document.getElementById('starter-css').value.trim(),
                js: document.getElementById('starter-js').value.trim()
            }
        };
    }

    validateForm(data) {
        if (!data.title || !data.description || !data.difficulty || !data.category || data.requirements.length === 0) {
            alert('Please fill in all required fields');
            return false;
        }
        return true;
    }

    getAuthorName() {
        const profile = this.storageManager?.get('profile');
        return profile?.username || 'Anonymous';
    }

    saveChallenge(challenge) {
        const challenges = this.getCustomChallenges();
        challenges.push(challenge);
        this.storageManager?.set('custom_challenges', challenges);
    }

    showChallengeCreated(challenge) {
        const display = document.getElementById('challenge-display');
        display.innerHTML = `
            <div class="challenge-created">
                <h4>🎉 Challenge Created Successfully!</h4>
                <div class="challenge-preview">
                    <h5>${challenge.title}</h5>
                    <p><strong>Difficulty:</strong> ${challenge.difficulty}</p>
                    <p><strong>Category:</strong> ${challenge.category}</p>
                    <p><strong>ID:</strong> <code>${challenge.id}</code></p>
                </div>
                <div class="share-options">
                    <button onclick="window.customChallenges.shareChallenge('${challenge.id}')" class="share-btn">🔗 Share Challenge</button>
                    <button onclick="window.customChallenges.testChallenge('${challenge.id}')" class="test-btn">🧪 Test Challenge</button>
                    <button onclick="window.customChallenges.showWelcome()" class="back-btn">← Back</button>
                </div>
            </div>
        `;
    }

    browseChallenges() {
        const challenges = this.getAllChallenges();
        const display = document.getElementById('challenge-display');
        
        if (challenges.length === 0) {
            display.innerHTML = `
                <div class="no-challenges">
                    <h4>📚 No Challenges Available</h4>
                    <p>Be the first to create a custom challenge!</p>
                    <button onclick="window.customChallenges.showCreateForm()" class="create-btn">✨ Create First Challenge</button>
                </div>
            `;
            return;
        }

        display.innerHTML = `
            <div class="browse-challenges">
                <h4>📚 Browse Challenges</h4>
                <div class="challenge-filters">
                    <select id="difficulty-filter" onchange="window.customChallenges.filterChallenges()">
                        <option value="">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <select id="category-filter" onchange="window.customChallenges.filterChallenges()">
                        <option value="">All Categories</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                        <option value="javascript">JavaScript</option>
                        <option value="mixed">Mixed</option>
                    </select>
                </div>
                <div class="challenges-grid" id="challenges-grid">
                    ${this.renderChallenges(challenges)}
                </div>
            </div>
        `;
    }

    renderChallenges(challenges) {
        return challenges.map(challenge => `
            <div class="challenge-card" data-difficulty="${challenge.difficulty}" data-category="${challenge.category}">
                <div class="challenge-card-header">
                    <h5>${challenge.title}</h5>
                    <div class="challenge-badges">
                        <span class="difficulty-badge ${challenge.difficulty}">${challenge.difficulty}</span>
                        <span class="category-badge">${challenge.category}</span>
                    </div>
                </div>
                <div class="challenge-card-body">
                    <p>${challenge.description.substring(0, 100)}${challenge.description.length > 100 ? '...' : ''}</p>
                    <div class="challenge-stats">
                        <span>👤 ${challenge.author}</span>
                        <span>🎯 ${challenge.attempts} attempts</span>
                        <span>✅ ${challenge.completions} completed</span>
                    </div>
                </div>
                <div class="challenge-card-actions">
                    <button onclick="window.customChallenges.startChallenge('${challenge.id}')" class="start-btn">🚀 Start</button>
                    <button onclick="window.customChallenges.viewChallenge('${challenge.id}')" class="view-btn">👀 View</button>
                </div>
            </div>
        `).join('');
    }

    showMyChallenges() {
        const myChallenges = this.getMyChallenges();
        const display = document.getElementById('challenge-display');
        
        if (myChallenges.length === 0) {
            display.innerHTML = `
                <div class="no-challenges">
                    <h4>👤 No Challenges Created</h4>
                    <p>You haven't created any challenges yet.</p>
                    <button onclick="window.customChallenges.showCreateForm()" class="create-btn">✨ Create Your First Challenge</button>
                </div>
            `;
            return;
        }

        display.innerHTML = `
            <div class="my-challenges">
                <h4>👤 My Challenges</h4>
                <div class="my-challenges-list">
                    ${myChallenges.map(challenge => `
                        <div class="my-challenge-item">
                            <div class="challenge-info">
                                <h5>${challenge.title}</h5>
                                <p>${challenge.description.substring(0, 80)}...</p>
                                <div class="challenge-meta">
                                    <span>Created: ${new Date(challenge.createdAt).toLocaleDateString()}</span>
                                    <span>Attempts: ${challenge.attempts}</span>
                                </div>
                            </div>
                            <div class="challenge-actions">
                                <button onclick="window.customChallenges.editChallenge('${challenge.id}')" class="edit-btn">✏️ Edit</button>
                                <button onclick="window.customChallenges.shareChallenge('${challenge.id}')" class="share-btn">🔗 Share</button>
                                <button onclick="window.customChallenges.deleteChallenge('${challenge.id}')" class="delete-btn">🗑️ Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    filterChallenges() {
        const difficultyFilter = document.getElementById('difficulty-filter').value;
        const categoryFilter = document.getElementById('category-filter').value;
        const cards = document.querySelectorAll('.challenge-card');
        
        cards.forEach(card => {
            const difficulty = card.dataset.difficulty;
            const category = card.dataset.category;
            
            const showDifficulty = !difficultyFilter || difficulty === difficultyFilter;
            const showCategory = !categoryFilter || category === categoryFilter;
            
            card.style.display = showDifficulty && showCategory ? 'block' : 'none';
        });
    }

    startChallenge(challengeId) {
        const challenge = this.getChallengeById(challengeId);
        if (!challenge) return;

        // Increment attempts
        challenge.attempts++;
        this.updateChallenge(challenge);

        // Load challenge into editor
        this.loadChallengeIntoEditor(challenge);
        this.showChallengeStarted(challenge);
    }

    loadChallengeIntoEditor(challenge) {
        // Load starter code into editors if they exist
        const htmlEditor = document.getElementById('html-editor');
        const cssEditor = document.getElementById('css-editor');
        const jsEditor = document.getElementById('js-editor');
        
        if (htmlEditor && challenge.starterCode.html) {
            htmlEditor.value = challenge.starterCode.html;
        }
        if (cssEditor && challenge.starterCode.css) {
            cssEditor.value = challenge.starterCode.css;
        }
        if (jsEditor && challenge.starterCode.js) {
            jsEditor.value = challenge.starterCode.js;
        }
        
        // Trigger editor updates if available
        if (window.editor && window.editor.updateCode) {
            window.editor.updateCode();
        }
    }

    showChallengeStarted(challenge) {
        const notification = document.createElement('div');
        notification.className = 'challenge-notification';
        notification.innerHTML = `
            <div class="challenge-popup">
                <h4>🚀 Challenge Started!</h4>
                <h5>${challenge.title}</h5>
                <div class="requirements-list">
                    <strong>Requirements:</strong>
                    <ul>
                        ${challenge.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="close-btn">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 100);
    }

    shareChallenge(challengeId) {
        const challenge = this.getChallengeById(challengeId);
        if (!challenge) return;

        const shareUrl = `${window.location.origin}/custom-challenge.html?id=${challengeId}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareUrl).then(() => {
                alert('Challenge link copied to clipboard!');
            });
        } else {
            prompt('Copy this link to share the challenge:', shareUrl);
        }
    }

    deleteChallenge(challengeId) {
        if (confirm('Are you sure you want to delete this challenge? This cannot be undone.')) {
            const challenges = this.getCustomChallenges();
            const filtered = challenges.filter(c => c.id !== challengeId);
            this.storageManager?.set('custom_challenges', filtered);
            this.showMyChallenges();
        }
    }

    getCustomChallenges() {
        return this.storageManager?.get('custom_challenges') || [];
    }

    getAllChallenges() {
        // Combine custom challenges with some default ones
        const custom = this.getCustomChallenges();
        const defaults = this.getDefaultChallenges();
        return [...defaults, ...custom].sort((a, b) => b.createdAt - a.createdAt);
    }

    getDefaultChallenges() {
        return [
            {
                id: 'default_1',
                title: 'Responsive Card Component',
                description: 'Create a responsive card component with image, title, and description that adapts to different screen sizes.',
                difficulty: 'medium',
                category: 'css',
                author: 'CodeQuest Team',
                createdAt: Date.now() - 86400000,
                attempts: 45,
                completions: 23,
                requirements: ['Use CSS Grid or Flexbox', 'Make it responsive', 'Add hover effects'],
                starterCode: { html: '', css: '', js: '' }
            },
            {
                id: 'default_2',
                title: 'Interactive Todo List',
                description: 'Build a todo list where users can add, complete, and delete tasks with local storage.',
                difficulty: 'hard',
                category: 'javascript',
                author: 'CodeQuest Team',
                createdAt: Date.now() - 172800000,
                attempts: 67,
                completions: 12,
                requirements: ['Add/delete tasks', 'Mark as complete', 'Save to localStorage'],
                starterCode: { html: '', css: '', js: '' }
            }
        ];
    }

    getMyChallenges() {
        const authorName = this.getAuthorName();
        return this.getCustomChallenges().filter(c => c.author === authorName);
    }

    getChallengeById(id) {
        return this.getAllChallenges().find(c => c.id === id);
    }

    updateChallenge(challenge) {
        const challenges = this.getCustomChallenges();
        const index = challenges.findIndex(c => c.id === challenge.id);
        if (index !== -1) {
            challenges[index] = challenge;
            this.storageManager?.set('custom_challenges', challenges);
        }
    }

    showWelcome() {
        const display = document.getElementById('challenge-display');
        display.innerHTML = `
            <p class="welcome-message">🚀 Create your own coding challenges and share them with others!</p>
        `;
    }

    autoSaveDraft() {
        const formData = {
            title: document.getElementById('challenge-title')?.value || '',
            description: document.getElementById('challenge-description')?.value || '',
            difficulty: document.getElementById('challenge-difficulty')?.value || '',
            category: document.getElementById('challenge-category')?.value || '',
            requirements: document.getElementById('challenge-requirements')?.value || '',
            starterHtml: document.getElementById('starter-html')?.value || '',
            starterCss: document.getElementById('starter-css')?.value || '',
            starterJs: document.getElementById('starter-js')?.value || ''
        };
        
        this.storageManager?.set('challenge_draft', formData);
    }
}

// Initialize custom challenges system
document.addEventListener('DOMContentLoaded', () => {
    window.customChallenges = new CustomChallengesSystem();
});