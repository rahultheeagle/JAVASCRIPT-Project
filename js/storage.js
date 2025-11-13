// Enhanced Storage JavaScript
class EnhancedStorage {
    constructor() {
        this.keys = {
            profile: 'codequest_profile',
            progress: 'codequest_progress',
            settings: 'codequest_settings',
            savedCode: 'codequest_saved_code',
            gamification: 'codequest_gamification',
            achievements: 'codequest_achievements',
            challenges: 'codequest_challenges',
            tutorials: 'codequest_tutorials'
        };
    }

    // Get data with optional default value
    get(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(this.keys[key] || key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Error getting ${key}:`, error);
            return defaultValue;
        }
    }

    // Set data with validation
    set(key, data) {
        try {
            if (data === undefined) {
                console.warn(`Attempting to store undefined value for key: ${key}`);
                return false;
            }
            
            localStorage.setItem(this.keys[key] || key, JSON.stringify(data));
            this.dispatchStorageEvent(key, data);
            return true;
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
            return false;
        }
    }

    // Remove data
    remove(key) {
        try {
            localStorage.removeItem(this.keys[key] || key);
            this.dispatchStorageEvent(key, null);
            return true;
        } catch (error) {
            console.error(`Error removing ${key}:`, error);
            return false;
        }
    }

    // Get all stored data
    getAll() {
        const data = {};
        Object.keys(this.keys).forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    // Clear all data
    clearAll() {
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.dispatchStorageEvent('all', null);
    }

    // Export data as JSON
    export(keys = null) {
        const data = keys ? 
            keys.reduce((acc, key) => ({ ...acc, [key]: this.get(key) }), {}) :
            this.getAll();
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `codequest-${keys ? keys.join('-') : 'all'}-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Import data from JSON
    import(data) {
        try {
            let imported = 0;
            Object.keys(data).forEach(key => {
                if (data[key] !== null && this.set(key, data[key])) {
                    imported++;
                }
            });
            return { success: true, imported };
        } catch (error) {
            console.error('Import error:', error);
            return { success: false, error: error.message };
        }
    }

    // Watch for changes to specific keys
    watch(key, callback) {
        document.addEventListener('storageChange', (e) => {
            if (e.detail.key === key) {
                callback(e.detail.newValue, e.detail.oldValue);
            }
        });
    }

    // Dispatch custom storage events
    dispatchStorageEvent(key, newValue) {
        const event = new CustomEvent('storageChange', {
            detail: { key, newValue, timestamp: Date.now() }
        });
        document.dispatchEvent(event);
    }

    // Get storage usage info
    getStorageInfo() {
        let totalSize = 0;
        const itemSizes = {};
        
        Object.entries(this.keys).forEach(([key, storageKey]) => {
            const data = localStorage.getItem(storageKey);
            if (data) {
                const size = new Blob([data]).size;
                itemSizes[key] = size;
                totalSize += size;
            }
        });

        return {
            totalSize,
            itemSizes,
            available: this.getAvailableSpace(),
            percentage: (totalSize / (5 * 1024 * 1024)) * 100 // Assuming 5MB limit
        };
    }

    // Estimate available localStorage space
    getAvailableSpace() {
        try {
            const testKey = 'test_storage_space';
            let testData = '';
            let size = 0;
            
            // Try to fill storage with test data
            while (size < 10 * 1024 * 1024) { // 10MB max test
                try {
                    testData += '0123456789';
                    localStorage.setItem(testKey, testData);
                    size = testData.length;
                } catch (e) {
                    localStorage.removeItem(testKey);
                    return size;
                }
            }
            
            localStorage.removeItem(testKey);
            return size;
        } catch (error) {
            return 0;
        }
    }

    // Backup data to file
    backup() {
        const backup = {
            timestamp: Date.now(),
            version: '1.0',
            data: this.getAll()
        };
        
        this.export();
        return backup;
    }

    // Restore from backup
    restore(backupData) {
        try {
            if (backupData.data) {
                return this.import(backupData.data);
            }
            return { success: false, error: 'Invalid backup format' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Create global instance
window.StorageManager = new EnhancedStorage();