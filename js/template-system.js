// Template System - Reusable HTML structures
class TemplateSystem {
    constructor() {
        this.templates = new Map();
        this.initializeTemplates();
    }

    // Register a template
    register(name, template) {
        this.templates.set(name, template);
    }

    // Render template with data
    render(name, data = {}) {
        const template = this.templates.get(name);
        if (!template) return '';
        
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || '';
        });
    }

    // Initialize common templates
    initializeTemplates() {
        // Card template
        this.register('card', `
            <div class="card {{class}}">
                <div class="card-header">
                    <h3>{{title}}</h3>
                </div>
                <div class="card-body">
                    {{content}}
                </div>
                {{footer}}
            </div>
        `);

        // Button template
        this.register('button', `
            <button class="btn {{type}}" {{attributes}}>
                {{icon}}{{text}}
            </button>
        `);

        // Modal template
        this.register('modal', `
            <div class="modal" id="{{id}}">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>{{title}}</h2>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        {{content}}
                    </div>
                    <div class="modal-footer">
                        {{actions}}
                    </div>
                </div>
            </div>
        `);

        // Form field template
        this.register('field', `
            <div class="form-field">
                <label for="{{id}}">{{label}}</label>
                <{{type}} id="{{id}}" name="{{name}}" {{attributes}}>{{options}}</{{type}}>
            </div>
        `);

        // Navigation item template
        this.register('navItem', `
            <li class="nav-item {{active}}">
                <a href="{{href}}" class="nav-link">
                    {{icon}}{{text}}
                </a>
            </li>
        `);

        // Progress bar template
        this.register('progress', `
            <div class="progress-container">
                <div class="progress-label">{{label}}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {{percent}}%"></div>
                </div>
                <div class="progress-text">{{percent}}%</div>
            </div>
        `);

        // Alert template
        this.register('alert', `
            <div class="alert alert-{{type}}">
                <span class="alert-icon">{{icon}}</span>
                <span class="alert-message">{{message}}</span>
                <button class="alert-close">&times;</button>
            </div>
        `);
    }

    // Create element from template
    createElement(name, data = {}) {
        const html = this.render(name, data);
        const temp = document.createElement('div');
        temp.innerHTML = html.trim();
        return temp.firstElementChild;
    }

    // Insert template into DOM
    insertInto(container, name, data = {}) {
        const element = this.createElement(name, data);
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        container.appendChild(element);
        return element;
    }
}

// Global template system instance
window.templates = new TemplateSystem();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TemplateSystem;
}