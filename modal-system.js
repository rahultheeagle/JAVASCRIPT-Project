class ModalSystem {
    constructor() {
        this.activeModal = null;
        this.init();
    }

    init() {
        this.createModalContainer();
        this.bindEvents();
    }

    createModalContainer() {
        if (document.getElementById('modal-container')) return;
        
        const container = document.createElement('div');
        container.id = 'modal-container';
        container.className = 'modal-overlay';
        document.body.appendChild(container);
    }

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.closeModal();
            }
        });
    }

    showModal(type, data = {}) {
        const container = document.getElementById('modal-container');
        container.innerHTML = this.getModalContent(type, data);
        container.classList.add('active');
        this.activeModal = type;
        document.body.style.overflow = 'hidden';
        
        // Bind close buttons
        container.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Bind specific modal events
        this.bindModalEvents(type, container);
    }

    closeModal() {
        const container = document.getElementById('modal-container');
        container.classList.remove('active');
        document.body.style.overflow = '';
        this.activeModal = null;
        setTimeout(() => container.innerHTML = '', 300);
    }

    getModalContent(type, data) {
        switch (type) {
            case 'instructions':
                return this.getInstructionsModal(data);
            case 'achievement':
                return this.getAchievementModal(data);
            case 'settings':
                return this.getSettingsModal();
            default:
                return '<div class="modal"><p>Unknown modal type</p></div>';
        }
    }

    getInstructionsModal(data) {
        const { title = 'Instructions', content = 'No instructions available', steps = [] } = data;
        
        return `
            <div class="modal instructions-modal">
                <div class="modal-header">
                    <h2>${title}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="instructions-content">
                        <p>${content}</p>
                        ${steps.length ? `
                            <ol class="instruction-steps">
                                ${steps.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        ` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary modal-close">Got it!</button>
                </div>
            </div>
        `;
    }

    getAchievementModal(data) {
        const { 
            title = 'Achievement Unlocked!', 
            description = 'You earned a new achievement', 
            icon = '🏆',
            xp = 0 
        } = data;
        
        return `
            <div class="modal achievement-modal">
                <div class="modal-header">
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="achievement-content">
                        <div class="achievement-icon">${icon}</div>
                        <h2>${title}</h2>
                        <p>${description}</p>
                        ${xp > 0 ? `<div class="xp-reward">+${xp} XP</div>` : ''}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary modal-close">Awesome!</button>
                </div>
            </div>
        `;
    }

    getSettingsModal() {
        const settings = this.loadSettings();
        
        return `
            <div class="modal settings-modal">
                <div class="modal-header">
                    <h2>Settings</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="settings-content">
                        <div class="setting-group">
                            <h3>Appearance</h3>
                            <div class="setting-item">
                                <label>Theme</label>
                                <select id="theme-setting">
                                    <option value="auto" ${settings.theme === 'auto' ? 'selected' : ''}>Auto</option>
                                    <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Light</option>
                                    <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                </select>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="animations-setting" ${settings.animations ? 'checked' : ''}>
                                    Enable animations
                                </label>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <h3>Notifications</h3>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="achievements-setting" ${settings.achievementNotifications ? 'checked' : ''}>
                                    Achievement notifications
                                </label>
                            </div>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="reminders-setting" ${settings.studyReminders ? 'checked' : ''}>
                                    Study reminders
                                </label>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <h3>Learning</h3>
                            <div class="setting-item">
                                <label>
                                    <input type="checkbox" id="hints-setting" ${settings.showHints ? 'checked' : ''}>
                                    Show hints automatically
                                </label>
                            </div>
                            <div class="setting-item">
                                <label>Auto-save interval</label>
                                <select id="autosave-setting">
                                    <option value="30" ${settings.autoSave === 30 ? 'selected' : ''}>30 seconds</option>
                                    <option value="60" ${settings.autoSave === 60 ? 'selected' : ''}>1 minute</option>
                                    <option value="300" ${settings.autoSave === 300 ? 'selected' : ''}>5 minutes</option>
                                    <option value="0" ${settings.autoSave === 0 ? 'selected' : ''}>Disabled</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="setting-group">
                            <h3>Data</h3>
                            <div class="setting-actions">
                                <button class="btn-secondary" id="export-data-btn">Export Data</button>
                                <button class="btn-secondary" id="import-data-btn">Import Data</button>
                                <button class="btn-danger" id="reset-data-btn">Reset All Data</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-secondary modal-close">Cancel</button>
                    <button class="btn-primary" id="save-settings-btn">Save Settings</button>
                </div>
            </div>
        `;
    }

    bindModalEvents(type, container) {
        if (type === 'settings') {
            this.bindSettingsEvents(container);
        }
    }

    bindSettingsEvents(container) {
        const saveBtn = container.querySelector('#save-settings-btn');
        const exportBtn = container.querySelector('#export-data-btn');
        const importBtn = container.querySelector('#import-data-btn');
        const resetBtn = container.querySelector('#reset-data-btn');

        saveBtn?.addEventListener('click', () => this.saveSettings(container));
        exportBtn?.addEventListener('click', () => this.exportData());
        importBtn?.addEventListener('click', () => this.importData());
        resetBtn?.addEventListener('click', () => this.resetData());
    }

    loadSettings() {
        const defaults = {
            theme: 'auto',
            animations: true,
            achievementNotifications: true,
            studyReminders: true,
            showHints: true,
            autoSave: 60
        };

        if (window.storageManager) {
            return { ...defaults, ...window.storageManager.getItem('appSettings') };
        }
        return defaults;
    }

    saveSettings(container) {
        const settings = {
            theme: container.querySelector('#theme-setting').value,
            animations: container.querySelector('#animations-setting').checked,
            achievementNotifications: container.querySelector('#achievements-setting').checked,
            studyReminders: container.querySelector('#reminders-setting').checked,
            showHints: container.querySelector('#hints-setting').checked,
            autoSave: parseInt(container.querySelector('#autosave-setting').value)
        };

        if (window.storageManager) {
            window.storageManager.setItem('appSettings', settings);
        }

        // Apply theme change immediately
        if (window.themeSystem && settings.theme !== this.loadSettings().theme) {
            window.themeSystem.setTheme(settings.theme);
        }

        this.closeModal();
        this.showNotification('Settings saved successfully!');
    }

    exportData() {
        if (!window.storageManager) return;
        
        const data = window.storageManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `codequest-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('Data exported successfully!');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = e.target.result;
                    if (window.storageManager) {
                        window.storageManager.importData(data);
                        this.showNotification('Data imported successfully!');
                        setTimeout(() => location.reload(), 1000);
                    }
                } catch (error) {
                    this.showNotification('Error importing data!', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }

    resetData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            if (window.storageManager) {
                window.storageManager.clearAll();
                this.showNotification('All data has been reset!');
                setTimeout(() => location.reload(), 1000);
            }
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Quick access methods
    showInstructions(title, content, steps = []) {
        this.showModal('instructions', { title, content, steps });
    }

    showAchievement(title, description, icon = '🏆', xp = 0) {
        this.showModal('achievement', { title, description, icon, xp });
    }

    showSettings() {
        this.showModal('settings');
    }
}

// Initialize modal system
document.addEventListener('DOMContentLoaded', () => {
    window.modalSystem = new ModalSystem();
    
    // Add settings button to existing pages
    const settingsBtn = document.createElement('button');
    settingsBtn.className = 'settings-btn';
    settingsBtn.innerHTML = '⚙️';
    settingsBtn.title = 'Settings';
    settingsBtn.addEventListener('click', () => window.modalSystem.showSettings());
    document.body.appendChild(settingsBtn);
});