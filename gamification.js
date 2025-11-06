// Daily Challenge System
class DailyChallengeSystem {
    constructor() {
        this.challengeData = this.loadChallengeData();
        this.challenges = [
            {
                id: 'complete-lesson',
                title: 'Daily Learner',
                description: 'Complete any lesson today',
                reward: 100,
                type: 'lesson'
            },
            {
                id: 'code-practice',
                title: 'Code Warrior',
                description: 'Write 50 lines of code in the editor',
                reward: 75,
                type: 'code'
            },
            {
                id: 'challenge-master',
                title: 'Challenge Master',
                description: 'Complete 3 coding challenges',
                reward: 150,
                type: 'challenge'
            },
            {
                id: 'streak-keeper',
                title: 'Streak Keeper',
                description: 'Maintain your learning streak',
                reward: 50,
                type: 'streak'
            }
        ];
        this.initializeElements();
        this.updateDailyChallenge();
        this.startTimer();
    }

    loadChallengeData() {
        const saved = localStorage.getItem('codequest_daily_challenge');
        const today = new Date().toDateString();
        const data = saved ? JSON.parse(saved) : {};
        
        if (data.date !== today) {
            return {
                date: today,
                currentChallenge: null,
                progress: 0,
                completed: false,
                completedChallenges: data.completedChallenges || 0
            };
        }
        return data;
    }

    saveChallengeData() {
        localStorage.setItem('codequest_daily_challenge', JSON.stringify(this.challengeData));
    }

    initializeElements() {
        this.challengeCard = document.getElementById('daily-challenge');
        this.challengeTitle = this.challengeCard.querySelector('.challenge-title');
        this.challengeDescription = this.challengeCard.querySelector('.challenge-description');
        this.challengeProgress = document.getElementById('daily-progress');
        this.progressText = document.getElementById('daily-progress-text');
        this.challengeBtn = document.getElementById('daily-challenge-btn');
        this.timerEl = document.getElementById('challenge-timer');
        
        this.challengeBtn.addEventListener('click', () => this.startChallenge());
    }

    updateDailyChallenge() {
        if (!this.challengeData.currentChallenge) {
            const randomChallenge = this.challenges[Math.floor(Math.random() * this.challenges.length)];
            this.challengeData.currentChallenge = randomChallenge;
            this.saveChallengeData();
        }

        const challenge = this.challengeData.currentChallenge;
        this.challengeTitle.textContent = challenge.title;
        this.challengeDescription.textContent = challenge.description;
        
        this.updateProgress();
        
        if (this.challengeData.completed) {
            this.challengeBtn.textContent = 'Completed!';
            this.challengeBtn.disabled = true;
        } else {
            this.challengeBtn.textContent = 'Start Challenge';
            this.challengeBtn.disabled = false;
        }
    }

    updateProgress() {
        const target = this.getTargetValue();
        const percentage = Math.min((this.challengeData.progress / target) * 100, 100);
        
        this.challengeProgress.style.width = `${percentage}%`;
        this.progressText.textContent = `${this.challengeData.progress}/${target}`;
        
        if (this.challengeData.progress >= target && !this.challengeData.completed) {
            this.completeChallenge();
        }
    }

    getTargetValue() {
        const challenge = this.challengeData.currentChallenge;
        switch (challenge.type) {
            case 'lesson': return 1;
            case 'code': return 50;
            case 'challenge': return 3;
            case 'streak': return 1;
            default: return 1;
        }
    }

    recordProgress(type, amount = 1) {
        if (this.challengeData.completed) return;
        
        const challenge = this.challengeData.currentChallenge;
        if (challenge && challenge.type === type) {
            this.challengeData.progress += amount;
            this.saveChallengeData();
            this.updateProgress();
        }
    }

    completeChallenge() {
        this.challengeData.completed = true;
        this.challengeData.completedChallenges++;
        this.saveChallengeData();
        
        const challenge = this.challengeData.currentChallenge;
        
        // Award XP
        if (window.xpSystem) {
            window.xpSystem.awardXP(challenge.reward, `Daily Challenge: ${challenge.title}`);
        }
        
        this.showCompletionNotification(challenge);
        this.updateDailyChallenge();
    }

    startChallenge() {
        const challenge = this.challengeData.currentChallenge;
        
        switch (challenge.type) {
            case 'lesson':
                window.location.href = 'index.html';
                break;
            case 'code':
                window.location.href = 'editor.html';
                break;
            case 'challenge':
                window.location.href = 'challenges.html';
                break;
            case 'streak':
                this.recordProgress('streak');
                break;
        }
    }

