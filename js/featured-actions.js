// Featured Actions - PWA Install and Certificates
class FeaturedActions {
    constructor() {
        this.init();
    }

    init() {
        this.setupPWAInstall();
        this.setupCertificates();
    }

    setupPWAInstall() {
        const installBtn = document.getElementById('install-app');
        let deferredPrompt;

        // Listen for beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBtn.style.display = 'flex';
        });

        installBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                
                if (outcome === 'accepted') {
                    this.showNotification('App installed successfully! 📱', 'success');
                }
                deferredPrompt = null;
            } else {
                // Show manual install instructions
                this.showInstallInstructions();
            }
        });

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            installBtn.innerHTML = `
                <div class="featured-icon">✅</div>
                <div class="featured-content">
                    <h4>App Installed</h4>
                    <p>CodeQuest is ready to use offline</p>
                    <span class="featured-badge">Active</span>
                </div>
            `;
        }
    }

    setupCertificates() {
        const certBtn = document.getElementById('view-certificates');
        
        certBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.openCertificatesModal();
        });
    }

    showInstallInstructions() {
        const modal = document.createElement('div');
        modal.className = 'install-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>📱 Install CodeQuest App</h3>
                <div class="install-steps">
                    <div class="step">
                        <strong>Chrome/Edge:</strong> Click menu → "Install CodeQuest"
                    </div>
                    <div class="step">
                        <strong>Safari:</strong> Share → "Add to Home Screen"
                    </div>
                    <div class="step">
                        <strong>Firefox:</strong> Menu → "Install" or "Add to Home Screen"
                    </div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Got it!</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    openCertificatesModal() {
        const modal = document.createElement('div');
        modal.className = 'certificates-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🏆 Your Certificates</h3>
                    <button class="close-btn" onclick="this.closest('.certificates-modal').remove()">×</button>
                </div>
                <div class="certificates-grid">
                    ${this.generateCertificateCards()}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    generateCertificateCards() {
        const certificates = [
            { name: 'HTML Fundamentals', progress: 80, earned: false },
            { name: 'CSS Mastery', progress: 60, earned: false },
            { name: 'JavaScript Basics', progress: 100, earned: true },
            { name: 'Web Development', progress: 45, earned: false }
        ];

        return certificates.map(cert => `
            <div class="cert-card ${cert.earned ? 'earned' : ''}">
                <div class="cert-icon">${cert.earned ? '🏆' : '📜'}</div>
                <h4>${cert.name}</h4>
                <div class="cert-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${cert.progress}%"></div>
                    </div>
                    <span>${cert.progress}%</span>
                </div>
                ${cert.earned ? 
                    '<button class="download-btn">Download PDF</button>' : 
                    '<span class="requirement">Complete more challenges</span>'
                }
            </div>
        `).join('');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeaturedActions();
});

// Add required CSS
const style = document.createElement('style');
style.textContent = `
    .install-modal, .certificates-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    
    .install-modal .modal-content, .certificates-modal .modal-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .install-steps .step {
        padding: 10px;
        margin: 10px 0;
        background: #f3f4f6;
        border-radius: 6px;
    }
    
    .certificates-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 20px;
    }
    
    .cert-card {
        padding: 20px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .cert-card.earned {
        border-color: #10b981;
        background: #f0fdf4;
    }
    
    .cert-icon {
        font-size: 2rem;
        margin-bottom: 10px;
    }
    
    .cert-progress {
        margin: 15px 0;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e5e7eb;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 5px;
    }
    
    .progress-fill {
        height: 100%;
        background: #3b82f6;
        transition: width 0.3s ease;
    }
    
    .download-btn {
        background: #10b981;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
    }
    
    .requirement {
        color: #6b7280;
        font-size: 0.9rem;
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);