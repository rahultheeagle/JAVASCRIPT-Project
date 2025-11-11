class ResetSystem {
    constructor() {
        this.init();
    }

    init() {
        this.addResetButtons();
        this.bindEvents();
    }

    addResetButtons() {
        // Add to storage manager
        this.addToStorageManager();
        // Add to settings modal
        this.addToSettings();
    }

    addToStorageManager() {
        const container = document.querySelector('.storage-actions');
        if (!container) return;

        const resetBtn = document.createElement('button');
        resetBtn.className = 'btn-danger reset-all-btn';
        resetBtn.innerHTML = '🗑️ Reset All Progress';
        resetBtn.onclick = () => this.showResetConfirmation('all');

        container.appendChild(resetBtn);
    }

    addToSettings() {
        if (window.modalSystem) {
            const originalGetSettingsModal = window.modalSystem.getSettingsModal;
            window.modalSystem.getSettingsModal = function() {
                const modal = originalGetSettingsModal.call(this);
                return modal.replace(
                    '<button class="btn-danger" id="reset-data-btn">Reset All Data</button>',
                    '<button class="btn-danger" id="reset-progress-btn">Reset Progress</button>\n                                <button class="btn-danger" id="reset-all-btn">Reset Everything</button>'
                );
            };
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'reset-progress-btn') {
                this.showResetConfirmation('progress');
            } else if (e.target.id === 'reset-all-btn') {
                this.showResetConfirmation('all');
            }
        });
    }

    showResetConfirmation(type) {
        const confirmations = {
            progress: {
                title: 'Reset Learning Progress',
                message: 'This will clear your XP, achievements, completed lessons, and statistics. Your profile settings will be kept.',
                items: ['XP and Level', 'Achievements', 'Completed Lessons', 'Learning Statistics', 'Challenge Progress']
            },
            profile: {
                title: 'Reset Profile',
                message: 'This will clear your profile information and preferences.',
                items: ['Username and Email', 'Profile Picture', 'Learning Preferences', 'Theme Settings']
            },
            all: {
                title: 'Reset Everything',
                message: 'This will completely reset CodeQuest to its initial state. All data will be permanently lost.',
                items: ['All Learning Progress', 'Profile Information', 'Settings and Preferences', 'Saved Code', 'All Local Data']
            }
        };

        const config = confirmations[type];
        this.showConfirmationModal(config, () => this.executeReset(type));
    }

    showConfirmationModal(config, onConfirm) {
        if (window.modalSystem) {
            const container = document.getElementById('modal-container');
            container.innerHTML = `
                <div class="modal reset-modal">
                    <div class="modal-header">
                        <h2>${config.title}</h2>
                        <button class="modal-close" onclick="window.modalSystem.closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="reset-warning">
                            <div class="warning-icon">⚠️</div>
                            <p>${config.message}</p>
                        </div>
                        <div class="reset-items">
                            <h4>The following will be cleared:</h4>
                            <ul>
                                ${config.items.map(item => `<li>${item}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="reset-confirmation">
                            <label>
                                <input type="checkbox" id="confirm-reset" required>
                                I understand this action cannot be undone
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" onclick="window.modalSystem.closeModal()">Cancel</button>
                        <button class="btn-danger" id="confirm-reset-btn" disabled onclick="this.executeConfirmedReset()">Reset</button>
                    </div>
                </div>
            `;
            
            container.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Bind confirmation checkbox
            const checkbox = document.getElementById('confirm-reset');
            const confirmBtn = document.getElementById('confirm-reset-btn');
            
            checkbox.addEventListener('change', () => {
                confirmBtn.disabled = !checkbox.checked;
            });

            // Store callback for execution
            window.resetSystem._pendingReset = onConfirm;
        } else {
            // Fallback to browser confirm
            if (confirm(`${config.title}\n\n${config.message}\n\nThis action cannot be undone. Continue?`)) {
                onConfirm();
            }
        }
    }

    executeConfirmedReset() {
        if (window.resetSystem._pendingReset) {
            window.resetSystem._pendingReset();
            window.resetSystem._pendingReset = null;
        }
        window.modalSystem?.closeModal();
    }

    executeReset(type) {
        if (!window.storageManager) {
            if (window.toastSystem) {
                window.toastSystem.error('Storage manager not available!');
            }
            return;
        }

        switch (type) {
            case 'progress':
                this.resetProgress();
                break;
            case 'profile':
                this.resetProfile();
                break;
            case 'all':
                this.resetAll();
                break;
        }
    }

    resetProgress() {
        const progressKeys = [
            'totalXP', 'currentLevel', 'currentStreak', 'streakRecord',
            'completedLessons', 'completedChallenges', 'unlockedAchievements',
            'challengesCompleted', 'lessonsCompleted', 'totalTimeSpent',
            'bestTimes', 'lessonProgress', 'lastActivity'
        ];

        progressKeys.forEach(key => {
            window.storageManager.removeItem(key);
        });

        if (window.toastSystem) {
            window.toastSystem.success('Learning progress has been reset!');
        }

        setTimeout(() => this.reloadPage(), 1500);
    }

    resetProfile() {
        const profileKeys = [
            'userProfile', 'appSettings'
        ];

        profileKeys.forEach(key => {
            window.storageManager.removeItem(key);
        });

        if (window.toastSystem) {
            window.toastSystem.success('Profile has been reset!');
        }

        setTimeout(() => this.reloadPage(), 1500);
    }

    resetAll() {
        window.storageManager.clearAll();

        if (window.toastSystem) {
            window.toastSystem.success('Everything has been reset!');
        }

        setTimeout(() => this.reloadPage(), 1500);
    }

    reloadPage() {
        window.location.reload();
    }

    // Quick reset methods for specific data types
    resetAchievements() {
        if (confirm('Reset all achievements? This cannot be undone.')) {
            window.storageManager?.removeItem('unlockedAchievements');
            window.toastSystem?.success('Achievements reset!');
        }
    }

    resetStatistics() {
        if (confirm('Reset all statistics? This cannot be undone.')) {
            const statsKeys = ['challengesCompleted', 'lessonsCompleted', 'totalTimeSpent', 'bestTimes'];
            statsKeys.forEach(key => window.storageManager?.removeItem(key));
            window.toastSystem?.success('Statistics reset!');
        }
    }

    resetSettings() {
        if (confirm('Reset all settings to default? This cannot be undone.')) {
            window.storageManager?.removeItem('appSettings');
            window.toastSystem?.success('Settings reset to default!');
            setTimeout(() => this.reloadPage(), 1000);
        }
    }

    // Emergency reset (for development/testing)
    emergencyReset() {
        if (confirm('EMERGENCY RESET: This will clear ALL data immediately. Continue?')) {
            localStorage.clear();
            sessionStorage.clear();
            window.toastSystem?.success('Emergency reset completed!');
            setTimeout(() => this.reloadPage(), 1000);
        }
    }

    // Backup before reset
    backupAndReset(type) {
        if (window.importExport) {
            // Create backup first
            window.importExport.createBackup();
            
            // Wait a moment then show reset confirmation
            setTimeout(() => {
                this.showResetConfirmation(type);
            }, 1000);
        } else {
            this.showResetConfirmation(type);
        }
    }
}

// Add global method for modal callback
window.executeConfirmedReset = function() {
    window.resetSystem.executeConfirmedReset();
};

// Initialize reset system
document.addEventListener('DOMContentLoaded', () => {
    window.resetSystem = new ResetSystem();
});