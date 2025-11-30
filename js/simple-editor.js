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
                            padding: 0;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            min-height: 100vh;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .empty-state {
                            text-align: center;
                            color: white;
                            padding: 40px;
                            background: rgba(255, 255, 255, 0.1);
                            border-radius: 20px;
                            backdrop-filter: blur(10px);
                            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                        }
                        .empty-state h2 {
                            font-size: 2.5rem;
                            margin-bottom: 20px;
                            background: linear-gradient(45deg, #fbbf24, #f59e0b);
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                            background-clip: text;
                        }
                        .empty-state p {
                            font-size: 1.2rem;
                            opacity: 0.9;
                            line-height: 1.6;
                        }
                    </style>
                </head>
                <body>
                    <div class="empty-state">
                        <h2>🚀 Start Coding!</h2>
                        <p>Write HTML, CSS, or JavaScript in the editor to see live results here.</p>
                        <p style="font-size: 1rem; margin-top: 20px; opacity: 0.7;">Your code will appear instantly as you type</p>
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
        if (confirm('Reset all code? This will clear HTML, CSS, and JavaScript sections.')) {
            // Clear all editors completely
            if (this.htmlEditor) {
                this.htmlEditor.value = '';
                this.htmlEditor.placeholder = 'Write your HTML code here...';
            }
            if (this.cssEditor) {
                this.cssEditor.value = '';
                this.cssEditor.placeholder = 'Write your CSS code here...';
            }
            if (this.jsEditor) {
                this.jsEditor.value = '';
                this.jsEditor.placeholder = 'Write your JavaScript code here...';
            }
            
            // Clear console
            this.clearConsole();
            
            // Update preview to show empty state
            this.updatePreview();
            
            // Remove any saved code
            if (window.StorageManager) {
                StorageManager.remove('savedCode');
            }
            
            this.showMessage('All code sections cleared successfully!', 'success');
        }
    }

    clearConsole() {
        if (this.console) {
            this.console.innerHTML = `
                <div class="console-message info">
                    <span class="timestamp" style="color: #94a3b8; font-size: 0.8rem;">[${new Date().toLocaleTimeString()}]</span>
                    <span class="message" style="color: #10b981;">Console cleared - Ready for new output</span>
                </div>
            `;
        }
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 30px;
            right: 30px;
            padding: 16px 24px;
            border-radius: 12px;
            color: white;
            background: ${type === 'success' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'};
            z-index: 1000;
            font-weight: 600;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
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
                <span class="timestamp" style="color: #94a3b8; font-size: 0.8rem;">[${timestamp}]</span>
                <span class="message" style="color: ${e.data.type === 'error' ? '#f87171' : '#34d399'};">${message}</span>
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