// Notifications feature module
import helpers from '../utils/helpers.js';

export class NotificationsFeature {
    constructor() {
        this.notifications = [];
        this.container = null;
    }

    init() {
        this.createContainer();
        this.setupEventListeners();
    }

    createContainer() {
        this.container = helpers.createElement('div', { 
            className: 'notifications-container',
            id: 'notifications-container'
        });
        document.body.appendChild(this.container);
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-notify]')) {
                const type = e.target.dataset.notify;
                const message = e.target.dataset.message || 'Test notification';
                this.show(message, type);
            }
        });
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.create(message, type);
        this.container.appendChild(notification);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => this.remove(notification), duration);
        }
        
        return notification;
    }

    create(message, type) {
        const notification = helpers.createElement('div', {
            className: `notification notification-${type}`
        });
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.closest('.notification').remove()">×</button>
            </div>
        `;
        
        // Add entrance animation
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        return notification;
    }

    remove(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    getIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    success(message, duration) {
        return this.show(message, 'success', duration);
    }

    error(message, duration) {
        return this.show(message, 'error', duration);
    }

    warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    info(message, duration) {
        return this.show(message, 'info', duration);
    }

    clear() {
        this.container.innerHTML = '';
    }
}

export default new NotificationsFeature();