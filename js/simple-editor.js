// Simplified Code Editor
class SimpleCodeEditor {
    constructor() {
        this.htmlEditor = document.getElementById('html-editor');
        this.cssEditor = document.getElementById('css-editor');
        this.jsEditor = document.getElementById('js-editor');
        this.preview = document.getElementById('preview-frame');
        this.console = document.getElementById('error-console');
        this.currentTab = 'html';
        
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupButtons();
        this.setupAutoUpdate();
        this.updatePreview();
    }

    setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        const wrappers = document.querySelectorAll('.editor-wrapper');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const lang = tab.dataset.lang;
                
                // Update tab styles
                tabs.forEach(t => {
                    t.style.background = '#4a5568';
                });
                tab.style.background = '#667eea';
                
                // Show/hide editors
                wrappers.forEach(wrapper => {
                    wrapper.style.display = wrapper.dataset.lang === lang ? 'flex' : 'none';
                });
                
                this.currentTab = lang;
            });
        });
    }

    setupButtons() {
        // Run button
        document.getElementById('run-code')?.addEventListener('click', () => {
            this.updatePreview();
        });

        // Save button
        document.getElementById('save-code')?.addEventListener('click', () => {
            this.saveCode();
        });

        // Reset button
        document.getElementById('reset-code')?.addEventListener('click', () => {
            this.resetCode();
        });

        // Refresh preview
        document.getElementById('refresh-preview')?.addEventListener('click', () => {
            this.updatePreview();
        });

        // Clear console
        document.getElementById('clear-console')?.addEventListener('click', () => {
            this.clearConsole();
        });
    }

    setupAutoUpdate() {
        [this.htmlEditor, this.cssEditor, this.jsEditor].forEach(editor => {
            if (editor) {
                editor.addEventListener('input', () => {
                    clearTimeout(this.updateTimer);
                    this.updateTimer = setTimeout(() => {
                        this.updatePreview();
                    }, 500);
                });
            }
        });
    }

    updatePreview() {
        const html = this.htmlEditor?.value || '';
        const css = this.cssEditor?.value || '';
        const js = this.jsEditor?.value || '';

        // Show empty state if no code
        if (!html && !css && !js) {
            const emptyContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <style>
                        body { 
                            margin: 0; 
                            padding: 40px; 
                            font-family: Arial, sans-serif; 
                            text-align: center;
                            color: #666;
                            background: #f9f9f9;
                        }
                        .empty-state {
                            margin-top: 50px;
                            font-size: 18px;
                        }
                    </style>
                </head>
                <body>
                    <div class="empty-state">
                        <h2>🚀 Start Coding!</h2>
                        <p>Write HTML, CSS, or JavaScript in the editor to see live results here.</p>
                    </div>
                </body>
                </html>
            `;
            if (this.preview) {
                this.preview.srcdoc = emptyContent;
            }
            return;
        }

        const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
                <script>
                    // Capture console logs
                    (function() {
                        const originalLog = console.log;
                        const originalError = console.error;
                        const originalWarn = console.warn;
                        
                        console.log = function(...args) {
                            try {
                                parent.postMessage({type: 'log', data: args.map(String)}, '*');
                            } catch(e) {}
                            originalLog.apply(console, args);
                        };
                        
                        console.error = function(...args) {
                            try {
                                parent.postMessage({type: 'error', data: args.map(String)}, '*');
                            } catch(e) {}
                            originalError.apply(console, args);
                        };
                        
                        console.warn = function(...args) {
                            try {
                                parent.postMessage({type: 'warn', data: args.map(String)}, '*');
                            } catch(e) {}
                            originalWarn.apply(console, args);
                        };
                        
                        window.onerror = function(msg, url, line, col, error) {
                            try {
                                parent.postMessage({type: 'error', data: [msg + ' (Line: ' + line + ')']}, '*');
                            } catch(e) {}
                            return true;
                        };
                        
                        window.addEventListener('unhandledrejection', function(event) {
                            try {
                                parent.postMessage({type: 'error', data: ['Promise rejected: ' + event.reason]}, '*');
                            } catch(e) {}
                        });
                    })();
                    
                    // Execute user JavaScript
                    try {
                        ${js}
                    } catch (error) {
                        console.error('Runtime Error:', error.message);
                    }
                </script>
            </body>
            </html>
        `;

        if (this.preview) {
            this.preview.srcdoc = previewContent;
        }
    }

    saveCode() {
        const code = {
            html: this.htmlEditor?.value || '',
            css: this.cssEditor?.value || '',
            js: this.jsEditor?.value || '',
            timestamp: Date.now()
        };

        if (window.StorageManager) {
            StorageManager.set('savedCode', code);
            this.showMessage('Code saved successfully!', 'success');
        }
    }

    resetCode() {
        if (confirm('Reset all code? This cannot be undone.')) {
            if (this.htmlEditor) this.htmlEditor.value = '';
            if (this.cssEditor) this.cssEditor.value = '';
            if (this.jsEditor) this.jsEditor.value = '';
            
            this.updatePreview();
            this.showMessage('Code reset successfully!', 'info');
        }
    }

    clearConsole() {
        if (this.console) {
            this.console.innerHTML = `
                <div class="console-message info">
                    <span class="timestamp" style="color: #a0aec0; font-size: 0.8rem;">[${new Date().toLocaleTimeString()}]</span>
                    <span class="message">Console cleared</span>
                </div>
            `;
        }
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            background: ${type === 'success' ? '#48bb78' : '#667eea'};
            z-index: 1000;
            font-weight: bold;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
}

// Listen for console messages from iframe
window.addEventListener('message', (e) => {
    if (e.data.type === 'log' || e.data.type === 'error') {
        const console = document.getElementById('error-console');
        if (console) {
            const messageEl = document.createElement('div');
            messageEl.className = `console-message ${e.data.type}`;
            
            const timestamp = new Date().toLocaleTimeString();
            const message = e.data.data.join(' ');
            
            messageEl.innerHTML = `
                <span class="timestamp" style="color: #a0aec0; font-size: 0.8rem;">[${timestamp}]</span>
                <span class="message" style="color: ${e.data.type === 'error' ? '#fc8181' : '#68d391'};">${message}</span>
            `;
            
            console.appendChild(messageEl);
            console.scrollTop = console.scrollHeight;
        }
    }
});

// Initialize editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('html-editor')) {
        window.editor = new SimpleCodeEditor();
    }
});