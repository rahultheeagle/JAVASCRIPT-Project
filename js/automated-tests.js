// Automated Test Cases - Comprehensive testing system
class AutomatedTestRunner {
    constructor() {
        this.challenges = {
            sum: {
                name: 'Sum Function',
                description: 'Create a function that adds two numbers',
                template: 'function sum(a, b) {\n  // Your code here\n}',
                tests: [
                    { input: [2, 3], expected: 5, description: 'Basic addition' },
                    { input: [0, 0], expected: 0, description: 'Zero values' },
                    { input: [-5, 5], expected: 0, description: 'Negative numbers' },
                    { input: [10, -3], expected: 7, description: 'Mixed signs' },
                    { input: [1.5, 2.5], expected: 4, description: 'Decimal numbers' }
                ]
            },
            factorial: {
                name: 'Factorial Function',
                description: 'Calculate factorial of a number',
                template: 'function factorial(n) {\n  // Your code here\n}',
                tests: [
                    { input: [0], expected: 1, description: 'Factorial of 0' },
                    { input: [1], expected: 1, description: 'Factorial of 1' },
                    { input: [5], expected: 120, description: 'Factorial of 5' },
                    { input: [3], expected: 6, description: 'Factorial of 3' },
                    { input: [4], expected: 24, description: 'Factorial of 4' }
                ]
            },
            palindrome: {
                name: 'Palindrome Check',
                description: 'Check if a string is a palindrome',
                template: 'function isPalindrome(str) {\n  // Your code here\n}',
                tests: [
                    { input: ['racecar'], expected: true, description: 'Simple palindrome' },
                    { input: ['hello'], expected: false, description: 'Not a palindrome' },
                    { input: ['A man a plan a canal Panama'], expected: true, description: 'Complex palindrome' },
                    { input: ['race a car'], expected: false, description: 'Spaces and punctuation' },
                    { input: [''], expected: true, description: 'Empty string' }
                ]
            },
            fibonacci: {
                name: 'Fibonacci Sequence',
                description: 'Generate nth Fibonacci number',
                template: 'function fibonacci(n) {\n  // Your code here\n}',
                tests: [
                    { input: [0], expected: 0, description: 'Fibonacci of 0' },
                    { input: [1], expected: 1, description: 'Fibonacci of 1' },
                    { input: [5], expected: 5, description: 'Fibonacci of 5' },
                    { input: [8], expected: 21, description: 'Fibonacci of 8' },
                    { input: [10], expected: 55, description: 'Fibonacci of 10' }
                ]
            }
        };

        this.currentChallenge = 'sum';
        this.testResults = [];
        this.setupEventListeners();
        this.loadChallenge();
    }

    setupEventListeners() {
        document.getElementById('challenge-select').addEventListener('change', (e) => {
            this.currentChallenge = e.target.value;
            this.loadChallenge();
        });

        document.getElementById('run-tests').addEventListener('click', () => {
            this.runAllTests();
        });

        document.getElementById('run-single').addEventListener('click', () => {
            this.runSingleTest();
        });
    }

    loadChallenge() {
        const challenge = this.challenges[this.currentChallenge];
        
        // Update challenge info
        document.getElementById('challenge-info').innerHTML = `
            <h3>${challenge.name}</h3>
            <p>${challenge.description}</p>
        `;

        // Update code template
        document.getElementById('user-solution').value = challenge.template;

        // Update single test selector
        const singleTestSelect = document.getElementById('single-test-select');
        singleTestSelect.innerHTML = challenge.tests.map((test, index) => 
            `<option value="${index}">Test ${index + 1}: ${test.description}</option>`
        ).join('');

        // Clear previous results
        this.clearResults();
    }

    async runAllTests() {
        const code = document.getElementById('user-solution').value;
        const challenge = this.challenges[this.currentChallenge];
        
        this.testResults = [];
        const startTime = performance.now();

        try {
            const userFunction = new Function('return ' + code)();
            
            for (let i = 0; i < challenge.tests.length; i++) {
                const testResult = await this.runTest(userFunction, challenge.tests[i], i);
                this.testResults.push(testResult);
                this.updateProgress(i + 1, challenge.tests.length);
            }
        } catch (error) {
            this.displayError(error.message);
            return;
        }

        const endTime = performance.now();
        const executionTime = endTime - startTime;

        this.displayResults(executionTime);
    }

    async runSingleTest() {
        const code = document.getElementById('user-solution').value;
        const challenge = this.challenges[this.currentChallenge];
        const testIndex = parseInt(document.getElementById('single-test-select').value);
        
        try {
            const userFunction = new Function('return ' + code)();
            const testResult = await this.runTest(userFunction, challenge.tests[testIndex], testIndex);
            
            this.testResults = [testResult];
            this.displayResults(0, true);
        } catch (error) {
            this.displayError(error.message);
        }
    }

