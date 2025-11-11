// Theme Controller - Dynamic CSS Variables Management
class ThemeController {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'default';
        this.customProperties = new Map();
        this.init();
    }

    // Initialize theme system
    init() {
        this.applyTheme(this.currentTheme);
        this.setupEventListeners();
    }

    // Apply theme
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('theme', theme);
        this.dispatchThemeChange();
    }

    // Set custom CSS variable
    setVariable(property, value) {
        document.documentElement.style.setProperty(`--${property}`, value);
        this.customProperties.set(property, value);
    }

    // Get CSS variable value
    getVariable(property) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(`--${property}`).trim();
    }

    // Set primary color dynamically
    setPrimaryColor(hue, saturation = 70, lightness = 50) {
        this.setVariable('primary-hue', hue);
        this.setVariable('primary-sat', `${saturation}%`);
        this.setVariable('primary-light', `${lightness}%`);
    }

    // Set spacing scale
    setSpacing(scale = 1) {
        const baseSpacing = {
            'space-xs': 0.25,
            'space-sm': 0.5,
            'space-md': 1,
            'space-lg': 1.5,
            'space-xl': 2,
            'space-2xl': 3
        };

        Object.entries(baseSpacing).forEach(([key, value]) => {
            this.setVariable(key, `${value * scale}rem`);
        });
    }

    // Set font scale
    setFontScale(scale = 1) {
        const baseFontSizes = {
            'font-size-xs': 0.75,
            'font-size-sm': 0.875,
            'font-size-base': 1,
            'font-size-lg': 1.125,
            'font-size-xl': 1.25,
            'font-size-2xl': 1.5,
            'font-size-3xl': 2
        };

        Object.entries(baseFontSizes).forEach(([key, value]) => {
            this.setVariable(key, `${value * scale}rem`);
        });
    }

    // Create custom theme
    createCustomTheme(config) {
        Object.entries(config).forEach(([property, value]) => {
            this.setVariable(property, value);
        });
    }

    // Reset to default theme
    resetTheme() {
        this.customProperties.forEach((value, property) => {
            document.documentElement.style.removeProperty(`--${property}`);
        });
        this.customProperties.clear();
        this.applyTheme('default');
    }

    // Toggle dark mode
    toggleDarkMode() {
        const newTheme = this.currentTheme === 'dark' ? 'default' : 'dark';
        this.applyTheme(newTheme);
    }

    // Get available themes
    getAvailableThemes() {
        return ['default', 'dark', 'blue', 'green', 'purple', 'orange', 'red', 'high-contrast'];
    }

    // Export current theme
    exportTheme() {
        const theme = {
            name: this.currentTheme,
            customProperties: Object.fromEntries(this.customProperties)
        };
        return JSON.stringify(theme, null, 2);
    }

    // Import theme
    importTheme(themeJson) {
        try {
            const theme = JSON.parse(themeJson);
            this.applyTheme(theme.name);
            
            if (theme.customProperties) {
                Object.entries(theme.customProperties).forEach(([property, value]) => {
                    this.setVariable(property, value);
                });
            }
            
            return true;
        } catch (error) {
            console.error('Invalid theme format:', error);
            return false;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for system theme changes
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (this.currentTheme === 'auto') {
                    this.applyTheme(e.matches ? 'dark' : 'default');
                }
            });
        }
    }

    // Dispatch theme change event
    dispatchThemeChange() {
        const event = new CustomEvent('themechange', {
            detail: { theme: this.currentTheme }
        });
        document.dispatchEvent(event);
    }

    // Animate theme transition
    animateThemeChange(duration = 300) {
        document.documentElement.style.transition = `all ${duration}ms ease`;
        
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, duration);
    }
}

// Global instance
window.themeController = new ThemeController();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeController;
}