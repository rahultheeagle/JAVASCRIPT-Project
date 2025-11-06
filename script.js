// Profile System with Local Storage Persistence
class ProfileSystem {
    constructor() {
        this.profileData = this.loadProfile();
        this.initializeElements();
        this.bindEvents();
        this.updateProfileDisplay();
    }

    // Load profile from localStorage
    loadProfile() {
        const saved = localStorage.getItem('codequest_profile');
        return saved ? JSON.parse(saved) : {
            username: 'Guest',
            email: '',
            avatarUrl: 'https://via.placeholder.com/50'
        };
    }

    // Save profile to localStorage
    saveProfile() {
        localStorage.setItem('codequest_profile', JSON.stringify(this.profileData));
    }

    // Initialize DOM elements
    initializeElements() {
        this.profileName = document.getElementById('profile-name');
        this.profileAvatar = document.getElementById('profile-avatar');
        this.editBtn = document.getElementById('edit-profile-btn');
        this.modal = document.getElementById('profile-modal');
        this.closeBtn = document.querySelector('.close');
        this.profileForm = document.getElementById('profile-form');
        this.usernameInput = document.getElementById('username');
        this.emailInput = document.getElementById('email');
        this.avatarInput = document.getElementById('avatar-url');
    }

    // Bind event listeners
    bindEvents() {
        this.editBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        this.profileForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Update profile display
    updateProfileDisplay() {
        this.profileName.textContent = this.profileData.username;
        this.profileAvatar.src = this.profileData.avatarUrl;
        this.profileAvatar.onerror = () => {
            this.profileAvatar.src = 'https://via.placeholder.com/50';
        };
    }

    // Open profile modal
    openModal() {
        this.usernameInput.value = this.profileData.username;
        this.emailInput.value = this.profileData.email;
        this.avatarInput.value = this.profileData.avatarUrl;
        this.modal.style.display = 'block';
    }

    // Close profile modal
    closeModal() {
        this.modal.style.display = 'none';
    }

    // Handle form submission
    handleSubmit(e) {
        e.preventDefault();
        
        this.profileData.username = this.usernameInput.value.trim() || 'Guest';
        this.profileData.email = this.emailInput.value.trim();
        this.profileData.avatarUrl = this.avatarInput.value.trim() || 'https://via.placeholder.com/50';
        
        this.saveProfile();
        this.updateProfileDisplay();
        this.closeModal();
        
        // Show success message
        this.showNotification('Profile updated successfully!');
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Progress Tracker System
class ProgressTracker {
    constructor() {
        this.progressData = this.loadProgress();
        this.totalLessons = 12;
        this.initializeElements();
        this.bindEvents();
        this.updateProgressDisplay();
    }

    // Load progress from localStorage
    loadProgress() {
        const saved = localStorage.getItem('codequest_progress');
        return saved ? JSON.parse(saved) : {
            completedLessons: [],
            currentLesson: 1
        };
    }

    // Save progress to localStorage
    saveProgress() {
        localStorage.setItem('codequest_progress', JSON.stringify(this.progressData));
    }

    // Initialize DOM elements
    initializeElements() {
        this.completedLessonsEl = document.getElementById('completed-lessons');
        this.totalLessonsEl = document.getElementById('total-lessons');
        this.completionPercentageEl = document.getElementById('completion-percentage');
        this.progressFillEl = document.getElementById('progress-fill');
        this.lessonCards = document.querySelectorAll('.lesson-card');
    }

    // Bind event listeners
    bindEvents() {
        this.lessonCards.forEach(card => {
            card.addEventListener('click', () => {
                const lessonId = parseInt(card.dataset.lesson);
                this.toggleLessonCompletion(lessonId);
            });
        });
    }

    // Toggle lesson completion status
    toggleLessonCompletion(lessonId) {
        const index = this.progressData.completedLessons.indexOf(lessonId);
        
        if (index === -1) {
            // Mark as completed
            this.progressData.completedLessons.push(lessonId);
            this.showNotification(`Lesson ${lessonId} completed! 🎉`);
        } else {
            // Mark as incomplete
            this.progressData.completedLessons.splice(index, 1);
            this.showNotification(`Lesson ${lessonId} marked as incomplete`);
        }
        
        this.saveProgress();
        this.updateProgressDisplay();
    }

    // Update progress display
    updateProgressDisplay() {
        const completedCount = this.progressData.completedLessons.length;
        const percentage = Math.round((completedCount / this.totalLessons) * 100);
        
        // Update stats
        this.completedLessonsEl.textContent = completedCount;
        this.totalLessonsEl.textContent = this.totalLessons;
        this.completionPercentageEl.textContent = `${percentage}%`;
        
        // Update progress bar
        this.progressFillEl.style.width = `${percentage}%`;
        
        // Update lesson cards
        this.lessonCards.forEach(card => {
            const lessonId = parseInt(card.dataset.lesson);
            const isCompleted = this.progressData.completedLessons.includes(lessonId);
            
            card.classList.remove('completed', 'in-progress');
            
            if (isCompleted) {
                card.classList.add('completed');
            } else if (lessonId === this.progressData.currentLesson) {
                card.classList.add('in-progress');
            }
        });
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize both systems when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new ProfileSystem();
    new ProgressTracker();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);