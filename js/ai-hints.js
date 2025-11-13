// AI Hints System - Simulated AI for personalized help
class AIHintsSystem {
    constructor() {
        this.storageManager = window.StorageManager;
        this.hintDatabase = this.initializeHintDatabase();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createHintPanel();
    }

    setupEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            const hintBtn = document.getElementById('ai-hint-btn');
            if (hintBtn) {
                hintBtn.addEventListener('click', () => this.getAIHint());
            }
        });
    }

    initializeHintDatabase() {
        return {
            html: {
                structure: [
                    "Start with a proper HTML5 document structure using <!DOCTYPE html>",
                    "Remember to include <head> and <body> sections",
                    "Use semantic HTML elements like <header>, <main>, <section>",
                    "Don't forget to close your tags properly"
                ],
                forms: [
                    "Use <form> element to wrap your input fields",
                    "Add 'name' and 'id' attributes to form inputs",
                    "Include proper input types: text, email, password, etc.",
                    "Use <label> elements for accessibility"
                ],
                links: [
                    "Use <a href='URL'> for external links",
                    "Use <a href='#id'> for internal page links",
                    "Add target='_blank' to open links in new tab",
                    "Include descriptive link text for accessibility"
                ]
            },
            css: {
                layout: [
                    "Use CSS Grid or Flexbox for modern layouts",
                    "Set display: flex on parent container",
                    "Use justify-content and align-items for alignment",
                    "Consider using CSS Grid for complex layouts"
                ],
                styling: [
                    "Use CSS variables for consistent colors: var(--primary-color)",
                    "Apply box-sizing: border-box for better sizing control",
                    "Use relative units like rem, em, or % for responsiveness",
                    "Group related styles together for better organization"
                ],
                responsive: [
                    "Use media queries for responsive design",
                    "Start with mobile-first approach",
                    "Test your design on different screen sizes",
                    "Use flexible units and avoid fixed widths"
                ]
            },
            javascript: {
                basics: [
                    "Declare variables with let or const, avoid var",
                    "Use meaningful variable names that describe their purpose",
                    "Remember JavaScript is case-sensitive",
                    "End statements with semicolons for clarity"
                ],
                functions: [
                    "Use arrow functions for shorter syntax: () => {}",
                    "Return values from functions when needed",
                    "Pass parameters to make functions reusable",
                    "Consider using function expressions for callbacks"
                ],
                dom: [
                    "Use document.getElementById() to select elements",
                    "Add event listeners with addEventListener()",
                    "Modify element content with textContent or innerHTML",
                    "Check if elements exist before manipulating them"
                ],
                errors: [
                    "Check the browser console for error messages",
                    "Ensure all variables are declared before use",
                    "Match opening and closing brackets/parentheses",
                    "Use try-catch blocks for error handling"
                ]
            },
            general: [
                "Break down complex problems into smaller steps",
                "Test your code frequently as you build",
                "Use meaningful names for variables and functions",
                "Comment your code to explain complex logic",
                "Look at the browser console for helpful error messages",
                "Try a different approach if you're stuck",
                "Search for examples of similar problems online",
                "Practice makes perfect - keep coding!"
            ]
        };
    }

    createHintPanel() {
        if (document.getElementById('ai-hint-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'ai-hint-panel';
        panel.className = 'ai-hint-panel';
        panel.innerHTML = `
            <div class="hint-header">
                <h4>🤖 AI Assistant</h4>
                <button id="toggle-hint-panel" class="toggle-btn">−</button>
            </div>
            <div class="hint-content">
                <div class="hint-controls">
                    <button id="ai-hint-btn" class="hint-btn">💡 Get Hint</button>
                    <button id="explain-code-btn" class="hint-btn">📖 Explain Code</button>
                    <button id="debug-help-btn" class="hint-btn">🐛 Debug Help</button>
                </div>
                <div id="hint-display" class="hint-display">
                    <p class="welcome-message">👋 Hi! I'm your AI coding assistant. Click a button above for personalized help!</p>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.setupPanelListeners();
    }

    setupPanelListeners() {
        document.getElementById('toggle-hint-panel').addEventListener('click', () => {
            const panel = document.getElementById('ai-hint-panel');
            panel.classList.toggle('collapsed');
        });

        document.getElementById('ai-hint-btn').addEventListener('click', () => this.getAIHint());
        document.getElementById('explain-code-btn').addEventListener('click', () => this.explainCode());
        document.getElementById('debug-help-btn').addEventListener('click', () => this.getDebugHelp());
    }

    getAIHint() {
        const currentCode = this.getCurrentCode();
        const language = this.detectLanguage(currentCode);
        const context = this.analyzeCodeContext(currentCode, language);
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            const hint = this.generateContextualHint(language, context, currentCode);
            this.displayHint(hint, '💡 AI Hint');
        }, 1500);
    }

    explainCode() {
        const currentCode = this.getCurrentCode();
        if (!currentCode.trim()) {
            this.displayHint("I don't see any code to explain. Try writing some code first!", '📖 Code Explanation');
            return;
        }

        this.showTypingIndicator();
        
        setTimeout(() => {
            const explanation = this.generateCodeExplanation(currentCode);
            this.displayHint(explanation, '📖 Code Explanation');
        }, 2000);
    }

    getDebugHelp() {
        const currentCode = this.getCurrentCode();
        const issues = this.detectCommonIssues(currentCode);
        
        this.showTypingIndicator();
        
        setTimeout(() => {
            const debugHelp = issues.length > 0 
                ? this.generateDebugSuggestions(issues)
                : "Your code looks good! If you're having issues, check the browser console for error messages.";
            this.displayHint(debugHelp, '🐛 Debug Help');
        }, 1800);
    }

    getCurrentCode() {
        const editors = ['html-editor', 'css-editor', 'js-editor'];
        let allCode = '';
        
        editors.forEach(editorId => {
            const editor = document.getElementById(editorId);
            if (editor && editor.value.trim()) {
                allCode += `\n--- ${editorId.replace('-editor', '').toUpperCase()} ---\n${editor.value}\n`;
            }
        });
        
        return allCode || this.getActiveEditorCode();
    }

    getActiveEditorCode() {
        const activeEditor = document.querySelector('textarea:focus, textarea.active');
        return activeEditor ? activeEditor.value : '';
    }

    detectLanguage(code) {
        if (code.includes('<!DOCTYPE') || code.includes('<html')) return 'html';
        if (code.includes('{') && (code.includes('color:') || code.includes('margin:'))) return 'css';
        if (code.includes('function') || code.includes('console.log') || code.includes('let ')) return 'javascript';
        return 'general';
    }

    analyzeCodeContext(code, language) {
        const context = [];
        
        if (language === 'html') {
            if (code.includes('<form')) context.push('forms');
            if (code.includes('<a ')) context.push('links');
            if (!code.includes('<!DOCTYPE')) context.push('structure');
        } else if (language === 'css') {
            if (code.includes('display:') || code.includes('flex')) context.push('layout');
            if (code.includes('@media')) context.push('responsive');
            else context.push('styling');
        } else if (language === 'javascript') {
            if (code.includes('getElementById') || code.includes('querySelector')) context.push('dom');
            if (code.includes('function') || code.includes('=>')) context.push('functions');
            else context.push('basics');
        }
        
        return context.length > 0 ? context : ['general'];
    }

    generateContextualHint(language, contexts, code) {
        const hints = [];
        
        contexts.forEach(context => {
            if (this.hintDatabase[language] && this.hintDatabase[language][context]) {
                const contextHints = this.hintDatabase[language][context];
                hints.push(contextHints[Math.floor(Math.random() * contextHints.length)]);
            }
        });
        
        if (hints.length === 0) {
            const generalHints = this.hintDatabase.general;
            hints.push(generalHints[Math.floor(Math.random() * generalHints.length)]);
        }
        
        return this.personalizeHint(hints[0], code);
    }

    personalizeHint(hint, code) {
        const userName = this.storageManager?.get('profile')?.username || 'there';
        const personalizedIntros = [
            `Hey ${userName}! ${hint}`,
            `${userName}, here's a tip: ${hint}`,
            `Great question, ${userName}! ${hint}`,
            `${userName}, try this: ${hint}`
        ];
        
        return personalizedIntros[Math.floor(Math.random() * personalizedIntros.length)];
    }

    generateCodeExplanation(code) {
        const explanations = [];
        
        if (code.includes('<!DOCTYPE html>')) {
            explanations.push("• The DOCTYPE declaration tells the browser this is an HTML5 document");
        }
        if (code.includes('function')) {
            explanations.push("• You're defining a function - a reusable block of code");
        }
        if (code.includes('addEventListener')) {
            explanations.push("• addEventListener lets you respond to user interactions like clicks");
        }
        if (code.includes('display: flex')) {
            explanations.push("• Flexbox layout makes it easy to align and distribute elements");
        }
        
        if (explanations.length === 0) {
            return "This code creates the basic structure for a web page. Each part has a specific purpose in building your application.";
        }
        
        return explanations.join('\n');
    }

    detectCommonIssues(code) {
        const issues = [];
        
        if (code.includes('<') && !code.includes('</')) {
            issues.push('unclosed_tags');
        }
        if (code.includes('{') && (code.split('{').length !== code.split('}').length)) {
            issues.push('unmatched_braces');
        }
        if (code.includes('getElementById') && !code.includes('document.')) {
            issues.push('missing_document');
        }
        if (code.includes('=') && code.includes('==') && !code.includes('===')) {
            issues.push('loose_equality');
        }
        
        return issues;
    }

    generateDebugSuggestions(issues) {
        const suggestions = {
            unclosed_tags: "🏷️ Make sure all your HTML tags are properly closed (e.g., <div></div>)",
            unmatched_braces: "🔧 Check that all your opening braces { have matching closing braces }",
            missing_document: "📄 Remember to use 'document.getElementById()' instead of just 'getElementById()'",
            loose_equality: "⚖️ Consider using strict equality (===) instead of loose equality (==)"
        };
        
        return issues.map(issue => suggestions[issue] || "Check your syntax carefully").join('\n\n');
    }

    showTypingIndicator() {
        const display = document.getElementById('hint-display');
        display.innerHTML = `
            <div class="typing-indicator">
                <span>🤖 AI is thinking</span>
                <div class="dots">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
            </div>
        `;
    }

    displayHint(hint, title) {
        const display = document.getElementById('hint-display');
        display.innerHTML = `
            <div class="hint-message">
                <h5>${title}</h5>
                <p>${hint}</p>
                <div class="hint-actions">
                    <button onclick="window.aiHints.getAIHint()" class="action-btn">💡 Another Hint</button>
                    <button onclick="window.aiHints.markHelpful()" class="action-btn">👍 Helpful</button>
                </div>
            </div>
        `;
    }

    markHelpful() {
        const display = document.getElementById('hint-display');
        const feedback = document.createElement('div');
        feedback.className = 'feedback-message';
        feedback.innerHTML = '✅ Thanks for the feedback! I\'m learning to help you better.';
        display.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 3000);
    }
}

// Initialize AI hints system
document.addEventListener('DOMContentLoaded', () => {
    window.aiHints = new AIHintsSystem();
});