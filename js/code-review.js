// Code Review System - Peer feedback simulation
class CodeReviewSystem {
    constructor() {
        this.storageManager = window.StorageManager;
        this.reviewers = ['CodeMaster', 'DevExpert', 'JSNinja', 'CSSGuru', 'HTMLPro', 'ReactDev', 'VueVet', 'AngularAce'];
        this.reviewTemplates = this.initializeReviewTemplates();
        this.init();
    }

    init() {
        this.createReviewPanel();
        this.setupEventListeners();
    }

    initializeReviewTemplates() {
        return {
            positive: [
                "Great job! Your code is clean and well-structured.",
                "Excellent use of semantic HTML elements!",
                "Nice implementation of responsive design principles.",
                "Good separation of concerns between HTML, CSS, and JS.",
                "Well-organized code with proper indentation.",
                "Smart use of CSS Grid/Flexbox for layout.",
                "Efficient JavaScript implementation!"
            ],
            suggestions: [
                "Consider adding more comments to explain complex logic.",
                "You could optimize this by using CSS variables for colors.",
                "Try using const instead of let for variables that don't change.",
                "Consider adding error handling for better user experience.",
                "This could be more accessible with proper ARIA labels.",
                "You might want to add input validation here.",
                "Consider using semantic HTML5 elements for better structure."
            ],
            issues: [
                "Missing alt attributes on images for accessibility.",
                "Some CSS selectors could be more specific.",
                "Consider handling edge cases in your JavaScript.",
                "This function could be broken down into smaller parts.",
                "Missing error handling for user inputs.",
                "Some variables could have more descriptive names.",
                "Consider adding loading states for better UX."
            ]
        };
    }

