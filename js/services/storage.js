// Storage service for data persistence
export class StorageService {
    constructor() {
        this.prefix = 'codequest_';
    }

    // Local storage methods
    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage get error:', error);
            return defaultValue;
        }
    }

    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    clear() {
        Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .forEach(key => localStorage.removeItem(key));
    }

    // Session storage methods
    setSession(key, value) {
        try {
            sessionStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Session storage error:', error);
            return false;
        }
    }

    getSession(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    }

    // Cache with expiration
    setCache(key, value, ttl = 3600000) { // 1 hour default
        const item = {
            value,
            expiry: Date.now() + ttl
        };
        this.set(`cache_${key}`, item);
    }

    getCache(key) {
        const item = this.get(`cache_${key}`);
        if (!item) return null;
        
        if (Date.now() > item.expiry) {
            this.remove(`cache_${key}`);
            return null;
        }
        
        return item.value;
    }
}

export default new StorageService();