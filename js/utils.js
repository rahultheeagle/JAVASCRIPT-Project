// Utility Functions JavaScript
class Utils {
    // Date and time utilities
    static formatDate(date, format = 'short') {
        const d = new Date(date);
        const options = {
            short: { month: 'short', day: 'numeric', year: 'numeric' },
            long: { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
            time: { hour: '2-digit', minute: '2-digit' },
            datetime: { 
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            }
        };
        
        return d.toLocaleDateString('en-US', options[format] || options.short);
    }

    static timeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    // String utilities
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static slugify(str) {
        return str
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    static truncate(str, length = 100, suffix = '...') {
        return str.length > length ? str.substring(0, length) + suffix : str;
    }

    // Array utilities
    static shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    static unique(array) {
        return [...new Set(array)];
    }

    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    // Number utilities
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    // DOM utilities
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Animation utilities
    static animate(element, properties, duration = 300) {
        return new Promise(resolve => {
            const start = performance.now();
            const startValues = {};
            
            Object.keys(properties).forEach(prop => {
                startValues[prop] = parseFloat(getComputedStyle(element)[prop]) || 0;
            });

            function step(timestamp) {
                const progress = Math.min((timestamp - start) / duration, 1);
                const easeProgress = 1 - Math.pow(1 - progress, 3); // ease-out cubic

                Object.entries(properties).forEach(([prop, endValue]) => {
                    const startValue = startValues[prop];
                    const currentValue = startValue + (endValue - startValue) * easeProgress;
                    element.style[prop] = currentValue + (prop.includes('opacity') ? '' : 'px');
                });

                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    resolve();
                }
            }

            requestAnimationFrame(step);
        });
    }

    // Color utilities
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    static rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // Local storage helpers
    static saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Storage error:', error);
            return false;
        }
    }

    static loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Storage error:', error);
            return defaultValue;
        }
    }

    // Event utilities
    static once(element, event, callback) {
        const handler = (e) => {
            callback(e);
            element.removeEventListener(event, handler);
        };
        element.addEventListener(event, handler);
    }

    static delegate(parent, selector, event, callback) {
        parent.addEventListener(event, (e) => {
            if (e.target.matches(selector)) {
                callback(e);
            }
        });
    }

    // Validation utilities
    static isEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    static isUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Performance utilities
    static measureTime(fn, label = 'Operation') {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${label} took ${end - start} milliseconds`);
        return result;
    }
}

// Export for global use
window.Utils = Utils;