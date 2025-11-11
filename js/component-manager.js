// Component Manager - Modular component system
class ComponentManager {
    constructor() {
        this.components = new Map();
        this.instances = new Map();
        this.init();
    }

    // Initialize component system
    init() {
        this.registerComponents();
        this.autoInitialize();
    }

    // Register component
    register(name, component) {
        this.components.set(name, component);
    }

    // Create component instance
    create(name, element, options = {}) {
        const Component = this.components.get(name);
        if (!Component) return null;

        const instance = new Component(element, options);
        const id = this.generateId();
        this.instances.set(id, instance);
        
        if (element) {
            element.dataset.componentId = id;
        }
        
        return instance;
    }

    // Get component instance
    getInstance(element) {
        const id = element.dataset.componentId;
        return id ? this.instances.get(id) : null;
    }

    // Auto-initialize components
    autoInitialize() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeAll();
        });
    }

    // Initialize all components in DOM
    initializeAll() {
        this.components.forEach((Component, name) => {
            const elements = document.querySelectorAll(`[data-component="${name}"]`);
            elements.forEach(element => {
                if (!element.dataset.componentId) {
                    this.create(name, element);
                }
            });
        });
    }

    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Register built-in components
    registerComponents() {
        // Modal Component
        this.register('modal', class Modal {
            constructor(element, options = {}) {
                this.element = element;
                this.options = { ...this.defaults, ...options };
                this.init();
            }

            get defaults() {
                return {
                    closeOnOverlay: true,
                    closeOnEscape: true
                };
            }

            init() {
                this.bindEvents();
            }

            bindEvents() {
                // Close button
                const closeBtn = this.element.querySelector('[data-modal-close]');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => this.close());
                }

                // Overlay click
                if (this.options.closeOnOverlay) {
                    this.element.addEventListener('click', (e) => {
                        if (e.target === this.element) this.close();
                    });
                }

                // Escape key
                if (this.options.closeOnEscape) {
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && this.isOpen()) this.close();
                    });
                }
            }

            open() {
                this.element.classList.add('modal--active');
                document.body.style.overflow = 'hidden';
                this.element.dispatchEvent(new CustomEvent('modal:open'));
            }

            close() {
                this.element.classList.remove('modal--active');
                document.body.style.overflow = '';
                this.element.dispatchEvent(new CustomEvent('modal:close'));
            }

            isOpen() {
                return this.element.classList.contains('modal--active');
            }
        });

        // Dropdown Component
        this.register('dropdown', class Dropdown {
            constructor(element, options = {}) {
                this.element = element;
                this.trigger = element.querySelector('[data-dropdown-trigger]');
                this.menu = element.querySelector('.dropdown__menu');
                this.options = { ...this.defaults, ...options };
                this.init();
            }

            get defaults() {
                return {
                    closeOnClick: true
                };
            }

            init() {
                this.bindEvents();
            }

            bindEvents() {
                if (this.trigger) {
                    this.trigger.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.toggle();
                    });
                }

                // Close on outside click
                document.addEventListener('click', (e) => {
                    if (!this.element.contains(e.target)) {
                        this.close();
                    }
                });

                // Close on item click
                if (this.options.closeOnClick) {
                    this.menu?.addEventListener('click', () => this.close());
                }
            }

            open() {
                this.element.classList.add('dropdown--active');
                this.element.dispatchEvent(new CustomEvent('dropdown:open'));
            }

            close() {
                this.element.classList.remove('dropdown--active');
                this.element.dispatchEvent(new CustomEvent('dropdown:close'));
            }

            toggle() {
                this.isOpen() ? this.close() : this.open();
            }

            isOpen() {
                return this.element.classList.contains('dropdown--active');
            }
        });

        // Tabs Component
        this.register('tabs', class Tabs {
            constructor(element, options = {}) {
                this.element = element;
                this.nav = element.querySelector('.tabs__nav');
                this.panels = element.querySelectorAll('.tabs__panel');
                this.options = { ...this.defaults, ...options };
                this.init();
            }

            get defaults() {
                return {
                    activeIndex: 0
                };
            }

            init() {
                this.bindEvents();
                this.setActive(this.options.activeIndex);
            }

            bindEvents() {
                this.nav?.addEventListener('click', (e) => {
                    const link = e.target.closest('[data-tab]');
                    if (link) {
                        e.preventDefault();
                        const index = parseInt(link.dataset.tab);
                        this.setActive(index);
                    }
                });
            }

            setActive(index) {
                // Update nav
                const links = this.nav?.querySelectorAll('[data-tab]');
                links?.forEach((link, i) => {
                    link.classList.toggle('tabs__link--active', i === index);
                });

                // Update panels
                this.panels.forEach((panel, i) => {
                    panel.classList.toggle('tabs__panel--active', i === index);
                });

                this.element.dispatchEvent(new CustomEvent('tabs:change', {
                    detail: { index }
                }));
            }
        });

        // Tooltip Component
        this.register('tooltip', class Tooltip {
            constructor(element, options = {}) {
                this.element = element;
                this.options = { ...this.defaults, ...options };
                this.init();
            }

            get defaults() {
                return {
                    text: '',
                    position: 'top'
                };
            }

            init() {
                this.createTooltip();
                this.bindEvents();
            }

            createTooltip() {
                const text = this.options.text || this.element.dataset.tooltip;
                if (!text) return;

                this.tooltip = document.createElement('div');
                this.tooltip.className = 'tooltip__content';
                this.tooltip.textContent = text;
                this.element.appendChild(this.tooltip);
            }

            bindEvents() {
                this.element.addEventListener('mouseenter', () => this.show());
                this.element.addEventListener('mouseleave', () => this.hide());
            }

            show() {
                if (this.tooltip) {
                    this.tooltip.style.opacity = '1';
                    this.tooltip.style.visibility = 'visible';
                }
            }

            hide() {
                if (this.tooltip) {
                    this.tooltip.style.opacity = '0';
                    this.tooltip.style.visibility = 'hidden';
                }
            }
        });
    }

    // Utility methods for creating components
    createButton(text, variant = 'primary', size = '') {
        const button = document.createElement('button');
        button.className = `btn btn--${variant} ${size ? `btn--${size}` : ''}`.trim();
        button.textContent = text;
        return button;
    }

    createCard(title, content, footer = '') {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            ${title ? `<div class="card__header"><h3 class="card__title">${title}</h3></div>` : ''}
            <div class="card__body">${content}</div>
            ${footer ? `<div class="card__footer">${footer}</div>` : ''}
        `;
        
        return card;
    }

    createBadge(text, variant = 'primary') {
        const badge = document.createElement('span');
        badge.className = `badge badge--${variant}`;
        badge.textContent = text;
        return badge;
    }

    createAlert(message, variant = 'info', title = '') {
        const alert = document.createElement('div');
        alert.className = `alert alert--${variant}`;
        
        alert.innerHTML = `
            ${title ? `<div class="alert__title">${title}</div>` : ''}
            <div class="alert__message">${message}</div>
        `;
        
        return alert;
    }

    createProgress(value = 0, variant = '') {
        const progress = document.createElement('div');
        progress.className = `progress ${variant ? `progress--${variant}` : ''}`.trim();
        
        const bar = document.createElement('div');
        bar.className = 'progress__bar';
        bar.style.width = `${value}%`;
        
        progress.appendChild(bar);
        return progress;
    }

    createSpinner(size = '') {
        const spinner = document.createElement('div');
        spinner.className = `spinner ${size ? `spinner--${size}` : ''}`.trim();
        return spinner;
    }
}

// Global instance
window.componentManager = new ComponentManager();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentManager;
}