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
                    this.updatePreview();
                    this.autoSave();
                });
                
                // Sync scroll between editor and highlight
                editor.addEventListener('scroll', () => {
                    const highlight = this.highlightElements[lang];
                    if (highlight) {
                        highlight.parentElement.scrollTop = editor.scrollTop;
                        highlight.parentElement.scrollLeft = editor.scrollLeft;
                    }
                });
            }
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
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>
                    try {
                        ${js}
                    } catch (error) {
                        console.error('Error:', error.message);
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

    initSyntaxHighlighting() {
        // Initialize syntax highlighting for all editors
        if (this.htmlEditor) this.updateSyntaxHighlight('html', this.htmlEditor.value);
        if (this.cssEditor) this.updateSyntaxHighlight('css', this.cssEditor.value);
        if (this.jsEditor) this.updateSyntaxHighlight('js', this.jsEditor.value);
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