    startTimer() {
        this.updateTimer();
        setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const timeLeft = tomorrow - now;
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        this.timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    showCompletionNotification(challenge) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 2rem;">🎯</span>
                <div>
                    <strong>Daily Challenge Complete!</strong><br>
                    <span>${challenge.title} - +${challenge.reward} XP</span>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
            padding: 20px 25px;
            border-radius: 12px;
            z-index: 1003;
            animation: slideIn 0.5s ease;
            box-shadow: 0 8px 20px rgba(76, 175, 80, 0.4);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Mission System
class MissionSystem {
    constructor() {
        this.missionData = this.loadMissionData();
        this.missions = [
            {
                id: 'html-master',
                title: 'HTML Master',
                description: 'Master the fundamentals of HTML',
                reward: 300,
                objectives: [
                    { id: 'html-lesson-1', text: 'Complete HTML Basics lesson', type: 'lesson', target: 1 },
                    { id: 'html-challenges', text: 'Complete 3 HTML challenges', type: 'html-challenge', target: 3 },
                    { id: 'html-practice', text: 'Write 100 lines of HTML', type: 'html-code', target: 100 }
                ]
            },
            {
                id: 'css-wizard',
                title: 'CSS Wizard',
                description: 'Become a styling expert',
                reward: 400,
                objectives: [
                    { id: 'css-lesson-2', text: 'Complete CSS Styling lesson', type: 'lesson', target: 2 },
                    { id: 'css-challenges', text: 'Complete 5 CSS challenges', type: 'css-challenge', target: 5 },
                    { id: 'responsive-design', text: 'Create responsive layout', type: 'responsive', target: 1 }
                ]
            },
            {
                id: 'js-ninja',
                title: 'JavaScript Ninja',
                description: 'Master JavaScript programming',
                reward: 500,
                objectives: [
                    { id: 'js-lessons', text: 'Complete 3 JS lessons', type: 'js-lesson', target: 3 },
                    { id: 'js-challenges', text: 'Complete 7 JS challenges', type: 'js-challenge', target: 7 },
                    { id: 'dom-manipulation', text: 'Complete DOM lesson', type: 'lesson', target: 4 }
                ]
            }
        ];
        this.initializeElements();
        this.updateMissions();
    }

    loadMissionData() {
        const saved = localStorage.getItem('codequest_missions');
        return saved ? JSON.parse(saved) : {
            activeMissions: ['html-master', 'css-wizard'],
            completedMissions: [],
            progress: {}
        };
    }

    saveMissionData() {
        localStorage.setItem('codequest_missions', JSON.stringify(this.missionData));
    }

    initializeElements() {
        this.missionsContainer = document.getElementById('missions-container');
    }

    updateMissions() {
        this.missionsContainer.innerHTML = '';
        
        this.missionData.activeMissions.forEach(missionId => {
            const mission = this.missions.find(m => m.id === missionId);
            if (mission) {
                this.createMissionCard(mission);
            }
        });
    }

    createMissionCard(mission) {
        const progress = this.missionData.progress[mission.id] || {};
        const completedObjectives = mission.objectives.filter(obj => 
            (progress[obj.id] || 0) >= obj.target
        ).length;
        const totalObjectives = mission.objectives.length;
        const missionProgress = (completedObjectives / totalObjectives) * 100;

        const missionCard = document.createElement('div');
        missionCard.className = 'mission-card';
        missionCard.innerHTML = `
            <div class="mission-header">
                <div class="mission-title">${mission.title}</div>
                <div class="mission-reward">+${mission.reward} XP</div>
            </div>
            <div class="mission-description">${mission.description}</div>
            <div class="mission-objectives">
                ${mission.objectives.map(obj => `
                    <div class="objective ${(progress[obj.id] || 0) >= obj.target ? 'completed' : ''}">
                        <div class="objective-status"></div>
                        <span>${obj.text} (${progress[obj.id] || 0}/${obj.target})</span>
                    </div>
                `).join('')}
            </div>
            <div class="mission-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${missionProgress}%"></div>
                </div>
                <span class="progress-text">${completedObjectives}/${totalObjectives}</span>
            </div>
        `;
        
        this.missionsContainer.appendChild(missionCard);
    }

    recordProgress(type, value = 1) {
        let updated = false;
        
        this.missionData.activeMissions.forEach(missionId => {
            const mission = this.missions.find(m => m.id === missionId);
            if (mission) {
                mission.objectives.forEach(objective => {
                    if (objective.type === type) {
                        if (!this.missionData.progress[missionId]) {
                            this.missionData.progress[missionId] = {};
                        }
                        
                        const currentProgress = this.missionData.progress[missionId][objective.id] || 0;
                        this.missionData.progress[missionId][objective.id] = Math.min(
                            currentProgress + value,
                            objective.target
                        );
                        updated = true;
                        
                        this.checkMissionCompletion(mission);
                    }
                });
            }
        });
        
        if (updated) {
            this.saveMissionData();
            this.updateMissions();
        }
    }

    checkMissionCompletion(mission) {
        const progress = this.missionData.progress[mission.id] || {};
        const allCompleted = mission.objectives.every(obj => 
            (progress[obj.id] || 0) >= obj.target
        );
        
        if (allCompleted && !this.missionData.completedMissions.includes(mission.id)) {
            this.completeMission(mission);
        }
    }

    completeMission(mission) {
        this.missionData.completedMissions.push(mission.id);
        this.missionData.activeMissions = this.missionData.activeMissions.filter(id => id !== mission.id);
        
        // Award XP
        if (window.xpSystem) {
            window.xpSystem.awardXP(mission.reward, `Mission Complete: ${mission.title}`);
        }
        
        // Check for mission master achievement
        if (window.achievementSystem) {
            window.achievementSystem.checkMissionAchievements(this.missionData.completedMissions.length);
        }
        
        this.showMissionCompleteNotification(mission);
        this.saveMissionData();
        this.updateMissions();
        
        // Activate next mission if available
        this.activateNextMission();
    }

    activateNextMission() {
        const availableMissions = this.missions.filter(mission => 
            !this.missionData.activeMissions.includes(mission.id) &&
            !this.missionData.completedMissions.includes(mission.id)
        );
        
        if (availableMissions.length > 0 && this.missionData.activeMissions.length < 2) {
            this.missionData.activeMissions.push(availableMissions[0].id);
            this.saveMissionData();
            this.updateMissions();
        }
    }

    showMissionCompleteNotification(mission) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 2rem;">🏅</span>
                <div>
                    <strong>Mission Complete!</strong><br>
                    <span>${mission.title} - +${mission.reward} XP</span>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px 35px;
            border-radius: 15px;
            z-index: 1003;
            animation: missionComplete 0.8s ease;
            box-shadow: 0 10px 30px rgba(102, 126, 234, 0.5);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Power-up System
class PowerUpSystem {
    constructor() {
        this.powerUpData = this.loadPowerUpData();
        this.powerUps = {
            'double-xp': { name: 'Double XP', cost: 200, duration: 3600000 }, // 1 hour
            'hint-master': { name: 'Hint Master', cost: 150, duration: 1800000 }, // 30 min
            'streak-shield': { name: 'Streak Shield', cost: 100, duration: 86400000 } // 24 hours
        };
        this.initializeElements();
        this.updatePowerUps();
        this.checkActivePowerUps();
    }

    loadPowerUpData() {
        const saved = localStorage.getItem('codequest_powerups');
        return saved ? JSON.parse(saved) : {
            active: {},
            inventory: {}
        };
    }

    savePowerUpData() {
        localStorage.setItem('codequest_powerups', JSON.stringify(this.powerUpData));
    }

    initializeElements() {
        this.powerUpElements = document.querySelectorAll('.power-up');
        this.powerUpElements.forEach(element => {
            const powerUpId = element.dataset.powerup;
            const btn = element.querySelector('.power-up-btn');
            btn.addEventListener('click', () => this.activatePowerUp(powerUpId));
        });
    }

    updatePowerUps() {
        this.powerUpElements.forEach(element => {
            const powerUpId = element.dataset.powerup;
            const btn = element.querySelector('.power-up-btn');
            const isActive = this.isPowerUpActive(powerUpId);
            
            if (isActive) {
                element.classList.add('active');
                btn.textContent = 'Active';
                btn.disabled = true;
            } else {
                element.classList.remove('active');
                btn.textContent = 'Activate';
                btn.disabled = false;
                
                // Check if user has enough XP
                const cost = this.powerUps[powerUpId].cost;
                const userXP = window.xpSystem ? window.xpSystem.xpData.totalXP : 0;
                if (userXP < cost) {
                    btn.disabled = true;
                    btn.textContent = 'Not enough XP';
                }
            }
        });
    }

    activatePowerUp(powerUpId) {
        const powerUp = this.powerUps[powerUpId];
        const userXP = window.xpSystem ? window.xpSystem.xpData.totalXP : 0;
        
        if (userXP < powerUp.cost) {
            this.showNotification('Not enough XP!', 'error');
            return;
        }
        
        if (this.isPowerUpActive(powerUpId)) {
            this.showNotification('Power-up already active!', 'warning');
            return;
        }
        
        // Deduct XP
        if (window.xpSystem) {
            window.xpSystem.xpData.totalXP -= powerUp.cost;
            window.xpSystem.saveXPData();
            window.xpSystem.updateXPDisplay();
        }
        
        // Activate power-up
        this.powerUpData.active[powerUpId] = {
            activatedAt: Date.now(),
            expiresAt: Date.now() + powerUp.duration
        };
        
        this.savePowerUpData();
        this.updatePowerUps();
        this.showActivationNotification(powerUp);
    }

    isPowerUpActive(powerUpId) {
        const active = this.powerUpData.active[powerUpId];
        if (!active) return false;
        
        if (Date.now() > active.expiresAt) {
            delete this.powerUpData.active[powerUpId];
            this.savePowerUpData();
            return false;
        }
        
        return true;
    }

    checkActivePowerUps() {
        setInterval(() => {
            let updated = false;
            Object.keys(this.powerUpData.active).forEach(powerUpId => {
                if (!this.isPowerUpActive(powerUpId)) {
                    updated = true;
                }
            });
            
            if (updated) {
                this.updatePowerUps();
            }
        }, 60000); // Check every minute
    }

    getActiveMultiplier(type) {
        switch (type) {
            case 'xp':
                return this.isPowerUpActive('double-xp') ? 2 : 1;
            case 'hints':
                return this.isPowerUpActive('hint-master') ? 0 : 1; // Free hints
            case 'streak':
                return this.isPowerUpActive('streak-shield') ? 1 : 0; // Streak protection
            default:
                return 1;
        }
    }

    showActivationNotification(powerUp) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 2rem;">⚡</span>
                <div>
                    <strong>Power-up Activated!</strong><br>
                    <span>${powerUp.name} is now active</span>
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
            color: white;
            padding: 20px 25px;
            border-radius: 12px;
            z-index: 1003;
            animation: slideIn 0.5s ease;
            box-shadow: 0 8px 20px rgba(255, 107, 107, 0.4);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showNotification(message, type = 'info') {
        const colors = {
            error: '#FF6B6B',
            warning: '#FFA500',
            info: '#667eea'
        };
        
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type]};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1002;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Leaderboard System
class LeaderboardSystem {
    constructor() {
        this.leaderboardData = this.loadLeaderboardData();
        this.currentTab = 'weekly';
        this.initializeElements();
        this.updateLeaderboard();
    }

    loadLeaderboardData() {
        const saved = localStorage.getItem('codequest_leaderboard');
        return saved ? JSON.parse(saved) : {
            users: this.generateMockUsers(),
            lastUpdated: Date.now()
        };
    }

    generateMockUsers() {
        const names = ['Alex', 'Sarah', 'Mike', 'Emma', 'David', 'Lisa', 'John', 'Anna', 'Chris', 'Maya'];
        const users = [];
        
        for (let i = 0; i < 10; i++) {
            users.push({
                id: `user_${i}`,
                name: names[i],
                avatar: `https://via.placeholder.com/40?text=${names[i][0]}`,
                totalXP: Math.floor(Math.random() * 5000) + 1000,
                weeklyXP: Math.floor(Math.random() * 1000) + 100,
                monthlyXP: Math.floor(Math.random() * 2000) + 500,
                level: Math.floor(Math.random() * 10) + 1
            });
        }
        
        return users;
    }

    saveLeaderboardData() {
        localStorage.setItem('codequest_leaderboard', JSON.stringify(this.leaderboardData));
    }

    initializeElements() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.leaderboardContent = document.getElementById('leaderboard-content');
        
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentTab = btn.dataset.tab;
                this.updateTabDisplay();
                this.updateLeaderboard();
            });
        });
    }

    updateTabDisplay() {
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === this.currentTab);
        });
    }

    updateLeaderboard() {
        const currentUser = this.getCurrentUser();
        let sortedUsers = [...this.leaderboardData.users];
        
        // Sort based on current tab
        switch (this.currentTab) {
            case 'weekly':
                sortedUsers.sort((a, b) => b.weeklyXP - a.weeklyXP);
                break;
            case 'monthly':
                sortedUsers.sort((a, b) => b.monthlyXP - a.monthlyXP);
                break;
            case 'alltime':
                sortedUsers.sort((a, b) => b.totalXP - a.totalXP);
                break;
        }
        
        // Add current user if not in list
        if (currentUser && !sortedUsers.find(u => u.id === 'current_user')) {
            sortedUsers.push(currentUser);
            sortedUsers.sort((a, b) => this.getXPForTab(b) - this.getXPForTab(a));
        }
        
        this.renderLeaderboard(sortedUsers.slice(0, 10));
    }

    getCurrentUser() {
        if (!window.profileSystem || !window.xpSystem) return null;
        
        const profile = window.profileSystem.profileData;
        const xp = window.xpSystem.xpData;
        
        return {
            id: 'current_user',
            name: profile.username,
            avatar: profile.avatarUrl,
            totalXP: xp.totalXP,
            weeklyXP: Math.floor(xp.totalXP * 0.3), // Mock weekly XP
            monthlyXP: Math.floor(xp.totalXP * 0.7), // Mock monthly XP
            level: xp.currentLevel
        };
    }

    getXPForTab(user) {
        switch (this.currentTab) {
            case 'weekly': return user.weeklyXP;
            case 'monthly': return user.monthlyXP;
            case 'alltime': return user.totalXP;
            default: return user.totalXP;
        }
    }

    renderLeaderboard(users) {
        this.leaderboardContent.innerHTML = '';
        
        users.forEach((user, index) => {
            const rank = index + 1;
            const xp = this.getXPForTab(user);
            const isCurrentUser = user.id === 'current_user';
            
            const item = document.createElement('div');
            item.className = `leaderboard-item ${isCurrentUser ? 'current-user' : ''}`;
            
            let rankClass = '';
            if (rank === 1) rankClass = 'gold';
            else if (rank === 2) rankClass = 'silver';
            else if (rank === 3) rankClass = 'bronze';
            
            item.innerHTML = `
                <div class="leaderboard-rank ${rankClass}">${rank}</div>
                <img class="leaderboard-avatar" src="${user.avatar}" alt="${user.name}">
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${user.name}</div>
                    <div class="leaderboard-level">Level ${user.level}</div>
                </div>
                <div class="leaderboard-xp">${xp} XP</div>
            `;
            
            this.leaderboardContent.appendChild(item);
        });
    }
}

