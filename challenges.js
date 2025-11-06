// Challenge System with Multiple Categories
class ChallengeSystem {
    constructor() {
        this.challengeData = this.loadChallengeData();
        this.currentCategory = null;
        
        this.initializeElements();
        this.loadChallenges();
        this.bindEvents();
        this.updateCategoryProgress();
    }
    
    // Initialize DOM elements
    initializeElements() {
        this.backToDashboard = document.getElementById('back-to-dashboard');
        this.categoriesGrid = document.querySelector('.categories-grid');
        this.challengesList = document.getElementById('challenges-list');
        this.backToCategories = document.getElementById('back-to-categories');
        this.categoryTitle = document.getElementById('category-title');
        this.challengesGrid = document.getElementById('challenges-grid');
        
        // Progress elements
        this.htmlCompleted = document.getElementById('html-completed');
        this.cssCompleted = document.getElementById('css-completed');
        this.jsCompleted = document.getElementById('js-completed');
        this.projectsCompleted = document.getElementById('projects-completed');
        
        this.htmlProgress = document.getElementById('html-progress');
        this.cssProgress = document.getElementById('css-progress');
        this.jsProgress = document.getElementById('js-progress');
        this.projectsProgress = document.getElementById('projects-progress');
    }
    
    // Load challenge data from localStorage
    loadChallengeData() {
        const saved = localStorage.getItem('codequest_challenges');
        return saved ? JSON.parse(saved) : {
            'html-basics': [],
            'css-styling': [],
            'js-fundamentals': [],
            'mini-projects': []
        };
    }
    
    // Save challenge data to localStorage
    saveChallengeData() {
        localStorage.setItem('codequest_challenges', JSON.stringify(this.challengeData));
    }
    
    // Define all challenges
    loadChallenges() {
        this.challenges = {
            'html-basics': [
                { id: 1, title: 'Basic HTML Structure', description: 'Create a simple HTML document with head and body', difficulty: 'easy', xp: 10 },
                { id: 2, title: 'Headings and Paragraphs', description: 'Use different heading levels and paragraphs', difficulty: 'easy', xp: 15 },
                { id: 3, title: 'Lists and Links', description: 'Create ordered/unordered lists and hyperlinks', difficulty: 'easy', xp: 20 },
                { id: 4, title: 'Images and Attributes', description: 'Add images with proper attributes', difficulty: 'easy', xp: 20 },
                { id: 5, title: 'Tables', description: 'Create a structured table with headers', difficulty: 'medium', xp: 25 },
                { id: 6, title: 'Forms and Inputs', description: 'Build a contact form with various input types', difficulty: 'medium', xp: 30 },
                { id: 7, title: 'Semantic HTML', description: 'Use semantic elements like article, section, nav', difficulty: 'medium', xp: 35 },
                { id: 8, title: 'HTML5 Elements', description: 'Implement audio, video, and canvas elements', difficulty: 'hard', xp: 40 },
                { id: 9, title: 'Accessibility Features', description: 'Add ARIA labels and accessibility attributes', difficulty: 'hard', xp: 45 },
                { id: 10, title: 'Complete HTML Page', description: 'Build a full webpage with all learned elements', difficulty: 'hard', xp: 50 }
            ],
            'css-styling': [
                { id: 1, title: 'Basic CSS Selectors', description: 'Style elements using different CSS selectors', difficulty: 'easy', xp: 10 },
                { id: 2, title: 'Colors and Fonts', description: 'Apply colors, fonts, and text styling', difficulty: 'easy', xp: 15 },
                { id: 3, title: 'Box Model', description: 'Understand margin, padding, border, and content', difficulty: 'easy', xp: 20 },
                { id: 4, title: 'Layout with Flexbox', description: 'Create flexible layouts using flexbox', difficulty: 'medium', xp: 25 },
                { id: 5, title: 'CSS Grid Layout', description: 'Build complex layouts with CSS Grid', difficulty: 'medium', xp: 30 },
                { id: 6, title: 'Responsive Design', description: 'Make layouts responsive with media queries', difficulty: 'medium', xp: 35 },
                { id: 7, title: 'CSS Animations', description: 'Create smooth animations and transitions', difficulty: 'hard', xp: 40 },
                { id: 8, title: 'CSS Variables', description: 'Use custom properties for dynamic styling', difficulty: 'hard', xp: 40 },
                { id: 9, title: 'Advanced Selectors', description: 'Master pseudo-classes and pseudo-elements', difficulty: 'hard', xp: 45 },
                { id: 10, title: 'Complete CSS Theme', description: 'Design a full website theme', difficulty: 'hard', xp: 50 }
            ],
            'js-fundamentals': [
                { id: 1, title: 'Variables and Data Types', description: 'Declare variables and work with different data types', difficulty: 'easy', xp: 10 },
                { id: 2, title: 'Functions', description: 'Create and call functions with parameters', difficulty: 'easy', xp: 15 },
                { id: 3, title: 'Conditionals', description: 'Use if/else statements and logical operators', difficulty: 'easy', xp: 20 },
                { id: 4, title: 'Loops', description: 'Implement for and while loops', difficulty: 'easy', xp: 20 },
                { id: 5, title: 'Arrays', description: 'Work with arrays and array methods', difficulty: 'medium', xp: 25 },
                { id: 6, title: 'Objects', description: 'Create and manipulate JavaScript objects', difficulty: 'medium', xp: 30 },
                { id: 7, title: 'DOM Manipulation', description: 'Select and modify HTML elements', difficulty: 'medium', xp: 35 },
                { id: 8, title: 'Event Handling', description: 'Handle user interactions with events', difficulty: 'hard', xp: 40 },
                { id: 9, title: 'Async JavaScript', description: 'Work with promises and async/await', difficulty: 'hard', xp: 45 },
                { id: 10, title: 'Local Storage', description: 'Store and retrieve data in the browser', difficulty: 'hard', xp: 50 }
            ],
            'mini-projects': [
                { id: 1, title: 'Personal Portfolio', description: 'Build a responsive personal portfolio website', difficulty: 'medium', xp: 100 },
                { id: 2, title: 'Todo List App', description: 'Create an interactive todo list with local storage', difficulty: 'medium', xp: 120 },
                { id: 3, title: 'Weather Dashboard', description: 'Build a weather app with API integration', difficulty: 'hard', xp: 150 },
                { id: 4, title: 'Calculator', description: 'Develop a functional calculator with JavaScript', difficulty: 'hard', xp: 130 },
                { id: 5, title: 'Quiz Game', description: 'Create an interactive quiz game with scoring', difficulty: 'hard', xp: 180 }
            ]
        };
    }
    