    createReviewPanel() {
        if (document.getElementById('review-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'review-panel';
        panel.className = 'review-panel';
        panel.innerHTML = `
            <div class="review-header">
                <h4>👥 Code Review</h4>
                <button id="toggle-review-panel" class="toggle-btn">−</button>
            </div>
            <div class="review-content">
                <div class="review-actions">
                    <button id="request-review-btn" class="review-btn primary">📝 Request Review</button>
                    <button id="submit-for-review-btn" class="review-btn secondary">📤 Submit Code</button>
                    <button id="view-reviews-btn" class="review-btn secondary">👀 View Reviews</button>
                </div>
                <div id="review-display" class="review-display">
                    <p class="welcome-message">💡 Get feedback on your code from experienced developers!</p>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.setupPanelListeners();
    }

    setupEventListeners() {
        // Auto-save code for review
        document.addEventListener('input', (e) => {
            if (e.target.matches('textarea[id*="editor"]')) {
                this.autoSaveCode();
            }
        });
    }

    setupPanelListeners() {
        document.getElementById('toggle-review-panel').addEventListener('click', () => {
            const panel = document.getElementById('review-panel');
            panel.classList.toggle('collapsed');
        });

        document.getElementById('request-review-btn').addEventListener('click', () => this.requestReview());
        document.getElementById('submit-for-review-btn').addEventListener('click', () => this.submitForReview());
        document.getElementById('view-reviews-btn').addEventListener('click', () => this.viewReviews());
    }

    requestReview() {
        const code = this.getCurrentCode();
        if (!code.trim()) {
            this.showMessage('Please write some code before requesting a review!', 'warning');
            return;
        }

        this.showReviewInProgress();
        
        setTimeout(() => {
            const review = this.generateReview(code);
            this.displayReview(review);
            this.saveReview(review);
        }, 3000);
    }

    submitForReview() {
        const code = this.getCurrentCode();
        if (!code.trim()) {
            this.showMessage('No code to submit for review!', 'warning');
            return;
        }

        const title = prompt('Enter a title for your code submission:') || 'Untitled Code';
        
        this.showSubmissionProgress();
        
        setTimeout(() => {
            const submissionId = this.saveSubmission(code, title);
            this.showSubmissionSuccess(submissionId);
            
            // Simulate receiving reviews over time
            setTimeout(() => this.simulateIncomingReview(submissionId), 5000);
            setTimeout(() => this.simulateIncomingReview(submissionId), 12000);
        }, 2000);
    }

    viewReviews() {
        const reviews = this.getStoredReviews();
        if (reviews.length === 0) {
            this.showMessage('No reviews available yet. Request a review or submit your code!', 'info');
            return;
        }

        this.displayReviewsList(reviews);
    }

    getCurrentCode() {
        const editors = ['html-editor', 'css-editor', 'js-editor'];
        let allCode = '';
        
        editors.forEach(editorId => {
            const editor = document.getElementById(editorId);
            if (editor && editor.value.trim()) {
                allCode += `\n--- ${editorId.replace('-editor', '').toUpperCase()} ---\n${editor.value}\n`;
            }
        });
        
        return allCode;
    }

    generateReview(code) {
        const reviewer = this.reviewers[Math.floor(Math.random() * this.reviewers.length)];
        const rating = 3 + Math.floor(Math.random() * 3); // 3-5 stars
        
        const review = {
            id: Date.now().toString(),
            reviewer,
            rating,
            timestamp: Date.now(),
            code: code.substring(0, 200) + '...',
            feedback: this.generateFeedback(code, rating),
            helpful: 0
        };

        return review;
    }

    generateFeedback(code, rating) {
        const feedback = [];
        
        // Always include one positive comment
        const positive = this.reviewTemplates.positive[Math.floor(Math.random() * this.reviewTemplates.positive.length)];
        feedback.push({ type: 'positive', text: positive });
        
        // Add suggestions based on rating
        if (rating < 5) {
            const suggestion = this.reviewTemplates.suggestions[Math.floor(Math.random() * this.reviewTemplates.suggestions.length)];
            feedback.push({ type: 'suggestion', text: suggestion });
        }
        
        // Add issues for lower ratings
        if (rating < 4) {
            const issue = this.reviewTemplates.issues[Math.floor(Math.random() * this.reviewTemplates.issues.length)];
            feedback.push({ type: 'issue', text: issue });
        }
        
        return feedback;
    }

    showReviewInProgress() {
        const display = document.getElementById('review-display');
        display.innerHTML = `
            <div class="review-progress">
                <div class="loading-spinner"></div>
                <p>🔍 Analyzing your code...</p>
                <div class="progress-steps">
                    <div class="step active">Checking syntax</div>
                    <div class="step">Reviewing structure</div>
                    <div class="step">Generating feedback</div>
                </div>
            </div>
        `;

        // Animate progress steps
        setTimeout(() => {
            const steps = document.querySelectorAll('.step');
            steps[1].classList.add('active');
        }, 1000);
        
        setTimeout(() => {
            const steps = document.querySelectorAll('.step');
            steps[2].classList.add('active');
        }, 2000);
    }

    displayReview(review) {
        const display = document.getElementById('review-display');
        display.innerHTML = `
            <div class="review-result">
                <div class="review-header-info">
                    <div class="reviewer-info">
                        <span class="reviewer-name">👤 ${review.reviewer}</span>
                        <div class="rating">
                            ${'⭐'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                        </div>
                    </div>
                    <div class="review-date">${new Date(review.timestamp).toLocaleDateString()}</div>
                </div>
                
                <div class="feedback-list">
                    ${review.feedback.map(item => `
                        <div class="feedback-item ${item.type}">
                            <div class="feedback-icon">
                                ${item.type === 'positive' ? '✅' : item.type === 'suggestion' ? '💡' : '⚠️'}
                            </div>
                            <div class="feedback-text">${item.text}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="review-actions">
                    <button onclick="window.codeReviewSystem.markHelpful('${review.id}')" class="action-btn">👍 Helpful (${review.helpful})</button>
                    <button onclick="window.codeReviewSystem.requestReview()" class="action-btn">🔄 Get Another Review</button>
                </div>
            </div>
        `;
    }

    showSubmissionProgress() {
        const display = document.getElementById('review-display');
        display.innerHTML = `
            <div class="submission-progress">
                <div class="loading-spinner"></div>
                <p>📤 Submitting your code for peer review...</p>
                <p class="sub-text">This will be reviewed by experienced developers</p>
            </div>
        `;
    }

    showSubmissionSuccess(submissionId) {
        const display = document.getElementById('review-display');
        display.innerHTML = `
            <div class="submission-success">
                <h4>✅ Code Submitted Successfully!</h4>
                <p>Submission ID: <code>${submissionId}</code></p>
                <p>Your code has been added to the review queue. You'll receive feedback from peers soon!</p>
                <div class="submission-stats">
                    <div class="stat">
                        <span class="stat-value">~2-5</span>
                        <span class="stat-label">Reviews Expected</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">~10min</span>
                        <span class="stat-label">Average Wait Time</span>
                    </div>
                </div>
            </div>
        `;
    }

    simulateIncomingReview(submissionId) {
        const review = this.generateReview(this.getCurrentCode());
        review.submissionId = submissionId;
        this.saveReview(review);
        
        this.showNotification(`📝 New review received from ${review.reviewer}!`);
    }

    displayReviewsList(reviews) {
        const display = document.getElementById('review-display');
        display.innerHTML = `
            <div class="reviews-list">
                <h4>📋 Your Code Reviews</h4>
                <div class="reviews-container">
                    ${reviews.slice(-5).reverse().map(review => `
                        <div class="review-item">
                            <div class="review-summary">
                                <div class="reviewer-badge">👤 ${review.reviewer}</div>
                                <div class="review-rating">${'⭐'.repeat(review.rating)}</div>
                                <div class="review-time">${this.timeAgo(review.timestamp)}</div>
                            </div>
                            <div class="review-preview">
                                ${review.feedback[0].text.substring(0, 80)}...
                            </div>
                            <button onclick="window.codeReviewSystem.displayReview(${JSON.stringify(review).replace(/"/g, '&quot;')})" class="view-btn">View Full Review</button>
                        </div>
                    `).join('')}
                </div>
                <div class="reviews-stats">
                    <p>Total Reviews: ${reviews.length} | Average Rating: ${this.calculateAverageRating(reviews).toFixed(1)}⭐</p>
                </div>
            </div>
        `;
    }

    saveReview(review) {
        const reviews = this.getStoredReviews();
        reviews.push(review);
        this.storageManager?.set('code_reviews', reviews);
    }

    saveSubmission(code, title) {
        const submissionId = 'SUB_' + Date.now().toString(36);
        const submissions = this.storageManager?.get('code_submissions') || [];
        
        submissions.push({
            id: submissionId,
            title,
            code,
            timestamp: Date.now(),
            reviewCount: 0
        });
        
        this.storageManager?.set('code_submissions', submissions);
        return submissionId;
    }

    getStoredReviews() {
        return this.storageManager?.get('code_reviews') || [];
    }

    autoSaveCode() {
        const code = this.getCurrentCode();
        if (code.trim()) {
            this.storageManager?.set('current_code_draft', {
                code,
                timestamp: Date.now()
            });
        }
    }

    markHelpful(reviewId) {
        const reviews = this.getStoredReviews();
        const review = reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful++;
            this.storageManager?.set('code_reviews', reviews);
            this.showMessage('Thanks for the feedback!', 'success');
            this.displayReview(review);
        }
    }

    calculateAverageRating(reviews) {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return sum / reviews.length;
    }

    timeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    }

    showMessage(text, type = 'info') {
        const display = document.getElementById('review-display');
        display.innerHTML = `
            <div class="review-message ${type}">
                <p>${text}</p>
            </div>
        `;
    }

    showNotification(text) {
        const notification = document.createElement('div');
        notification.className = 'review-notification';
        notification.innerHTML = `
            <div class="notification-popup">
                <span>${text}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize code review system
document.addEventListener('DOMContentLoaded', () => {
    window.codeReviewSystem = new CodeReviewSystem();
});