class JSValidatorSystem {
    constructor() {
        this.challenges = {
            sum: {
                title: 'Sum Two Numbers',
                description: 'Write a function that takes two numbers and returns their sum.',
                template: 'function sum(a, b) {\n  // Your code here\n}',
                testCases: [
                    { input: [2, 3], expected: 5 },
                    { input: [0, 0], expected: 0 },
                    { input: [-1, 1], expected: 0 },
                    { input: [10, -5], expected: 5 }
                ]
            },
            factorial: {
                title: 'Calculate Factorial',
                description: 'Write a function that calculates the factorial of a number.',
                template: 'function factorial(n) {\n  // Your code here\n}',
                testCases: [
                    { input: [0], expected: 1 },
                    { input: [1], expected: 1 },
                    { input: [5], expected: 120 },
                    { input: [3], expected: 6 }
                ]
            },
            reverse: {
                title: 'Reverse String',
                description: 'Write a function that reverses a string.',
                template: 'function reverse(str) {\n  // Your code here\n}',
                testCases: [
                    { input: ['hello'], expected: 'olleh' },
                    { input: [''], expected: '' },
                    { input: ['a'], expected: 'a' },
                    { input: ['JavaScript'], expected: 'tpircSavaJ' }
                ]
            },
            fibonacci: {
                title: 'Fibonacci Sequence',
                description: 'Write a function that returns the nth Fibonacci number.',
                template: 'function fibonacci(n) {\n  // Your code here\n}',
                testCases: [
                    { input: [0], expected: 0 },
                    { input: [1], expected: 1 },
                    { input: [5], expected: 5 },
                    { input: [8], expected: 21 }
                ]
            },
            palindrome: {
                title: 'Check Palindrome',
                description: 'Write a function that checks if a string is a palindrome.',
                template: 'function isPalindrome(str) {\n  // Your code here\n}',
                testCases: [
                    { input: ['racecar'], expected: true },
                    { input: ['hello'], expected: false },
                    { input: [''], expected: true },
                    { input: ['a'], expected: true }
                ]
            }
        };
        
        this.currentChallenge = 'sum';
        this.initializeElements();
        this.bindEvents();
        this.loadChallenge();
    }

    initializeElements() {
        this.challengeSelect = document.getElementById('challenge-select');
        this.challengeDescription = document.getElementById('challenge-description');
        this.expectedOutput = document.getElementById('expected-output');
        this.codeInput = document.getElementById('code-input');
        this.validateBtn = document.getElementById('validate-btn');
        this.clearBtn = document.getElementById('clear-btn');
        this.resultsContent = document.getElementById('results-content');
    }

    bindEvents() {
        this.challengeSelect.addEventListener('change', (e) => {
            this.currentChallenge = e.target.value;
            this.loadChallenge();
        });

        this.validateBtn.addEventListener('click', () => this.validateCode());
        this.clearBtn.addEventListener('click', () => this.clearCode());
    }

    loadChallenge() {
        const challenge = this.challenges[this.currentChallenge];
        
        this.challengeDescription.innerHTML = `
            <h4>${challenge.title}</h4>
            <p>${challenge.description}</p>
        `;

        this.expectedOutput.innerHTML = `
            <h4>Expected Behavior:</h4>
            ${challenge.testCases.map(test => 
                `<div>Input: ${JSON.stringify(test.input)} → Output: ${JSON.stringify(test.expected)}</div>`
            ).join('')}
        `;

        this.codeInput.value = challenge.template;
        this.clearResults();
    }

    validateCode() {
        const code = this.codeInput.value.trim();
        if (!code) {
            this.showError('Please write your solution first.');
            return;
        }

        const challenge = this.challenges[this.currentChallenge];
        const results = this.runTests(code, challenge);
        this.displayResults(results);
    }

