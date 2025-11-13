// Output Validator - Compare user output with expected output
class OutputValidator {
    constructor(testCases = []) {
        this.testCases = testCases;
        this.results = [];
    }

    validateCode(userCode) {
        this.results = [];
        
        try {
            // Create function from user code
            const userFunction = new Function('return ' + userCode)();
            
            // Run all test cases
            this.testCases.forEach((testCase, index) => {
                const result = this.runTestCase(userFunction, testCase, index);
                this.results.push(result);
            });
            
            this.displayResults();
            return this.results;
            
        } catch (error) {
            this.displayError(error.message);
            return [];
        }
    }

    runTestCase(userFunction, testCase, index) {
        try {
            const actual = Array.isArray(testCase.input) ? 
                userFunction(...testCase.input) : 
                userFunction(testCase.input);
            
            const passed = this.compareOutputs(actual, testCase.expected);
            
            return {
                index: index + 1,
                description: testCase.description,
                input: testCase.input,
                expected: testCase.expected,
                actual: actual,
                passed: passed,
                error: null
            };
        } catch (error) {
            return {
                index: index + 1,
                description: testCase.description,
                input: testCase.input,
                expected: testCase.expected,
                actual: null,
                passed: false,
                error: error.message
            };
        }
    }

    compareOutputs(actual, expected) {
        // Deep comparison for different data types
        if (actual === expected) return true;
        
        // Handle arrays
        if (Array.isArray(actual) && Array.isArray(expected)) {
            return actual.length === expected.length && 
                   actual.every((val, i) => this.compareOutputs(val, expected[i]));
        }
        
        // Handle objects
        if (typeof actual === 'object' && typeof expected === 'object' && 
            actual !== null && expected !== null) {
            const actualKeys = Object.keys(actual);
            const expectedKeys = Object.keys(expected);
            
            return actualKeys.length === expectedKeys.length &&
                   actualKeys.every(key => this.compareOutputs(actual[key], expected[key]));
        }
        
        return false;
    }

    displayResults() {
        const resultsContainer = document.getElementById('test-results');
        const expectedDisplay = document.getElementById('expected-display');
        const actualDisplay = document.getElementById('actual-display');
        
        if (!resultsContainer) return;
        
        const passedCount = this.results.filter(r => r.passed).length;
        const totalCount = this.results.length;
        
        resultsContainer.innerHTML = `
            <div class="results-summary ${passedCount === totalCount ? 'success' : 'failure'}">
                <h4>${passedCount}/${totalCount} Tests Passed</h4>
            </div>
            ${this.results.map(result => this.renderTestResult(result)).join('')}
        `;
        
        // Display comparison for first failed test or last test
        const displayResult = this.results.find(r => !r.passed) || this.results[this.results.length - 1];
        if (displayResult && expectedDisplay && actualDisplay) {
            expectedDisplay.innerHTML = `<pre>${JSON.stringify(displayResult.expected, null, 2)}</pre>`;
            actualDisplay.innerHTML = `<pre>${displayResult.error ? 
                `Error: ${displayResult.error}` : 
                JSON.stringify(displayResult.actual, null, 2)}</pre>`;
        }
    }

    renderTestResult(result) {
        const statusIcon = result.passed ? '✅' : '❌';
        const statusClass = result.passed ? 'passed' : 'failed';
        
        return `
            <div class="test-result ${statusClass}">
                <div class="test-header">
                    <span class="test-status">${statusIcon}</span>
                    <span class="test-description">${result.description}</span>
                </div>
                <div class="test-details">
                    <div class="test-input">Input: ${JSON.stringify(result.input)}</div>
                    <div class="test-expected">Expected: ${JSON.stringify(result.expected)}</div>
                    <div class="test-actual">Got: ${result.error ? 
                        `Error: ${result.error}` : 
                        JSON.stringify(result.actual)}</div>
                </div>
            </div>
        `;
    }

    displayError(message) {
        const resultsContainer = document.getElementById('test-results');
        if (resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="validation-error">
                    <h4>❌ Code Error</h4>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Legacy ValidationSystem class for backward compatibility
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
window.OutputValidator = OutputValidator;