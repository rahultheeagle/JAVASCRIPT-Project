class ImportExport {
    constructor() {
        this.init();
    }

    init() {
        this.createUI();
        this.bindEvents();
    }

    createUI() {
        // Add import/export buttons to existing pages
        this.addToStorageManager();
        this.addToSettings();
    }

    addToStorageManager() {
        const container = document.querySelector('.storage-actions');
        if (!container) return;

        const exportBtn = document.createElement('button');
        exportBtn.className = 'btn-primary export-btn';
        exportBtn.innerHTML = '📥 Export Progress';
        exportBtn.onclick = () => this.exportProgress();

        const importBtn = document.createElement('button');
        importBtn.className = 'btn-secondary import-btn';
        importBtn.innerHTML = '📤 Import Progress';
        importBtn.onclick = () => this.importProgress();

        container.appendChild(exportBtn);
        container.appendChild(importBtn);
    }

    addToSettings() {
        // Add to modal settings if available
        if (window.modalSystem) {
            const originalGetSettingsModal = window.modalSystem.getSettingsModal;
            window.modalSystem.getSettingsModal = function() {
                const modal = originalGetSettingsModal.call(this);
                return modal.replace(
                    '<button class="btn-secondary" id="export-data-btn">Export Data</button>',
                    '<button class="btn-secondary" id="export-data-btn">Export All Data</button>\n                                <button class="btn-primary" id="export-progress-btn">Export Progress</button>'
                );
            };
        }
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.id === 'export-progress-btn') {
                this.exportProgress();
            }
        });
    }

    exportProgress() {
        const progressData = this.collectProgressData();
        const jsonData = JSON.stringify(progressData, null, 2);
        
        this.downloadFile(jsonData, `codequest-progress-${this.getTimestamp()}.json`, 'application/json');
        
        if (window.toastSystem) {
            window.toastSystem.success('Progress exported successfully!');
        }
    }

    collectProgressData() {
        const data = {
            exportInfo: {
                version: '1.0',
                exportDate: new Date().toISOString(),
                platform: 'CodeQuest'
            },
            userProfile: this.getUserProfile(),
            progress: this.getProgress(),
            achievements: this.getAchievements(),
            statistics: this.getStatistics(),
            settings: this.getSettings(),
            completedChallenges: this.getCompletedChallenges(),
            lessonProgress: this.getLessonProgress()
        };

        return data;
    }

    getUserProfile() {
        if (!window.storageManager) return {};
        
        return window.storageManager.getItem('userProfile') || {};
    }

    getProgress() {
        if (!window.storageManager) return {};
        
        return {
            completedLessons: window.storageManager.getItem('completedLessons') || [],
            currentStreak: window.storageManager.getItem('currentStreak') || 0,
            totalXP: window.storageManager.getItem('totalXP') || 0,
            currentLevel: window.storageManager.getItem('currentLevel') || 1,
            lastActivity: window.storageManager.getItem('lastActivity') || null
        };
    }

    getAchievements() {
        if (!window.storageManager) return [];
        
        return window.storageManager.getItem('unlockedAchievements') || [];
    }

    getStatistics() {
        if (!window.storageManager) return {};
        
        return {
            challengesCompleted: window.storageManager.getItem('challengesCompleted') || 0,
            lessonsCompleted: window.storageManager.getItem('lessonsCompleted') || 0,
            totalTimeSpent: window.storageManager.getItem('totalTimeSpent') || 0,
            bestTimes: window.storageManager.getItem('bestTimes') || {},
            streakRecord: window.storageManager.getItem('streakRecord') || 0
        };
    }

    getSettings() {
        if (!window.storageManager) return {};
        
        return window.storageManager.getItem('appSettings') || {};
    }

    getCompletedChallenges() {
        if (!window.storageManager) return [];
        
        return window.storageManager.getItem('completedChallenges') || [];
    }

    getLessonProgress() {
        if (!window.storageManager) return {};
        
        return window.storageManager.getItem('lessonProgress') || {};
    }

    importProgress() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    this.processImportedData(data);
                } catch (error) {
                    if (window.toastSystem) {
                        window.toastSystem.error('Invalid JSON file!');
                    }
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    processImportedData(data) {
        if (!this.validateImportData(data)) {
            if (window.toastSystem) {
                window.toastSystem.error('Invalid progress file format!');
            }
            return;
        }

        // Show confirmation dialog
        if (!confirm('This will overwrite your current progress. Continue?')) {
            return;
        }

        this.restoreProgressData(data);
        
        if (window.toastSystem) {
            window.toastSystem.success('Progress imported successfully!');
        }
        
        // Reload page to reflect changes
        setTimeout(() => location.reload(), 1500);
    }

    validateImportData(data) {
        return data && 
               data.exportInfo && 
               data.exportInfo.platform === 'CodeQuest' &&
               typeof data.progress === 'object';
    }

    restoreProgressData(data) {
        if (!window.storageManager) return;

        // Restore user profile
        if (data.userProfile) {
            window.storageManager.setItem('userProfile', data.userProfile);
        }

        // Restore progress
        if (data.progress) {
            Object.entries(data.progress).forEach(([key, value]) => {
                window.storageManager.setItem(key, value);
            });
        }

        // Restore achievements
        if (data.achievements) {
            window.storageManager.setItem('unlockedAchievements', data.achievements);
        }

        // Restore statistics
        if (data.statistics) {
            Object.entries(data.statistics).forEach(([key, value]) => {
                window.storageManager.setItem(key, value);
            });
        }

        // Restore settings
        if (data.settings) {
            window.storageManager.setItem('appSettings', data.settings);
        }

        // Restore completed challenges
        if (data.completedChallenges) {
            window.storageManager.setItem('completedChallenges', data.completedChallenges);
        }

        // Restore lesson progress
        if (data.lessonProgress) {
            window.storageManager.setItem('lessonProgress', data.lessonProgress);
        }
    }

    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }

    getTimestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    }

    // Quick export methods
    exportUserProfile() {
        const profile = this.getUserProfile();
        const jsonData = JSON.stringify(profile, null, 2);
        this.downloadFile(jsonData, `profile-${this.getTimestamp()}.json`, 'application/json');
        
        if (window.toastSystem) {
            window.toastSystem.success('Profile exported!');
        }
    }

    exportAchievements() {
        const achievements = this.getAchievements();
        const jsonData = JSON.stringify(achievements, null, 2);
        this.downloadFile(jsonData, `achievements-${this.getTimestamp()}.json`, 'application/json');
        
        if (window.toastSystem) {
            window.toastSystem.success('Achievements exported!');
        }
    }

    exportStatistics() {
        const stats = this.getStatistics();
        const jsonData = JSON.stringify(stats, null, 2);
        this.downloadFile(jsonData, `statistics-${this.getTimestamp()}.json`, 'application/json');
        
        if (window.toastSystem) {
            window.toastSystem.success('Statistics exported!');
        }
    }

    // Backup creation
    createBackup() {
        const backupData = {
            ...this.collectProgressData(),
            backupInfo: {
                type: 'full_backup',
                createdAt: new Date().toISOString(),
                version: '1.0'
            }
        };
        
        const jsonData = JSON.stringify(backupData, null, 2);
        this.downloadFile(jsonData, `codequest-backup-${this.getTimestamp()}.json`, 'application/json');
        
        if (window.toastSystem) {
            window.toastSystem.success('Backup created successfully!');
        }
    }
}

// Initialize import/export system
document.addEventListener('DOMContentLoaded', () => {
    window.importExport = new ImportExport();
});