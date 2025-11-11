class DOMManipulator {
    constructor() {
        this.templates = new Map();
        this.cache = new Map();
    }

    // Element creation and manipulation
    create(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') element.className = value;
            else if (key === 'innerHTML') element.innerHTML = value;
            else if (key === 'textContent') element.textContent = value;
            else if (key.startsWith('data-')) element.setAttribute(key, value);
            else element[key] = value;
        });

        if (content) element.textContent = content;
        return element;
    }

    // Dynamic content rendering
    render(container, data, template) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        if (Array.isArray(data)) {
            target.innerHTML = '';
            data.forEach(item => {
                const element = this.renderItem(item, template);
                target.appendChild(element);
            });
        } else {
            target.innerHTML = '';
            target.appendChild(this.renderItem(data, template));
        }
    }

    renderItem(data, template) {
        if (typeof template === 'function') {
            return template(data);
        }
        
        if (typeof template === 'string') {
            return this.renderTemplate(template, data);
        }

        return this.create('div', {}, JSON.stringify(data));
    }

    renderTemplate(templateStr, data) {
        const html = templateStr.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || '';
        });
        
        const wrapper = this.create('div');
        wrapper.innerHTML = html;
        return wrapper.firstElementChild || wrapper;
    }

    // List operations
    renderList(container, items, itemTemplate, options = {}) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        const { filter, sort, limit } = options;
        let processedItems = [...items];

        if (filter) processedItems = processedItems.filter(filter);
        if (sort) processedItems.sort(sort);
        if (limit) processedItems = processedItems.slice(0, limit);

        this.render(target, processedItems, itemTemplate);
    }

    // Table rendering
    renderTable(container, data, columns) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        const table = this.create('table', { className: 'data-table' });
        
        // Header
        const thead = this.create('thead');
        const headerRow = this.create('tr');
        columns.forEach(col => {
            const th = this.create('th', {}, col.label || col.key);
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Body
        const tbody = this.create('tbody');
        data.forEach(row => {
            const tr = this.create('tr');
            columns.forEach(col => {
                const td = this.create('td');
                const value = row[col.key];
                td.innerHTML = col.render ? col.render(value, row) : value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);

        target.innerHTML = '';
        target.appendChild(table);
    }

    // Form rendering
    renderForm(container, fields, options = {}) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        const form = this.create('form', { className: 'dynamic-form' });
        
        fields.forEach(field => {
            const wrapper = this.create('div', { className: 'field-wrapper' });
            
            if (field.label) {
                const label = this.create('label', { textContent: field.label });
                wrapper.appendChild(label);
            }

            const input = this.createFormField(field);
            wrapper.appendChild(input);
            form.appendChild(wrapper);
        });

        if (options.submitText) {
            const button = this.create('button', { 
                type: 'submit', 
                textContent: options.submitText,
                className: 'btn btn-primary'
            });
            form.appendChild(button);
        }

        target.innerHTML = '';
        target.appendChild(form);
    }

    createFormField(field) {
        const { type = 'text', name, placeholder, options, value } = field;

        if (type === 'select') {
            const select = this.create('select', { name });
            options.forEach(opt => {
                const option = this.create('option', { 
                    value: opt.value, 
                    textContent: opt.label 
                });
                select.appendChild(option);
            });
            return select;
        }

        if (type === 'textarea') {
            return this.create('textarea', { name, placeholder, value });
        }

        return this.create('input', { type, name, placeholder, value });
    }

    // Card grid rendering
    renderCards(container, items, cardTemplate) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        const grid = this.create('div', { className: 'cards-grid' });
        
        items.forEach(item => {
            const card = this.create('div', { className: 'card' });
            const content = cardTemplate(item);
            
            if (typeof content === 'string') {
                card.innerHTML = content;
            } else {
                card.appendChild(content);
            }
            
            grid.appendChild(card);
        });

        target.innerHTML = '';
        target.appendChild(grid);
    }

    // Dynamic updates
    update(selector, data, template) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            if (template) {
                const content = this.renderItem(data, template);
                el.innerHTML = '';
                el.appendChild(content);
            } else {
                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'textContent') el.textContent = value;
                    else if (key === 'innerHTML') el.innerHTML = value;
                    else if (key === 'className') el.className = value;
                    else el.setAttribute(key, value);
                });
            }
        });
    }

    // Append/prepend operations
    append(container, content, template) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        const element = template ? this.renderItem(content, template) : content;
        target.appendChild(element);
    }

    prepend(container, content, template) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        const element = template ? this.renderItem(content, template) : content;
        target.insertBefore(element, target.firstChild);
    }

    // Remove operations
    remove(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    }

    clear(container) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (target) target.innerHTML = '';
    }

    // Conditional rendering
    renderIf(container, condition, content, template) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        if (condition) {
            const element = template ? this.renderItem(content, template) : content;
            target.appendChild(element);
        }
    }

    // Batch operations
    batch(operations) {
        operations.forEach(op => {
            const { method, args } = op;
            if (this[method]) {
                this[method](...args);
            }
        });
    }

    // Animation helpers
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms`;
        setTimeout(() => element.style.opacity = '1', 10);
    }

    slideIn(element, direction = 'down', duration = 300) {
        const transform = direction === 'down' ? 'translateY(-20px)' : 'translateX(-20px)';
        element.style.transform = transform;
        element.style.opacity = '0';
        element.style.transition = `all ${duration}ms`;
        setTimeout(() => {
            element.style.transform = 'none';
            element.style.opacity = '1';
        }, 10);
    }
}

// Global instance
const dom = new DOMManipulator();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DOMManipulator;
}