    async runTest(userFunction, testCase, index) {
        const startTime = performance.now();
        
        try {
            const result = Array.isArray(testCase.input) ? 
                userFunction(...testCase.input) : 
                userFunction(testCase.input);
            
            const endTime = performance.now();
            const passed = this.compareResults(result, testCase.expected);
            
            return {
                index: index + 1,
                description: testCase.description,
                input: testCase.input,
                expected: testCase.expected,
                actual: result,
                passed: passed,
                executionTime: endTime - startTime,
                error: null
            };
        } catch (error) {
            const endTime = performance.now();
            return {
                index: index + 1,
                description: testCase.description,
                input: testCase.input,
                expected: testCase.expected,
                actual: null,
                passed: false,
                executionTime: endTime - startTime,
                error: error.message
            };
        }
    }

    compareResults(actual, expected) {
        if (actual === expected) return true;
        
        // Handle arrays
        if (Array.isArray(actual) && Array.isArray(expected)) {
            return actual.length === expected.length && 
                   actual.every((val, i) => this.compareResults(val, expected[i]));
        }
        
        // Handle objects
        if (typeof actual === 'object' && typeof expected === 'object' && 
            actual !== null && expected !== null) {
            const actualKeys = Object.keys(actual);
            const expectedKeys = Object.keys(expected);
            
            return actualKeys.length === expectedKeys.length &&
                   actualKeys.every(key => this.compareResults(actual[key], expected[key]));
        }
        
        return false;
    }

    updateProgress(current, total) {
        const percentage = (current / total) * 100;
        document.getElementById('test-progress').style.width = `${percentage}%`;
    }

    displayResults(executionTime, singleTest = false) {
        const passedCount = this.testResults.filter(r => r.passed).length;
        const failedCount = this.testResults.length - passedCount;
        const totalCount = this.testResults.length;

        // Update summary stats
        document.getElementById('passed-count').textContent = passedCount;
        document.getElementById('failed-count').textContent = failedCount;
        document.getElementById('total-count').textContent = totalCount;

        // Update progress bar
        const successRate = (passedCount / totalCount) * 100;
        document.getElementById('test-progress').style.width = `${successRate}%`;
        document.getElementById('test-progress').className = 
            `progress-fill ${successRate === 100 ? 'success' : successRate >= 50 ? 'partial' : 'failure'}`;

        // Display test results
        const resultsContainer = document.getElementById('test-results');
        resultsContainer.innerHTML = `
            <h4>Test Results:</h4>
            ${this.testResults.map(result => this.renderTestResult(result)).join('')}
        `;

        // Update performance metrics
        if (!singleTest) {
            const avgExecutionTime = this.testResults.reduce((sum, r) => sum + r.executionTime, 0) / totalCount;
            document.getElementById('execution-time').textContent = `${executionTime.toFixed(2)}ms`;
            document.getElementById('memory-usage').textContent = 'N/A';
            document.getElementById('test-coverage').textContent = `${successRate.toFixed(1)}%`;
        }
    }

    renderTestResult(result) {
        const statusIcon = result.passed ? '✅' : '❌';
        const statusClass = result.passed ? 'passed' : 'failed';
        
        return `
            <div class="test-case ${statusClass}">
                <div class="test-header">
                    <span class="test-status">${statusIcon}</span>
                    <span class="test-name">Test ${result.index}: ${result.description}</span>
                    <span class="test-time">${result.executionTime.toFixed(2)}ms</span>
                </div>
                <div class="test-details">
                    <div class="test-input">Input: ${JSON.stringify(result.input)}</div>
                    <div class="test-expected">Expected: ${JSON.stringify(result.expected)}</div>
                    <div class="test-actual">
                        ${result.error ? 
                            `Error: ${result.error}` : 
                            `Got: ${JSON.stringify(result.actual)}`}
                    </div>
                </div>
            </div>
        `;
    }

    displayError(message) {
        document.getElementById('test-results').innerHTML = `
            <div class="error-message">
                <h4>❌ Execution Error</h4>
                <p>${message}</p>
            </div>
        `;
    }

    clearResults() {
        document.getElementById('passed-count').textContent = '0';
        document.getElementById('failed-count').textContent = '0';
        document.getElementById('total-count').textContent = '0';
        document.getElementById('test-progress').style.width = '0%';
        document.getElementById('test-results').innerHTML = '';
        document.getElementById('execution-time').textContent = '-';
        document.getElementById('memory-usage').textContent = '-';
        document.getElementById('test-coverage').textContent = '-';
    }
}

// Initialize test runner when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AutomatedTestRunner();
});