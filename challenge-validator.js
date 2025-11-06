// Challenge Validation System
class ChallengeValidator {
    constructor() {
        this.validationRules = this.loadValidationRules();
    }
    
    // Load validation rules for each challenge
    loadValidationRules() {
        return {
            'html-basics': {
                1: {
                    title: 'Basic HTML Structure',
                    validators: [
                        {
                            name: 'DOCTYPE Declaration',
                            check: (html) => html.includes('<!DOCTYPE html>'),
                            message: 'Missing DOCTYPE html declaration'
                        },
                        {
                            name: 'HTML Element with Lang',
                            check: (html) => /<html[^>]*lang\s*=\s*["'][^"']*["'][^>]*>/i.test(html),
                            message: 'HTML element must include lang attribute'
                        },
                        {
                            name: 'Head Section',
                            check: (html) => /<head[\s\S]*<\/head>/i.test(html),
                            message: 'Missing head section'
                        },
                        {
                            name: 'Title Element',
                            check: (html) => /<title[\s\S]*<\/title>/i.test(html),
                            message: 'Missing title element in head'
                        },
                        {
                            name: 'Body Section',
                            check: (html) => /<body[\s\S]*<\/body>/i.test(html),
                            message: 'Missing body section'
                        }
                    ]
                },
                2: {
                    title: 'Headings and Paragraphs',
                    validators: [
                        {
                            name: 'H1 Element',
                            check: (html) => /<h1[\s\S]*<\/h1>/i.test(html),
                            message: 'Missing h1 element'
                        },
                        {
                            name: 'Multiple Heading Levels',
                            check: (html) => {
                                const h1 = /<h1[\s\S]*<\/h1>/i.test(html);
                                const h2 = /<h2[\s\S]*<\/h2>/i.test(html);
                                const h3 = /<h3[\s\S]*<\/h3>/i.test(html);
                                return [h1, h2, h3].filter(Boolean).length >= 3;
                            },
                            message: 'Need at least 3 different heading levels (h1, h2, h3)'
                        },
                        {
                            name: 'Paragraph Elements',
                            check: (html) => (html.match(/<p[\s\S]*?<\/p>/gi) || []).length >= 2,
                            message: 'Need at least 2 paragraph elements'
                        }
                    ]
                }
            },
            'css-styling': {
                1: {
                    title: 'Basic CSS Selectors',
                    validators: [
                        {
                            name: 'Element Selector',
                            check: (css) => /^[a-zA-Z][a-zA-Z0-9]*\s*\{[^}]*\}/m.test(css),
                            message: 'Missing element selector (e.g., h1 { })'
                        },
                        {
                            name: 'Class Selector',
                            check: (css) => /\.[a-zA-Z][a-zA-Z0-9-_]*\s*\{[^}]*\}/m.test(css),
                            message: 'Missing class selector (e.g., .my-class { })'
                        },
                        {
                            name: 'ID Selector',
                            check: (css) => /#[a-zA-Z][a-zA-Z0-9-_]*\s*\{[^}]*\}/m.test(css),
                            message: 'Missing ID selector (e.g., #my-id { })'
                        },
                        {
                            name: 'Color Property',
                            check: (css) => /color\s*:\s*[^;]+;/i.test(css),
                            message: 'Missing color property'
                        },
                        {
                            name: 'Font Property',
                            check: (css) => /(font-family|font-size|font-weight)\s*:\s*[^;]+;/i.test(css),
                            message: 'Missing font-related property'
                        }
                    ]
                }
            },
            'js-fundamentals': {
                1: {
                    title: 'Variables and Data Types',
                    validators: [
                        {
                            name: 'Let Declaration',
                            check: (js) => /let\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/m.test(js),
                            message: 'Missing let variable declaration'
                        },
                        {
                            name: 'Const Declaration',
                            check: (js) => /const\s+[a-zA-Z_$][a-zA-Z0-9_$]*\s*=/m.test(js),
                            message: 'Missing const variable declaration'
                        },
                        {
                            name: 'String Variable',
                            check: (js) => /=\s*["'`][^"'`]*["'`]/m.test(js),
                            message: 'Missing string variable'
                        },
                        {
                            name: 'Number Variable',
                            check: (js) => /=\s*\d+/m.test(js),
                            message: 'Missing number variable'
                        },
                        {
                            name: 'Console Log',
                            check: (js) => /console\.log\s*\(/i.test(js),
                            message: 'Missing console.log statement'
                        }
                    ]
                }
            },
            'mini-projects': {
                1: {
                    title: 'Personal Portfolio',
                    validators: [
                        {
                            name: 'Header Element',
                            check: (html) => /<header[\s\S]*<\/header>/i.test(html),
                            message: 'Missing header element'
                        },
                        {
                            name: 'Navigation Menu',
                            check: (html) => /<nav[\s\S]*<\/nav>/i.test(html),
                            message: 'Missing navigation menu'
                        },
                        {
                            name: 'Multiple Sections',
                            check: (html) => (html.match(/<section[\s\S]*?<\/section>/gi) || []).length >= 3,
                            message: 'Need at least 3 sections (about, skills, projects, contact)'
                        },
                        {
                            name: 'CSS Grid or Flexbox',
                            check: (css) => /(display\s*:\s*(grid|flex))/i.test(css),
                            message: 'Missing CSS Grid or Flexbox layout'
                        },
                        {
                            name: 'Media Query',
                            check: (css) => /@media\s*\([^)]*\)/i.test(css),
                            message: 'Missing media query for responsive design'
                        }
                    ]
                }
            }
        };
    }
    
    // Validate challenge solution
    validateChallenge(category, challengeId, html, css, js) {
        const rules = this.validationRules[category]?.[challengeId];
        if (!rules) {
            return {
                isValid: false,
                message: 'Challenge validation rules not found',
                results: []
            };
        }
        
        const results = [];
        let passedCount = 0;
        
        for (const validator of rules.validators) {
            try {
                const passed = validator.check(html, css, js);
                results.push({
                    name: validator.name,
                    passed: passed,
                    message: passed ? 'Passed' : validator.message
                });
                
                if (passed) passedCount++;
            } catch (error) {
                results.push({
                    name: validator.name,
                    passed: false,
                    message: 'Validation error: ' + error.message
                });
            }
        }
        
        const totalTests = rules.validators.length;
        const isValid = passedCount === totalTests;
        const percentage = Math.round((passedCount / totalTests) * 100);
        
        // Record progress for gamification systems if challenge is completed
        if (isValid && typeof window !== 'undefined') {
            // Check achievements
            if (window.achievementSystem) {
                window.achievementSystem.checkChallengeAchievements(category, false);
            }
            
            // Record for daily challenges
            if (window.dailyChallengeSystem) {
                window.dailyChallengeSystem.recordProgress('challenge');
            }
            
            // Record for missions based on category
            if (window.missionSystem) {
                if (category === 'html-basics') {
                    window.missionSystem.recordProgress('html-challenge');
                } else if (category === 'css-styling') {
                    window.missionSystem.recordProgress('css-challenge');
                } else if (category === 'js-fundamentals') {
                    window.missionSystem.recordProgress('js-challenge');
                }
            }
            
            // Award XP with power-up multiplier
            if (window.xpSystem && window.powerUpSystem) {
                const baseXP = this.getChallengeXP(category, challengeId);
                const multiplier = window.powerUpSystem.getActiveMultiplier('xp');
                window.xpSystem.awardXP(baseXP * multiplier, `Challenge: ${rules.title}`);
            }
        }
        
        return {
            isValid: isValid,
            passedCount: passedCount,
            totalTests: totalTests,
            percentage: percentage,
            message: isValid 
                ? 'All requirements met! Challenge completed successfully!' 
                : `${passedCount}/${totalTests} requirements met (${percentage}%)`,
            results: results
        };
    }
    
    // Advanced HTML validation
    validateHTML(html) {
        const issues = [];
        
        // Check for common HTML issues
        if (!html.trim()) {
            issues.push('HTML content is empty');
            return issues;
        }
        
        // Check for unclosed tags
        const openTags = html.match(/<[^\/][^>]*>/g) || [];
        const closeTags = html.match(/<\/[^>]*>/g) || [];
        
        if (openTags.length !== closeTags.length) {
            issues.push('Possible unclosed HTML tags detected');
        }
        
        // Check for proper nesting
        if (html.includes('<body') && html.includes('<head') && 
            html.indexOf('<body') < html.indexOf('<head')) {
            issues.push('Body element should come after head element');
        }
        
        return issues;
    }
    
    // Advanced CSS validation
    validateCSS(css) {
        const issues = [];
        
        if (!css.trim()) {
            issues.push('CSS content is empty');
            return issues;
        }
        
        // Check for syntax errors
        const braceCount = (css.match(/\{/g) || []).length - (css.match(/\}/g) || []).length;
        if (braceCount !== 0) {
            issues.push('Mismatched CSS braces detected');
        }
        
        // Check for missing semicolons
        const declarations = css.match(/[^{}]+\{[^{}]*\}/g) || [];
        for (const declaration of declarations) {
            const content = declaration.match(/\{([^}]*)\}/)?.[1] || '';
            const lines = content.split(';').filter(line => line.trim());
            if (lines.length > 0 && !content.trim().endsWith(';')) {
                issues.push('Missing semicolon in CSS declaration');
                break;
            }
        }
        
        return issues;
    }
    
    // Advanced JavaScript validation
    validateJavaScript(js) {
        const issues = [];
        
        if (!js.trim()) {
            issues.push('JavaScript content is empty');
            return issues;
        }
        
        try {
            // Basic syntax check using Function constructor
            new Function(js);
        } catch (error) {
            issues.push('JavaScript syntax error: ' + error.message);
        }
        
        // Check for common issues
        if (js.includes('var ')) {
            issues.push('Consider using let or const instead of var');
        }
        
        return issues;
    }
    
    // Get XP reward for challenge completion
    getChallengeXP(category, challengeId) {
        const baseXP = {
            'html-basics': 30,
            'css-styling': 40,
            'js-fundamentals': 50,
            'mini-projects': 100
        };
        
        return baseXP[category] || 25;
    }
    
    // Run comprehensive validation
    runFullValidation(category, challengeId, html, css, js) {
        const challengeValidation = this.validateChallenge(category, challengeId, html, css, js);
        const htmlIssues = this.validateHTML(html);
        const cssIssues = this.validateCSS(css);
        const jsIssues = this.validateJavaScript(js);
        
        return {
            challenge: challengeValidation,
            syntax: {
                html: htmlIssues,
                css: cssIssues,
                js: jsIssues
            },
            hasIssues: htmlIssues.length > 0 || cssIssues.length > 0 || jsIssues.length > 0
        };
    }
    
    // Record failed attempt for solution reveal system
    recordFailedAttempt(category, challengeId) {
        if (typeof window !== 'undefined' && window.localStorage) {
            const key = `failed_attempts_${category}_${challengeId}`;
            const attempts = parseInt(localStorage.getItem(key) || '0') + 1;
            localStorage.setItem(key, attempts.toString());
            return attempts;
        }
        return 0;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengeValidator;
} else {
    window.ChallengeValidator = ChallengeValidator;
}