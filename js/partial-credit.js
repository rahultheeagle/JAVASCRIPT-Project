// Partial Credit System - Grade incomplete solutions with detailed feedback
class PartialCreditGrader {
    constructor() {
        this.criteria = [
            {
                id: 'function_declaration',
                name: 'Function Declaration',
                points: 20,
                check: (code) => this.checkFunctionDeclaration(code),
                feedback: {
                    pass: 'Function properly declared',
                    fail: 'Missing or incorrect function declaration'
                }
            },
            {
                id: 'array_filtering',
                name: 'Array Filtering',
                points: 30,
                check: (code) => this.checkArrayFiltering(code),
                feedback: {
                    pass: 'Array filtering implemented correctly',
                    fail: 'Array filtering missing or incorrect'
                }
            },
            {
                id: 'number_doubling',
                name: 'Number Doubling',
                points: 30,
                check: (code) => this.checkNumberDoubling(code),
                feedback: {
                    pass: 'Number doubling implemented correctly',
                    fail: 'Number doubling missing or incorrect'
                }
            },
            {
                id: 'correct_return',
                name: 'Correct Return',
                points: 20,
                check: (code) => this.checkCorrectReturn(code),
                feedback: {
                    pass: 'Function returns correct result',
                    fail: 'Function return is missing or incorrect'
                }
            }
        ];

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('grade-solution').addEventListener('click', () => {
            this.gradeSolution();
        });
    }

    gradeSolution() {
        const code = document.getElementById('solution-code').value;
        const results = this.evaluateCriteria(code);
        const totalScore = results.reduce((sum, result) => sum + result.earnedPoints, 0);
        const maxScore = this.criteria.reduce((sum, criterion) => sum + criterion.points, 0);
        const percentage = Math.round((totalScore / maxScore) * 100);

        this.displayResults(results, totalScore, maxScore, percentage);
    }

    evaluateCriteria(code) {
        return this.criteria.map(criterion => {
            const passed = criterion.check(code);
            const earnedPoints = passed ? criterion.points : this.getPartialPoints(criterion, code);
            
            return {
                ...criterion,
                passed: passed,
                earnedPoints: earnedPoints,
                feedback: passed ? criterion.feedback.pass : criterion.feedback.fail
            };
        });
    }

    getPartialPoints(criterion, code) {
        // Award partial credit based on criterion type
        switch (criterion.id) {
            case 'function_declaration':
                if (code.includes('function')) return Math.floor(criterion.points * 0.5);
                if (code.includes('=>')) return Math.floor(criterion.points * 0.3);
                return 0;
            
            case 'array_filtering':
                if (code.includes('filter')) return Math.floor(criterion.points * 0.7);
                if (code.includes('for') || code.includes('forEach')) return Math.floor(criterion.points * 0.4);
                return 0;
            
            case 'number_doubling':
                if (code.includes('* 2') || code.includes('*2')) return Math.floor(criterion.points * 0.8);
                if (code.includes('map')) return Math.floor(criterion.points * 0.5);
                return 0;
            
            case 'correct_return':
                if (code.includes('return')) return Math.floor(criterion.points * 0.6);
                return 0;
            
            default:
                return 0;
        }
    }

    checkFunctionDeclaration(code) {
        return /function\s+processArray\s*\(/.test(code) || 
               /processArray\s*=\s*\(/.test(code) ||
               /const\s+processArray\s*=/.test(code);
    }

    checkArrayFiltering(code) {
        // Check for filter with even number condition
        return /\.filter\s*\(\s*\w+\s*=>\s*\w+\s*%\s*2\s*===?\s*0/.test(code) ||
               /\.filter\s*\(\s*function\s*\(\w+\)\s*{\s*return\s+\w+\s*%\s*2\s*===?\s*0/.test(code);
    }

    checkNumberDoubling(code) {
        // Check for map with doubling or direct multiplication
        return /\.map\s*\(\s*\w+\s*=>\s*\w+\s*\*\s*2/.test(code) ||
               /\*\s*2/.test(code) && this.checkArrayFiltering(code);
    }

    checkCorrectReturn(code) {
        try {
            const func = new Function('return ' + code)();
            const testResult = func([1, 2, 3, 4, 5, 6]);
            const expected = [4, 8, 12];
            return JSON.stringify(testResult) === JSON.stringify(expected);
        } catch (e) {
            return code.includes('return');
        }
    }

    displayResults(results, totalScore, maxScore, percentage) {
        // Update score display
        document.getElementById('total-score').innerHTML = `
            <span class="score-value">${totalScore}</span>
            <span class="score-max">/${maxScore}</span>
        `;
        document.getElementById('score-percentage').textContent = `${percentage}%`;

        // Update score color based on percentage
        const scoreElement = document.querySelector('.total-score');
        scoreElement.className = `total-score ${this.getScoreClass(percentage)}`;

        // Display criteria breakdown
        const breakdownContainer = document.querySelector('.criteria-list');
        breakdownContainer.innerHTML = results.map(result => this.renderCriterion(result)).join('');

        // Display feedback
        const feedbackContainer = document.querySelector('.feedback-list');
        const suggestions = this.generateSuggestions(results);
        feedbackContainer.innerHTML = suggestions.map(suggestion => `
            <div class="feedback-item">
                <span class="feedback-icon">${suggestion.icon}</span>
                <span class="feedback-text">${suggestion.text}</span>
            </div>
        `).join('');
    }

    renderCriterion(result) {
        const statusIcon = result.passed ? '✅' : 
                          result.earnedPoints > 0 ? '🟡' : '❌';
        const statusClass = result.passed ? 'passed' : 
                           result.earnedPoints > 0 ? 'partial' : 'failed';

        return `
            <div class="criterion-item ${statusClass}">
                <div class="criterion-header">
                    <span class="criterion-status">${statusIcon}</span>
                    <span class="criterion-name">${result.name}</span>
                    <span class="criterion-points">${result.earnedPoints}/${result.points} pts</span>
                </div>
                <div class="criterion-feedback">${result.feedback}</div>
            </div>
        `;
    }

    generateSuggestions(results) {
        const suggestions = [];
        
        results.forEach(result => {
            if (!result.passed) {
                switch (result.id) {
                    case 'function_declaration':
                        suggestions.push({
                            icon: '💡',
                            text: 'Try: function processArray(arr) { ... }'
                        });
                        break;
                    case 'array_filtering':
                        suggestions.push({
                            icon: '🔍',
                            text: 'Use .filter() to get even numbers: arr.filter(x => x % 2 === 0)'
                        });
                        break;
                    case 'number_doubling':
                        suggestions.push({
                            icon: '✖️',
                            text: 'Use .map() to double numbers: .map(x => x * 2)'
                        });
                        break;
                    case 'correct_return':
                        suggestions.push({
                            icon: '↩️',
                            text: 'Make sure to return the processed array'
                        });
                        break;
                }
            }
        });

        if (suggestions.length === 0) {
            suggestions.push({
                icon: '🎉',
                text: 'Perfect solution! All criteria met.'
            });
        }

        return suggestions;
    }

    getScoreClass(percentage) {
        if (percentage >= 90) return 'excellent';
        if (percentage >= 80) return 'good';
        if (percentage >= 70) return 'fair';
        if (percentage >= 60) return 'poor';
        return 'failing';
    }
}

// Initialize grader when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PartialCreditGrader();
});