// Advanced Theme System with Dark/Light Mode Toggle
class ThemeSystem {
    constructor() {
        this.currentTheme = 'light';
        this.themes = {
            light: {
                name: 'Light Mode',
                icon: '☀️',
                colors: {
                    primary: '#667eea',
                    secondary: '#764ba2',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    surface: 'rgba(255, 255, 255, 0.95)',
                    text: '#333333',
                    textSecondary: '#666666',
                    border: '#e2e8f0',
                    accent: '#4caf50',
                    warning: '#ff9800',
                    error: '#f44336'
                }
            },
            dark: {
                name: 'Dark Mode',
                icon: '🌙',
                colors: {
                    primary: '#7c3aed',
                    secondary: '#1e293b',
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    surface: 'rgba(30, 41, 59, 0.95)',
                    text: '#f1f5f9',
                    textSecondary: '#cbd5e1',
                    border: '#334155',
                    accent: '#10b981',
                    warning: '#f59e0b',
                    error: '#ef4444'
                }
            },
            auto: {
                name: 'Auto Mode',
                icon: '🌓',
                colors: null // Will use system preference
            }
        };
        
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.initializeTheme();
        this.createThemeToggle();
        this.bindEvents();
    }

    // Initialize theme system
    initializeTheme() {
        // Load saved theme preference
        const savedTheme = this.loadThemePreference();
        this.currentTheme = savedTheme || this.detectSystemTheme();
        
        // Apply initial theme
        this.applyTheme(this.currentTheme);
        
        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === 'auto') {
                this.applyTheme('auto');
            }
        });
    }

    // Detect system theme preference
    detectSystemTheme() {
        if (this.mediaQuery.matches) {
            return 'dark';
        }
        return 'light';
    }

    // Create theme toggle button
    createThemeToggle() {
        // Create toggle button
        const themeToggle = document.createElement('button');
        themeToggle.id = 'theme-toggle';
        themeToggle.className = 'theme-toggle';
        themeToggle.setAttribute('aria-label', 'Toggle theme');
        themeToggle.innerHTML = `
            <span class="theme-icon">${this.themes[this.currentTheme].icon}</span>
            <span class="theme-text">${this.themes[this.currentTheme].name}</span>
        `;

        // Create dropdown for theme options
        const themeDropdown = document.createElement('div');
        themeDropdown.className = 'theme-dropdown';
        themeDropdown.innerHTML = `
            <div class="theme-options">
                <button class="theme-option" data-theme="light">
                    <span class="option-icon">☀️</span>
                    <span class="option-text">Light Mode</span>
                </button>
                <button class="theme-option" data-theme="dark">
                    <span class="option-icon">🌙</span>
                    <span class="option-text">Dark Mode</span>
                </button>
                <button class="theme-option" data-theme="auto">
                    <span class="option-icon">🌓</span>
                    <span class="option-text">Auto Mode</span>
                </button>
            </div>
        `;

        // Create theme container
        const themeContainer = document.createElement('div');
        themeContainer.className = 'theme-container';
        themeContainer.appendChild(themeToggle);
        themeContainer.appendChild(themeDropdown);

        return themeContainer;
    }

    // Initialize theme toggle in the page
    initializeThemeToggle() {
        // Try to find existing theme toggle
        let existingToggle = document.getElementById('theme-toggle');
        if (existingToggle) {
            existingToggle.parentElement.remove();
        }

        // Create new theme toggle
        const themeContainer = this.createThemeToggle();
        
        // Add to page header or body
        const header = document.querySelector('header, .challenges-header, .container header');
        if (header) {
            header.appendChild(themeContainer);
        } else {
            document.body.appendChild(themeContainer);
        }

        this.updateToggleState();
    }

    // Bind event listeners
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeThemeToggle();
        });

        // Handle theme toggle clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('#theme-toggle')) {
                this.toggleDropdown();
            } else if (e.target.closest('.theme-option')) {
                const theme = e.target.closest('.theme-option').dataset.theme;
                this.setTheme(theme);
                this.hideDropdown();
            } else if (!e.target.closest('.theme-container')) {
                this.hideDropdown();
            }
        });

        // Handle keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideDropdown();
            }
        });
    }

    // Toggle dropdown visibility
    toggleDropdown() {
        const dropdown = document.querySelector('.theme-dropdown');
        if (dropdown) {
            dropdown.classList.toggle('show');
        }
    }

    // Hide dropdown
    hideDropdown() {
        const dropdown = document.querySelector('.theme-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    // Set theme
    setTheme(theme) {
        if (!this.themes[theme]) return;

        this.currentTheme = theme;
        this.applyTheme(theme);
        this.saveThemePreference(theme);
        this.updateToggleState();
        
        // Dispatch theme change event
        const event = new CustomEvent('themeChanged', {
            detail: { theme, colors: this.getCurrentColors() }
        });
        window.dispatchEvent(event);
    }

    // Apply theme to the page
    applyTheme(theme) {
        const colors = this.getThemeColors(theme);
        const root = document.documentElement;

        // Set CSS custom properties
        Object.entries(colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Update body class
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme === 'auto' ? this.detectSystemTheme() : theme}`);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(colors.primary);
    }

    // Get theme colors
    getThemeColors(theme) {
        if (theme === 'auto') {
            const systemTheme = this.detectSystemTheme();
            return this.themes[systemTheme].colors;
        }
        return this.themes[theme].colors;
    }

    // Get current theme colors
    getCurrentColors() {
        return this.getThemeColors(this.currentTheme);
    }

    // Update toggle button state
    updateToggleState() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeOptions = document.querySelectorAll('.theme-option');

        if (themeToggle) {
            const currentThemeData = this.themes[this.currentTheme];
            themeToggle.innerHTML = `
                <span class="theme-icon">${currentThemeData.icon}</span>
                <span class="theme-text">${currentThemeData.name}</span>
            `;
        }

        // Update active option
        themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === this.currentTheme);
        });
    }

    // Update meta theme color
    updateMetaThemeColor(color) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;
    }

    // Save theme preference
    saveThemePreference(theme) {
        try {
            localStorage.setItem('codequest_theme', theme);
            
            // Also save to StorageManager if available
            if (typeof StorageManager !== 'undefined') {
                const settings = StorageManager.get('settings') || {};
                settings.theme = theme;
                settings.themeChangedAt = Date.now();
                StorageManager.set('settings', settings);
            }
        } catch (e) {
            console.warn('Could not save theme preference:', e);
        }
    }

    // Load theme preference
    loadThemePreference() {
        try {
            // Try StorageManager first
            if (typeof StorageManager !== 'undefined') {
                const settings = StorageManager.get('settings');
                if (settings && settings.theme) {
                    return settings.theme;
                }
            }
            
            // Fallback to localStorage
            return localStorage.getItem('codequest_theme');
        } catch (e) {
            console.warn('Could not load theme preference:', e);
            return null;
        }
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Check if dark mode is active
    isDarkMode() {
        if (this.currentTheme === 'auto') {
            return this.detectSystemTheme() === 'dark';
        }
        return this.currentTheme === 'dark';
    }

    // Toggle between light and dark (for simple toggle)
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    // Add custom theme
    addCustomTheme(name, colors) {
        this.themes[name] = {
            name: name.charAt(0).toUpperCase() + name.slice(1),
            icon: '🎨',
            colors: colors
        };
    }

    // Export theme settings
    exportThemeSettings() {
        const settings = {
            currentTheme: this.currentTheme,
            themes: this.themes,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `codequest-theme-settings-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import theme settings
    importThemeSettings(settingsData) {
        try {
            if (settingsData.themes) {
                Object.assign(this.themes, settingsData.themes);
            }
            if (settingsData.currentTheme) {
                this.setTheme(settingsData.currentTheme);
            }
            return true;
        } catch (e) {
            console.error('Failed to import theme settings:', e);
            return false;
        }
    }

    // Create theme preview
    createThemePreview(theme) {
        const colors = this.getThemeColors(theme);
        const preview = document.createElement('div');
        preview.className = 'theme-preview';
        preview.innerHTML = `
            <div class="preview-header" style="background: ${colors.primary};">
                <div class="preview-text" style="color: white;">Header</div>
            </div>
            <div class="preview-body" style="background: ${colors.surface}; color: ${colors.text};">
                <div class="preview-text">Content</div>
                <div class="preview-button" style="background: ${colors.accent}; color: white;">Button</div>
            </div>
        `;
        return preview;
    }

    // Show theme settings modal
    showThemeSettings() {
        const modal = document.createElement('div');
        modal.className = 'theme-settings-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🎨 Theme Settings</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="theme-previews">
                        ${Object.entries(this.themes).map(([key, theme]) => `
                            <div class="theme-preview-card ${key === this.currentTheme ? 'active' : ''}" data-theme="${key}">
                                <div class="preview-header">
                                    <span class="preview-icon">${theme.icon}</span>
                                    <span class="preview-name">${theme.name}</span>
                                </div>
                                ${theme.colors ? this.createThemePreview(key).outerHTML : '<div class="auto-preview">Follows system preference</div>'}
                            </div>
                        `).join('')}
                    </div>
                    <div class="theme-actions">
                        <button class="export-themes-btn">📤 Export Settings</button>
                        <input type="file" id="import-themes" accept=".json" style="display: none;">
                        <button class="import-themes-btn">📥 Import Settings</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Bind modal events
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('.modal-overlay').addEventListener('click', () => modal.remove());
        
        modal.querySelectorAll('.theme-preview-card').forEach(card => {
            card.addEventListener('click', () => {
                const theme = card.dataset.theme;
                this.setTheme(theme);
                modal.querySelectorAll('.theme-preview-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });
        });

        modal.querySelector('.export-themes-btn').addEventListener('click', () => {
            this.exportThemeSettings();
        });

        modal.querySelector('.import-themes-btn').addEventListener('click', () => {
            modal.querySelector('#import-themes').click();
        });

        modal.querySelector('#import-themes').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const settings = JSON.parse(e.target.result);
                        if (this.importThemeSettings(settings)) {
                            alert('Theme settings imported successfully!');
                            modal.remove();
                        } else {
                            alert('Failed to import theme settings.');
                        }
                    } catch (error) {
                        alert('Invalid theme settings file.');
                    }
                };
                reader.readAsText(file);
            }
        });
    }
}

// Global theme system instance
window.themeSystem = new ThemeSystem();

// Helper functions for easy access
window.toggleTheme = () => window.themeSystem.toggleTheme();
window.setTheme = (theme) => window.themeSystem.setTheme(theme);
window.getCurrentTheme = () => window.themeSystem.getCurrentTheme();
window.isDarkMode = () => window.themeSystem.isDarkMode();