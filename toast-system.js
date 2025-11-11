class ToastSystem {
    constructor() {
        this.toasts = [];
        this.maxToasts = 5;
        this.init();
    }

    init() {
        this.createContainer();
    }

    createContainer() {
        if (document.getElementById('toast-container')) return;
        
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    show(message, type = 'info', duration = 4000, options = {}) {
        const toast = this.createToast(message, type, options);
        const container = document.getElementById('toast-container');
        
        // Remove oldest toast if at max capacity
        if (this.toasts.length >= this.maxToasts) {
            this.remove(this.toasts[0]);
        }
        
        container.appendChild(toast);
        this.toasts.push(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }
        
        return toast;
    }

    createToast(message, type, options) {
        const { icon, title, action } = options;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        toast.innerHTML = `
            <div class="toast-content">
                ${icon ? `<div class="toast-icon">${icon}</div>` : ''}
                <div class="toast-text">
                    ${title ? `<div class="toast-title">${title}</div>` : ''}
                    <div class="toast-message">${message}</div>
                </div>
                ${action ? `<button class="toast-action" onclick="${action.callback}">${action.text}</button>` : ''}
                <button class="toast-close" onclick="window.toastSystem.remove(this.parentElement)">&times;</button>
            </div>
        `;
        
        return toast;
    }

    remove(toast) {
        if (!toast || !toast.parentElement) return;
        
        toast.classList.add('removing');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    // Quick methods
    success(message, options = {}) {
        return this.show(message, 'success', 4000, {
            icon: '✅',
            ...options
        });
    }

    error(message, options = {}) {
        return this.show(message, 'error', 6000, {
            icon: '❌',
            ...options
        });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', 5000, {
            icon: '⚠️',
            ...options
        });
    }

    info(message, options = {}) {
        return this.show(message, 'info', 4000, {
            icon: 'ℹ️',
            ...options
        });
    }

    achievement(title, message, xp = 0, icon = '🏆') {
        return this.show(message, 'achievement', 6000, {
            icon: icon,
            title: title,
            action: xp > 0 ? {
                text: `+${xp} XP`,
                callback: 'void(0)'
            } : null
        });
    }

    // Batch operations
    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }

    // Settings integration
    shouldShow(type) {
        if (!window.storageManager) return true;
        
        const settings = window.storageManager.getItem('appSettings') || {};
        
        if (type === 'achievement' && settings.achievementNotifications === false) {
            return false;
        }
        
        return true;
    }
}

// Initialize toast system
document.addEventListener('DOMContentLoaded', () => {
    window.toastSystem = new ToastSystem();
    
    // Override modal system notification method to use toasts
    if (window.modalSystem) {
        window.modalSystem.showNotification = (message, type = 'success') => {
            if (type === 'success') {
                window.toastSystem.success(message);
            } else {
                window.toastSystem.error(message);
            }
        };
    }
});