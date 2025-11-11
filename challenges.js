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
        
        // Difficulty filter elements
        this.difficultyFilters = document.querySelectorAll('.difficulty-filter');
        this.easyProgress = document.getElementById('easy-progress');
        this.mediumProgress = document.getElementById('medium-progress');
        this.hardProgress = document.getElementById('hard-progress');
        this.easyCount = document.getElementById('easy-count');
        this.mediumCount = document.getElementById('medium-count');
        this.hardCount = document.getElementById('hard-count');
        
        this.currentDifficultyFilter = 'all';
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
        
        // Difficulty filter clicks
        this.difficultyFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                this.currentDifficultyFilter = filter.dataset.difficulty;
                this.updateDifficultyFilters();
                if (this.currentCategory) {
                    this.renderChallenges(this.currentCategory);
                }
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
        
        // Reset difficulty filter
        this.currentDifficultyFilter = 'all';
        this.updateDifficultyFilters();
        
        // Update title
        const categoryNames = {
            'html-basics': 'HTML Basics',
            'css-styling': 'CSS Styling',
            'js-fundamentals': 'JavaScript Fundamentals',
            'mini-projects': 'Mini-Projects'
        };
        this.categoryTitle.textContent = categoryNames[category];
        
        // Update difficulty progress
        this.updateDifficultyProgress(category);
        
        // Render challenges
        this.renderChallenges(category);
    }
    
    // Render challenges for a category
    renderChallenges(category) {
        const challenges = this.challenges[category];
        const completedChallenges = this.challengeData[category] || [];
        
        // Filter challenges by difficulty if needed
        const filteredChallenges = this.currentDifficultyFilter === 'all' 
            ? challenges 
            : challenges.filter(c => c.difficulty === this.currentDifficultyFilter);
        
        this.challengesGrid.innerHTML = filteredChallenges.map((challenge, index) => {
            const isCompleted = completedChallenges.includes(challenge.id);
            const isLocked = this.isChallengeLockedByDifficulty(challenge, category, completedChallenges);
            
            let statusClass = 'status-available';
            let statusText = 'Available';
            
            if (isCompleted) {
                statusClass = 'status-completed';
                statusText = 'Completed ✓';
            } else if (isLocked) {
                statusClass = 'status-locked';
                statusText = this.getLockReason(challenge, category, completedChallenges);
            }
            
            // Get timer data for this challenge
            const challengeKey = `${category}-${challenge.id}`;
            const timerData = window.TimerSystem ? window.TimerSystem.getTimerData(challengeKey) : null;
            const bestTime = timerData && timerData.bestTime ? window.TimerSystem.formatTime(timerData.bestTime) : null;
            const attempts = timerData ? timerData.attempts : 0;
            
            return `
                <div class="challenge-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}" 
                     data-challenge-id="${challenge.id}" data-category="${category}" data-difficulty="${challenge.difficulty}">
                    <div class="challenge-header">
                        <span class="challenge-title">${challenge.title}</span>
                        <span class="challenge-difficulty difficulty-${challenge.difficulty}">${challenge.difficulty}</span>
                    </div>
                    <div class="challenge-description">${challenge.description}</div>
                    <div class="challenge-timer-info">
                        ${bestTime ? `<span class="timer-stat">⏱️ Best: ${bestTime}</span>` : ''}
                        ${attempts > 0 ? `<span class="timer-stat">🎯 Attempts: ${attempts}</span>` : ''}
                    </div>
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
                } else {
                    this.showLockMessage(item);
                }
            });
        });
        
        // Add search highlighting if search is active
        if (window.searchFilterSystem && window.searchFilterSystem.currentFilters.search) {
            this.highlightSearchTerms(window.searchFilterSystem.currentFilters.search);
        }
    }
    
    // Start a challenge
    startChallenge(category, challengeId) {
        // Start timer for this challenge
        const challengeKey = `${category}-${challengeId}`;
        const challenge = this.challenges[category].find(c => c.id === challengeId);
        const challengeName = challenge ? challenge.title : `Challenge ${challengeId}`;
        
        if (window.TimerSystem) {
            window.TimerSystem.startTimer(challengeKey, challengeName);
        }
        
        // Navigate to challenge detail page
        window.location.href = `challenge-detail.html?category=${category}&id=${challengeId}`;
    }
    
    // Show challenge completion message
    showCompletionMessage(challenge, completionTime = null) {
        const notification = document.createElement('div');
        const timeText = completionTime ? `<br><span>⏱️ Time: ${window.TimerSystem.formatTime(completionTime)}</span>` : '';
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 2rem;">🎉</span>
                <div>
                    <strong>Challenge Completed!</strong><br>
                    <span>${challenge.title} - +${challenge.xp} XP</span>
                    ${timeText}
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
    
    // Check if challenge is locked by difficulty progression
    isChallengeLockedByDifficulty(challenge, category, completedChallenges) {
        const challenges = this.challenges[category];
        const challengeIndex = challenges.findIndex(c => c.id === challenge.id);
        
        // First challenge is always unlocked
        if (challengeIndex === 0) return false;
        
        // Check if previous challenge is completed (sequential unlock)
        const previousChallenge = challenges[challengeIndex - 1];
        if (!completedChallenges.includes(previousChallenge.id)) {
            return true;
        }
        
        // Check difficulty progression: must complete easier difficulties first
        if (challenge.difficulty === 'medium') {
            const easyCompleted = this.getDifficultyCompletedCount(category, 'easy', completedChallenges);
            const easyTotal = this.getDifficultyTotal(category, 'easy');
            return easyCompleted < Math.ceil(easyTotal * 0.7); // Need 70% of easy challenges
        }
        
        if (challenge.difficulty === 'hard') {
            const easyCompleted = this.getDifficultyCompletedCount(category, 'easy', completedChallenges);
            const mediumCompleted = this.getDifficultyCompletedCount(category, 'medium', completedChallenges);
            const easyTotal = this.getDifficultyTotal(category, 'easy');
            const mediumTotal = this.getDifficultyTotal(category, 'medium');
            
            return easyCompleted < easyTotal || mediumCompleted < Math.ceil(mediumTotal * 0.6); // Need all easy + 60% medium
        }
        
        return false;
    }
    
    // Get lock reason message
    getLockReason(challenge, category, completedChallenges) {
        const challenges = this.challenges[category];
        const challengeIndex = challenges.findIndex(c => c.id === challenge.id);
        const previousChallenge = challenges[challengeIndex - 1];
        
        if (!completedChallenges.includes(previousChallenge.id)) {
            return `Complete "${previousChallenge.title}" first 🔒`;
        }
        
        if (challenge.difficulty === 'medium') {
            const easyCompleted = this.getDifficultyCompletedCount(category, 'easy', completedChallenges);
            const easyTotal = this.getDifficultyTotal(category, 'easy');
            const needed = Math.ceil(easyTotal * 0.7);
            return `Complete ${needed - easyCompleted} more Easy challenges 🔒`;
        }
        
        if (challenge.difficulty === 'hard') {
            const easyCompleted = this.getDifficultyCompletedCount(category, 'easy', completedChallenges);
            const mediumCompleted = this.getDifficultyCompletedCount(category, 'medium', completedChallenges);
            const easyTotal = this.getDifficultyTotal(category, 'easy');
            const mediumTotal = this.getDifficultyTotal(category, 'medium');
            
            if (easyCompleted < easyTotal) {
                return `Complete all Easy challenges first 🔒`;
            }
            const needed = Math.ceil(mediumTotal * 0.6);
            return `Complete ${needed - mediumCompleted} more Medium challenges 🔒`;
        }
        
        return 'Locked 🔒';
    }
    
    // Get completed count for specific difficulty
    getDifficultyCompletedCount(category, difficulty, completedChallenges) {
        return this.challenges[category]
            .filter(c => c.difficulty === difficulty && completedChallenges.includes(c.id))
            .length;
    }
    
    // Get total count for specific difficulty
    getDifficultyTotal(category, difficulty) {
        return this.challenges[category].filter(c => c.difficulty === difficulty).length;
    }
    
    // Show lock message
    showLockMessage(item) {
        const statusBadge = item.querySelector('.status-badge');
        const message = statusBadge.textContent;
        
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.5rem;">🔒</span>
                <div>
                    <strong>Challenge Locked</strong><br>
                    <span>${message}</span>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff6b6b;
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Update difficulty filters
    updateDifficultyFilters() {
        this.difficultyFilters.forEach(filter => {
            filter.classList.remove('active');
            if (filter.dataset.difficulty === this.currentDifficultyFilter) {
                filter.classList.add('active');
            }
        });
    }
    
    // Update difficulty progress for current category
    updateDifficultyProgress(category) {
        const completedChallenges = this.challengeData[category] || [];
        const difficulties = ['easy', 'medium', 'hard'];
        const progressElements = [this.easyProgress, this.mediumProgress, this.hardProgress];
        const countElements = [this.easyCount, this.mediumCount, this.hardCount];
        
        difficulties.forEach((difficulty, index) => {
            const completed = this.getDifficultyCompletedCount(category, difficulty, completedChallenges);
            const total = this.getDifficultyTotal(category, difficulty);
            const percentage = total > 0 ? (completed / total) * 100 : 0;
            
            progressElements[index].style.width = `${percentage}%`;
            countElements[index].textContent = `${completed}/${total}`;
        });
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
    
    // Update categories view with search results
    updateCategoriesWithSearchResults(filteredChallenges) {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            const category = card.dataset.category;
            const hasResults = filteredChallenges[category] && filteredChallenges[category].length > 0;
            
            if (Object.keys(filteredChallenges).length === 0) {
                card.style.display = 'block';
                card.classList.remove('search-dimmed');
            } else if (hasResults) {
                card.style.display = 'block';
                card.classList.remove('search-dimmed');
                card.classList.add('search-highlighted');
                
                const challengeCount = card.querySelector('.challenge-count');
                if (challengeCount) {
                    const originalText = challengeCount.textContent;
                    const resultCount = filteredChallenges[category].length;
                    challengeCount.innerHTML = `${resultCount} of ${originalText} <small>(filtered)</small>`;
                }
            } else {
                card.style.display = 'block';
                card.classList.add('search-dimmed');
                card.classList.remove('search-highlighted');
            }
        });
    }
    
    // Highlight search terms in challenge items
    highlightSearchTerms(searchTerm) {
        if (!searchTerm.trim()) return;
        
        const challengeItems = this.challengesGrid.querySelectorAll('.challenge-item');
        const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        
        challengeItems.forEach(item => {
            const title = item.querySelector('.challenge-title');
            const description = item.querySelector('.challenge-description');
            
            if (title) {
                title.innerHTML = title.textContent.replace(regex, '<span class="search-match">$1</span>');
            }
            
            if (description) {
                description.innerHTML = description.textContent.replace(regex, '<span class="search-match">$1</span>');
            }
        });
    }
}

// Initialize challenge system when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new ChallengeSystem();
    
    // Add timer statistics panel to the page
    if (window.timerUI) {
        const timerStatsContainer = document.createElement('div');
        timerStatsContainer.className = 'timer-stats-container';
        timerStatsContainer.innerHTML = window.timerUI.createStatsPanel();
        
        // Insert after the categories grid
        const categoriesGrid = document.querySelector('.categories-grid');
        if (categoriesGrid && categoriesGrid.parentElement) {
            categoriesGrid.parentElement.appendChild(timerStatsContainer);
        }
    }
});