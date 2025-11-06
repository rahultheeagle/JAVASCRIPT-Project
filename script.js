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

// Achievement System
class AchievementSystem {
    constructor() {
        this.achievementData = this.loadAchievements();
        this.milestones = {
            'first-lesson': { threshold: 1, name: 'First Steps' },
            'early-bird': { threshold: 3, name: 'Early Bird' },
            'dedicated': { threshold: 5, name: 'Dedicated Learner' },
            'halfway': { threshold: 6, name: 'Halfway Hero' },
            'almost-there': { threshold: 9, name: 'Almost There' },
            'champion': { threshold: 12, name: 'CodeQuest Champion' }
        };
        this.initializeElements();
        this.updateBadgeDisplay();
    }

    // Load achievements from localStorage
    loadAchievements() {
        const saved = localStorage.getItem('codequest_achievements');
        return saved ? JSON.parse(saved) : {
            earnedBadges: []
        };
    }

    // Save achievements to localStorage
    saveAchievements() {
        localStorage.setItem('codequest_achievements', JSON.stringify(this.achievementData));
    }

    // Initialize DOM elements
    initializeElements() {
        this.badgeElements = document.querySelectorAll('.badge');
    }

    // Check and award achievements based on completed lessons
    checkAchievements(completedCount) {
        const newBadges = [];
        
        Object.keys(this.milestones).forEach(badgeId => {
            const milestone = this.milestones[badgeId];
            const alreadyEarned = this.achievementData.earnedBadges.includes(badgeId);
            
            if (completedCount >= milestone.threshold && !alreadyEarned) {
                this.achievementData.earnedBadges.push(badgeId);
                newBadges.push(milestone.name);
            }
        });
        
        if (newBadges.length > 0) {
            this.saveAchievements();
            this.updateBadgeDisplay();
            this.showAchievementNotification(newBadges);
        }
    }

    // Update badge display
    updateBadgeDisplay() {
        this.badgeElements.forEach(badge => {
            const badgeId = badge.dataset.badge;
            const isEarned = this.achievementData.earnedBadges.includes(badgeId);
            
            if (isEarned) {
                badge.classList.add('earned');
            } else {
                badge.classList.remove('earned');
            }
        });
    }

