// Advanced Storage Manager - Centralized localStorage management with enhanced features
class StorageManager {
    static keys = {
        profile: 'codequest_profile',
        progress: 'codequest_progress',
        settings: 'codequest_settings',
        savedCode: 'codequest_saved_code',
        gamification: 'codequest_gamification',
        achievements: 'codequest_achievements',
        challenges: 'codequest_challenges',
        tutorials: 'codequest_tutorials',
        sessions: 'codequest_sessions',
        backups: 'codequest_backups'
    };

    static version = '2.0.0';
    static maxBackups = 5;
    static compressionEnabled = true;

    // Get data from localStorage with validation
    static get(key) {
        try {
            const data = localStorage.getItem(this.keys[key] || key);
            if (!data) return null;
            
            const parsed = JSON.parse(data);
            // Validate data structure
            if (parsed && typeof parsed === 'object' && parsed._timestamp) {
                return parsed.data;
            }
            return parsed;
        } catch (e) {
            console.error(`Error getting ${key}:`, e);
            return null;
        }
    }

    // Set data to localStorage with metadata
    static set(key, data) {
        try {
            const wrappedData = {
                data: data,
                _timestamp: Date.now(),
                _version: this.version
            };
            
            // Create backup before overwriting
            this.createBackup(key);
            
            localStorage.setItem(this.keys[key] || key, JSON.stringify(wrappedData));
            this.updateSession(key, 'write');
            return true;
        } catch (e) {
            console.error(`Error setting ${key}:`, e);
            this.handleStorageError(e);
            return false;
        }
    }

    // Remove data from localStorage
    static remove(key) {
        localStorage.removeItem(this.keys[key] || key);
    }

    // Get all data
    static getAll() {
        const data = {};
        Object.keys(this.keys).forEach(key => {
            data[key] = this.get(key);
        });
        return data;
    }

