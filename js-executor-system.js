class JSExecutorSystem {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.setupSafeEnvironment();
    }

    initializeElements() {
        this.codeInput = document.getElementById('code-input');
        this.outputContent = document.getElementById('output-content');
        this.runBtn = document.getElementById('run-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.clearOutputBtn = document.getElementById('clear-output-btn');
        this.exampleBtns = document.querySelectorAll('.example-btn');
    }

    bindEvents() {
        this.runBtn.addEventListener('click', () => this.executeCode());
        this.clearBtn.addEventListener('click', () => this.clearCode());
        this.clearOutputBtn.addEventListener('click', () => this.clearOutput());
        
        this.exampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.codeInput.value = btn.dataset.code;
            });
        });

        // Execute on Ctrl+Enter
        this.codeInput.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.executeCode();
            }
        });
    }

    setupSafeEnvironment() {
        // Create safe console methods
        this.safeConsole = {
            log: (...args) => this.addOutput(args.map(arg => this.formatValue(arg)).join(' '), 'log'),
            error: (...args) => this.addOutput(args.map(arg => this.formatValue(arg)).join(' '), 'error'),
            warn: (...args) => this.addOutput(args.map(arg => this.formatValue(arg)).join(' '), 'log'),
            info: (...args) => this.addOutput(args.map(arg => this.formatValue(arg)).join(' '), 'log')
        };

        // Restricted globals
        this.restrictedGlobals = [
            'window', 'document', 'location', 'history', 'navigator',
            'localStorage', 'sessionStorage', 'fetch', 'XMLHttpRequest',
            'eval', 'Function', 'setTimeout', 'setInterval', 'alert'
        ];
    }

    executeCode() {
        const code = this.codeInput.value.trim();
        if (!code) {
            this.addOutput('No code to execute', 'error');
            return;
        }

        this.clearOutput();
        this.addOutput(`> Executing code...`, 'log');

        try {
            // Create safe execution context
            const result = this.safeExecute(code);
            
            if (result !== undefined) {
                this.addOutput(`Result: ${this.formatValue(result)}`, 'result');
            }
        } catch (error) {
            this.addOutput(`Error: ${error.message}`, 'error');
        }
    }

    safeExecute(code) {
        // Check for restricted patterns
        if (this.containsRestrictedCode(code)) {
            throw new Error('Code contains restricted operations');
        }

        // Create safe execution environment
        const safeGlobals = {
            console: this.safeConsole,
            Math: Math,
            Date: Date,
            JSON: JSON,
            Array: Array,
            Object: Object,
            String: String,
            Number: Number,
            Boolean: Boolean,
            RegExp: RegExp,
            parseInt: parseInt,
            parseFloat: parseFloat,
            isNaN: isNaN,
            isFinite: isFinite
        };

        // Create function with restricted scope
        const wrappedCode = `
            "use strict";
            ${Object.keys(safeGlobals).map(key => `const ${key} = arguments[0].${key};`).join('\n')}
            
            // Prevent access to global scope
            const window = undefined;
            const document = undefined;
            const global = undefined;
            const globalThis = undefined;
            
            return (function() {
                ${code}
            })();
        `;

        try {
            const func = new Function(wrappedCode);
            return func(safeGlobals);
        } catch (error) {
            throw new Error(`Execution error: ${error.message}`);
        }
    }

    containsRestrictedCode(code) {
        // Check for dangerous patterns
        const dangerousPatterns = [
            /\beval\s*\(/,
            /\bFunction\s*\(/,
            /\bsetTimeout\s*\(/,
            /\bsetInterval\s*\(/,
            /\balert\s*\(/,
            /\bconfirm\s*\(/,
            /\bprompt\s*\(/,
            /\bwindow\./,
            /\bdocument\./,
            /\blocation\./,
            /\bhistory\./,
            /\blocalStorage\./,
            /\bsessionStorage\./,
            /\bfetch\s*\(/,
            /\bXMLHttpRequest\s*\(/,
            /\bimport\s+/,
            /\brequire\s*\(/,
            /\bprocess\./,
            /\b__dirname\b/,
            /\b__filename\b/,
            /while\s*\(\s*true\s*\)/,
            /for\s*\(\s*;\s*;\s*\)/
        ];

        return dangerousPatterns.some(pattern => pattern.test(code));
    }

    formatValue(value) {
        if (value === null) return 'null';
        if (value === undefined) return 'undefined';
        if (typeof value === 'string') return `"${value}"`;
        if (typeof value === 'function') return '[Function]';
        if (Array.isArray(value)) {
            return `[${value.map(v => this.formatValue(v)).join(', ')}]`;
        }
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value, null, 2);
            } catch {
                return '[Object]';
            }
        }
        return String(value);
    }

    addOutput(message, type = 'log') {
        const outputLine = document.createElement('div');
        outputLine.className = `output-line output-${type}`;
        outputLine.textContent = message;
        
        // Remove placeholder if exists
        const placeholder = this.outputContent.querySelector('.output-placeholder');
        if (placeholder) {
            placeholder.remove();
        }
        
        this.outputContent.appendChild(outputLine);
        this.outputContent.scrollTop = this.outputContent.scrollHeight;
    }

    clearCode() {
        this.codeInput.value = '';
        this.codeInput.focus();
    }

    clearOutput() {
        this.outputContent.innerHTML = '';
    }
}

// Initialize executor system
document.addEventListener('DOMContentLoaded', () => {
    new JSExecutorSystem();
});