    runTests(code, challenge) {
        const results = {
            passed: 0,
            total: challenge.testCases.length,
            testResults: []
        };

        try {
            // Create safe function
            const func = this.createSafeFunction(code);
            
            challenge.testCases.forEach((testCase, index) => {
                try {
                    const actual = func(...testCase.input);
                    const passed = this.compareValues(actual, testCase.expected);
                    
                    results.testResults.push({
                        index: index + 1,
                        input: testCase.input,
                        expected: testCase.expected,
                        actual: actual,
                        passed: passed
                    });

                    if (passed) results.passed++;
                } catch (error) {
                    results.testResults.push({
                        index: index + 1,
                        input: testCase.input,
                        expected: testCase.expected,
                        actual: `Error: ${error.message}`,
                        passed: false
                    });
                }
            });
        } catch (error) {
            results.error = error.message;
        }

        return results;
    }

    createSafeFunction(code) {
        // Extract function name from challenge
        const functionName = Object.keys(this.challenges)[
            Object.values(this.challenges).indexOf(this.challenges[this.currentChallenge])
        ];
        
        const wrappedCode = `
            "use strict";
            ${code}
            return ${this.getFunctionName(code)};
        `;

        try {
            const func = new Function(wrappedCode);
            return func();
        } catch (error) {
            throw new Error(`Code compilation error: ${error.message}`);
        }
    }

    getFunctionName(code) {
        const match = code.match(/function\s+(\w+)\s*\(/);
        return match ? match[1] : 'unknownFunction';
    }

    compareValues(actual, expected) {
        if (typeof actual !== typeof expected) return false;
        if (actual === expected) return true;
        
        // Deep comparison for objects/arrays
        if (typeof actual === 'object' && actual !== null && expected !== null) {
            return JSON.stringify(actual) === JSON.stringify(expected);
        }
        
        return false;
    }

    displayResults(results) {
        if (results.error) {
            this.resultsContent.innerHTML = `
                <div class="validation-summary failure">
                    <h4>Compilation Error</h4>
                    <p>${results.error}</p>
                </div>
            `;
            return;
        }

        const allPassed = results.passed === results.total;
        const summaryClass = allPassed ? 'success' : 'failure';
        const summaryText = allPassed ? 
            '🎉 All tests passed! Great job!' : 
            `${results.passed}/${results.total} tests passed. Keep trying!`;

        let html = `
            <div class="validation-summary ${summaryClass}">
                <h4>${summaryText}</h4>
            </div>
        `;

        results.testResults.forEach(test => {
            const statusClass = test.passed ? 'passed' : 'failed';
            const statusText = test.passed ? 'PASSED' : 'FAILED';
            
            html += `
                <div class="test-case ${statusClass}">
                    <div class="test-header">
                        <strong>Test Case ${test.index}</strong>
                        <span class="test-status ${statusClass}">${statusText}</span>
                    </div>
                    <div class="test-details">
                        <div class="test-input"><strong>Input:</strong> ${JSON.stringify(test.input)}</div>
                        <div class="test-expected"><strong>Expected:</strong> ${JSON.stringify(test.expected)}</div>
                        <div class="test-actual"><strong>Actual:</strong> ${JSON.stringify(test.actual)}</div>
                    </div>
                </div>
            `;
        });

        this.resultsContent.innerHTML = html;

        // Award XP if all tests pass
        if (allPassed && window.xpSystem) {
            window.xpSystem.awardXP(100, `Validation Challenge: ${this.challenges[this.currentChallenge].title}`);
        }
    }

    showError(message) {
        this.resultsContent.innerHTML = `
            <div class="validation-summary failure">
                <h4>Error</h4>
                <p>${message}</p>
            </div>
        `;
    }

    clearCode() {
        const challenge = this.challenges[this.currentChallenge];
        this.codeInput.value = challenge.template;
        this.clearResults();
    }

    clearResults() {
        this.resultsContent.innerHTML = '<div class="results-placeholder">Select a challenge and write your solution to see validation results.</div>';
    }
}

// Initialize validator system
document.addEventListener('DOMContentLoaded', () => {
    new JSValidatorSystem();
});