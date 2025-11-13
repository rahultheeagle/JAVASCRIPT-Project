// Template literals implementation and utilities
export class TemplateLiterals {
    // Basic template rendering
    static render(template, data) {
        return template.replace(/\$\{([^}]+)\}/g, (match, key) => {
            return this.getValue(data, key.trim()) || '';
        });
    }

    // Get nested object values
    static getValue(obj, path) {
        return path.split('.').reduce((current, key) => current?.[key], obj);
    }

    // HTML template with escaping
    static html(template, data, escape = true) {
        const rendered = this.render(template, data);
        return escape ? this.escapeHtml(rendered) : rendered;
    }

    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Conditional templates
    static conditional(condition, trueTemplate, falseTemplate = '') {
        return condition ? trueTemplate : falseTemplate;
    }

    // Loop templates
    static loop(array, template) {
        return array.map((item, index) => 
            this.render(template, { ...item, index, length: array.length })
        ).join('');
    }

    // Tagged template functions
    static css(strings, ...values) {
        return strings.reduce((result, string, i) => {
            return result + string + (values[i] || '');
        }, '');
    }

    static sql(strings, ...values) {
        // Simple SQL template (for demo purposes)
        return strings.reduce((result, string, i) => {
            const value = values[i];
            const escaped = typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
            return result + string + (escaped || '');
        }, '');
    }

    // Multi-line template formatting
    static multiline(template) {
        return template
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
    }

    // Template with functions
    static withHelpers(template, data, helpers = {}) {
        const context = { ...data, ...helpers };
        return this.render(template, context);
    }

    // Common template helpers
    static helpers = {
        uppercase: (str) => String(str).toUpperCase(),
        lowercase: (str) => String(str).toLowerCase(),
        capitalize: (str) => String(str).charAt(0).toUpperCase() + String(str).slice(1),
        formatDate: (date) => new Date(date).toLocaleDateString(),
        formatNumber: (num) => Number(num).toLocaleString(),
        truncate: (str, length = 50) => String(str).length > length ? String(str).slice(0, length) + '...' : str,
        pluralize: (count, singular, plural) => count === 1 ? singular : plural || singular + 's'
    };

    // Template compilation for performance
    static compile(template) {
        return (data) => this.render(template, data);
    }
}

export default TemplateLiterals;