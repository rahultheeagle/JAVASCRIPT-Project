// Timer UI Components
class TimerUI {
    constructor() {
        this.setupEventListeners();
    }

    // Create timer widget HTML
    createTimerWidget(challengeId, challengeName = '') {
        return `
            <div class="timer-widget" data-challenge-id="${challengeId}">
                <div class="timer-header">
                    <span class="timer-icon">⏱️</span>
                    <span class="timer-label">Time</span>
                </div>
                <div class="timer-display">00:00</div>
                <div class="timer-controls">
                    <button class="timer-btn start-btn" onclick="startChallengeTimer('${challengeId}', '${challengeName}')">
                        <span class="btn-icon">▶️</span> Start
                    </button>
                    <button class="timer-btn pause-btn" onclick="pauseChallengeTimer()" style="display:none;">
                        <span class="btn-icon">⏸️</span> Pause
                    </button>
                    <button class="timer-btn resume-btn" onclick="resumeChallengeTimer()" style="display:none;">
                        <span class="btn-icon">▶️</span> Resume
                    </button>
                    <button class="timer-btn stop-btn" onclick="stopChallengeTimer(false)" style="display:none;">
                        <span class="btn-icon">⏹️</span> Stop
                    </button>
                </div>
                <div class="timer-stats">
                    <div class="stat-item">
                        <span class="stat-label">Best:</span>
                        <span class="stat-value best-time">--</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Avg:</span>
                        <span class="stat-value avg-time">--</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Attempts:</span>
                        <span class="stat-value attempts">0</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Create compact timer display
    createCompactTimer(challengeId) {
        return `
            <div class="compact-timer" data-challenge-id="${challengeId}">
                <span class="timer-icon">⏱️</span>
                <span class="timer-display">00:00</span>
                <div class="timer-controls-compact">
                    <button class="timer-btn-compact start-btn" onclick="startChallengeTimer('${challengeId}')">▶️</button>
                    <button class="timer-btn-compact pause-btn" onclick="pauseChallengeTimer()" style="display:none;">⏸️</button>
                    <button class="timer-btn-compact stop-btn" onclick="stopChallengeTimer(false)" style="display:none;">⏹️</button>
                </div>
            </div>
        `;
    }

    // Create timer statistics panel
    createStatsPanel() {
        const stats = window.TimerSystem.getStatistics();
        
        return `
            <div class="timer-stats-panel">
                <h3>⏱️ Timer Statistics</h3>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">${stats.totalChallenges}</div>
                        <div class="stat-label">Total Challenges</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.completedChallenges}</div>
                        <div class="stat-label">Completed</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${window.TimerSystem.formatTime(stats.totalTimeSpent)}</div>
                        <div class="stat-label">Total Time</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${stats.completionRate.toFixed(1)}%</div>
                        <div class="stat-label">Completion Rate</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${window.TimerSystem.formatTime(stats.todayTime)}</div>
                        <div class="stat-label">Today</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">${window.TimerSystem.formatTime(stats.weekTime)}</div>
                        <div class="stat-label">This Week</div>
                    </div>
                </div>
                
