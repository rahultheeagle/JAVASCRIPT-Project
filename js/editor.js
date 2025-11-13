// Code Editor JavaScript with Syntax Highlighting
class CodeEditor {
    constructor() {
        this.htmlEditor = document.getElementById('html-editor');
        this.cssEditor = document.getElementById('css-editor');
        this.jsEditor = document.getElementById('js-editor');
        this.preview = document.getElementById('preview-frame');
        this.console = document.getElementById('error-console');
        
        this.highlightElements = {
            html: document.getElementById('html-highlight'),
            css: document.getElementById('css-highlight'),
            js: document.getElementById('js-highlight')
        };
        
        this.lineNumberElements = {
            html: document.getElementById('html-line-numbers'),
            css: document.getElementById('css-line-numbers'),
            js: document.getElementById('js-line-numbers')
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedCode();
        this.initSyntaxHighlighting();
        this.updatePreview();
    }

    setupEventListeners() {
        [this.htmlEditor, this.cssEditor, this.jsEditor].forEach((editor, index) => {
            if (editor) {
                const lang = ['html', 'css', 'js'][index];
                editor.addEventListener('input', () => {
                    this.updateSyntaxHighlight(lang, editor.value);
                    this.updateLineNumbers(lang, editor.value);
                    this.debouncePreview();
                    this.autoSave();
                });
                
                // Sync scroll between editor, highlight, and line numbers
                editor.addEventListener('scroll', () => {
                    const highlight = this.highlightElements[lang];
                    const lineNumbers = this.lineNumberElements[lang];
                    
                    if (highlight) {
                        highlight.parentElement.scrollTop = editor.scrollTop;
                        highlight.parentElement.scrollLeft = editor.scrollLeft;
                    }
                    
                    if (lineNumbers) {
                        lineNumbers.scrollTop = editor.scrollTop;
                    }
                });
            }
        });

        // Listen for console messages from iframe
        window.addEventListener('message', (e) => {
            if (e.data.type === 'log' || e.data.type === 'error') {
                this.addConsoleMessage(e.data.type, e.data.data.join(' '));
            }
        });

        // Manual refresh button
        document.getElementById('refresh-preview')?.addEventListener('click', () => {
            this.updatePreview();
        });

        // Clear console button
        document.getElementById('clear-console')?.addEventListener('click', () => {
            this.clearConsole();
        });

        // Validate code button
        document.getElementById('validate-solution')?.addEventListener('click', () => {
            this.runValidation();
        });

        // Toolbar buttons
        document.getElementById('run-btn')?.addEventListener('click', () => this.updatePreview());
        document.getElementById('save-btn')?.addEventListener('click', () => this.saveCode());
        document.getElementById('reset-btn')?.addEventListener('click', () => this.resetCode());
        document.getElementById('format-btn')?.addEventListener('click', () => this.formatCode());
    }

    updatePreview() {
        const html = this.htmlEditor?.value || '';
        const css = this.cssEditor?.value || '';
        const js = this.jsEditor?.value || '';

        const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { margin: 0; padding: 10px; font-family: Arial, sans-serif; }
                    ${css}
                </style>
            </head>
            <body>
                ${html}
                <script>
                    // Capture console logs and errors
                    const originalLog = console.log;
                    const originalError = console.error;
                    
                    console.log = function(...args) {
                        parent.postMessage({type: 'log', data: args}, '*');
                        originalLog.apply(console, args);
                    };
                    
                    console.error = function(...args) {
                        parent.postMessage({type: 'error', data: args}, '*');
                        originalError.apply(console, args);
                    };
                    
                    window.onerror = function(msg, url, line, col, error) {
                        parent.postMessage({type: 'error', data: [msg + ' (Line: ' + line + ')']}, '*');
                        return true;
                    };
                    
                    window.addEventListener('unhandledrejection', function(event) {
                        parent.postMessage({type: 'error', data: ['Promise rejected: ' + event.reason]}, '*');
                    });
                    
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
            this.updateStatus('✓ Preview Updated');
        }
    }

    saveCode() {
        const code = {
            html: this.htmlEditor?.value || '',
            css: this.cssEditor?.value || '',
            js: this.jsEditor?.value || '',
            timestamp: Date.now()
        };

        StorageManager.set('savedCode', code);
        this.showMessage('Code saved successfully!', 'success');
    }

    loadSavedCode() {
        const saved = StorageManager.get('savedCode');
        if (saved) {
            if (this.htmlEditor) this.htmlEditor.value = saved.html || '';
            if (this.cssEditor) this.cssEditor.value = saved.css || '';
            if (this.jsEditor) this.jsEditor.value = saved.js || '';
        }
    }