    // Clear all data
    static clearAll() {
        Object.values(this.keys).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // Export data as JSON
    static export(keys = null) {
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

    // Import data from JSON with validation
    static import(data) {
        try {
            // Validate import data
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format');
            }
            
            // Create full backup before import
            this.createFullBackup();
            
            Object.keys(data).forEach(key => {
                if (data[key] !== null && this.keys[key]) {
                    this.set(key, data[key]);
                }
            });
            
            this.updateSession('import', 'import');
            return true;
        } catch (e) {
            console.error('Import error:', e);
            return false;
        }
    }

    // Advanced Features
    
    // Create backup of specific key
    static createBackup(key) {
        try {
            const currentData = this.get(key);
            if (!currentData) return;
            
            const backups = this.get('backups') || {};
            const keyBackups = backups[key] || [];
            
            keyBackups.unshift({
                data: currentData,
                timestamp: Date.now(),
                version: this.version
            });
            
            // Keep only max backups
            if (keyBackups.length > this.maxBackups) {
                keyBackups.splice(this.maxBackups);
            }
            
            backups[key] = keyBackups;
            localStorage.setItem(this.keys.backups, JSON.stringify({
                data: backups,
                _timestamp: Date.now(),
                _version: this.version
            }));
        } catch (e) {
            console.error('Backup creation failed:', e);
        }
    }
    
    // Create full backup
    static createFullBackup() {
        const allData = this.getAll();
        const backup = {
            timestamp: Date.now(),
            version: this.version,
            data: allData
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `codequest-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Restore from backup
    static restoreBackup(key, backupIndex = 0) {
        try {
            const backups = this.get('backups') || {};
            const keyBackups = backups[key];
            
            if (!keyBackups || !keyBackups[backupIndex]) {
                throw new Error('Backup not found');
            }
            
            const backup = keyBackups[backupIndex];
            this.set(key, backup.data);
            return true;
        } catch (e) {
            console.error('Restore failed:', e);
            return false;
        }
    }
    
    // Update session tracking
    static updateSession(key, action) {
        try {
            const sessions = this.get('sessions') || [];
            sessions.unshift({
                key,
                action,
                timestamp: Date.now(),
                userAgent: navigator.userAgent.substring(0, 50)
            });
            
            // Keep only last 100 sessions
            if (sessions.length > 100) {
                sessions.splice(100);
            }
            
            localStorage.setItem(this.keys.sessions, JSON.stringify({
                data: sessions,
                _timestamp: Date.now(),
                _version: this.version
            }));
        } catch (e) {
            console.error('Session update failed:', e);
        }
    }
    
    // Handle storage errors
    static handleStorageError(error) {
        if (error.name === 'QuotaExceededError') {
            console.warn('Storage quota exceeded, attempting cleanup...');
            this.cleanup();
        }
    }
    
    // Cleanup old data
    static cleanup() {
        try {
            // Remove old sessions
            const sessions = this.get('sessions') || [];
            const recentSessions = sessions.slice(0, 50);
            this.set('sessions', recentSessions);
            
            // Remove old backups
            const backups = this.get('backups') || {};
            Object.keys(backups).forEach(key => {
                backups[key] = backups[key].slice(0, 3);
            });
            this.set('backups', backups);
            
            console.log('Storage cleanup completed');
        } catch (e) {
            console.error('Cleanup failed:', e);
        }
    }
    
    // Get storage usage info
    static getStorageInfo() {
        let totalSize = 0;
        const breakdown = {};
        
        Object.entries(this.keys).forEach(([key, storageKey]) => {
            const data = localStorage.getItem(storageKey);
            const size = data ? new Blob([data]).size : 0;
            breakdown[key] = {
                size: size,
                sizeFormatted: this.formatBytes(size),
                lastModified: this.get(key) ? Date.now() : null
            };
            totalSize += size;
        });
        
        return {
            total: totalSize,
            totalFormatted: this.formatBytes(totalSize),
            breakdown: breakdown,
            quota: this.getStorageQuota()
        };
    }
    
    // Format bytes to human readable
    static formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Get storage quota (estimate)
    static async getStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                return {
                    quota: estimate.quota,
                    usage: estimate.usage,
                    quotaFormatted: this.formatBytes(estimate.quota || 0),
                    usageFormatted: this.formatBytes(estimate.usage || 0)
                };
            } catch (e) {
                console.error('Storage estimate failed:', e);
            }
        }
        return { quota: 'Unknown', usage: 'Unknown' };
    }
    
    // Sync data across tabs
    static syncAcrossTabs() {
        window.addEventListener('storage', (e) => {
            if (Object.values(this.keys).includes(e.key)) {
                const event = new CustomEvent('storageSync', {
                    detail: {
                        key: e.key,
                        oldValue: e.oldValue,
                        newValue: e.newValue
                    }
                });
                window.dispatchEvent(event);
            }
        });
    }
}

// Display functions
function displayData() {
    const progressData = StorageManager.get('profile') || {};
    const settingsData = StorageManager.get('settings') || {};
    const codeData = StorageManager.get('savedCode') || {};
    const gameData = StorageManager.get('gamification') || {};

    document.getElementById('progressData').textContent = JSON.stringify(progressData, null, 2);
    document.getElementById('settingsData').textContent = JSON.stringify(settingsData, null, 2);
    document.getElementById('codeData').textContent = JSON.stringify(codeData, null, 2);
    document.getElementById('gameData').textContent = JSON.stringify(gameData, null, 2);
}

// Export functions
function exportProgress() { StorageManager.export(['profile', 'progress', 'achievements']); }
function exportSettings() { StorageManager.export(['settings']); }
function exportCode() { StorageManager.export(['savedCode']); }
function exportGame() { StorageManager.export(['gamification', 'challenges']); }
function exportAll() { StorageManager.export(); }

// Clear functions
function clearProgress() {
    if (confirm('Clear all progress data? This cannot be undone.')) {
        ['profile', 'progress', 'achievements'].forEach(key => StorageManager.remove(key));
        displayData();
    }
}

function clearSettings() {
    if (confirm('Clear all settings? This cannot be undone.')) {
        StorageManager.remove('settings');
        displayData();
    }
}

function clearCode() {
    if (confirm('Clear all saved code? This cannot be undone.')) {
        StorageManager.remove('savedCode');
        displayData();
    }
}

function clearGame() {
    if (confirm('Clear all gamification data? This cannot be undone.')) {
        ['gamification', 'challenges'].forEach(key => StorageManager.remove(key));
        displayData();
    }
}

function clearAll() {
    if (confirm('Clear ALL data? This cannot be undone.')) {
        StorageManager.clearAll();
        displayData();
    }
}

// Import functions
function importData() {
    document.getElementById('importFile').click();
}

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (StorageManager.import(data)) {
                alert('Data imported successfully!');
                displayData();
            } else {
                alert('Import failed. Please check the file format.');
            }
        } catch (error) {
            alert('Invalid JSON file.');
        }
    };
    reader.readAsText(file);
}

// New UI Functions

// Tab management
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
    
    // Load tab-specific data
    if (tabName === 'backups') showBackupHistory();
    if (tabName === 'sessions') showSessionHistory();
    if (tabName === 'advanced') updateStorageStats();
}

// Create backup for specific key
function createBackup(key) {
    StorageManager.createBackup(key);
    alert(`Backup created for ${key}`);
    if (document.getElementById('backupsTab').classList.contains('active')) {
        showBackupHistory();
    }
}

// Show backup history
function showBackupHistory() {
    const backups = StorageManager.get('backups') || {};
    const backupList = document.getElementById('backupList');
    
    if (Object.keys(backups).length === 0) {
        backupList.innerHTML = '<p>No backups available</p>';
        return;
    }
    
    let html = '';
    Object.entries(backups).forEach(([key, keyBackups]) => {
        html += `<div class="backup-group">
            <h3>${key.charAt(0).toUpperCase() + key.slice(1)} Backups</h3>`;
        
        keyBackups.forEach((backup, index) => {
            const date = new Date(backup.timestamp).toLocaleString();
            html += `<div class="backup-item">
                <span class="backup-date">${date}</span>
                <span class="backup-version">v${backup.version}</span>
                <button onclick="restoreBackup('${key}', ${index})">Restore</button>
            </div>`;
        });
        
        html += '</div>';
    });
    
    backupList.innerHTML = html;
}

// Restore backup
function restoreBackup(key, index) {
    if (confirm(`Restore ${key} from backup? Current data will be overwritten.`)) {
        if (StorageManager.restoreBackup(key, index)) {
            alert('Backup restored successfully!');
            displayData();
        } else {
            alert('Restore failed!');
        }
    }
}

// Show session history
function showSessionHistory() {
    const sessions = StorageManager.get('sessions') || [];
    const sessionsList = document.getElementById('sessionsList');
    
    if (sessions.length === 0) {
        sessionsList.innerHTML = '<p>No session history available</p>';
        return;
    }
    
    let html = '<div class="sessions-grid">';
    sessions.slice(0, 20).forEach(session => {
        const date = new Date(session.timestamp).toLocaleString();
        html += `<div class="session-item">
            <div class="session-info">
                <strong>${session.key}</strong> - ${session.action}
                <br><small>${date}</small>
            </div>
        </div>`;
    });
    html += '</div>';
    
    sessionsList.innerHTML = html;
}

// Update storage statistics
async function updateStorageStats() {
    const info = StorageManager.getStorageInfo();
    const quota = await StorageManager.getStorageQuota();
    
    // Update usage bar
    if (quota.quota && quota.usage) {
        const percentage = (quota.usage / quota.quota) * 100;
        document.getElementById('usageFill').style.width = percentage + '%';
        document.getElementById('usageText').textContent = 
            `${quota.usageFormatted} / ${quota.quotaFormatted} (${percentage.toFixed(1)}%)`;
    } else {
        document.getElementById('usageText').textContent = info.totalFormatted;
    }
    
    // Update total items
    const totalItems = Object.keys(info.breakdown).reduce((sum, key) => {
        return sum + (info.breakdown[key].size > 0 ? 1 : 0);
    }, 0);
    document.getElementById('totalItems').textContent = totalItems;
    
    // Update last backup
    const backups = StorageManager.get('backups') || {};
    const lastBackupTime = Object.values(backups).flat()
        .reduce((latest, backup) => Math.max(latest, backup.timestamp || 0), 0);
    
    if (lastBackupTime > 0) {
        document.getElementById('lastBackup').textContent = 
            new Date(lastBackupTime).toLocaleString();
    }
}

// Show storage analysis
function showStorageAnalysis() {
    const info = StorageManager.getStorageInfo();
    const analysisDiv = document.getElementById('storageAnalysis');
    
    let html = '<div class="analysis-results"><h3>Storage Breakdown</h3>';
    
    Object.entries(info.breakdown).forEach(([key, data]) => {
        const percentage = info.total > 0 ? (data.size / info.total) * 100 : 0;
        html += `<div class="analysis-item">
            <div class="analysis-header">
                <span class="analysis-key">${key}</span>
                <span class="analysis-size">${data.sizeFormatted}</span>
            </div>
            <div class="analysis-bar">
                <div class="analysis-fill" style="width: ${percentage}%"></div>
            </div>
            <small>${percentage.toFixed(1)}% of total</small>
        </div>`;
    });
    
    html += '</div>';
    analysisDiv.innerHTML = html;
}

// Perform cleanup
function performCleanup() {
    if (confirm('This will remove old backups and session data. Continue?')) {
        StorageManager.cleanup();
        alert('Cleanup completed!');
        updateStorageStats();
        if (document.getElementById('backupsTab').classList.contains('active')) {
            showBackupHistory();
        }
        if (document.getElementById('sessionsTab').classList.contains('active')) {
            showSessionHistory();
        }
    }
}

// Toggle sync
function toggleSync() {
    const syncBtn = document.getElementById('syncBtn');
    const isEnabled = syncBtn.textContent === 'Disable Sync';
    
    if (isEnabled) {
        syncBtn.textContent = 'Enable Sync';
        // Remove sync listeners (simplified)
    } else {
        StorageManager.syncAcrossTabs();
        syncBtn.textContent = 'Disable Sync';
        
        // Listen for sync events
        window.addEventListener('storageSync', (e) => {
            console.log('Data synced:', e.detail);
            displayData();
        });
    }
}

// Enhanced display function
function displayData() {
    const progressData = StorageManager.get('profile') || {};
    const settingsData = StorageManager.get('settings') || {};
    const codeData = StorageManager.get('savedCode') || {};
    const gameData = StorageManager.get('gamification') || {};

    document.getElementById('progressData').textContent = JSON.stringify(progressData, null, 2);
    document.getElementById('settingsData').textContent = JSON.stringify(settingsData, null, 2);
    document.getElementById('codeData').textContent = JSON.stringify(codeData, null, 2);
    document.getElementById('gameData').textContent = JSON.stringify(gameData, null, 2);
    
    // Update stats if on advanced tab
    if (document.getElementById('advancedTab').classList.contains('active')) {
        updateStorageStats();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayData();
    updateStorageStats();
    StorageManager.syncAcrossTabs();
});