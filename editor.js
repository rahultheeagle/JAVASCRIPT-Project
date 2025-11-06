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
        this.errorConsole = document.getElementById('error-console');
        this.clearConsoleBtn = document.getElementById('clear-console');
        this.toggleConsoleBtn = document.getElementById('toggle-console');
        this.consoleSection = document.querySelector('.console-section');
        this.saveStatus = document.getElementById('save-status');
        this.saveBtn = document.getElementById('save-code');
        this.loadBtn = document.getElementById('load-code');
        this.formatBtn = document.getElementById('format-code');
        this.resetBtn = document.getElementById('reset-code');
        
        this.currentTab = 'html';
        this.isResizing = false;
        this.isAutoRun = true;
        this.executionDelay = 300;
        this.updateTimeout = null;
        this.highlightTimeout = null;
        this.consoleVisible = true;
        this.autoSaveTimeout = null;
        this.lastSavedContent = { html: '', css: '', js: '' };
        
        // Default template content
        this.defaultTemplate = {
            html: `<!DOCTYPE html>
<html>
<head>
    <title>My Project</title>
</head>
<body>
    <h1>Hello CodeQuest!</h1>
    <p>Start coding here...</p>
</body>
</html>`,
            css: `body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}`,
            js: `console.log('Welcome to CodeQuest!');

// Your JavaScript code here`
        };
        
        this.initializeEditor();
        this.bindEvents();
        this.setupConsoleListener();
        this.updatePreview();
    }
    
    // Setup console message listener
    setupConsoleListener() {
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'console') {
                this.addConsoleMessage(event.data.level, event.data.message);
            }
        });
    }
    
    // Initialize editor
    initializeEditor() {
        // Set initial active tab
        this.switchTab('html');
        
        // Initialize syntax highlighting
        this.initializeSyntaxHighlighting();
        
        // Load saved content
        this.loadSavedContent();
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
    
    // Handle code changes with real-time execution and auto-save
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
        
        // Auto-save functionality
        this.setSaveStatus('unsaved', '✏ Unsaved');
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.autoSave();
        }, 2000); // Auto-save after 2 seconds of inactivity
    }
    
    // Set execution status
    setExecutionStatus(status, text) {
        this.executionStatus.className = `status-indicator ${status}`;
        this.executionStatus.textContent = text;
    }
    
    // Add message to console
    addConsoleMessage(type, message, details = '') {
        const timestamp = new Date().toLocaleTimeString();
        const messageDiv = document.createElement('div');
        messageDiv.className = `console-message ${type}`;
        
        messageDiv.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="message">${message}</span>
            ${details ? `<div class="error-details">${details}</div>` : ''}
        `;
        
        this.errorConsole.appendChild(messageDiv);
        this.errorConsole.scrollTop = this.errorConsole.scrollHeight;
        
        // Limit console messages to 100
        const messages = this.errorConsole.querySelectorAll('.console-message');
        if (messages.length > 100) {
            messages[0].remove();
        }
    }
    
    // Clear console
    clearConsole() {
        this.errorConsole.innerHTML = `
            <div class="console-message info">
                <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                <span class="message">Console cleared</span>
            </div>
        `;
    }
    
    // Toggle console visibility
    toggleConsole() {
        this.consoleVisible = !this.consoleVisible;
        if (this.consoleVisible) {
            this.consoleSection.classList.remove('hidden');
            this.toggleConsoleBtn.textContent = 'Hide';
        } else {
            this.consoleSection.classList.add('hidden');
            this.toggleConsoleBtn.textContent = 'Show';
        }
    }
    
    // Set save status
    setSaveStatus(status, text) {
        this.saveStatus.className = `save-status ${status}`;
        this.saveStatus.textContent = text;
    }
    
    // Auto-save to localStorage
    autoSave() {
        const currentContent = {
            html: this.htmlEditor.value,
            css: this.cssEditor.value,
            js: this.jsEditor.value
        };
        
        // Only save if content has changed
        if (JSON.stringify(currentContent) !== JSON.stringify(this.lastSavedContent)) {
            this.setSaveStatus('saving', '💾 Saving...');
            
            setTimeout(() => {
                localStorage.setItem('codequest_editor_autosave', JSON.stringify({
                    ...currentContent,
                    timestamp: new Date().toISOString()
                }));
                
                this.lastSavedContent = { ...currentContent };
                this.setSaveStatus('saved', '✓ Auto-saved');
                
                setTimeout(() => {
                    this.setSaveStatus('saved', '✓ Saved');
                }, 1500);
            }, 300);
        }
    }
    
    // Manual save to localStorage
    saveToStorage() {
        this.setSaveStatus('saving', '💾 Saving...');
        
        const content = {
            html: this.htmlEditor.value,
            css: this.cssEditor.value,
            js: this.jsEditor.value,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('codequest_editor_manual', JSON.stringify(content));
        localStorage.setItem('codequest_editor_autosave', JSON.stringify(content));
        
        this.lastSavedContent = {
            html: content.html,
            css: content.css,
            js: content.js
        };
        
        setTimeout(() => {
            this.setSaveStatus('saved', '✓ Saved manually');
            this.addConsoleMessage('info', 'Code saved to local storage');
            
            setTimeout(() => {
                this.setSaveStatus('saved', '✓ Saved');
            }, 2000);
        }, 300);
    }
    
    // Load from localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('codequest_editor_manual') || localStorage.getItem('codequest_editor_autosave');
        
        if (saved) {
            try {
                const content = JSON.parse(saved);
                
                this.htmlEditor.value = content.html || '';
                this.cssEditor.value = content.css || '';
                this.jsEditor.value = content.js || '';
                
                this.updateAllHighlighting();
                if (this.isAutoRun) {
                    this.updatePreview();
                }
                
                this.lastSavedContent = {
                    html: content.html || '',
                    css: content.css || '',
                    js: content.js || ''
                };
                
                const saveDate = new Date(content.timestamp).toLocaleString();
                this.addConsoleMessage('info', `Code loaded from ${saveDate}`);
                this.setSaveStatus('saved', '✓ Loaded');
                
                setTimeout(() => {
                    this.setSaveStatus('saved', '✓ Saved');
                }, 2000);
                
            } catch (error) {
                this.addConsoleMessage('error', 'Failed to load saved code: ' + error.message);
            }
        } else {
            this.addConsoleMessage('warn', 'No saved code found');
        }
    }
    
    // Load saved content on initialization
    loadSavedContent() {
        const autoSaved = localStorage.getItem('codequest_editor_autosave');
        
        if (autoSaved) {
            try {
                const content = JSON.parse(autoSaved);
                
                this.htmlEditor.value = content.html || this.defaultTemplate.html;
                this.cssEditor.value = content.css || this.defaultTemplate.css;
                this.jsEditor.value = content.js || this.defaultTemplate.js;
                
                this.lastSavedContent = {
                    html: content.html || this.defaultTemplate.html,
                    css: content.css || this.defaultTemplate.css,
                    js: content.js || this.defaultTemplate.js
                };
                
                this.setSaveStatus('saved', '✓ Restored');
                setTimeout(() => {
                    this.setSaveStatus('saved', '✓ Saved');
                }, 2000);
                
            } catch (error) {
                console.error('Failed to load auto-saved content:', error);
                this.setDefaultTemplate();
            }
        } else {
            // No saved content, use default template
            this.setDefaultTemplate();
        }
    }
    
    // Set default template content
    setDefaultTemplate() {
        this.htmlEditor.value = this.defaultTemplate.html;
        this.cssEditor.value = this.defaultTemplate.css;
        this.jsEditor.value = this.defaultTemplate.js;
        
        this.lastSavedContent = {
            html: this.defaultTemplate.html,
            css: this.defaultTemplate.css,
            js: this.defaultTemplate.js
        };
        
        this.setSaveStatus('saved', '✓ Template loaded');
        setTimeout(() => {
            this.setSaveStatus('saved', '✓ Saved');
        }, 2000);
    }
    
    // Format current active code
    formatCurrentCode() {
        this.formatBtn.classList.add('formatting');
        this.formatBtn.textContent = '✨ Formatting...';
        
        setTimeout(() => {
            try {
                switch(this.currentTab) {
                    case 'html':
                        this.formatHTML();
                        break;
                    case 'css':
                        this.formatCSS();
                        break;
                    case 'js':
                        this.formatJavaScript();
                        break;
                }
                
                this.addConsoleMessage('info', `${this.currentTab.toUpperCase()} code formatted`);
                
            } catch (error) {
                this.addConsoleMessage('error', 'Formatting failed: ' + error.message);
            }
            
            this.formatBtn.classList.remove('formatting');
            this.formatBtn.textContent = '✨ Format';
        }, 300);
    }
    
    // Format HTML code
    formatHTML() {
        const html = this.htmlEditor.value;
        const formatted = this.formatHTMLString(html);
        this.htmlEditor.value = formatted;
        this.updateHighlighting('html', formatted, this.htmlHighlight);
        this.triggerAutoSave();
    }
    
    // Format CSS code
    formatCSS() {
        const css = this.cssEditor.value;
        const formatted = this.formatCSSString(css);
        this.cssEditor.value = formatted;
        this.updateHighlighting('css', formatted, this.cssHighlight);
        this.triggerAutoSave();
    }
    
    // Format JavaScript code
    formatJavaScript() {
        const js = this.jsEditor.value;
        const formatted = this.formatJSString(js);
        this.jsEditor.value = formatted;
        this.updateHighlighting('javascript', formatted, this.jsHighlight);
        this.triggerAutoSave();
    }
    
    // Simple HTML formatter
    formatHTMLString(html) {
        let formatted = html.replace(/></g, '>\n<');
        let indent = 0;
        const lines = formatted.split('\n');
        
        return lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            
            if (trimmed.startsWith('</')) {
                indent = Math.max(0, indent - 1);
            }
            
            const result = '  '.repeat(indent) + trimmed;
            
            if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>') && !this.isSelfClosingTag(trimmed)) {
                indent++;
            }
            
            return result;
        }).join('\n');
    }
    
    // Simple CSS formatter
    formatCSSString(css) {
        return css
            .replace(/\{/g, ' {\n  ')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n  ')
            .replace(/,/g, ',\n')
            .replace(/\n\s*\n/g, '\n')
            .replace(/^\s+/gm, (match, offset, string) => {
                const line = string.substring(0, offset).split('\n').pop();
                if (line.includes('{') && !line.includes('}')) {
                    return '  ';
                }
                return '';
            })
            .trim();
    }
    
    // Simple JavaScript formatter
    formatJSString(js) {
        let formatted = js;
        let indent = 0;
        
        // Basic formatting rules
        formatted = formatted
            .replace(/\{/g, ' {\n')
            .replace(/\}/g, '\n}\n')
            .replace(/;/g, ';\n')
            .replace(/,/g, ', ')
            .replace(/\n\s*\n/g, '\n');
        
        const lines = formatted.split('\n');
        
        return lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return '';
            
            if (trimmed.includes('}')) {
                indent = Math.max(0, indent - 1);
            }
            
            const result = '  '.repeat(indent) + trimmed;
            
            if (trimmed.includes('{')) {
                indent++;
            }
            
            return result;
        }).join('\n');
    }
    
    // Check if HTML tag is self-closing
    isSelfClosingTag(tag) {
        const selfClosing = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
        const tagName = tag.match(/<(\w+)/)?.[1]?.toLowerCase();
        return selfClosing.includes(tagName) || tag.endsWith('/>');
    }
    
    // Trigger auto-save after formatting
    triggerAutoSave() {
        this.setSaveStatus('unsaved', '✏ Unsaved');
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.autoSave();
        }, 1000);
    }
    
    // Show reset confirmation dialog
    showResetConfirmation() {
        const hasUnsavedChanges = this.hasUnsavedChanges();
        const message = hasUnsavedChanges 
            ? 'Are you sure you want to reset to template? You have unsaved changes that will be lost.'
            : 'Are you sure you want to reset to the default template?';
        
        if (confirm(message)) {
            this.resetToTemplate();
        }
    }
    
    // Check if there are unsaved changes
    hasUnsavedChanges() {
        const currentContent = {
            html: this.htmlEditor.value,
            css: this.cssEditor.value,
            js: this.jsEditor.value
        };
        
        return JSON.stringify(currentContent) !== JSON.stringify(this.lastSavedContent);
    }
    
    // Reset to default template
    resetToTemplate() {
        this.resetBtn.classList.add('resetting');
        this.resetBtn.textContent = '🔄 Resetting...';
        
        setTimeout(() => {
            // Set template content
            this.htmlEditor.value = this.defaultTemplate.html;
            this.cssEditor.value = this.defaultTemplate.css;
            this.jsEditor.value = this.defaultTemplate.js;
            
            // Update syntax highlighting
            this.updateAllHighlighting();
            
            // Update preview if auto-run is enabled
            if (this.isAutoRun) {
                this.updatePreview();
            }
            
            // Clear console
            this.clearConsole();
            
            // Update save status
            this.lastSavedContent = {
                html: this.defaultTemplate.html,
                css: this.defaultTemplate.css,
                js: this.defaultTemplate.js
            };
            
            this.setSaveStatus('saved', '✓ Reset to template');
            this.addConsoleMessage('info', 'Code reset to default template');
            
            // Auto-save the template
            setTimeout(() => {
                this.autoSave();
            }, 500);
            
            setTimeout(() => {
                this.setSaveStatus('saved', '✓ Saved');
            }, 2000);
            
            this.resetBtn.classList.remove('resetting');
            this.resetBtn.textContent = '🔄 Reset';
            
        }, 300);
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
        
        // Console controls
        this.clearConsoleBtn.addEventListener('click', () => {
            this.clearConsole();
        });
        
        this.toggleConsoleBtn.addEventListener('click', () => {
            this.toggleConsole();
        });
        
        // Save/Load controls
        this.saveBtn.addEventListener('click', () => {
            this.saveToStorage();
        });
        
        this.loadBtn.addEventListener('click', () => {
            this.loadFromStorage();
        });
        
        this.formatBtn.addEventListener('click', () => {
            this.formatCurrentCode();
        });
        
        this.resetBtn.addEventListener('click', () => {
            this.showResetConfirmation();
        });
        
        // Keyboard shortcuts for save/load/format
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 's') {
                    e.preventDefault();
                    this.saveToStorage();
                } else if (e.key === 'f' && e.shiftKey) {
                    e.preventDefault();
                    this.formatCurrentCode();
                }
            }
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
            
            // Clear previous execution messages
            this.addConsoleMessage('info', 'Code executed');
            
            // Create complete HTML document with console integration
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
                        // Console integration
                        const originalConsole = {
                            log: console.log,
                            error: console.error,
                            warn: console.warn,
                            info: console.info
                        };
                        
                        // Override console methods to send to parent
                        console.log = function(...args) {
                            originalConsole.log.apply(console, args);
                            parent.postMessage({type: 'console', level: 'log', message: args.join(' ')}, '*');
                        };
                        
                        console.error = function(...args) {
                            originalConsole.error.apply(console, args);
                            parent.postMessage({type: 'console', level: 'error', message: args.join(' ')}, '*');
                        };
                        
                        console.warn = function(...args) {
                            originalConsole.warn.apply(console, args);
                            parent.postMessage({type: 'console', level: 'warn', message: args.join(' ')}, '*');
                        };
                        
                        console.info = function(...args) {
                            originalConsole.info.apply(console, args);
                            parent.postMessage({type: 'console', level: 'info', message: args.join(' ')}, '*');
                        };
                        
                        // Enhanced error handling
                        window.onerror = function(msg, url, line, col, error) {
                            const errorMsg = msg + (line ? ' (Line: ' + line + ', Column: ' + col + ')' : '');
                            parent.postMessage({type: 'console', level: 'error', message: errorMsg}, '*');
                            
                            const errorDiv = document.createElement('div');
                            errorDiv.style.cssText = 'background: #ffebee; color: #c62828; padding: 10px; margin: 10px; border-radius: 4px; font-family: monospace; border-left: 4px solid #c62828;';
                            errorDiv.innerHTML = '<strong>⚠ JavaScript Error:</strong><br>' + msg + '<br><small>Line: ' + line + ', Column: ' + col + '</small>';
                            document.body.appendChild(errorDiv);
                            return true;
                        };
                        
                        window.addEventListener('unhandledrejection', function(event) {
                            parent.postMessage({type: 'console', level: 'error', message: 'Unhandled Promise Rejection: ' + event.reason}, '*');
                        });
                        
                        try {
                            ${js}
                        } catch (error) {
                            const errorMsg = 'JavaScript Error: ' + error.message + (error.stack ? '\n' + error.stack : '');
                            parent.postMessage({type: 'console', level: 'error', message: errorMsg}, '*');
                            
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