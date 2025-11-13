// Main Application JavaScript
class CodeQuestApp {
    constructor() {
        this.init();
    }

    init() {
        this.loadProfile();
        this.setupEventListeners();
        this.updateUI();
    }

    loadProfile() {
        const profile = StorageManager.get('profile') || {
            name: 'Guest',
            email: '',
            avatar: 'https://via.placeholder.com/50',
            xp: 0,
            level: 1,
            streak: 0,
            lastActivity: null
        };
        
        this.profile = profile;
        StorageManager.set('profile', profile);
    }

    setupEventListeners() {
        // Profile modal
        const editBtn = document.getElementById('edit-profile-btn');
        const modal = document.getElementById('profile-modal');
        const closeBtn = document.querySelector('.close');
        const form = document.getElementById('profile-form');

        if (editBtn) editBtn.onclick = () => this.openProfileModal();
        if (closeBtn) closeBtn.onclick = () => this.closeProfileModal();
        if (form) form.onsubmit = (e) => this.saveProfile(e);
        
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.onclick = () => this.toggleTheme();
    }

    openProfileModal() {
        const modal = document.getElementById('profile-modal');
        document.getElementById('username').value = this.profile.name;
        document.getElementById('email').value = this.profile.email;
        document.getElementById('avatar-url').value = this.profile.avatar;
        modal.style.display = 'block';
    }

    closeProfileModal() {
        document.getElementById('profile-modal').style.display = 'none';
    }

    saveProfile(e) {
        e.preventDefault();
        this.profile.name = document.getElementById('username').value;
        this.profile.email = document.getElementById('email').value;
        this.profile.avatar = document.getElementById('avatar-url').value || this.profile.avatar;
        
        StorageManager.set('profile', this.profile);
        this.updateUI();
        this.closeProfileModal();
    }

    updateUI() {
        document.getElementById('profile-name').textContent = this.profile.name;
        document.getElementById('profile-avatar').src = this.profile.avatar;
        document.getElementById('level-badge').textContent = `Level ${this.profile.level}`;
        
        const xpNeeded = this.profile.level * 100;
        const xpProgress = (this.profile.xp % 100) / 100 * 100;
        
        document.getElementById('xp-fill').style.width = `${xpProgress}%`;
        document.getElementById('xp-text').textContent = `${this.profile.xp % 100} / 100 XP`;
    }

    addXP(amount) {
        this.profile.xp += amount;
        const newLevel = Math.floor(this.profile.xp / 100) + 1;
        
        if (newLevel > this.profile.level) {
            this.profile.level = newLevel;
            this.showLevelUp();
        }
        
        StorageManager.set('profile', this.profile);
        this.updateUI();
    }

    showLevelUp() {
        // Simple level up notification
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.textContent = `Level Up! You're now level ${this.profile.level}!`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: fadeIn 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        document.getElementById('theme-toggle').textContent = isDark ? '☀️' : '🌙';
        StorageManager.set('theme', isDark ? 'dark' : 'light');
    }
}

// Storage Manager Class
class StorageManager {
    static keys = {
        profile: 'codequest_profile',
        progress: 'codequest_progress',
        settings: 'codequest_settings',
        savedCode: 'codequest_saved_code',
        gamification: 'codequest_gamification'
    };

    static batchQueue = [];
    static batchTimeout = null;

    static get(key) {
        try {
            const start = performance.now();
            const data = localStorage.getItem(this.keys[key] || key);
            const result = data ? JSON.parse(data) : null;
            const end = performance.now();
            
            if (end - start > 10) {
                console.warn(`Storage read took ${(end - start).toFixed(2)}ms`);
            }
            
            return result;
        } catch (e) {
            console.error('Storage read error:', e);
            return null;
        }
    }

    static set(key, data) {
        try {
            const start = performance.now();
            
            // Add timestamp for cleanup
            const dataWithTimestamp = {
                ...data,
                _timestamp: Date.now()
            };
            
            // Compress data
            const compressed = JSON.stringify(dataWithTimestamp).replace(/\s+/g, '');
            
            localStorage.setItem(this.keys[key] || key, compressed);
            
            const end = performance.now();
            if (end - start > 10) {
                console.warn(`Storage write took ${(end - start).toFixed(2)}ms`);
            }
            
            return true;
        } catch (e) {
            console.error('Storage write error:', e);
            return false;
        }
    }

    static batchSet(key, data) {
        this.batchQueue.push({ key, data });
        
        if (this.batchTimeout) clearTimeout(this.batchTimeout);
        this.batchTimeout = setTimeout(() => this.flushBatch(), 50);
    }

    static flushBatch() {
        const start = performance.now();
        
        this.batchQueue.forEach(({ key, data }) => {
            this.set(key, data);
        });
        
        this.batchQueue = [];
        
        const end = performance.now();
        console.log(`Batch storage operation: ${(end - start).toFixed(2)}ms`);
    }

    static remove(key) {
        localStorage.removeItem(this.keys[key] || key);
    }

    static cleanup() {
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        const now = Date.now();
        let cleaned = 0;

        Object.keys(localStorage).forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data._timestamp && (now - data._timestamp) > maxAge) {
                    localStorage.removeItem(key);
                    cleaned++;
                }
            } catch (e) {
                // Invalid JSON, skip
            }
        });

        if (cleaned > 0) {
            console.log(`Cleaned up ${cleaned} old storage entries`);
        }
    }

    static getStorageSize() {
        let total = 0;
        Object.keys(localStorage).forEach(key => {
            total += localStorage.getItem(key).length;
        });
        return (total / 1024).toFixed(2) + ' KB';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const start = performance.now();
    
    // Cleanup old storage data
    StorageManager.cleanup();
    
    window.app = new CodeQuestApp();
    
    const end = performance.now();
    console.log(`App initialization: ${(end - start).toFixed(2)}ms`);
    
    // Performance monitoring
    if (end - start > 100) {
        console.warn('App initialization exceeds 100ms target');
    }
});