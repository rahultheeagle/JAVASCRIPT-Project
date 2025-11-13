// Progress Tracking - Calculate completion percentage
class ProgressTracker {
    constructor() {
        this.categories = {
            html: { total: 4, completed: 0 },
            css: { total: 5, completed: 0 },
            js: { total: 8, completed: 0 },
            advanced: { total: 6, completed: 0 }
        };
        
        this.totals = {
            lessons: 12,
            challenges: 25,
            tutorials: 8
        };
        
        this.init();
    }

    init() {
        this.loadProgress();
        this.setupEventListeners();
        this.calculateAllProgress();
    }

    setupEventListeners() {
        document.getElementById('simulate-progress').addEventListener('click', () => {
            this.simulateProgress();
        });

        document.getElementById('reset-progress').addEventListener('click', () => {
            this.resetProgress();
        });

        document.getElementById('calculate-progress').addEventListener('click', () => {
            this.calculateAllProgress();
        });
    }

    loadProgress() {
        // Load from localStorage or use defaults
        const savedProgress = StorageManager?.get('progress') || {};
        
        // Load category progress
        Object.keys(this.categories).forEach(category => {
            if (savedProgress[category]) {
                this.categories[category].completed = savedProgress[category].completed || 0;
            }
        });

        // Load completed counts
        this.completedCounts = {
            lessons: savedProgress.lessonsCompleted || 0,
            challenges: savedProgress.challengesCompleted || 0,
            tutorials: savedProgress.tutorialsCompleted || 0
        };
    }

    saveProgress() {
        const progressData = {
            ...this.categories,
            lessonsCompleted: this.completedCounts.lessons,
            challengesCompleted: this.completedCounts.challenges,
            tutorialsCompleted: this.completedCounts.tutorials,
            lastUpdated: Date.now()
        };

        if (window.StorageManager) {
            StorageManager.set('progress', progressData);
        }
    }

    calculateCategoryPercentage(category) {
        const { completed, total } = this.categories[category];
        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    calculateOverallPercentage() {
        const totalItems = Object.values(this.categories).reduce((sum, cat) => sum + cat.total, 0);
        const completedItems = Object.values(this.categories).reduce((sum, cat) => sum + cat.completed, 0);
        
        return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
    }

    calculateLessonPercentage() {
        return Math.round((this.completedCounts.lessons / this.totals.lessons) * 100);
    }

    calculateChallengePercentage() {
        return Math.round((this.completedCounts.challenges / this.totals.challenges) * 100);
    }

    calculateTutorialPercentage() {
        return Math.round((this.completedCounts.tutorials / this.totals.tutorials) * 100);
    }

    calculateAllProgress() {
        // Calculate overall percentage
        const overallPercentage = this.calculateOverallPercentage();
        
        // Update overall display
        document.getElementById('overall-percentage').textContent = `${overallPercentage}%`;
        document.getElementById('overall-progress').style.width = `${overallPercentage}%`;
        
        // Update completion counts
        document.getElementById('lessons-completed').textContent = this.completedCounts.lessons;
        document.getElementById('challenges-completed').textContent = this.completedCounts.challenges;
        document.getElementById('tutorials-completed').textContent = this.completedCounts.tutorials;
        
        // Update category progress
        Object.keys(this.categories).forEach(category => {
            const percentage = this.calculateCategoryPercentage(category);
            const { completed, total } = this.categories[category];
            
            document.getElementById(`${category}-percentage`).textContent = `${percentage}%`;
            document.getElementById(`${category}-progress`).style.width = `${percentage}%`;
            document.getElementById(`${category}-completed`).textContent = completed;
            document.getElementById(`${category}-total`).textContent = total;
            
            // Update progress bar color based on completion
            const progressBar = document.getElementById(`${category}-progress`);
            progressBar.className = `progress-fill ${this.getProgressClass(percentage)}`;
        });

        // Update overall progress bar color
        const overallProgressBar = document.getElementById('overall-progress');
        overallProgressBar.className = `progress-fill ${this.getProgressClass(overallPercentage)}`;
        
        this.saveProgress();
    }

    getProgressClass(percentage) {
        if (percentage === 100) return 'complete';
        if (percentage >= 75) return 'high';
        if (percentage >= 50) return 'medium';
        if (percentage >= 25) return 'low';
        return 'minimal';
    }

    simulateProgress() {
        // Simulate random progress for demonstration
        Object.keys(this.categories).forEach(category => {
            const maxIncrease = Math.min(2, this.categories[category].total - this.categories[category].completed);
            const increase = Math.floor(Math.random() * (maxIncrease + 1));
            this.categories[category].completed = Math.min(
                this.categories[category].total,
                this.categories[category].completed + increase
            );
        });

        // Simulate lesson/challenge/tutorial progress
        this.completedCounts.lessons = Math.min(this.totals.lessons, 
            this.completedCounts.lessons + Math.floor(Math.random() * 3));
        this.completedCounts.challenges = Math.min(this.totals.challenges, 
            this.completedCounts.challenges + Math.floor(Math.random() * 5));
        this.completedCounts.tutorials = Math.min(this.totals.tutorials, 
            this.completedCounts.tutorials + Math.floor(Math.random() * 2));

        this.calculateAllProgress();
        this.showMessage('Progress updated!', 'success');
    }

    resetProgress() {
        if (confirm('Reset all progress? This cannot be undone.')) {
            Object.keys(this.categories).forEach(category => {
                this.categories[category].completed = 0;
            });

            this.completedCounts = {
                lessons: 0,
                challenges: 0,
                tutorials: 0
            };

            this.calculateAllProgress();
            this.showMessage('Progress reset!', 'info');
        }
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
            z-index: 1000;
            animation: fadeIn 0.5s ease;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }

    // Public method to update progress from other parts of the app
    updateProgress(type, category = null, increment = 1) {
        switch (type) {
            case 'lesson':
                this.completedCounts.lessons = Math.min(this.totals.lessons, 
                    this.completedCounts.lessons + increment);
                break;
            case 'challenge':
                this.completedCounts.challenges = Math.min(this.totals.challenges, 
                    this.completedCounts.challenges + increment);
                break;
            case 'tutorial':
                this.completedCounts.tutorials = Math.min(this.totals.tutorials, 
                    this.completedCounts.tutorials + increment);
                break;
            case 'category':
                if (category && this.categories[category]) {
                    this.categories[category].completed = Math.min(
                        this.categories[category].total,
                        this.categories[category].completed + increment
                    );
                }
                break;
        }
        
        this.calculateAllProgress();
    }
}

// Initialize progress tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new ProgressTracker();
});