    autoSave() {
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            this.saveCode();
        }, 2000);
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

    formatCode() {
        // Simple code formatting
        if (this.htmlEditor) {
            this.htmlEditor.value = this.formatHTML(this.htmlEditor.value);
        }
        if (this.cssEditor) {
            this.cssEditor.value = this.formatCSS(this.cssEditor.value);
        }
        this.updatePreview();
        this.showMessage('Code formatted!', 'success');
    }

    formatHTML(html) {
        return html.replace(/></g, '>\n<').replace(/^\s+|\s+$/g, '');
    }

    formatCSS(css) {
        return css.replace(/;/g, ';\n').replace(/{/g, ' {\n').replace(/}/g, '\n}\n');
    }

    updateSyntaxHighlight(lang, code) {
        const highlight = this.highlightElements[lang];
        if (highlight && window.Prism) {
            highlight.textContent = code;
            Prism.highlightElement(highlight);
        }
    }

    updateLineNumbers(lang, code) {
        const lineNumbers = this.lineNumberElements[lang];
        if (!lineNumbers) return;
        
        const lines = code.split('\n').length;
        const numbers = Array.from({length: lines}, (_, i) => i + 1).join('\n');
        lineNumbers.textContent = numbers;
    }

    initSyntaxHighlighting() {
        // Initialize syntax highlighting and line numbers for all editors
        if (this.htmlEditor) {
            this.updateSyntaxHighlight('html', this.htmlEditor.value);
            this.updateLineNumbers('html', this.htmlEditor.value);
        }
        if (this.cssEditor) {
            this.updateSyntaxHighlight('css', this.cssEditor.value);
            this.updateLineNumbers('css', this.cssEditor.value);
        }
        if (this.jsEditor) {
            this.updateSyntaxHighlight('js', this.jsEditor.value);
            this.updateLineNumbers('js', this.jsEditor.value);
        }
    }

    debouncePreview() {
        clearTimeout(this.previewTimer);
        this.updateStatus('⏳ Updating...');
        this.previewTimer = setTimeout(() => {
            this.updatePreview();
        }, 300);
    }

    updateStatus(text) {
        const status = document.getElementById('execution-status');
        if (status) status.textContent = text;
    }

    addConsoleMessage(type, message) {
        const console = this.console;
        if (!console) return;

        const messageEl = document.createElement('div');
        messageEl.className = `console-message ${type}`;
        
        const timestamp = new Date().toLocaleTimeString();
        const sanitizedMessage = this.sanitizeMessage(message);
        
        messageEl.innerHTML = `
            <span class="timestamp">[${timestamp}]</span>
            <span class="message">${sanitizedMessage}</span>
        `;
        
        console.appendChild(messageEl);
        console.scrollTop = console.scrollHeight;
        
        // Update error count
        if (type === 'error') {
            this.updateErrorCount();
        }
    }

    sanitizeMessage(message) {
        return String(message)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    updateErrorCount() {
        const errors = this.console?.querySelectorAll('.console-message.error').length || 0;
        const status = document.getElementById('execution-status');
        if (status && errors > 0) {
            status.textContent = `⚠️ ${errors} Error${errors > 1 ? 's' : ''}`;
            status.style.background = '#e53e3e';
        }
    }

    validateCode() {
        const errors = [];
        
        // HTML validation
        const html = this.htmlEditor?.value || '';
        if (html && !html.includes('<!DOCTYPE')) {
            errors.push({type: 'warning', message: 'Missing DOCTYPE declaration'});
        }
        
        // CSS validation
        const css = this.cssEditor?.value || '';
        const cssErrors = this.validateCSS(css);
        errors.push(...cssErrors);
        
        // JS validation
        const js = this.jsEditor?.value || '';
        const jsErrors = this.validateJS(js);
        errors.push(...jsErrors);
        
        return errors;
    }

    validateCSS(css) {
        const errors = [];
        const lines = css.split('\n');
        
        lines.forEach((line, index) => {
            if (line.includes('{') && !line.includes('}') && !lines[index + 1]?.includes('}')) {
                // Simple check for unclosed braces
            }
        });
        
        return errors;
    }

    validateJS(js) {
        const errors = [];
        
        try {
            new Function(js);
        } catch (error) {
            errors.push({
                type: 'error',
                message: `Syntax Error: ${error.message}`
            });
        }
        
        return errors;
    }

    clearConsole() {
        if (this.console) {
            this.console.innerHTML = `
                <div class="console-message info">
                    <span class="timestamp">[${new Date().toLocaleTimeString()}]</span>
                    <span class="message">Console cleared</span>
                </div>
            `;
        }
        
        // Reset error count
        const status = document.getElementById('execution-status');
        if (status) {
            status.textContent = '✓ Ready';
            status.style.background = '#48bb78';
        }
    }

    runValidation() {
        const errors = this.validateCode();
        const resultsDiv = document.getElementById('validation-results');
        
        if (!resultsDiv) return;
        
        if (errors.length === 0) {
            resultsDiv.innerHTML = `
                <div class="validation-success">
                    <span class="validation-icon">✓</span>
                    <span>No errors found! Code looks good.</span>
                </div>
            `;
        } else {
            const errorList = errors.map(error => `
                <div class="validation-item ${error.type}">
                    <span class="validation-icon">${error.type === 'error' ? '⚠️' : '⚠️'}</span>
                    <span>${error.message}</span>
                </div>
            `).join('');
            
            resultsDiv.innerHTML = `
                <div class="validation-errors">
                    <div class="validation-header">${errors.length} issue${errors.length > 1 ? 's' : ''} found:</div>
                    ${errorList}
                </div>
            `;
        }
    }

    showMessage(text, type = 'info') {
        const message = document.createElement('div');
        message.className = `message message-${type}`;
        message.textContent = text;
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
            z-index: 1000;
            animation: fadeIn 0.5s ease;
        `;
        
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
    }
}

// Initialize editor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('html-editor')) {
        window.editor = new CodeEditor();
    }
});