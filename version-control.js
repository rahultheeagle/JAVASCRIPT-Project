class VersionControl {
    constructor() {
        this.history = new Map();
        this.maxVersions = 50;
        this.init();
    }

    init() {
        this.loadHistory();
        this.bindEvents();
    }

    loadHistory() {
        if (window.storageManager) {
            const saved = window.storageManager.getItem('codeHistory') || {};
            Object.entries(saved).forEach(([challengeId, versions]) => {
                this.history.set(challengeId, versions);
            });
        }
    }

    saveHistory() {
        if (window.storageManager) {
            const historyObj = {};
            this.history.forEach((versions, challengeId) => {
                historyObj[challengeId] = versions;
            });
            window.storageManager.setItem('codeHistory', historyObj);
        }
    }

    bindEvents() {
        // Auto-save on code changes
        document.addEventListener('input', (e) => {
            if (e.target.matches('.code-editor, #code-input, textarea[data-challenge]')) {
                this.debounceAutoSave(e.target);
            }
        });
    }

    debounceAutoSave(element) {
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            const challengeId = element.dataset.challenge || this.getCurrentChallengeId();
            if (challengeId && element.value.trim()) {
                this.saveVersion(challengeId, element.value, 'auto-save');
            }
        }, 2000);
    }

    getCurrentChallengeId() {
        // Try to get challenge ID from URL or page context
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('challenge') || 'current-challenge';
    }

    saveVersion(challengeId, code, type = 'manual', description = '') {
        if (!challengeId || !code.trim()) return null;

        const version = {
            id: this.generateVersionId(),
            code: code,
            timestamp: new Date().toISOString(),
            type: type, // 'manual', 'auto-save', 'submission', 'checkpoint'
            description: description,
            size: code.length,
            hash: this.generateHash(code)
        };

        // Get or create history for challenge
        if (!this.history.has(challengeId)) {
            this.history.set(challengeId, []);
        }

        const versions = this.history.get(challengeId);
        
        // Check if code is different from last version
        if (versions.length > 0 && versions[versions.length - 1].hash === version.hash) {
            return null; // No changes
        }

        // Add new version
        versions.push(version);

        // Limit versions
        if (versions.length > this.maxVersions) {
            versions.splice(0, versions.length - this.maxVersions);
        }

        this.saveHistory();
        return version.id;
    }

    getVersions(challengeId) {
        return this.history.get(challengeId) || [];
    }

    getVersion(challengeId, versionId) {
        const versions = this.getVersions(challengeId);
        return versions.find(v => v.id === versionId);
    }

    getLatestVersion(challengeId) {
        const versions = this.getVersions(challengeId);
        return versions.length > 0 ? versions[versions.length - 1] : null;
    }

    restoreVersion(challengeId, versionId) {
        const version = this.getVersion(challengeId, versionId);
        if (!version) return false;

        // Find code editor and restore
        const editor = document.querySelector('.code-editor, #code-input, textarea[data-challenge]');
        if (editor) {
            editor.value = version.code;
            
            // Trigger change event
            editor.dispatchEvent(new Event('input', { bubbles: true }));
            
            if (window.toastSystem) {
                window.toastSystem.success(`Restored version from ${this.formatDate(version.timestamp)}`);
            }
            
            return true;
        }
        
        return false;
    }

    compareVersions(challengeId, versionId1, versionId2) {
        const v1 = this.getVersion(challengeId, versionId1);
        const v2 = this.getVersion(challengeId, versionId2);
        
        if (!v1 || !v2) return null;

        return {
            version1: v1,
            version2: v2,
            diff: this.generateDiff(v1.code, v2.code),
            sizeDiff: v2.size - v1.size,
            timeDiff: new Date(v2.timestamp) - new Date(v1.timestamp)
        };
    }

    generateDiff(code1, code2) {
        const lines1 = code1.split('\n');
        const lines2 = code2.split('\n');
        const diff = [];

        const maxLines = Math.max(lines1.length, lines2.length);
        
        for (let i = 0; i < maxLines; i++) {
            const line1 = lines1[i] || '';
            const line2 = lines2[i] || '';
            
            if (line1 !== line2) {
                diff.push({
                    lineNumber: i + 1,
                    removed: line1,
                    added: line2,
                    type: line1 === '' ? 'added' : line2 === '' ? 'removed' : 'modified'
                });
            }
        }
        
        return diff;
    }

    deleteVersion(challengeId, versionId) {
        const versions = this.history.get(challengeId);
        if (!versions) return false;

        const index = versions.findIndex(v => v.id === versionId);
        if (index === -1) return false;

        versions.splice(index, 1);
        this.saveHistory();
        
        if (window.toastSystem) {
            window.toastSystem.success('Version deleted');
        }
        
        return true;
    }

    clearHistory(challengeId) {
        if (challengeId) {
            this.history.delete(challengeId);
        } else {
            this.history.clear();
        }
        this.saveHistory();
        
        if (window.toastSystem) {
            window.toastSystem.success('History cleared');
        }
    }

    exportHistory(challengeId) {
        const versions = this.getVersions(challengeId);
        const exportData = {
            challengeId: challengeId,
            exportDate: new Date().toISOString(),
            totalVersions: versions.length,
            versions: versions
        };

        const jsonData = JSON.stringify(exportData, null, 2);
        this.downloadFile(jsonData, `code-history-${challengeId}-${this.getTimestamp()}.json`);
        
        if (window.toastSystem) {
            window.toastSystem.success('History exported');
        }
    }

    importHistory(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.challengeId && data.versions) {
                this.history.set(data.challengeId, data.versions);
                this.saveHistory();
                return true;
            }
        } catch (error) {
            console.error('Import failed:', error);
        }
        return false;
    }

    getStatistics(challengeId) {
        const versions = this.getVersions(challengeId);
        if (versions.length === 0) return null;

        const totalVersions = versions.length;
        const totalSize = versions.reduce((sum, v) => sum + v.size, 0);
        const avgSize = Math.round(totalSize / totalVersions);
        
        const firstVersion = versions[0];
        const lastVersion = versions[versions.length - 1];
        const timeSpan = new Date(lastVersion.timestamp) - new Date(firstVersion.timestamp);
        
        const typeCount = versions.reduce((count, v) => {
            count[v.type] = (count[v.type] || 0) + 1;
            return count;
        }, {});

        return {
            totalVersions,
            avgSize,
            timeSpan,
            typeCount,
            firstSaved: firstVersion.timestamp,
            lastSaved: lastVersion.timestamp,
            sizeGrowth: lastVersion.size - firstVersion.size
        };
    }

    generateVersionId() {
        return `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateHash(code) {
        let hash = 0;
        for (let i = 0; i < code.length; i++) {
            const char = code.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36);
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    getTimestamp() {
        return new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    }

    downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // UI Helper methods
    createHistoryPanel(challengeId) {
        const versions = this.getVersions(challengeId);
        
        return `
            <div class="version-history-panel">
                <div class="history-header">
                    <h3>Version History (${versions.length})</h3>
                    <div class="history-actions">
                        <button class="btn-secondary" onclick="window.versionControl.saveVersion('${challengeId}', document.querySelector('.code-editor, #code-input').value, 'manual', prompt('Version description:'))">Save Version</button>
                        <button class="btn-secondary" onclick="window.versionControl.exportHistory('${challengeId}')">Export</button>
                    </div>
                </div>
                <div class="history-list">
                    ${versions.slice().reverse().map(version => `
                        <div class="version-item" data-version="${version.id}">
                            <div class="version-info">
                                <div class="version-meta">
                                    <span class="version-type ${version.type}">${version.type}</span>
                                    <span class="version-time">${this.formatDate(version.timestamp)}</span>
                                    <span class="version-size">${version.size} chars</span>
                                </div>
                                ${version.description ? `<div class="version-desc">${version.description}</div>` : ''}
                            </div>
                            <div class="version-actions">
                                <button class="btn-small" onclick="window.versionControl.restoreVersion('${challengeId}', '${version.id}')">Restore</button>
                                <button class="btn-small btn-danger" onclick="window.versionControl.deleteVersion('${challengeId}', '${version.id}'); this.closest('.version-item').remove()">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    showHistoryModal(challengeId) {
        if (window.modalSystem) {
            const historyPanel = this.createHistoryPanel(challengeId);
            const stats = this.getStatistics(challengeId);
            
            window.modalSystem.showModal('custom', {
                title: 'Code Version History',
                content: `
                    ${stats ? `
                        <div class="history-stats">
                            <div class="stat-item">
                                <span class="stat-label">Total Versions:</span>
                                <span class="stat-value">${stats.totalVersions}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Average Size:</span>
                                <span class="stat-value">${stats.avgSize} chars</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Time Span:</span>
                                <span class="stat-value">${Math.round(stats.timeSpan / 60000)} minutes</span>
                            </div>
                        </div>
                    ` : ''}
                    ${historyPanel}
                `
            });
        }
    }
}

// Initialize version control
document.addEventListener('DOMContentLoaded', () => {
    window.versionControl = new VersionControl();
});