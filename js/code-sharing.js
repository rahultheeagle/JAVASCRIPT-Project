// Code Sharing System - Generate shareable links to solutions
class CodeSharingSystem {
    constructor() {
        this.storageManager = window.StorageManager;
        this.baseUrl = window.location.origin;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSharedCode();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const shareBtn = document.getElementById('share-code-btn');
            if (shareBtn) {
                shareBtn.addEventListener('click', () => this.shareCurrentCode());
            }
        });
    }

    generateShareableLink(codeData) {
        const shareId = this.generateShareId();
        const shareData = {
            id: shareId,
            code: codeData.code,
            language: codeData.language,
            title: codeData.title || 'Shared Code',
            author: codeData.author || 'Anonymous',
            createdAt: Date.now(),
            views: 0
        };

        // Store in localStorage with share ID
        this.storageManager?.set(`shared_code_${shareId}`, shareData);
        
        // Add to shared codes list
        const sharedCodes = this.storageManager?.get('shared_codes') || [];
        sharedCodes.push(shareId);
        this.storageManager?.set('shared_codes', sharedCodes);

        const shareUrl = `${this.baseUrl}/shared-code.html?id=${shareId}`;
        return { shareUrl, shareId, shareData };
    }

    generateShareId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    shareCurrentCode() {
        const codeEditor = document.querySelector('textarea[id*="code"], textarea[id*="html"], textarea[id*="css"], textarea[id*="js"]');
        if (!codeEditor) {
            alert('No code found to share');
            return;
        }

        const code = codeEditor.value;
        if (!code.trim()) {
            alert('Please write some code before sharing');
            return;
        }

        const language = this.detectLanguage(codeEditor.id);
        const title = prompt('Enter a title for your code:') || 'Untitled Code';
        const author = prompt('Enter your name (optional):') || 'Anonymous';

        const result = this.generateShareableLink({
            code,
            language,
            title,
            author
        });

        this.showShareDialog(result);
    }

    detectLanguage(elementId) {
        if (elementId.includes('html')) return 'html';
        if (elementId.includes('css')) return 'css';
        if (elementId.includes('js')) return 'javascript';
        return 'text';
    }

    showShareDialog(result) {
        const dialog = document.createElement('div');
        dialog.className = 'share-dialog';
        dialog.innerHTML = `
            <div class="share-modal">
                <div class="share-header">
                    <h3>🔗 Code Shared Successfully!</h3>
                    <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
                </div>
                <div class="share-content">
                    <p>Your code has been shared with ID: <strong>${result.shareId}</strong></p>
                    <div class="share-url">
                        <input type="text" value="${result.shareUrl}" readonly id="share-url-input">
                        <button onclick="navigator.clipboard.writeText('${result.shareUrl}').then(() => alert('Link copied!'))" class="copy-btn">📋 Copy</button>
                    </div>
                    <div class="share-actions">
                        <button onclick="window.open('${result.shareUrl}', '_blank')" class="btn primary-btn">🔍 View Shared Code</button>
                        <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn secondary-btn">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);
        setTimeout(() => dialog.classList.add('show'), 100);
    }

    loadSharedCode() {
        const urlParams = new URLSearchParams(window.location.search);
        const shareId = urlParams.get('id');
        
        if (shareId && window.location.pathname.includes('shared-code.html')) {
            this.displaySharedCode(shareId);
        }
    }

    displaySharedCode(shareId) {
        const shareData = this.storageManager?.get(`shared_code_${shareId}`);
        
        if (!shareData) {
            document.body.innerHTML = `
                <div class="container">
                    <h1>❌ Code Not Found</h1>
                    <p>The shared code link is invalid or has expired.</p>
                    <a href="index.html" class="btn primary-btn">← Back to Dashboard</a>
                </div>
            `;
            return;
        }

        // Increment view count
        shareData.views++;
        this.storageManager?.set(`shared_code_${shareId}`, shareData);

        document.body.innerHTML = `
            <div class="container">
                <header>
                    <h1>📤 Shared Code: ${shareData.title}</h1>
                    <nav>
                        <a href="index.html">← Dashboard</a>
                    </nav>
                </header>
                
                <div class="shared-code-container">
                    <div class="code-info">
                        <div class="info-item">
                            <strong>Author:</strong> ${shareData.author}
                        </div>
                        <div class="info-item">
                            <strong>Language:</strong> ${shareData.language}
                        </div>
                        <div class="info-item">
                            <strong>Created:</strong> ${new Date(shareData.createdAt).toLocaleDateString()}
                        </div>
                        <div class="info-item">
                            <strong>Views:</strong> ${shareData.views}
                        </div>
                    </div>
                    
                    <div class="code-display">
                        <div class="code-header">
                            <span>Code</span>
                            <button onclick="navigator.clipboard.writeText(\`${shareData.code.replace(/`/g, '\\`')}\`).then(() => alert('Code copied!'))" class="copy-code-btn">📋 Copy Code</button>
                        </div>
                        <pre><code class="language-${shareData.language}">${this.escapeHtml(shareData.code)}</code></pre>
                    </div>
                    
                    <div class="share-actions">
                        <button onclick="window.codeSharingSystem.forkCode('${shareId}')" class="btn primary-btn">🍴 Fork This Code</button>
                        <button onclick="window.open('editor.html', '_blank')" class="btn secondary-btn">✏️ Open Editor</button>
                    </div>
                </div>
            </div>
        `;
    }

    forkCode(shareId) {
        const shareData = this.storageManager?.get(`shared_code_${shareId}`);
        if (shareData) {
            // Store forked code for editor
            this.storageManager?.set('forked_code', {
                code: shareData.code,
                language: shareData.language,
                originalTitle: shareData.title,
                originalAuthor: shareData.author
            });
            
            window.open('editor.html?fork=true', '_blank');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getSharedCodes() {
        const sharedCodes = this.storageManager?.get('shared_codes') || [];
        return sharedCodes.map(id => this.storageManager?.get(`shared_code_${id}`)).filter(Boolean);
    }
}

// Initialize code sharing system
document.addEventListener('DOMContentLoaded', () => {
    window.codeSharingSystem = new CodeSharingSystem();
});