class EventHandler {
    constructor() {
        this.listeners = new Map();
        this.init();
    }

    init() {
        this.setupClickHandlers();
        this.setupInputHandlers();
        this.setupSubmitHandlers();
        this.setupStorageHandlers();
    }

    // Click event handling
    setupClickHandlers() {
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-click]');
            if (target) {
                const action = target.dataset.click;
                this.handleClick(action, target, e);
            }
        });
    }

    handleClick(action, element, event) {
        const handlers = {
            'toggle': () => element.classList.toggle('active'),
            'modal': () => this.openModal(element.dataset.modal),
            'close': () => this.closeModal(element),
            'delete': () => this.confirmDelete(element),
            'save': () => this.saveData(element),
            'theme': () => this.toggleTheme()
        };

        if (handlers[action]) {
            handlers[action]();
            this.emit('click', { action, element, event });
        }
    }

    // Input event handling
    setupInputHandlers() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('[data-input]')) {
                const action = e.target.dataset.input;
                this.handleInput(action, e.target, e);
            }
        });
    }

    handleInput(action, element, event) {
        const handlers = {
            'validate': () => this.validateField(element),
            'search': () => this.debounce(() => this.search(element.value), 300),
            'autosave': () => this.debounce(() => this.autoSave(element), 1000),
            'filter': () => this.filterContent(element.value),
            'counter': () => this.updateCounter(element)
        };

        if (handlers[action]) {
            handlers[action]();
            this.emit('input', { action, element, event });
        }
    }

    // Submit event handling
    setupSubmitHandlers() {
        document.addEventListener('submit', (e) => {
            if (e.target.matches('[data-submit]')) {
                e.preventDefault();
                const action = e.target.dataset.submit;
                this.handleSubmit(action, e.target, e);
            }
        });
    }

    handleSubmit(action, form, event) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);

        const handlers = {
            'save': () => this.saveForm(data, form),
            'login': () => this.loginUser(data),
            'register': () => this.registerUser(data),
            'contact': () => this.sendMessage(data),
            'settings': () => this.updateSettings(data)
        };

        if (handlers[action]) {
            handlers[action]();
            this.emit('submit', { action, form, data, event });
        }
    }

    // Storage event handling
    setupStorageHandlers() {
        window.addEventListener('storage', (e) => {
            this.handleStorage(e);
        });
    }

    handleStorage(event) {
        const { key, newValue, oldValue } = event;
        
        const handlers = {
            'theme': () => this.syncTheme(newValue),
            'user': () => this.syncUser(newValue),
            'settings': () => this.syncSettings(newValue),
            'progress': () => this.syncProgress(newValue)
        };

        if (handlers[key]) {
            handlers[key]();
            this.emit('storage', { key, newValue, oldValue, event });
        }
    }

    // Helper methods
    openModal(modalId) {
        document.getElementById(modalId)?.classList.add('active');
    }

    closeModal(element) {
        element.closest('.modal')?.classList.remove('active');
    }

    confirmDelete(element) {
        if (confirm('Delete this item?')) {
            element.closest('[data-item]')?.remove();
        }
    }

    saveData(element) {
        const data = element.dataset.save;
        localStorage.setItem('saved-data', data);
        this.showToast('Data saved!');
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    }

    validateField(element) {
        const isValid = element.checkValidity();
        element.classList.toggle('invalid', !isValid);
        return isValid;
    }

    search(query) {
        const items = document.querySelectorAll('[data-searchable]');
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
        });
    }

    autoSave(element) {
        localStorage.setItem(`autosave-${element.name}`, element.value);
    }

    filterContent(value) {
        const items = document.querySelectorAll('[data-filter]');
        items.forEach(item => {
            const category = item.dataset.filter;
            item.style.display = !value || category === value ? '' : 'none';
        });
    }

    updateCounter(element) {
        const counter = document.querySelector(`[data-counter="${element.name}"]`);
        if (counter) {
            const remaining = (element.maxLength || 100) - element.value.length;
            counter.textContent = remaining;
        }
    }

    saveForm(data, form) {
        localStorage.setItem('form-data', JSON.stringify(data));
        this.showToast('Form saved!');
        form.reset();
    }

    loginUser(data) {
        // Simulate login
        localStorage.setItem('user', JSON.stringify(data));
        this.showToast('Login successful!');
    }

    registerUser(data) {
        // Simulate registration
        localStorage.setItem('user', JSON.stringify(data));
        this.showToast('Registration successful!');
    }

    sendMessage(data) {
        // Simulate message sending
        this.showToast('Message sent!');
    }

    updateSettings(data) {
        localStorage.setItem('settings', JSON.stringify(data));
        this.showToast('Settings updated!');
    }

    syncTheme(theme) {
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
    }

    syncUser(userData) {
        if (userData) {
            const user = JSON.parse(userData);
            document.querySelector('[data-user-name]').textContent = user.name || 'User';
        }
    }

    syncSettings(settingsData) {
        if (settingsData) {
            const settings = JSON.parse(settingsData);
            Object.entries(settings).forEach(([key, value]) => {
                const input = document.querySelector(`[name="${key}"]`);
                if (input) input.value = value;
            });
        }
    }

    syncProgress(progressData) {
        if (progressData) {
            const progress = JSON.parse(progressData);
            const bar = document.querySelector('.progress-bar');
            if (bar) bar.style.width = `${progress.percentage}%`;
        }
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    debounce(func, wait) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(func, wait);
    }

    // Event emitter
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}

// Initialize event handler
const eventHandler = new EventHandler();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EventHandler;
}