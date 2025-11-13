// PWA functionality and installation
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.createPWAPanel();
        this.checkInstallStatus();
        this.setupOfflineDetection();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('SW registered:', registration);
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    this.showUpdateNotification();
                });
            } catch (error) {
                console.log('SW registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        window.addEventListener('appinstalled', () => {
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstalledMessage();
        });
    }

    createPWAPanel() {
        if (document.getElementById('pwa-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'pwa-panel';
        panel.className = 'pwa-panel';
        panel.innerHTML = `
            <div class="pwa-header">
                <h4>📱 Mobile App</h4>
                <button id="toggle-pwa-panel" class="toggle-btn">−</button>
            </div>
            <div class="pwa-content">
                <div id="pwa-status" class="pwa-status">
                    <div class="status-item">
                        <span class="status-label">Connection:</span>
                        <span id="connection-status" class="status-value online">Online</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Install Status:</span>
                        <span id="install-status" class="status-value">Not Installed</span>
                    </div>
                </div>
                
                <div class="pwa-actions">
                    <button id="install-app" class="pwa-btn primary" style="display: none;">📱 Install App</button>
                    <button id="share-app" class="pwa-btn secondary">🔗 Share App</button>
                    <button id="add-to-homescreen" class="pwa-btn secondary">🏠 Add to Home</button>
                </div>
                
                <div class="pwa-features">
                    <h5>App Features:</h5>
                    <ul>
                        <li>✅ Works offline</li>
                        <li>✅ Fast loading</li>
                        <li>✅ Push notifications</li>
                        <li>✅ Home screen icon</li>
                        <li>✅ Full screen mode</li>
                    </ul>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.setupPanelListeners();
    }

    setupPanelListeners() {
        document.getElementById('toggle-pwa-panel').addEventListener('click', () => {
            const panel = document.getElementById('pwa-panel');
            panel.classList.toggle('collapsed');
        });

        document.getElementById('install-app').addEventListener('click', () => this.installApp());
        document.getElementById('share-app').addEventListener('click', () => this.shareApp());
        document.getElementById('add-to-homescreen').addEventListener('click', () => this.showAddToHomeInstructions());
    }

    async installApp() {
        if (!this.deferredPrompt) {
            this.showMessage('App installation not available', 'info');
            return;
        }

        const result = await this.deferredPrompt.prompt();
        console.log('Install result:', result);

        if (result.outcome === 'accepted') {
            this.showMessage('App installed successfully!', 'success');
        }

        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    async shareApp() {
        const shareData = {
            title: 'CodeQuest - Interactive Learning Platform',
            text: 'Learn coding with interactive challenges and tutorials!',
            url: window.location.origin
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                this.fallbackShare(shareData.url);
            }
        } else {
            this.fallbackShare(shareData.url);
        }
    }

    fallbackShare(url) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showMessage('Link copied to clipboard!', 'success');
            });
        } else {
            prompt('Copy this link to share:', url);
        }
    }

    showAddToHomeInstructions() {
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        
        let instructions = '';
        
        if (isIOS) {
            instructions = `
                <h4>Add to iPhone/iPad Home Screen:</h4>
                <ol>
                    <li>Tap the Share button <span style="font-size: 1.2em;">⬆️</span></li>
                    <li>Scroll down and tap "Add to Home Screen"</li>
                    <li>Tap "Add" to confirm</li>
                </ol>
            `;
        } else if (isAndroid) {
            instructions = `
                <h4>Add to Android Home Screen:</h4>
                <ol>
                    <li>Tap the menu button <span style="font-size: 1.2em;">⋮</span></li>
                    <li>Tap "Add to Home screen"</li>
                    <li>Tap "Add" to confirm</li>
                </ol>
            `;
        } else {
            instructions = `
                <h4>Add to Desktop:</h4>
                <p>Look for the install button in your browser's address bar or use Ctrl+Shift+A (Chrome)</p>
            `;
        }

        this.showInstructionsModal(instructions);
    }

    showInstructionsModal(content) {
        const modal = document.createElement('div');
        modal.className = 'pwa-modal';
        modal.innerHTML = `
            <div class="pwa-modal-content">
                <div class="pwa-modal-header">
                    <h3>Installation Instructions</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="pwa-modal-body">
                    ${content}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    showInstallButton() {
        const installBtn = document.getElementById('install-app');
        if (installBtn) {
            installBtn.style.display = 'block';
        }
    }

    hideInstallButton() {
        const installBtn = document.getElementById('install-app');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    checkInstallStatus() {
        // Check if running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
            this.isInstalled = true;
            document.getElementById('install-status').textContent = 'Installed';
            document.getElementById('install-status').className = 'status-value installed';
        }
    }

    setupOfflineDetection() {
        const updateConnectionStatus = () => {
            const status = document.getElementById('connection-status');
            if (navigator.onLine) {
                status.textContent = 'Online';
                status.className = 'status-value online';
            } else {
                status.textContent = 'Offline';
                status.className = 'status-value offline';
                this.showMessage('You are offline. Some features may be limited.', 'warning');
            }
        };

        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        updateConnectionStatus();
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="update-popup">
                <h4>🔄 Update Available</h4>
                <p>A new version of CodeQuest is available!</p>
                <div class="update-actions">
                    <button id="update-now" class="update-btn">Update Now</button>
                    <button id="update-later" class="cancel-btn">Later</button>
                </div>
            </div>
        `;

        document.body.appendChild(notification);
        
        document.getElementById('update-now').addEventListener('click', () => {
            window.location.reload();
        });
        
        document.getElementById('update-later').addEventListener('click', () => {
            notification.remove();
        });
    }

    showInstalledMessage() {
        this.showMessage('CodeQuest installed successfully! 🎉', 'success');
    }

    showMessage(text, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'pwa-notification';
        notification.innerHTML = `
            <div class="pwa-message ${type}">
                <span>${text}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }

    // Send local notification
    sendNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                icon: '/assets/icons/icon-192x192.png',
                badge: '/assets/icons/icon-72x72.png',
                ...options
            });
        }
    }
}

// Initialize PWA manager
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
});