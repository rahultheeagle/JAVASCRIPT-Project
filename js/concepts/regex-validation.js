// Regular expressions for validation
export class RegexValidation {
    // Common patterns
    static patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\+?[\d\s\-\(\)]{10,}$/,
        url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        username: /^[a-zA-Z0-9_]{3,20}$/,
        zipCode: /^\d{5}(-\d{4})?$/,
        creditCard: /^\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}$/,
        ipAddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
        slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    };

    // Validation methods
    static isEmail(email) {
        return this.patterns.email.test(email);
    }

    static isPhone(phone) {
        return this.patterns.phone.test(phone);
    }

    static isUrl(url) {
        return this.patterns.url.test(url);
    }

    static isStrongPassword(password) {
        return this.patterns.password.test(password);
    }

    static isUsername(username) {
        return this.patterns.username.test(username);
    }

    static isZipCode(zipCode) {
        return this.patterns.zipCode.test(zipCode);
    }

    static isCreditCard(cardNumber) {
        return this.patterns.creditCard.test(cardNumber.replace(/\s/g, ''));
    }

    static isIPAddress(ip) {
        return this.patterns.ipAddress.test(ip);
    }

    static isHexColor(color) {
        return this.patterns.hexColor.test(color);
    }

    static isSlug(slug) {
        return this.patterns.slug.test(slug);
    }

    // Text processing
    static extractEmails(text) {
        return text.match(new RegExp(this.patterns.email.source, 'g')) || [];
    }

    static extractUrls(text) {
        return text.match(new RegExp(this.patterns.url.source, 'g')) || [];
    }

    static extractPhones(text) {
        return text.match(new RegExp(this.patterns.phone.source, 'g')) || [];
    }

    // String cleaning
    static cleanPhone(phone) {
        return phone.replace(/[^\d+]/g, '');
    }

    static cleanCreditCard(cardNumber) {
        return cardNumber.replace(/[\s\-]/g, '');
    }

    static slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Custom validation
    static createValidator(pattern, flags = '') {
        const regex = new RegExp(pattern, flags);
        return (value) => regex.test(value);
    }

    static validateField(value, rules) {
        const errors = [];

        if (rules.required && !value) {
            errors.push('This field is required');
            return errors;
        }

        if (value && rules.pattern && !rules.pattern.test(value)) {
            errors.push(rules.message || 'Invalid format');
        }

        if (value && rules.minLength && value.length < rules.minLength) {
            errors.push(`Minimum length is ${rules.minLength}`);
        }

        if (value && rules.maxLength && value.length > rules.maxLength) {
            errors.push(`Maximum length is ${rules.maxLength}`);
        }

        return errors;
    }

    // Password strength checker
    static checkPasswordStrength(password) {
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[@$!%*?&]/.test(password)
        };

        const score = Object.values(checks).filter(Boolean).length;
        const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];

        return { checks, score, strength };
    }

    // Form validation
    static validateForm(formData, rules) {
        const errors = {};

        Object.entries(rules).forEach(([field, fieldRules]) => {
            const value = formData[field];
            const fieldErrors = this.validateField(value, fieldRules);
            if (fieldErrors.length > 0) {
                errors[field] = fieldErrors;
            }
        });

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export default RegexValidation;