// Enhanced Achievement System
class EnhancedAchievementSystem extends AchievementSystem {
    constructor() {
        super();
        this.dailyAchievements = {
            'daily-warrior': { threshold: 7, name: 'Daily Warrior' }
        };
        this.missionAchievements = {
            'mission-master': { threshold: 5, name: 'Mission Master' }
        };
    }

    checkDailyAchievements(completedChallenges) {
        const newBadges = [];
        
        Object.keys(this.dailyAchievements).forEach(badgeId => {
            const achievement = this.dailyAchievements[badgeId];
            const alreadyEarned = this.achievementData.earnedBadges.includes(badgeId);
            
            if (completedChallenges >= achievement.threshold && !alreadyEarned) {
                this.achievementData.earnedBadges.push(badgeId);
                newBadges.push(achievement.name);
            }
        });
        
        if (newBadges.length > 0) {
            this.saveAchievements();
            this.updateBadgeDisplay();
            this.showAchievementNotification(newBadges);
        }
    }

    checkMissionAchievements(completedMissions) {
        const newBadges = [];
        
        Object.keys(this.missionAchievements).forEach(badgeId => {
            const achievement = this.missionAchievements[badgeId];
            const alreadyEarned = this.achievementData.earnedBadges.includes(badgeId);
            
            if (completedMissions >= achievement.threshold && !alreadyEarned) {
                this.achievementData.earnedBadges.push(badgeId);
                newBadges.push(achievement.name);
            }
        });
        
        if (newBadges.length > 0) {
            this.saveAchievements();
            this.updateBadgeDisplay();
            this.showAchievementNotification(newBadges);
        }
    }
}

// Add mission complete animation
const missionCompleteStyle = document.createElement('style');
missionCompleteStyle.textContent = `
    @keyframes missionComplete {
        0% { transform: translate(-50%, -50%) scale(0.5) rotate(-10deg); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); }
        100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
    }
`;
document.head.appendChild(missionCompleteStyle);