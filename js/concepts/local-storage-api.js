// Local Storage API implementation
export class LocalStorageAPI {
    constructor(prefix = 'app_') {
        this.prefix = prefix;
    }

    set(key, value) {
        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('LocalStorage set error:', error);
            return false;
        }
    }

    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
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

    exists(key) {
        return localStorage.getItem(this.prefix + key) !== null;
    }

    keys() {
        return Object.keys(localStorage)
            .filter(key => key.startsWith(this.prefix))
            .map(key => key.replace(this.prefix, ''));
    }

    setWithExpiry(key, value, ttl) {
        const item = { value, expiry: Date.now() + ttl };
        this.set(key, item);
    }

    getWithExpiry(key) {
        const item = this.get(key);
        if (!item || !item.expiry) return item;
        
        if (Date.now() > item.expiry) {
            this.remove(key);
            return null;
        }
        return item.value;
    }
}

export default new LocalStorageAPI();