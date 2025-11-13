// Validation JavaScript
class ValidationSystem {
    constructor() {
        this.patterns = {
            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            phone: /^\(\d{3}\)\s\d{3}-\d{4}$/,
            strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            username: /^[a-zA-Z0-9_]{3,20}$/,
            url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
        };
    }

    validateEmail(email) {
        return {
            isValid: this.patterns.email.test(email),
            message: this.patterns.email.test(email) ? 'Valid email' : 'Invalid email format'
        };
    }

    validatePassword(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        const passed = Object.values(checks).every(check => check);
        
        return {
            isValid: passed,
            checks: checks,
            message: passed ? 'Strong password' : 'Password requirements not met'
        };
    }

    validateForm(formData) {
        const errors = [];
        
        for (const [field, value] of Object.entries(formData)) {
            const validation = this.validateField(field, value);
            if (!validation.isValid) {
                errors.push({ field, message: validation.message });
            }
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    validateField(field, value) {
        switch (field) {
            case 'email':
                return this.validateEmail(value);
            case 'password':
                return this.validatePassword(value);
            case 'username':
                return {
                    isValid: this.patterns.username.test(value),
                    message: this.patterns.username.test(value) ? 'Valid username' : 'Username must be 3-20 characters, letters, numbers, underscore only'
                };
            default:
                return { isValid: true, message: 'Valid' };
        }
    }

    validateCode(code, language = 'javascript') {
        const issues = [];
        
        // Basic syntax checks
        if (language === 'javascript') {
            // Check for common issues
            if (code.includes('eval(')) {
                issues.push({ type: 'security', message: 'Avoid using eval()' });
            }
            
            if (!code.includes('function') && !code.includes('=>')) {
                issues.push({ type: 'structure', message: 'No functions detected' });
            }
            
            // Check for balanced brackets
            const brackets = { '(': 0, '[': 0, '{': 0 };
            for (const char of code) {
                if (char === '(') brackets['(']++;
                if (char === ')') brackets['(']--;
                if (char === '[') brackets['[']++;
                if (char === ']') brackets['[']--;
                if (char === '{') brackets['{']++;
                if (char === '}') brackets['{']--;
            }
            
            Object.entries(brackets).forEach(([bracket, count]) => {
                if (count !== 0) {
                    issues.push({ type: 'syntax', message: `Unbalanced ${bracket} brackets` });
                }
            });
        }

        return {
            isValid: issues.length === 0,
            issues: issues
        };
    }

    sanitizeInput(input) {
        return input
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }
}

// Export for use in other modules
window.ValidationSystem = ValidationSystem;