                <div class="best-times-section">
                    <h4>🏆 Best Times</h4>
                    <div class="best-times-list">
                        ${stats.bestTimes.map(bt => `
                            <div class="best-time-item">
                                <span class="challenge-name">${bt.challengeName || bt.challengeId}</span>
                                <span class="time-value">${bt.bestTimeFormatted}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="recent-activity-section">
                    <h4>📊 Recent Activity</h4>
                    <div class="activity-list">
                        ${stats.recentActivity.map(activity => `
                            <div class="activity-item">
                                <div class="activity-info">
                                    <span class="challenge-id">${activity.challengeId}</span>
                                    <span class="activity-status ${activity.completed ? 'completed' : 'attempted'}">${activity.completed ? '✅' : '⏱️'}</span>
                                </div>
                                <div class="activity-details">
                                    <span class="duration">${activity.durationFormatted}</span>
                                    <span class="time-ago">${activity.timeAgo}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // Update timer widget state
    updateTimerWidget(challengeId, state) {
        const widget = document.querySelector(`[data-challenge-id="${challengeId}"]`);
        if (!widget) return;

        const startBtn = widget.querySelector('.start-btn');
        const pauseBtn = widget.querySelector('.pause-btn');
        const resumeBtn = widget.querySelector('.resume-btn');
        const stopBtn = widget.querySelector('.stop-btn');

        // Reset all buttons
        [startBtn, pauseBtn, resumeBtn, stopBtn].forEach(btn => {
            if (btn) btn.style.display = 'none';
        });

        // Show appropriate buttons based on state
        switch (state) {
            case 'idle':
                if (startBtn) startBtn.style.display = 'inline-block';
                break;
            case 'running':
                if (pauseBtn) pauseBtn.style.display = 'inline-block';
                if (stopBtn) stopBtn.style.display = 'inline-block';
                break;
            case 'paused':
                if (resumeBtn) resumeBtn.style.display = 'inline-block';
                if (stopBtn) stopBtn.style.display = 'inline-block';
                break;
        }

        // Update stats
        this.updateTimerStats(challengeId);
    }

    // Update timer statistics in widget
    updateTimerStats(challengeId) {
        const widget = document.querySelector(`[data-challenge-id="${challengeId}"]`);
        if (!widget) return;

        const timerData = window.TimerSystem.getTimerData(challengeId);
        if (!timerData) return;

        const bestTimeEl = widget.querySelector('.best-time');
        const avgTimeEl = widget.querySelector('.avg-time');
        const attemptsEl = widget.querySelector('.attempts');

        if (bestTimeEl) {
            bestTimeEl.textContent = timerData.bestTime ? 
                window.TimerSystem.formatTime(timerData.bestTime) : '--';
        }

        if (avgTimeEl) {
            avgTimeEl.textContent = timerData.averageTime > 0 ? 
                window.TimerSystem.formatTime(timerData.averageTime) : '--';
        }

        if (attemptsEl) {
            attemptsEl.textContent = timerData.attempts.toString();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for timer events
        window.addEventListener('timerStarted', (e) => {
            this.updateTimerWidget(e.detail.challengeId, 'running');
            this.showNotification(`Timer started for ${e.detail.challengeName || e.detail.challengeId}`, 'success');
        });

        window.addEventListener('timerPaused', (e) => {
            this.updateTimerWidget(e.detail.challengeId, 'paused');
            this.showNotification('Timer paused', 'info');
        });

        window.addEventListener('timerResumed', (e) => {
            this.updateTimerWidget(e.detail.challengeId, 'running');
            this.showNotification('Timer resumed', 'info');
        });

        window.addEventListener('timerStopped', (e) => {
            this.updateTimerWidget(e.detail.challengeId, 'idle');
            const message = e.detail.completed ? 
                `Challenge completed in ${window.TimerSystem.formatTime(e.detail.elapsedTime)}!` :
                `Timer stopped. Time: ${window.TimerSystem.formatTime(e.detail.elapsedTime)}`;
            this.showNotification(message, e.detail.completed ? 'success' : 'info');
        });

        window.addEventListener('timerTick', (e) => {
            // Update all timer displays for the current challenge
            const displays = document.querySelectorAll(`[data-challenge-id="${e.detail.challengeId}"] .timer-display`);
            displays.forEach(display => {
                display.textContent = e.detail.formattedTime;
            });
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `timer-notification ${type}`;
        notification.innerHTML = `
            <span class="notification-icon">${this.getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    // Initialize timer widgets on page
    initializeTimerWidgets() {
        // Find all challenge containers and add timer widgets
        const challengeContainers = document.querySelectorAll('.challenge-container, .challenge-card');
        
        challengeContainers.forEach(container => {
            const challengeId = container.dataset.challengeId || container.id;
            const challengeName = container.dataset.challengeName || 
                                 container.querySelector('h3, h4, .challenge-title')?.textContent || '';
            
            if (challengeId && !container.querySelector('.timer-widget')) {
                const timerWidget = document.createElement('div');
                timerWidget.innerHTML = this.createTimerWidget(challengeId, challengeName);
                container.appendChild(timerWidget.firstElementChild);
                
                // Update initial state
                this.updateTimerWidget(challengeId, 'idle');
            }
        });
    }

    // Add timer to specific element
    addTimerToElement(element, challengeId, challengeName = '', compact = false) {
        const timerHTML = compact ? 
            this.createCompactTimer(challengeId) : 
            this.createTimerWidget(challengeId, challengeName);
        
        const timerElement = document.createElement('div');
        timerElement.innerHTML = timerHTML;
        element.appendChild(timerElement.firstElementChild);
        
        this.updateTimerWidget(challengeId, 'idle');
    }

    // Create timer dashboard
    createTimerDashboard() {
        const dashboard = document.createElement('div');
        dashboard.className = 'timer-dashboard';
        dashboard.innerHTML = `
            <div class="timer-dashboard-header">
                <h2>⏱️ Timer Dashboard</h2>
                <div class="dashboard-actions">
                    <button onclick="timerUI.exportTimerData()" class="dashboard-btn">📤 Export Data</button>
                    <button onclick="timerUI.showTimerSettings()" class="dashboard-btn">⚙️ Settings</button>
                </div>
            </div>
            <div class="timer-dashboard-content">
                ${this.createStatsPanel()}
            </div>
        `;
        
        return dashboard;
    }

    // Export timer data
    exportTimerData() {
        window.TimerSystem.exportData();
        this.showNotification('Timer data exported successfully!', 'success');
    }

    // Show timer settings (placeholder)
    showTimerSettings() {
        this.showNotification('Timer settings coming soon!', 'info');
    }
}

// Global timer UI instance
window.timerUI = new TimerUI();

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize timer widgets on existing challenges
    setTimeout(() => {
        window.timerUI.initializeTimerWidgets();
    }, 1000);
});