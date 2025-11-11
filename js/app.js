// Main application entry point
class App {
    constructor() {
        this.modules = new Map();
        this.config = {
            debug: true,
            version: '1.0.0',
            features: ['auth', 'challenges', 'progress', 'notifications']
        };
        this.init();
    }

    async init() {
        try {
            await this.loadCore();
            await this.loadFeatures();
            this.setupEventListeners();
            this.render();
        } catch (error) {
            console.error('App initialization failed:', error);
        }
    }

    async loadCore() {
        // Load core utilities
        await this.loadModule('utils', './js/utils/helpers.js');
        await this.loadModule('storage', './js/services/storage.js');
        await this.loadModule('api', './js/services/api.js');
    }

    async loadFeatures() {
        // Load feature modules
        const features = this.config.features;
        for (const feature of features) {
            await this.loadModule(feature, `./js/features/${feature}.js`);
        }
    }

    async loadModule(name, path) {
        try {
            const module = await import(path);
            this.modules.set(name, module.default || module);
        } catch (error) {
            console.warn(`Failed to load module ${name}:`, error);
        }
    }

    getModule(name) {
        return this.modules.get(name);
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.modules.forEach((module, name) => {
                if (module.init) module.init();
            });
        });
    }

    render() {
        const container = document.getElementById('app');
        if (container) {
            container.innerHTML = '<div class="app-loaded">App initialized successfully</div>';
        }
    }
}

// Initialize app
const app = new App();
window.app = app;