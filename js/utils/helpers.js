// Utility helper functions
export const helpers = {
    // DOM utilities
    $(selector) {
        return document.querySelector(selector);
    },

    $$(selector) {
        return document.querySelectorAll(selector);
    },

    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') element.className = value;
            else if (key === 'innerHTML') element.innerHTML = value;
            else element.setAttribute(key, value);
        });
        if (content) element.textContent = content;
        return element;
    },

    // String utilities
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    slugify(str) {
        return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    },

    // Array utilities
    unique(arr) {
        return [...new Set(arr)];
    },

    groupBy(arr, key) {
        return arr.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    },

    // Date utilities
    formatDate(date) {
        return new Date(date).toLocaleDateString();
    },

    timeAgo(date) {
        const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(seconds / secondsInUnit);
            if (interval >= 1) {
                return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
            }
        }
        return 'just now';
    },

    // Performance utilities
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Validation utilities
    isEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    isUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
};

export default helpers;