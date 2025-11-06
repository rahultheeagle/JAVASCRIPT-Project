// Interactive Code Editor with Split-Pane Layout
class CodeEditor {
    constructor() {
        this.htmlEditor = document.getElementById('html-editor');
        this.cssEditor = document.getElementById('css-editor');
        this.jsEditor = document.getElementById('js-editor');
        this.htmlHighlight = document.getElementById('html-highlight');
        this.cssHighlight = document.getElementById('css-highlight');
        this.jsHighlight = document.getElementById('js-highlight');
        this.previewFrame = document.getElementById('preview-frame');
        this.tabs = document.querySelectorAll('.tab');
        this.editorWrappers = document.querySelectorAll('.editor-wrapper');
        this.runBtn = document.getElementById('run-code');
        this.refreshBtn = document.getElementById('refresh-preview');
        this.backBtn = document.getElementById('back-to-dashboard');
        this.resizer = document.querySelector('.resizer');
        this.autoRunToggle = document.getElementById('auto-run');
        this.delaySelect = document.getElementById('delay-select');
        this.executionStatus = document.getElementById('execution-status');
        
        this.currentTab = 'html';
        this.isResizing = false;
        this.isAutoRun = true;
        this.executionDelay = 300;
        this.updateTimeout = null;
        this.highlightTimeout = null;
        
        this.initializeEditor();
        this.bindEvents();
        this.updatePreview();
    }
    
    // Initialize editor
    initializeEditor() {
        // Set initial active tab
        this.switchTab('html');
        
        // Initialize syntax highlighting
        this.initializeSyntaxHighlighting();
    }
    
    // Initialize syntax highlighting
    initializeSyntaxHighlighting() {
        // Wait for Prism to load
        if (typeof Prism !== 'undefined') {
            this.updateAllHighlighting();
        } else {
            setTimeout(() => this.initializeSyntaxHighlighting(), 100);
        }
    }
    
    // Update syntax highlighting for all editors
    updateAllHighlighting() {
        this.updateHighlighting('html', this.htmlEditor.value, this.htmlHighlight);
        this.updateHighlighting('css', this.cssEditor.value, this.cssHighlight);
        this.updateHighlighting('javascript', this.jsEditor.value, this.jsHighlight);
    }
    
    // Update syntax highlighting for specific language
    updateHighlighting(language, code, highlightElement) {
        if (typeof Prism !== 'undefined') {
            highlightElement.textContent = code;
            highlightElement.className = `language-${language}`;
            Prism.highlightElement(highlightElement);
        }
    }
    
    // Handle code changes with real-time execution
    handleCodeChange(language, code, highlightElement) {
        // Update syntax highlighting immediately
        clearTimeout(this.highlightTimeout);
        this.highlightTimeout = setTimeout(() => {
            this.updateHighlighting(language, code, highlightElement);
        }, 50);
        
        // Update preview if auto-run is enabled
        if (this.isAutoRun) {
            this.setExecutionStatus('running', '⏳ Executing...');
            clearTimeout(this.updateTimeout);
            this.updateTimeout = setTimeout(() => {
                this.updatePreview();
            }, this.executionDelay);
        }
    }
    
    // Set execution status
    setExecutionStatus(status, text) {
        this.executionStatus.className = `status-indicator ${status}`;
        this.executionStatus.textContent = text;
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
        
        // Real-time code execution and syntax highlighting
        this.htmlEditor.addEventListener('input', () => {
            this.handleCodeChange('html', this.htmlEditor.value, this.htmlHighlight);
        });
        
        this.cssEditor.addEventListener('input', () => {
            this.handleCodeChange('css', this.cssEditor.value, this.cssHighlight);
        });
        
        this.jsEditor.addEventListener('input', () => {
            this.handleCodeChange('javascript', this.jsEditor.value, this.jsHighlight);
        });
        
        // Back to dashboard
        this.backBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
        
        // Auto-run toggle
        this.autoRunToggle.addEventListener('change', (e) => {
            this.isAutoRun = e.target.checked;
            if (this.isAutoRun) {
                this.updatePreview();
            }
        });
        
        // Execution delay selector
        this.delaySelect.addEventListener('change', (e) => {
            this.executionDelay = parseInt(e.target.value);
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
        
        // Update editor wrapper visibility
        this.editorWrappers.forEach(wrapper => {
            wrapper.classList.remove('active');
            if (wrapper.dataset.lang === lang) {
                wrapper.classList.add('active');
                const editor = wrapper.querySelector('.code-editor');
                editor.focus();
            }
        });
    }
    
    // Update live preview with enhanced error handling
    updatePreview() {
        try {
            const html = this.htmlEditor.value;
            const css = this.cssEditor.value;
            const js = this.jsEditor.value;
            
            // Create complete HTML document with enhanced error handling
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
                        // Enhanced error handling
                        window.onerror = function(msg, url, line, col, error) {
                            const errorDiv = document.createElement('div');
                            errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 10px; margin: 10px; border-radius: 4px; font-family: monospace; border-left: 4px solid #c62828;';
                            errorDiv.innerHTML = '<strong>⚠ JavaScript Error:</strong><br>' + msg + '<br><small>Line: ' + line + ', Column: ' + col + '</small>';
                            document.body.appendChild(errorDiv);
                            return true;
                        };
                        
                        try {
                            ${js}
                        } catch (error) {
                            console.error('JavaScript Error:', error);
                            const errorDiv = document.createElement('div');
                            errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 10px; margin: 10px; border-radius: 4px; font-family: monospace; border-left: 4px solid #c62828;';
                            errorDiv.innerHTML = '<strong>⚠ JavaScript Error:</strong><br>' + error.message;
                            document.body.appendChild(errorDiv);
                        }
                    </script>
                </body>
                </html>
            `;
            
            // Update iframe content
            const blob = new Blob([fullHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            this.previewFrame.src = url;
            
            // Clean up blob URL and update status after loading
            this.previewFrame.onload = () => {
                URL.revokeObjectURL(url);
                this.setExecutionStatus('ready', '✓ Ready');
            };
            
            this.previewFrame.onerror = () => {
                this.setExecutionStatus('error', '⚠ Error');
            };
            
            // Show run feedback
            this.showRunFeedback();
            
        } catch (error) {
            console.error('Preview update error:', error);
            this.setExecutionStatus('error', '⚠ Error');
        }
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