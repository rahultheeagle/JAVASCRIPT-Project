// Form Validation - User input with validation
class FormValidation {
    constructor() {
        this.validators = {
            required: (value) => value.trim() !== '',
            email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            minLength: (value, min) => value.length >= min,
            maxLength: (value, max) => value.length <= max,
            number: (value) => !isNaN(value) && value !== '',
            phone: (value) => /^\+?[\d\s\-\(\)]{10,}$/.test(value),
            url: (value) => /^https?:\/\/.+\..+/.test(value),
            password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value)
        };
        
        this.messages = {
            required: 'This field is required',
            email: 'Please enter a valid email address',
            minLength: 'Must be at least {min} characters',
            maxLength: 'Must be no more than {max} characters',
            number: 'Please enter a valid number',
            phone: 'Please enter a valid phone number',
            url: 'Please enter a valid URL',
            password: 'Password must contain uppercase, lowercase, number and be 8+ characters'
        };
    }

    // Validate single field
    validateField(field, rules) {
        const value = field.value;
        const errors = [];

        for (const rule of rules) {
            const [validator, ...params] = rule.split(':');
            
            if (validator === 'required' && !this.validators.required(value)) {
                errors.push(this.messages.required);
                break;
            }
            
            if (value && this.validators[validator]) {
                const isValid = params.length > 0 ? 
                    this.validators[validator](value, ...params) : 
                    this.validators[validator](value);
                
                if (!isValid) {
                    let message = this.messages[validator];
                    if (params.length > 0) {
                        params.forEach((param, index) => {
                            message = message.replace(`{${Object.keys(this.messages)[index] || 'param'}}`, param);
                        });
                    }
                    errors.push(message);
                }
            }
        }

        return errors;
    }

    // Show field error
    showError(field, errors) {
        this.clearError(field);
        
        if (errors.length > 0) {
            field.classList.add('error');
            
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = errors[0];
            
            field.parentNode.appendChild(errorDiv);
            return false;
        }
        
        field.classList.add('valid');
        return true;
    }

    // Clear field error
    clearError(field) {
        field.classList.remove('error', 'valid');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Validate form
    validateForm(form) {
        const fields = form.querySelectorAll('[data-validate]');
        let isValid = true;

        fields.forEach(field => {
            const rules = field.dataset.validate.split('|');
            const errors = this.validateField(field, rules);
            
            if (!this.showError(field, errors)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // Initialize form validation
    init(formSelector) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        // Real-time validation
        form.addEventListener('input', (e) => {
            if (e.target.dataset.validate) {
                const rules = e.target.dataset.validate.split('|');
                const errors = this.validateField(e.target, rules);
                this.showError(e.target, errors);
            }
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm(form)) {
                this.handleSubmit(form);
            }
        });

        return form;
    }

    // Handle form submission
    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show success message
        if (window.toastSystem) {
            toastSystem.show('Form submitted successfully!', 'success');
        } else {
            alert('Form submitted successfully!');
        }
        
        console.log('Form data:', data);
        
        // Reset form
        form.reset();
        form.querySelectorAll('.error, .valid').forEach(field => {
            this.clearError(field);
        });
    }

    // Create form field
    createField(config) {
        const { type, name, label, placeholder, validation, options } = config;
        
        let fieldHTML = '';
        
        if (type === 'select') {
            fieldHTML = `
                <select name="${name}" data-validate="${validation || ''}" ${validation?.includes('required') ? 'required' : ''}>
                    <option value="">Choose ${label}</option>
                    ${options.map(opt => `<option value="${opt.value}">${opt.text}</option>`).join('')}
                </select>
            `;
        } else if (type === 'textarea') {
            fieldHTML = `
                <textarea name="${name}" placeholder="${placeholder || ''}" 
                         data-validate="${validation || ''}" ${validation?.includes('required') ? 'required' : ''}></textarea>
            `;
        } else {
            fieldHTML = `
                <input type="${type}" name="${name}" placeholder="${placeholder || ''}" 
                       data-validate="${validation || ''}" ${validation?.includes('required') ? 'required' : ''}>
            `;
        }

        return `
            <div class="form-field">
                <label for="${name}">${label}</label>
                ${fieldHTML}
            </div>
        `;
    }
}

// Global instance
window.formValidation = new FormValidation();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormValidation;
}