    // Show achievement notification
    showAchievementNotification(newBadges) {
        newBadges.forEach((badgeName, index) => {
            setTimeout(() => {
                const notification = document.createElement('div');
                notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-size: 1.5rem;">🏆</span>
                        <div>
                            <strong>Achievement Unlocked!</strong><br>
                            ${badgeName}
                        </div>
                    </div>
                `;
                notification.style.cssText = `
                    position: fixed;
                    top: ${20 + (index * 80)}px;
                    right: 20px;
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    color: #333;
                    padding: 15px 20px;
                    border-radius: 10px;
                    z-index: 1002;
                    animation: badgeEarned 0.6s ease;
                    box-shadow: 0 8px 20px rgba(255, 215, 0, 0.4);
                    border: 2px solid #B8860B;
                `;
                
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.remove();
                }, 4000);
            }, index * 500);
        });
    }
}

// Streak Counter System
class StreakCounter {
    constructor() {
        this.streakData = this.loadStreakData();
        this.initializeElements();
        this.updateStreakDisplay();
        this.checkDailyReset();
    }

    // Load streak data from localStorage
    loadStreakData() {
        const saved = localStorage.getItem('codequest_streak');
        return saved ? JSON.parse(saved) : {
            currentStreak: 0,
            lastActivityDate: null,
            longestStreak: 0,
            activityDates: []
        };
    }

    // Save streak data to localStorage
    saveStreakData() {
        localStorage.setItem('codequest_streak', JSON.stringify(this.streakData));
    }

    // Initialize DOM elements
    initializeElements() {
        this.streakCounterEl = document.getElementById('streak-counter');
        this.lastActivityEl = document.getElementById('last-activity');
        this.streakStatEl = document.querySelector('.streak-stat');
    }

    // Get today's date as string
    getTodayString() {
        return new Date().toDateString();
    }

    // Check if we need to reset streak (called on page load)
    checkDailyReset() {
        const today = this.getTodayString();
        const lastActivity = this.streakData.lastActivityDate;
        
        if (lastActivity) {
            const lastDate = new Date(lastActivity);
            const todayDate = new Date(today);
            const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
            
            // If more than 1 day has passed, reset streak
            if (daysDiff > 1) {
                this.streakData.currentStreak = 0;
                this.saveStreakData();
                this.updateStreakDisplay();
            }
        }
    }

    // Record activity for today
    recordActivity() {
        const today = this.getTodayString();
        const lastActivity = this.streakData.lastActivityDate;
        
        // If this is the first activity today
        if (lastActivity !== today) {
            if (lastActivity) {
                const lastDate = new Date(lastActivity);
                const todayDate = new Date(today);
                const daysDiff = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));
                
                if (daysDiff === 1) {
                    // Consecutive day - increment streak
                    this.streakData.currentStreak++;
                } else if (daysDiff > 1) {
                    // Gap in days - reset streak
                    this.streakData.currentStreak = 1;
                } else {
                    // Same day - no change to streak
                    return;
                }
            } else {
                // First ever activity
                this.streakData.currentStreak = 1;
            }
            
            this.streakData.lastActivityDate = today;
            
            // Update longest streak
            if (this.streakData.currentStreak > this.streakData.longestStreak) {
                this.streakData.longestStreak = this.streakData.currentStreak;
            }
            
            // Add to activity dates
            if (!this.streakData.activityDates.includes(today)) {
                this.streakData.activityDates.push(today);
            }
            
            this.saveStreakData();
            this.updateStreakDisplay();
            this.showStreakNotification();
        }
    }

    // Update streak display
    updateStreakDisplay() {
        this.streakCounterEl.textContent = this.streakData.currentStreak;
        
        // Update last activity text
        if (this.streakData.lastActivityDate) {
            const lastDate = new Date(this.streakData.lastActivityDate);
            const today = new Date();
            const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 0) {
                this.lastActivityEl.textContent = 'Active today!';
            } else if (daysDiff === 1) {
                this.lastActivityEl.textContent = 'Yesterday';
            } else {
                this.lastActivityEl.textContent = `${daysDiff} days ago`;
            }
        } else {
            this.lastActivityEl.textContent = 'No activity yet';
        }
        
        // Add hot streak effect for streaks >= 3
        if (this.streakData.currentStreak >= 3) {
            this.streakStatEl.classList.add('hot-streak');
        } else {
            this.streakStatEl.classList.remove('hot-streak');
        }
    }

    // Show streak notification
    showStreakNotification() {
        const streak = this.streakData.currentStreak;
        let message = '';
        let emoji = '🔥';
        
        if (streak === 1) {
            message = 'Great start! Keep it up!';
            emoji = '🎆';
        } else if (streak === 3) {
            message = 'You\'re on fire! 3-day streak!';
        } else if (streak === 7) {
            message = 'Amazing! One week streak!';
            emoji = '🏆';
        } else if (streak === 30) {
            message = 'Incredible! 30-day streak!';
            emoji = '🎉';
        } else if (streak > 1) {
            message = `${streak}-day streak! Keep going!`;
        }
        
        if (message) {
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 1.5rem;">${emoji}</span>
                    <div>
                        <strong>Streak Update!</strong><br>
                        ${message}
                    </div>
                </div>
            `;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 1002;
                animation: slideIn 0.3s ease;
                box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3);
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
    }
}

// Initialize all systems when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const profileSystem = new ProfileSystem();
    const progressTracker = new ProgressTracker();
    const achievementSystem = new AchievementSystem();
    const streakCounter = new StreakCounter();
    
    // Connect progress tracker with achievement system and streak counter
    const originalToggle = progressTracker.toggleLessonCompletion;
    progressTracker.toggleLessonCompletion = function(lessonId) {
        originalToggle.call(this, lessonId);
        achievementSystem.checkAchievements(this.progressData.completedLessons.length);
        streakCounter.recordActivity();
    };
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