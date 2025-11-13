// Event delegation implementation
export class EventDelegation {
    constructor() {
        this.delegates = new Map();
        this.setupGlobalListener();
    }

    setupGlobalListener() {
        document.addEventListener('click', this.handleClick.bind(this), true);
        document.addEventListener('input', this.handleInput.bind(this), true);
        document.addEventListener('change', this.handleChange.bind(this), true);
        document.addEventListener('submit', this.handleSubmit.bind(this), true);
    }

    // Register delegated event handlers
    on(selector, event, handler) {
        if (!this.delegates.has(event)) {
            this.delegates.set(event, new Map());
        }
        this.delegates.get(event).set(selector, handler);
    }

    off(selector, event) {
        if (this.delegates.has(event)) {
            this.delegates.get(event).delete(selector);
        }
    }

    // Handle different event types
    handleClick(e) {
        this.handleEvent('click', e);
    }

    handleInput(e) {
        this.handleEvent('input', e);
    }

    handleChange(e) {
        this.handleEvent('change', e);
    }

    handleSubmit(e) {
        this.handleEvent('submit', e);
    }

    handleEvent(eventType, e) {
        if (!this.delegates.has(eventType)) return;

        const handlers = this.delegates.get(eventType);
        
        for (const [selector, handler] of handlers) {
            const target = e.target.closest(selector);
            if (target) {
                handler.call(target, e, target);
            }
        }
    }

    // Utility methods for common patterns
    static delegate(container, selector, event, handler) {
        container.addEventListener(event, (e) => {
            const target = e.target.closest(selector);
            if (target && container.contains(target)) {
                handler.call(target, e, target);
            }
        });
    }

    static delegateData(container, dataAttribute, event, handler) {
        container.addEventListener(event, (e) => {
            const target = e.target.closest(`[${dataAttribute}]`);
            if (target && container.contains(target)) {
                const value = target.getAttribute(dataAttribute);
                handler.call(target, e, target, value);
            }
        });
    }

    // Common delegation patterns
    static setupButtonDelegation(container = document) {
        this.delegateData(container, 'data-action', 'click', (e, target, action) => {
            e.preventDefault();
            
            const handlers = {
                'toggle': () => target.classList.toggle('active'),
                'show': () => target.style.display = 'block',
                'hide': () => target.style.display = 'none',
                'remove': () => target.remove(),
                'confirm': () => {
                    if (confirm('Are you sure?')) {
                        target.closest('[data-item]')?.remove();
                    }
                }
            };

            if (handlers[action]) {
                handlers[action]();
            }
        });
    }

    static setupFormDelegation(container = document) {
        this.delegate(container, 'form[data-ajax]', 'submit', async (e, form) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            try {
                form.classList.add('loading');
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                form.classList.remove('loading');
                form.classList.add('success');
                
                setTimeout(() => form.classList.remove('success'), 2000);
            } catch (error) {
                form.classList.remove('loading');
                form.classList.add('error');
            }
        });
    }

    static setupListDelegation(container = document) {
        this.delegate(container, '[data-list] [data-delete]', 'click', (e, target) => {
            const item = target.closest('[data-item]');
            if (item && confirm('Delete this item?')) {
                item.remove();
            }
        });

        this.delegate(container, '[data-list] [data-edit]', 'click', (e, target) => {
            const item = target.closest('[data-item]');
            if (item) {
                item.classList.toggle('editing');
            }
        });
    }
}

export default new EventDelegation();