    // Bind event listeners
    bindEvents() {
        // Back to dashboard
        this.backToDashboard.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Back to categories
        this.backToCategories.addEventListener('click', () => {
            this.showCategories();
        });
        
        // Category card clicks
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                this.showChallenges(category);
            });
        });
    }
    
    // Show categories view
    showCategories() {
        this.categoriesGrid.parentElement.style.display = 'block';
        this.challengesList.style.display = 'none';
        this.currentCategory = null;
    }
    
    // Show challenges for a category
    showChallenges(category) {
        this.currentCategory = category;
        this.categoriesGrid.parentElement.style.display = 'none';
        this.challengesList.style.display = 'block';
        
        // Update title
        const categoryNames = {
            'html-basics': 'HTML Basics',
            'css-styling': 'CSS Styling',
            'js-fundamentals': 'JavaScript Fundamentals',
            'mini-projects': 'Mini-Projects'
        };
        this.categoryTitle.textContent = categoryNames[category];
        
        // Render challenges
        this.renderChallenges(category);
    }
    
    // Render challenges for a category
    renderChallenges(category) {
        const challenges = this.challenges[category];
        const completedChallenges = this.challengeData[category] || [];
        
        this.challengesGrid.innerHTML = challenges.map((challenge, index) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            const isLocked = index > 0 && !completedChallenges.includes(challenges[index - 1].id);
            
            let statusClass = 'status-available';
            let statusText = 'Available';
            
            if (isCompleted) {
                statusClass = 'status-completed';
                statusText = 'Completed ✓';
            } else if (isLocked) {
                statusClass = 'status-locked';
                statusText = 'Locked 🔒';
            }
            
            return `
                <div class="challenge-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}" 
                     data-challenge-id="${challenge.id}" data-category="${category}">
                    <div class="challenge-header">
                        <span class="challenge-title">${challenge.title}</span>
                        <span class="challenge-difficulty difficulty-${challenge.difficulty}">${challenge.difficulty}</span>
                    </div>
                    <div class="challenge-description">${challenge.description}</div>
                    <div class="challenge-status">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        <span class="challenge-xp">+${challenge.xp} XP</span>
                    </div>
                </div>
            `;
        }).join('');
        
        // Add click events to challenge items
        this.challengesGrid.querySelectorAll('.challenge-item').forEach(item => {
            item.addEventListener('click', () => {
                if (!item.classList.contains('locked')) {
                    const challengeId = parseInt(item.dataset.challengeId);
                    const category = item.dataset.category;
                    this.startChallenge(category, challengeId);
                }
            });
        });
    }
    
    // Start a challenge
    startChallenge(category, challengeId) {
        // For now, just mark as completed (will be enhanced in future features)
        if (!this.challengeData[category]) {
            this.challengeData[category] = [];
        }
        
        if (!this.challengeData[category].includes(challengeId)) {
            this.challengeData[category].push(challengeId);
            this.saveChallengeData();
            this.updateCategoryProgress();
            this.renderChallenges(category);
            
            // Show completion message
            const challenge = this.challenges[category].find(c => c.id === challengeId);
            this.showCompletionMessage(challenge);
        }
    }
    
    // Show challenge completion message
    showCompletionMessage(challenge) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 2rem;">🎉</span>
                <div>
                    <strong>Challenge Completed!</strong><br>
                    <span>${challenge.title} - +${challenge.xp} XP</span>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
            padding: 20px 25px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
    
    // Update category progress indicators
    updateCategoryProgress() {
        const categories = ['html-basics', 'css-styling', 'js-fundamentals', 'mini-projects'];
        const elements = [this.htmlCompleted, this.cssCompleted, this.jsCompleted, this.projectsCompleted];
        const progressBars = [this.htmlProgress, this.cssProgress, this.jsProgress, this.projectsProgress];
        const totals = [10, 10, 10, 5];
        
        categories.forEach((category, index) => {
            const completed = this.challengeData[category] ? this.challengeData[category].length : 0;
            const total = totals[index];
            const percentage = (completed / total) * 100;
            
            elements[index].textContent = completed;
            progressBars[index].style.width = `${percentage}%`;
        });
    }
}

// Initialize challenge system when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new ChallengeSystem();
});