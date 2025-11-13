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

    static get(key) {
        try {
            const data = localStorage.getItem(this.keys[key] || key);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }

    static set(key, data) {
        try {
            localStorage.setItem(this.keys[key] || key, JSON.stringify(data));
            return true;
        } catch (e) {
            return false;
        }
    }

    static remove(key) {
        localStorage.removeItem(this.keys[key] || key);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new CodeQuestApp();
});