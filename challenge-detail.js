// Challenge Detail System with Requirements and Instructions
class ChallengeDetail {
    constructor() {
        this.challengeId = this.getChallengeIdFromURL();
        this.category = this.getCategoryFromURL();
        this.challengeData = this.loadChallengeData();
        
        this.initializeElements();
        this.loadChallengeDetails();
        this.bindEvents();
    }
    
    // Get challenge ID from URL parameters
    getChallengeIdFromURL() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get('id')) || 1;
    }
    
    // Get category from URL parameters
    getCategoryFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get('category') || 'html-basics';
    }
    
    // Initialize DOM elements
    initializeElements() {
        this.backBtn = document.getElementById('back-to-challenges');
        this.challengeTitle = document.getElementById('challenge-title');
        this.difficultyBadge = document.getElementById('difficulty-badge');
        this.xpBadge = document.getElementById('xp-badge');
        this.categoryBadge = document.getElementById('category-badge');
        this.challengeDescription = document.getElementById('challenge-description');
        this.requirementsList = document.getElementById('requirements-list');
        this.showHintBtn = document.getElementById('show-hint');
        this.hintButtons = document.getElementById('hint-buttons');
        this.hintContent = document.getElementById('hint-content');
        
        this.userXP = this.loadUserXP();
        this.unlockedHints = this.loadUnlockedHints();
        this.examplePreview = document.getElementById('example-preview');
        this.starterHtml = document.getElementById('starter-html');
        this.starterCss = document.getElementById('starter-css');
        this.starterJs = document.getElementById('starter-js');
        this.copyStarterBtn = document.getElementById('copy-starter');
        this.challengeProgress = document.getElementById('challenge-progress');
        this.startChallengeBtn = document.getElementById('start-challenge');
        this.skipChallengeBtn = document.getElementById('skip-challenge');
        this.startCodingBtn = document.getElementById('start-coding');
        
        // Timer elements
        this.timerWidget = document.getElementById('challenge-timer-widget');
        this.challengeKey = `${this.category}-${this.challengeId}`;
        
        // Initialize timer widget
        this.initializeTimer();
    }\n    \n    // Load challenge data from localStorage\n    loadChallengeData() {\n        const saved = localStorage.getItem('codequest_challenges');\n        return saved ? JSON.parse(saved) : {};\n    }\n    \n    // Define detailed challenge requirements and instructions\n    getChallengeDetails() {\n        const challengeDetails = {\n            'html-basics': {\n                1: {\n                    title: 'Basic HTML Structure',\n                    description: 'Create a complete HTML document with proper structure including DOCTYPE, html, head, and body elements.',\n                    requirements: [\n                        'Include DOCTYPE html declaration',\n                        'Create html element with lang attribute',\n                        'Add head section with title element',\n                        'Include body section with content',\n                        'Use proper indentation and formatting'\n                    ],\n                    hints: [\n                        'Start with <!DOCTYPE html>',\n                        'Remember to set the language attribute: <html lang=\"en\">',\n                        'The title appears in the browser tab'\n                    ],\n                    example: 'A basic webpage with \"Hello World\" heading and paragraph',\n                    starterCode: {\n                        html: '<!-- Create your HTML structure here -->',\n                        css: '/* Add your styles here */',\n                        js: '// Add your JavaScript here'\n                    }\n                },\n                2: {\n                    title: 'Headings and Paragraphs',\n                    description: 'Use different heading levels (h1-h6) and paragraph elements to create a structured document.',\n                    requirements: [\n                        'Use at least 3 different heading levels (h1, h2, h3)',\n                        'Include multiple paragraph elements',\n                        'Maintain proper heading hierarchy',\n                        'Add meaningful content to each element'\n                    ],\n                    hints: [\n                        'h1 should be used for main title',\n                        'Use h2 for section headings, h3 for subsections',\n                        'Paragraphs should contain complete sentences'\n                    ],\n                    example: 'A blog post structure with main title, section headings, and paragraphs',\n                    starterCode: {\n                        html: '<h1>Main Title</h1>\\n<!-- Add more headings and paragraphs -->',\n                        css: 'h1 { color: #333; }',\n                        js: '// No JavaScript needed for this challenge'\n                    }\n                }\n            },\n            'css-styling': {\n                1: {\n                    title: 'Basic CSS Selectors',\n                    description: 'Apply styles using element, class, and ID selectors to create a visually appealing webpage.',\n                    requirements: [\n                        'Use element selectors to style HTML tags',\n                        'Create and use at least 2 CSS classes',\n                        'Use at least 1 ID selector',\n                        'Apply colors, fonts, and spacing',\n                        'Ensure good visual hierarchy'\n                    ],\n                    hints: [\n                        'Element selector: h1 { }',\n                        'Class selector: .my-class { }',\n                        'ID selector: #my-id { }'\n                    ],\n                    example: 'A styled webpage with different colors, fonts, and spacing',\n                    starterCode: {\n                        html: '<h1 id=\"main-title\">Welcome</h1>\\n<p class=\"intro\">Introduction paragraph</p>',\n                        css: '/* Add your CSS selectors and styles here */',\n                        js: '// No JavaScript needed'\n                    }\n                }\n            },\n            'js-fundamentals': {\n                1: {\n                    title: 'Variables and Data Types',\n                    description: 'Declare variables using different data types and display them on the webpage.',\n                    requirements: [\n                        'Declare variables using let and const',\n                        'Use string, number, and boolean data types',\n                        'Display variable values in HTML elements',\n                        'Use template literals for string formatting',\n                        'Add console.log statements for debugging'\n                    ],\n                    hints: [\n                        'Use const for values that won\\'t change',\n                        'Template literals use backticks: `Hello ${name}`',\n                        'Use document.getElementById() to update HTML'\n                    ],\n                    example: 'A webpage showing different variable values and types',\n                    starterCode: {\n                        html: '<div id=\"output\">Variables will appear here</div>',\n                        css: '#output { padding: 20px; font-family: Arial; }',\n                        js: '// Declare your variables here\\n// Update the HTML content'\n                    }\n                }\n            },\n            'mini-projects': {\n                1: {\n                    title: 'Personal Portfolio',\n                    description: 'Create a responsive personal portfolio website showcasing your skills and projects.',\n                    requirements: [\n                        'Create a header with navigation menu',\n                        'Add an about section with personal information',\n                        'Include a skills section with your abilities',\n                        'Add a projects section with sample projects',\n                        'Include a contact section with contact information',\n                        'Make the design responsive for mobile devices',\n                        'Use CSS Grid or Flexbox for layout',\n                        'Add smooth scrolling navigation'\n                    ],\n                    hints: [\n                        'Use semantic HTML elements like <header>, <section>, <nav>',\n                        'CSS Grid is great for overall layout, Flexbox for components',\n                        'Use media queries for responsive design',\n                        'Add CSS transitions for smooth interactions'\n                    ],\n                    example: 'A complete portfolio website with multiple sections and responsive design',\n                    starterCode: {\n                        html: '<!DOCTYPE html>\\n<html lang=\"en\">\\n<head>\\n    <meta charset=\"UTF-8\">\\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\\n    <title>My Portfolio</title>\\n</head>\\n<body>\\n    <!-- Build your portfolio here -->\\n</body>\\n</html>',\n                        css: '/* Add your portfolio styles here */',\n                        js: '// Add interactive features here'\n                    }\n                }\n            }\n        };\n        \n        return challengeDetails[this.category]?.[this.challengeId] || this.getDefaultChallenge();\n    }\n    \n    // Get default challenge if not found\n    getDefaultChallenge() {\n        return {\n            title: 'Challenge Not Found',\n            description: 'This challenge is not yet available.',\n            requirements: ['Challenge content coming soon'],\n            hints: ['Check back later for this challenge'],\n            example: 'Challenge preview not available',\n            starterCode: { html: '', css: '', js: '' }\n        };\n    }\n    \n    // Load and display challenge details\n    loadChallengeDetails() {\n        const challenge = this.getChallengeDetails();\n        const allChallenges = this.getAllChallenges();\n        const currentChallenge = allChallenges[this.category]?.find(c => c.id === this.challengeId);\n        \n        if (!currentChallenge) return;\n        \n        // Update header information\n        this.challengeTitle.textContent = challenge.title;\n        this.difficultyBadge.textContent = currentChallenge.difficulty;\n        this.difficultyBadge.className = `difficulty-badge ${currentChallenge.difficulty}`;\n        this.xpBadge.textContent = `+${currentChallenge.xp} XP`;\n        \n        const categoryNames = {\n            'html-basics': 'HTML Basics',\n            'css-styling': 'CSS Styling',\n            'js-fundamentals': 'JavaScript Fundamentals',\n            'mini-projects': 'Mini-Projects'\n        };\n        this.categoryBadge.textContent = categoryNames[this.category];\n        \n        // Update content\n        this.challengeDescription.textContent = challenge.description;\n        \n        // Populate requirements\n        this.requirementsList.innerHTML = challenge.requirements\n            .map(req => `<li>${req}</li>`)\n            .join('');\n        \n        // Set up hints\n        this.hintContent.innerHTML = challenge.hints\n            .map(hint => `<p>${hint}</p>`)\n            .join('');\n        \n        // Set example\n        this.examplePreview.textContent = challenge.example;\n        \n        // Set starter code\n        this.starterHtml.textContent = challenge.starterCode.html;\n        this.starterCss.textContent = challenge.starterCode.css;\n        this.starterJs.textContent = challenge.starterCode.js;\n        \n        // Update progress
        const totalChallenges = allChallenges[this.category]?.length || 0;
        this.challengeProgress.textContent = `Challenge ${this.challengeId} of ${totalChallenges}`;
        
        // Check if challenge is completed
        const isCompleted = this.challengeData[this.category]?.includes(this.challengeId);
        if (isCompleted) {
            this.startChallengeBtn.textContent = 'Completed ✓';
            this.startChallengeBtn.style.background = '#4caf50';
        }
        
        // Update timer widget with challenge info
        this.updateTimerWidget(challenge.title);\n    }\n    \n    // Get all challenges (simplified version)\n    getAllChallenges() {\n        return {\n            'html-basics': Array.from({length: 10}, (_, i) => ({ id: i + 1, difficulty: i < 4 ? 'easy' : i < 7 ? 'medium' : 'hard', xp: (i + 1) * 5 + 5 })),\n            'css-styling': Array.from({length: 10}, (_, i) => ({ id: i + 1, difficulty: i < 3 ? 'easy' : i < 7 ? 'medium' : 'hard', xp: (i + 1) * 5 + 5 })),\n            'js-fundamentals': Array.from({length: 10}, (_, i) => ({ id: i + 1, difficulty: i < 4 ? 'easy' : i < 6 ? 'medium' : 'hard', xp: (i + 1) * 5 + 5 })),\n            'mini-projects': Array.from({length: 5}, (_, i) => ({ id: i + 1, difficulty: i < 2 ? 'medium' : 'hard', xp: 100 + i * 20 }))\n        };\n    }\n    \n    // Bind event listeners\n    bindEvents() {\n        // Back to challenges\n        this.backBtn.addEventListener('click', () => {\n            window.location.href = `challenges.html`;\n        });\n        \n        // Show hint\n        this.showHintBtn.addEventListener('click', () => {\n            if (this.hintContent.style.display === 'none') {\n                this.hintContent.style.display = 'block';\n                this.showHintBtn.textContent = 'Hide Hint';\n            } else {\n                this.hintContent.style.display = 'none';\n                this.showHintBtn.textContent = 'Show Hint';\n            }\n        });\n        \n        // Copy starter code\n        this.copyStarterBtn.addEventListener('click', () => {\n            this.copyStarterCode();\n        });\n        \n        // Start challenge\n        this.startChallengeBtn.addEventListener('click', () => {\n            this.startChallenge();\n        });\n        \n        // Skip challenge\n        this.skipChallengeBtn.addEventListener('click', () => {\n            this.skipChallenge();\n        });\n        \n        // Start coding
        this.startCodingBtn.addEventListener('click', () => {
            this.startCoding();
        });
        
        // Listen for timer events
        window.addEventListener('timerStarted', (e) => {
            if (e.detail.challengeId === this.challengeKey) {
                this.startChallengeBtn.textContent = 'In Progress...';
                this.startChallengeBtn.style.background = '#ff9800';
            }
        });
        
        window.addEventListener('timerStopped', (e) => {
            if (e.detail.challengeId === this.challengeKey && e.detail.completed) {
                this.startChallengeBtn.textContent = 'Completed ✓';
                this.startChallengeBtn.style.background = '#4caf50';
            }
        });\n    }\n    \n    // Copy starter code to clipboard\n    copyStarterCode() {\n        const challenge = this.getChallengeDetails();\n        const code = `HTML:\\n${challenge.starterCode.html}\\n\\nCSS:\\n${challenge.starterCode.css}\\n\\nJavaScript:\\n${challenge.starterCode.js}`;\n        \n        navigator.clipboard.writeText(code).then(() => {\n            this.copyStarterBtn.textContent = 'Copied!';\n            setTimeout(() => {\n                this.copyStarterBtn.textContent = 'Copy Code';\n            }, 2000);\n        });\n    }\n    \n    // Start challenge (mark as completed for now)
    startChallenge() {
        if (!this.challengeData[this.category]) {
            this.challengeData[this.category] = [];
        }
        
        if (!this.challengeData[this.category].includes(this.challengeId)) {
            // Stop timer and mark as completed
            let completionTime = null;
            if (window.TimerSystem) {
                const session = window.TimerSystem.stopTimer(true);
                completionTime = session ? session.duration : null;
            }
            
            this.challengeData[this.category].push(this.challengeId);
            localStorage.setItem('codequest_challenges', JSON.stringify(this.challengeData));
            
            this.startChallengeBtn.textContent = 'Completed ✓';
            this.startChallengeBtn.style.background = '#4caf50';
            
            this.showCompletionMessage(completionTime);
        }
    }\n    \n    // Skip challenge\n    skipChallenge() {\n        const nextId = this.challengeId + 1;\n        const allChallenges = this.getAllChallenges();\n        const maxChallenges = allChallenges[this.category]?.length || 0;\n        \n        if (nextId <= maxChallenges) {\n            window.location.href = `challenge-detail.html?category=${this.category}&id=${nextId}`;\n        } else {\n            window.location.href = 'challenges.html';\n        }\n    }\n    \n    // Start coding in editor
    startCoding() {
        const challenge = this.getChallengeDetails();
        
        // Start timer if not already running
        if (window.TimerSystem && !window.TimerSystem.isActive) {
            window.TimerSystem.startTimer(this.challengeKey, challenge.title);
        }
        
        // Store starter code in localStorage for editor
        localStorage.setItem('codequest_editor_challenge', JSON.stringify({
            html: challenge.starterCode.html,
            css: challenge.starterCode.css,
            js: challenge.starterCode.js,
            challengeId: this.challengeId,
            category: this.category,
            timerKey: this.challengeKey
        }));
        
        window.location.href = 'editor.html';
    }\n    \n    // Initialize timer widget
    initializeTimer() {
        if (this.timerWidget && window.timerUI) {
            const challenge = this.getChallengeDetails();
            this.timerWidget.innerHTML = window.timerUI.createCompactTimer(this.challengeKey);
            
            // Update timer stats
            setTimeout(() => {
                window.timerUI.updateTimerStats(this.challengeKey);
            }, 100);
        }
    }
    
    // Update timer widget with challenge info
    updateTimerWidget(challengeName) {
        if (window.TimerSystem) {
            const timerData = window.TimerSystem.getTimerData(this.challengeKey);
            if (timerData) {
                // Update challenge name if not set
                if (!timerData.name || timerData.name === this.challengeKey) {
                    timerData.name = challengeName;
                    window.TimerSystem.saveTimerData();
                }
            }
        }
    }
    
    // Show completion message
    showCompletionMessage(completionTime = null) {
        const notification = document.createElement('div');
        const timeText = completionTime ? `<br><span>⏱️ Time: ${window.TimerSystem.formatTime(completionTime)}</span>` : '';
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 2rem;">🎉</span>
                <div>
                    <strong>Challenge Completed!</strong><br>
                    <span>Great job on completing this challenge!</span>
                    ${timeText}
                </div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #66BB6A);
            color: white;
            padding: 20px 25px;
            border-radius: 10px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 8px 20px rgba(76, 175, 80, 0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }\n}\n\n// Initialize challenge detail when DOM loads\ndocument.addEventListener('DOMContentLoaded', () => {\n    const challengeDetail = new ChallengeDetail();\n    \n    // Add XP-based hints methods\n    challengeDetail.setupHintsSystem = function(challenge) {\n        const hintKey = `${this.category}-${this.challengeId}`;\n        const unlockedHints = this.unlockedHints[hintKey] || [];\n        \n        const xpDisplay = document.createElement('div');\n        xpDisplay.className = 'xp-display';\n        xpDisplay.innerHTML = `💰 Your XP: ${this.userXP}`;\n        this.hintButtons.parentElement.insertBefore(xpDisplay, this.hintButtons);\n        \n        const hintsWithCosts = [\n            { text: challenge.hints[0] || 'No hint available', cost: 5 },\n            { text: challenge.hints[1] || 'No hint available', cost: 10 },\n            { text: challenge.hints[2] || 'No hint available', cost: 15 }\n        ];\n        \n        this.hintButtons.innerHTML = hintsWithCosts.map((hint, index) => {\n            const isUnlocked = unlockedHints.includes(index);\n            const canAfford = this.userXP >= hint.cost;\n            \n            let buttonClass = 'hint-btn';\n            let buttonText = `Hint ${index + 1}`;\n            let costText = `${hint.cost} XP`;\n            \n            if (isUnlocked) {\n                buttonClass += ' unlocked';\n                buttonText = `Hint ${index + 1} (Unlocked)`;\n                costText = 'Unlocked ✓';\n            } else if (!canAfford) {\n                buttonClass += ' insufficient-xp';\n                costText = `Need ${hint.cost} XP`;\n            }\n            \n            return `\n                <button class="${buttonClass}" data-hint-index="${index}" data-cost="${hint.cost}">\n                    <span>${buttonText}</span>\n                    <span class="hint-cost">${costText}</span>\n                </button>\n            `;\n        }).join('');\n        \n        this.displayUnlockedHints(hintsWithCosts, unlockedHints);\n        \n        this.hintButtons.querySelectorAll('.hint-btn').forEach(btn => {\n            btn.addEventListener('click', () => {\n                const hintIndex = parseInt(btn.dataset.hintIndex);\n                const cost = parseInt(btn.dataset.cost);\n                this.handleHintClick(hintIndex, cost, hintsWithCosts);\n            });\n        });\n    };\n    \n    challengeDetail.handleHintClick = function(hintIndex, cost, hintsWithCosts) {\n        const hintKey = `${this.category}-${this.challengeId}`;\n        const unlockedHints = this.unlockedHints[hintKey] || [];\n        \n        if (unlockedHints.includes(hintIndex)) return;\n        \n        if (this.userXP < cost) {\n            alert(`You need ${cost} XP to unlock this hint. Complete more challenges to earn XP!`);\n            return;\n        }\n        \n        if (confirm(`Unlock this hint for ${cost} XP?`)) {\n            const xpData = JSON.parse(localStorage.getItem('codequest_xp') || '{}');\n            xpData.totalXP = (xpData.totalXP || 0) - cost;\n            localStorage.setItem('codequest_xp', JSON.stringify(xpData));\n            this.userXP = xpData.totalXP;\n            \n            if (!this.unlockedHints[hintKey]) {\n                this.unlockedHints[hintKey] = [];\n            }\n            this.unlockedHints[hintKey].push(hintIndex);\n            localStorage.setItem('codequest_unlocked_hints', JSON.stringify(this.unlockedHints));\n            \n            const challenge = this.getChallengeDetails();\n            this.setupHintsSystem(challenge);\n        }\n    };\n    \n    challengeDetail.displayUnlockedHints = function(hintsWithCosts, unlockedHints) {\n        if (unlockedHints.length === 0) {\n            this.hintContent.innerHTML = '<div class="no-hints">No hints unlocked yet. Purchase hints above to get help!</div>';\n            return;\n        }\n        \n        this.hintContent.innerHTML = unlockedHints\n            .sort((a, b) => a - b)\n            .map(index => {\n                const hint = hintsWithCosts[index];\n                return `\n                    <div class="hint-item">\n                        <h5>💡 Hint ${index + 1}</h5>\n                        <p>${hint.text}</p>\n                    </div>\n                `;\n            }).join('');\n    };\n    \n    // Override loadChallengeDetails to include hints setup\n    const originalLoadChallengeDetails = challengeDetail.loadChallengeDetails;\n    challengeDetail.loadChallengeDetails = function() {\n        originalLoadChallengeDetails.call(this);\n        const challenge = this.getChallengeDetails();\n        this.setupHintsSystem(challenge);\n    };\n});