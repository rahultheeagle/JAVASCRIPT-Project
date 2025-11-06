// Interactive Code Editor with Split-Pane Layout
class CodeEditor {
    constructor() {
        this.htmlEditor = document.getElementById('html-editor');
        this.cssEditor = document.getElementById('css-editor');
        this.jsEditor = document.getElementById('js-editor');
        this.previewFrame = document.getElementById('preview-frame');
        this.tabs = document.querySelectorAll('.tab');
        this.editors = document.querySelectorAll('.code-editor');
        this.runBtn = document.getElementById('run-code');
        this.refreshBtn = document.getElementById('refresh-preview');
        this.backBtn = document.getElementById('back-to-dashboard');
        this.resizer = document.querySelector('.resizer');
        
        this.currentTab = 'html';
        this.isResizing = false;
        
        this.initializeEditor();
        this.bindEvents();
        this.updatePreview();
    }
    
    // Initialize editor
    initializeEditor() {
        // Set initial active tab
        this.switchTab('html');
    }
    
    // Bind all event listeners
    bindEvents() {
        // Tab switching
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const lang = tab.dataset.lang;
                this.switchTab(lang);
            });
        });
        
        // Code execution
        this.runBtn.addEventListener('click', () => this.updatePreview());
        this.refreshBtn.addEventListener('click', () => this.updatePreview());
        
        // Auto-update preview on code change (with debounce)
        let updateTimeout;
        [this.htmlEditor, this.cssEditor, this.jsEditor].forEach(editor => {
            editor.addEventListener('input', () => {
                clearTimeout(updateTimeout);
                updateTimeout = setTimeout(() => this.updatePreview(), 500);
            });
        });
        
        // Back to dashboard
        this.backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Resizer functionality
        this.initializeResizer();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 'Enter':
                        e.preventDefault();
                        this.updatePreview();
                        break;
                    case '1':
                        e.preventDefault();
                        this.switchTab('html');
                        break;
                    case '2':
                        e.preventDefault();
                        this.switchTab('css');
                        break;
                    case '3':
                        e.preventDefault();
                        this.switchTab('js');
                        break;
                }
            }
        });
    }
    
    // Switch between editor tabs
    switchTab(lang) {
        this.currentTab = lang;
        
        // Update tab buttons
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.lang === lang) {
                tab.classList.add('active');
            }
        });
        
        // Update editor visibility
        this.editors.forEach(editor => {
            editor.classList.remove('active');
            if (editor.id === `${lang}-editor`) {
                editor.classList.add('active');
                editor.focus();
            }
        });
    }
    
    // Update live preview
    updatePreview() {
        const html = this.htmlEditor.value;
        const css = this.cssEditor.value;
        const js = this.jsEditor.value;
        
        // Create complete HTML document
        const fullHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    ${css}
                </style>
            </head>
            <body>
                ${html}
                <script>
                    try {
                        ${js}
                    } catch (error) {
                        console.error('JavaScript Error:', error);
                        document.body.innerHTML += '<div style="background: #ffebee; color: #c62828; padding: 10px; margin: 10px; border-radius: 4px; font-family: monospace;"><strong>JavaScript Error:</strong><br>' + error.message + '</div>';
                    }
                </script>
            </body>
            </html>
        `;
        
        // Update iframe content
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        this.previewFrame.src = url;
        
        // Clean up blob URL after loading
        this.previewFrame.onload = () => {
            URL.revokeObjectURL(url);
        };
        
        // Show run feedback
        this.showRunFeedback();
    }
    
    // Show run feedback
    showRunFeedback() {
        const originalText = this.runBtn.textContent;
        this.runBtn.textContent = '✓ Running...';
        this.runBtn.style.background = '#2196F3';
        
        setTimeout(() => {
            this.runBtn.textContent = originalText;
            this.runBtn.style.background = '#4CAF50';
        }, 800);
    }
    
    // Initialize resizer functionality
    initializeResizer() {
        const editorPane = document.querySelector('.editor-pane');
        const previewPane = document.querySelector('.preview-pane');
        const container = document.querySelector('.split-container');
        
        this.resizer.addEventListener('mousedown', (e) => {
            this.isResizing = true;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isResizing) return;
            
            const containerRect = container.getBoundingClientRect();
            const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            
            // Limit resize between 20% and 80%
            if (newLeftWidth >= 20 && newLeftWidth <= 80) {
                editorPane.style.flex = `0 0 ${newLeftWidth}%`;
                previewPane.style.flex = `0 0 ${100 - newLeftWidth}%`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        });
    }
}

// Initialize editor when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new CodeEditor();
});