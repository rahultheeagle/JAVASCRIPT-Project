class StatisticsDashboard {
    constructor() {
        this.charts = new Map();
        this.init();
    }

    init() {
        this.loadData();
        this.createCharts();
    }

    loadData() {
        if (!window.storageManager) return {};

        return {
            totalXP: window.storageManager.getItem('totalXP') || 0,
            currentLevel: window.storageManager.getItem('currentLevel') || 1,
            currentStreak: window.storageManager.getItem('currentStreak') || 0,
            streakRecord: window.storageManager.getItem('streakRecord') || 0,
            completedLessons: window.storageManager.getItem('completedLessons') || [],
            completedChallenges: window.storageManager.getItem('completedChallenges') || [],
            challengesCompleted: window.storageManager.getItem('challengesCompleted') || 0,
            lessonsCompleted: window.storageManager.getItem('lessonsCompleted') || 0,
            totalTimeSpent: window.storageManager.getItem('totalTimeSpent') || 0,
            bestTimes: window.storageManager.getItem('bestTimes') || {},
            unlockedAchievements: window.storageManager.getItem('unlockedAchievements') || [],
            dailyActivity: window.storageManager.getItem('dailyActivity') || {},
            weeklyProgress: window.storageManager.getItem('weeklyProgress') || {},
            categoryProgress: window.storageManager.getItem('categoryProgress') || {}
        };
    }

    createCharts() {
        const data = this.loadData();
        
        this.createProgressChart(data);
        this.createActivityChart(data);
        this.createCategoryChart(data);
        this.createTimeChart(data);
        this.createStreakChart(data);
        this.createAchievementChart(data);
    }

    createProgressChart(data) {
        const container = document.getElementById('progress-chart');
        if (!container) return;

        const progressData = [
            { label: 'Lessons', value: data.lessonsCompleted, total: 20, color: '#3b82f6' },
            { label: 'Challenges', value: data.challengesCompleted, total: 50, color: '#10b981' },
            { label: 'Achievements', value: data.unlockedAchievements.length, total: 25, color: '#8b5cf6' }
        ];

        container.innerHTML = `
            <div class="chart-header">
                <h3>Learning Progress</h3>
            </div>
            <div class="progress-bars-chart">
                ${progressData.map(item => `
                    <div class="progress-item">
                        <div class="progress-label">
                            <span>${item.label}</span>
                            <span>${item.value}/${item.total}</span>
                        </div>
                        <div class="progress-bar-chart">
                            <div class="progress-fill-chart" 
                                 style="width: ${(item.value / item.total) * 100}%; background: ${item.color}">
                            </div>
                        </div>
                        <div class="progress-percentage">${Math.round((item.value / item.total) * 100)}%</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createActivityChart(data) {
        const container = document.getElementById('activity-chart');
        if (!container) return;

        // Generate last 7 days activity
        const days = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            days.push({
                date: dateStr,
                day: date.toLocaleDateString('en', { weekday: 'short' }),
                activity: data.dailyActivity[dateStr] || 0
            });
        }

        const maxActivity = Math.max(...days.map(d => d.activity), 1);

        container.innerHTML = `
            <div class="chart-header">
                <h3>Weekly Activity</h3>
            </div>
            <div class="activity-chart">
                ${days.map(day => `
                    <div class="activity-bar">
                        <div class="activity-fill" 
                             style="height: ${(day.activity / maxActivity) * 100}%"
                             title="${day.activity} activities on ${day.date}">
                        </div>
                        <div class="activity-label">${day.day}</div>
                        <div class="activity-value">${day.activity}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createCategoryChart(data) {
        const container = document.getElementById('category-chart');
        if (!container) return;

        const categories = [
            { name: 'HTML', progress: data.categoryProgress.html || 0, color: '#e34c26' },
            { name: 'CSS', progress: data.categoryProgress.css || 0, color: '#1572b6' },
            { name: 'JavaScript', progress: data.categoryProgress.javascript || 0, color: '#f7df1e' }
        ];

        const total = categories.reduce((sum, cat) => sum + cat.progress, 0);

        container.innerHTML = `
            <div class="chart-header">
                <h3>Category Progress</h3>
            </div>
            <div class="category-chart">
                <div class="pie-chart">
                    ${this.createPieChart(categories, total)}
                </div>
                <div class="category-legend">
                    ${categories.map(cat => `
                        <div class="legend-item">
                            <div class="legend-color" style="background: ${cat.color}"></div>
                            <span class="legend-label">${cat.name}</span>
                            <span class="legend-value">${cat.progress}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    createPieChart(categories, total) {
        if (total === 0) {
            return '<div class="empty-chart">No data available</div>';
        }

        let cumulativePercentage = 0;
        const segments = categories.map(cat => {
            const percentage = (cat.progress / total) * 100;
            const startAngle = cumulativePercentage * 3.6;
            const endAngle = (cumulativePercentage + percentage) * 3.6;
            cumulativePercentage += percentage;

            return `
                <div class="pie-segment" 
                     style="--start-angle: ${startAngle}deg; --end-angle: ${endAngle}deg; --color: ${cat.color}">
                </div>
            `;
        }).join('');

        return `<div class="pie-segments">${segments}</div>`;
    }

    createTimeChart(data) {
        const container = document.getElementById('time-chart');
        if (!container) return;

        const timeData = {
            total: data.totalTimeSpent,
            average: data.challengesCompleted > 0 ? Math.round(data.totalTimeSpent / data.challengesCompleted) : 0,
            longest: Math.max(...Object.values(data.bestTimes), 0),
            shortest: Math.min(...Object.values(data.bestTimes).filter(t => t > 0), 0) || 0
        };

        container.innerHTML = `
            <div class="chart-header">
                <h3>Time Analytics</h3>
            </div>
            <div class="time-stats">
                <div class="time-stat">
                    <div class="time-value">${this.formatTime(timeData.total)}</div>
                    <div class="time-label">Total Time</div>
                </div>
                <div class="time-stat">
                    <div class="time-value">${this.formatTime(timeData.average)}</div>
                    <div class="time-label">Avg per Challenge</div>
                </div>
                <div class="time-stat">
                    <div class="time-value">${this.formatTime(timeData.longest)}</div>
                    <div class="time-label">Longest Session</div>
                </div>
                <div class="time-stat">
                    <div class="time-value">${this.formatTime(timeData.shortest)}</div>
                    <div class="time-label">Best Time</div>
                </div>
            </div>
        `;
    }

    createStreakChart(data) {
        const container = document.getElementById('streak-chart');
        if (!container) return;

        const streakPercentage = Math.min((data.currentStreak / 30) * 100, 100);
        const recordPercentage = Math.min((data.streakRecord / 30) * 100, 100);

        container.innerHTML = `
            <div class="chart-header">
                <h3>Learning Streak</h3>
            </div>
            <div class="streak-visual">
                <div class="streak-circle">
                    <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" class="streak-bg"></circle>
                        <circle cx="50" cy="50" r="45" class="streak-progress" 
                                style="stroke-dasharray: ${streakPercentage * 2.83} 283"></circle>
                    </svg>
                    <div class="streak-text">
                        <div class="streak-number">${data.currentStreak}</div>
                        <div class="streak-label">Days</div>
                    </div>
                </div>
                <div class="streak-stats">
                    <div class="streak-stat">
                        <span class="streak-stat-label">Current Streak:</span>
                        <span class="streak-stat-value">${data.currentStreak} days</span>
                    </div>
                    <div class="streak-stat">
                        <span class="streak-stat-label">Best Streak:</span>
                        <span class="streak-stat-value">${data.streakRecord} days</span>
                    </div>
                </div>
            </div>
        `;
    }

    createAchievementChart(data) {
        const container = document.getElementById('achievement-chart');
        if (!container) return;

        const totalAchievements = 25; // Total available achievements
        const unlockedCount = data.unlockedAchievements.length;
        const percentage = (unlockedCount / totalAchievements) * 100;

        // Group achievements by month
        const monthlyUnlocks = {};
        data.unlockedAchievements.forEach(achievement => {
            if (achievement.unlockedAt) {
                const month = new Date(achievement.unlockedAt).toLocaleDateString('en', { month: 'short' });
                monthlyUnlocks[month] = (monthlyUnlocks[month] || 0) + 1;
            }
        });

        container.innerHTML = `
            <div class="chart-header">
                <h3>Achievement Progress</h3>
            </div>
            <div class="achievement-overview">
                <div class="achievement-progress">
                    <div class="achievement-circle">
                        <div class="achievement-percentage">${Math.round(percentage)}%</div>
                        <div class="achievement-count">${unlockedCount}/${totalAchievements}</div>
                    </div>
                </div>
                <div class="monthly-achievements">
                    ${Object.entries(monthlyUnlocks).map(([month, count]) => `
                        <div class="monthly-item">
                            <span class="month-label">${month}</span>
                            <span class="month-count">${count}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    formatTime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
        return `${Math.round(seconds / 3600)}h`;
    }

    updateCharts() {
        this.createCharts();
        
        if (window.toastSystem) {
            window.toastSystem.success('Charts updated!');
        }
    }

    exportData() {
        const data = this.loadData();
        const exportData = {
            exportDate: new Date().toISOString(),
            statistics: data,
            summary: {
                totalXP: data.totalXP,
                level: data.currentLevel,
                completionRate: Math.round(((data.lessonsCompleted + data.challengesCompleted) / 70) * 100),
                timeSpent: this.formatTime(data.totalTimeSpent),
                achievements: data.unlockedAchievements.length
            }
        };

        const jsonData = JSON.stringify(exportData, null, 2);
        this.downloadFile(jsonData, `learning-analytics-${this.getTimestamp()}.json`);
        
        if (window.toastSystem) {
            window.toastSystem.success('Analytics exported!');
        }
    }

    generateSampleData() {
        if (!window.storageManager) return;

        const sampleData = {
            totalXP: 2450,
            currentLevel: 4,
            currentStreak: 12,
            streakRecord: 18,
            completedLessons: ['html-intro', 'css-intro', 'js-basics', 'dom-manipulation'],
            completedChallenges: ['html-1', 'css-1', 'js-1', 'js-2', 'css-2'],
            challengesCompleted: 15,
            lessonsCompleted: 8,
            totalTimeSpent: 14400, // 4 hours
            bestTimes: { 'html-1': 120, 'css-1': 180, 'js-1': 240 },
            unlockedAchievements: [
                { id: 'first-steps', unlockedAt: new Date(Date.now() - 86400000 * 10).toISOString() },
                { id: 'challenge-master', unlockedAt: new Date(Date.now() - 86400000 * 5).toISOString() },
                { id: 'speed-demon', unlockedAt: new Date().toISOString() }
            ],
            dailyActivity: {
                [this.getDateString(-6)]: 2,
                [this.getDateString(-5)]: 4,
                [this.getDateString(-4)]: 1,
                [this.getDateString(-3)]: 3,
                [this.getDateString(-2)]: 5,
                [this.getDateString(-1)]: 2,
                [this.getDateString(0)]: 3
            },
            categoryProgress: {
                html: 75,
                css: 60,
                javascript: 45
            }
        };

        Object.entries(sampleData).forEach(([key, value]) => {
            window.storageManager.setItem(key, value);
        });

        this.updateCharts();
        
        if (window.toastSystem) {
            window.toastSystem.success('Sample data generated!');
        }
    }

    getDateString(daysOffset) {
        const date = new Date();
        date.setDate(date.getDate() + daysOffset);
        return date.toISOString().split('T')[0];
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
}

// Initialize statistics dashboard
document.addEventListener('DOMContentLoaded', () => {
    window.statisticsDashboard = new StatisticsDashboard();
});