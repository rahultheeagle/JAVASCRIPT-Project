// Multiplayer System - Race against time with others (simulated)
class MultiplayerSystem {
    constructor() {
        this.storageManager = window.StorageManager;
        this.gameState = {
            isActive: false,
            players: [],
            currentChallenge: null,
            startTime: null,
            timeLimit: 300000, // 5 minutes
            myProgress: 0
        };
        this.botNames = ['CodeNinja', 'DevMaster', 'JSWizard', 'CSSGuru', 'HTMLHero', 'ReactRocket', 'VueViper', 'AngularAce'];
        this.init();
    }

    init() {
        this.createMultiplayerPanel();
        this.setupEventListeners();
    }

    createMultiplayerPanel() {
        if (document.getElementById('multiplayer-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'multiplayer-panel';
        panel.className = 'multiplayer-panel';
        panel.innerHTML = `
            <div class="mp-header">
                <h4>🏁 Multiplayer Race</h4>
                <button id="toggle-mp-panel" class="toggle-btn">−</button>
            </div>
            <div class="mp-content">
                <div class="mp-lobby" id="mp-lobby">
                    <div class="lobby-controls">
                        <button id="quick-match-btn" class="mp-btn primary">⚡ Quick Match</button>
                        <button id="create-room-btn" class="mp-btn secondary">🏠 Create Room</button>
                        <button id="join-room-btn" class="mp-btn secondary">🚪 Join Room</button>
                    </div>
                    <div class="player-stats">
                        <div class="stat-item">
                            <span class="stat-label">Wins:</span>
                            <span id="win-count">0</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Races:</span>
                            <span id="race-count">0</span>
                        </div>
                    </div>
                </div>
                <div class="mp-game" id="mp-game" style="display: none;">
                    <div class="race-info">
                        <div class="challenge-title" id="race-challenge">Loading...</div>
                        <div class="race-timer" id="race-timer">5:00</div>
                    </div>
                    <div class="players-list" id="players-list"></div>
                    <div class="race-controls">
                        <button id="leave-race-btn" class="mp-btn danger">🚪 Leave Race</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.setupPanelListeners();
    }

    setupEventListeners() {
        // Listen for code changes to update progress
        document.addEventListener('input', (e) => {
            if (this.gameState.isActive && e.target.matches('textarea[id*="editor"]')) {
                this.updateProgress();
            }
        });
    }

    setupPanelListeners() {
        document.getElementById('toggle-mp-panel').addEventListener('click', () => {
            const panel = document.getElementById('multiplayer-panel');
            panel.classList.toggle('collapsed');
        });

        document.getElementById('quick-match-btn').addEventListener('click', () => this.startQuickMatch());
        document.getElementById('create-room-btn').addEventListener('click', () => this.createRoom());
        document.getElementById('join-room-btn').addEventListener('click', () => this.joinRoom());
        document.getElementById('leave-race-btn').addEventListener('click', () => this.leaveRace());
    }

    startQuickMatch() {
        this.showMatchmaking();
        
        setTimeout(() => {
            this.startRace({
                challenge: this.getRandomChallenge(),
                players: this.generateBotPlayers(3)
            });
        }, 2000);
    }

    createRoom() {
        const roomCode = this.generateRoomCode();
        this.showRoomCreated(roomCode);
        
        setTimeout(() => {
            this.startRace({
                challenge: this.getRandomChallenge(),
                players: this.generateBotPlayers(2)
            });
        }, 3000);
    }

    joinRoom() {
        const roomCode = prompt('Enter room code:');
        if (roomCode) {
            this.showJoiningRoom(roomCode);
            
            setTimeout(() => {
                this.startRace({
                    challenge: this.getRandomChallenge(),
                    players: this.generateBotPlayers(3)
                });
            }, 1500);
        }
    }

    showMatchmaking() {
        const lobby = document.getElementById('mp-lobby');
        lobby.innerHTML = `
            <div class="matchmaking">
                <div class="loading-spinner"></div>
                <p>Finding players...</p>
                <div class="found-players">
                    <div class="player-found">👤 You</div>
                </div>
            </div>
        `;

        // Simulate finding players
        setTimeout(() => this.addFoundPlayer('CodeNinja'), 500);
        setTimeout(() => this.addFoundPlayer('DevMaster'), 1000);
        setTimeout(() => this.addFoundPlayer('JSWizard'), 1500);
    }

    addFoundPlayer(name) {
        const foundPlayers = document.querySelector('.found-players');
        if (foundPlayers) {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-found';
            playerDiv.innerHTML = `🤖 ${name}`;
            foundPlayers.appendChild(playerDiv);
        }
    }

    showRoomCreated(roomCode) {
        const lobby = document.getElementById('mp-lobby');
        lobby.innerHTML = `
            <div class="room-created">
                <h4>🏠 Room Created!</h4>
                <div class="room-code">Room Code: <strong>${roomCode}</strong></div>
                <p>Waiting for players to join...</p>
                <div class="room-players">
                    <div class="room-player">👤 You (Host)</div>
                </div>
            </div>
        `;

        setTimeout(() => this.addRoomPlayer('CodeNinja'), 1000);
        setTimeout(() => this.addRoomPlayer('DevMaster'), 2000);
    }

    addRoomPlayer(name) {
        const roomPlayers = document.querySelector('.room-players');
        if (roomPlayers) {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'room-player';
            playerDiv.innerHTML = `🤖 ${name}`;
            roomPlayers.appendChild(playerDiv);
        }
    }

    showJoiningRoom(roomCode) {
        const lobby = document.getElementById('mp-lobby');
        lobby.innerHTML = `
            <div class="joining-room">
                <div class="loading-spinner"></div>
                <p>Joining room ${roomCode}...</p>
            </div>
        `;
    }

    startRace(config) {
        this.gameState.isActive = true;
        this.gameState.currentChallenge = config.challenge;
        this.gameState.players = [
            { name: 'You', progress: 0, isMe: true },
            ...config.players
        ];
        this.gameState.startTime = Date.now();
        this.gameState.myProgress = 0;

        document.getElementById('mp-lobby').style.display = 'none';
        document.getElementById('mp-game').style.display = 'block';
        
        document.getElementById('race-challenge').textContent = config.challenge.title;
        
        this.startRaceTimer();
        this.startBotSimulation();
        this.updatePlayersDisplay();
        
        this.showRaceStartNotification();
    }

    getRandomChallenge() {
        const challenges = [
            { title: 'Create a Login Form', difficulty: 'Easy' },
            { title: 'Build a Calculator', difficulty: 'Medium' },
            { title: 'Responsive Navigation', difficulty: 'Medium' },
            { title: 'Todo List App', difficulty: 'Hard' },
            { title: 'Image Gallery', difficulty: 'Easy' },
            { title: 'Weather Widget', difficulty: 'Hard' }
        ];
        return challenges[Math.floor(Math.random() * challenges.length)];
    }

    generateBotPlayers(count) {
        const shuffled = [...this.botNames].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count).map(name => ({
            name,
            progress: 0,
            isBot: true,
            speed: 0.3 + Math.random() * 0.7 // Random speed multiplier
        }));
    }

    generateRoomCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    startRaceTimer() {
        const timer = setInterval(() => {
            if (!this.gameState.isActive) {
                clearInterval(timer);
                return;
            }

            const elapsed = Date.now() - this.gameState.startTime;
            const remaining = Math.max(0, this.gameState.timeLimit - elapsed);
            
            const minutes = Math.floor(remaining / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);
            
            document.getElementById('race-timer').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (remaining === 0) {
                this.endRace('timeout');
            }
        }, 1000);
    }

    startBotSimulation() {
        const botTimer = setInterval(() => {
            if (!this.gameState.isActive) {
                clearInterval(botTimer);
                return;
            }

            this.gameState.players.forEach(player => {
                if (player.isBot && player.progress < 100) {
                    player.progress += player.speed * (0.5 + Math.random());
                    player.progress = Math.min(100, player.progress);
                    
                    if (player.progress >= 100) {
                        this.endRace('bot_win', player.name);
                    }
                }
            });
            
            this.updatePlayersDisplay();
        }, 1000);
    }

    updateProgress() {
        const editors = ['html-editor', 'css-editor', 'js-editor'];
        let totalCode = 0;
        let targetLength = 500; // Estimated target code length
        
        editors.forEach(editorId => {
            const editor = document.getElementById(editorId);
            if (editor) {
                totalCode += editor.value.length;
            }
        });
        
        this.gameState.myProgress = Math.min(100, (totalCode / targetLength) * 100);
        
        // Update my progress in players array
        const myPlayer = this.gameState.players.find(p => p.isMe);
        if (myPlayer) {
            myPlayer.progress = this.gameState.myProgress;
        }
        
        if (this.gameState.myProgress >= 100) {
            this.endRace('player_win');
        }
        
        this.updatePlayersDisplay();
    }

    updatePlayersDisplay() {
        const playersList = document.getElementById('players-list');
        if (!playersList) return;

        const sortedPlayers = [...this.gameState.players].sort((a, b) => b.progress - a.progress);
        
        playersList.innerHTML = sortedPlayers.map((player, index) => `
            <div class="race-player ${player.isMe ? 'me' : ''} ${player.progress >= 100 ? 'finished' : ''}">
                <div class="player-rank">#${index + 1}</div>
                <div class="player-info">
                    <div class="player-name">${player.isMe ? '👤' : '🤖'} ${player.name}</div>
                    <div class="player-progress-bar">
                        <div class="progress-fill" style="width: ${player.progress}%"></div>
                    </div>
                    <div class="player-percentage">${Math.round(player.progress)}%</div>
                </div>
            </div>
        `).join('');
    }

    showRaceStartNotification() {
        const notification = document.createElement('div');
        notification.className = 'race-notification';
        notification.innerHTML = `
            <div class="race-popup">
                <h3>🏁 Race Started!</h3>
                <p>Challenge: ${this.gameState.currentChallenge.title}</p>
                <p>Code as fast as you can!</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    endRace(reason, winner = null) {
        this.gameState.isActive = false;
        
        let message = '';
        let isWin = false;
        
        switch (reason) {
            case 'player_win':
                message = '🎉 You Won!';
                isWin = true;
                break;
            case 'bot_win':
                message = `😔 ${winner} Won!`;
                break;
            case 'timeout':
                message = '⏰ Time\'s Up!';
                break;
        }
        
        this.showRaceEndNotification(message, isWin);
        this.updateStats(isWin);
        
        setTimeout(() => {
            this.returnToLobby();
        }, 5000);
    }

    showRaceEndNotification(message, isWin) {
        const notification = document.createElement('div');
        notification.className = 'race-end-notification';
        notification.innerHTML = `
            <div class="race-end-popup ${isWin ? 'win' : 'lose'}">
                <h3>${message}</h3>
                <div class="final-standings">
                    ${this.gameState.players
                        .sort((a, b) => b.progress - a.progress)
                        .map((player, index) => `
                            <div class="final-player ${player.isMe ? 'me' : ''}">
                                #${index + 1} ${player.isMe ? '👤' : '🤖'} ${player.name} - ${Math.round(player.progress)}%
                            </div>
                        `).join('')}
                </div>
                <p>Returning to lobby in 5 seconds...</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 4500);
    }

    updateStats(isWin) {
        const stats = this.storageManager?.get('multiplayer_stats') || { wins: 0, races: 0 };
        stats.races++;
        if (isWin) stats.wins++;
        
        this.storageManager?.set('multiplayer_stats', stats);
    }

    returnToLobby() {
        document.getElementById('mp-game').style.display = 'none';
        document.getElementById('mp-lobby').style.display = 'block';
        
        // Reset lobby
        const stats = this.storageManager?.get('multiplayer_stats') || { wins: 0, races: 0 };
        document.getElementById('mp-lobby').innerHTML = `
            <div class="lobby-controls">
                <button id="quick-match-btn" class="mp-btn primary">⚡ Quick Match</button>
                <button id="create-room-btn" class="mp-btn secondary">🏠 Create Room</button>
                <button id="join-room-btn" class="mp-btn secondary">🚪 Join Room</button>
            </div>
            <div class="player-stats">
                <div class="stat-item">
                    <span class="stat-label">Wins:</span>
                    <span id="win-count">${stats.wins}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Races:</span>
                    <span id="race-count">${stats.races}</span>
                </div>
            </div>
        `;
        
        this.setupPanelListeners();
    }

    leaveRace() {
        if (confirm('Are you sure you want to leave the race?')) {
            this.gameState.isActive = false;
            this.returnToLobby();
        }
    }
}

// Initialize multiplayer system
document.addEventListener('DOMContentLoaded', () => {
    window.multiplayerSystem = new MultiplayerSystem();
});