// Solution reveal functionality for challenge detail page
document.addEventListener('DOMContentLoaded', () => {
    // Add solution reveal methods to existing challenge detail
    if (typeof challengeDetail !== 'undefined') {
        challengeDetail.loadFailedAttempts = function() {
            const saved = localStorage.getItem('codequest_failed_attempts');
            const attempts = saved ? JSON.parse(saved) : {};
            const key = `${this.category}-${this.challengeId}`;
            return attempts[key] || 0;
        };
        
        challengeDetail.saveFailedAttempts = function(count) {
            const saved = localStorage.getItem('codequest_failed_attempts');
            const attempts = saved ? JSON.parse(saved) : {};
            const key = `${this.category}-${this.challengeId}`;
            attempts[key] = count;
            localStorage.setItem('codequest_failed_attempts', JSON.stringify(attempts));
        };
        
        challengeDetail.setupSolutionReveal = function() {
            const solutionSection = document.getElementById('solution-section');
            const attemptCount = document.getElementById('attempt-count');
            const revealBtn = document.getElementById('reveal-solution');
            
            if (!solutionSection || !attemptCount || !revealBtn) return;
            
            const failedAttempts = this.loadFailedAttempts();
            attemptCount.textContent = failedAttempts;
            
            if (failedAttempts >= 3) {
                revealBtn.disabled = false;
                revealBtn.classList.add('available');
                revealBtn.textContent = 'Reveal Solution';
            }
            
            revealBtn.addEventListener('click', () => {
                if (failedAttempts >= 3) {
                    this.showSolution();
                }
            });
            
            solutionSection.style.display = 'block';
        };
        
        challengeDetail.showSolution = function() {
            const solutionContent = document.getElementById('solution-content');
            const solutions = {
                'html-basics': {
                    1: {
                        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first HTML document.</p>
</body>
</html>`,
                        css: `body {
    font-family: Arial, sans-serif;
    margin: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}`,
                        js: `console.log('HTML structure created successfully!');`,
                        explanation: 'This solution includes all required HTML5 elements: DOCTYPE declaration, html element with lang attribute, head section with title, and body with content. The structure follows proper HTML5 standards.'
                    },
                    2: {
                        html: `<h1>My Blog Post</h1>
<h2>Introduction</h2>
<p>This is the introduction paragraph of my blog post.</p>

<h2>Main Content</h2>
<p>Here is the main content with detailed information.</p>

<h3>Subsection</h3>
<p>This is a subsection with additional details.</p>

<h2>Conclusion</h2>
<p>This is the conclusion paragraph wrapping up the blog post.</p>`,
                        css: `h1 { 
    color: #2c3e50; 
    text-align: center; 
}
h2 { 
    color: #34495e; 
    border-bottom: 2px solid #3498db; 
}
h3 { 
    color: #7f8c8d; 
}
p { 
    line-height: 1.6; 
    margin-bottom: 15px; 
}`,
                        js: `console.log('Headings and paragraphs structured correctly!');`,
                        explanation: 'This solution demonstrates proper heading hierarchy (h1 for main title, h2 for sections, h3 for subsections) and includes multiple paragraph elements with meaningful content.'
                    }
                },
                'css-styling': {
                    1: {
                        html: `<h1 id="main-title">Welcome to My Website</h1>
<p class="intro">This is an introduction paragraph.</p>
<p class="highlight">This paragraph is highlighted.</p>
<div class="container">
    <span>This is inside a container.</span>
</div>`,
                        css: `/* Element selector */
h1 {
    color: #2c3e50;
    font-family: 'Arial', sans-serif;
    text-align: center;
}

/* Class selectors */
.intro {
    font-size: 18px;
    color: #34495e;
    margin-bottom: 20px;
}

.highlight {
    background-color: #f39c12;
    color: white;
    padding: 10px;
    border-radius: 5px;
}

/* ID selector */
#main-title {
    border-bottom: 3px solid #3498db;
    padding-bottom: 10px;
}`,
                        js: `console.log('CSS selectors applied successfully!');`,
                        explanation: 'This solution uses element selectors (h1), class selectors (.intro, .highlight), and ID selectors (#main-title) to apply different styles including colors, fonts, spacing, and visual hierarchy.'
                    }
                }
            };
            
            const solution = solutions[this.category]?.[this.challengeId];
            if (!solution) {
                solutionContent.innerHTML = '<p>Solution not available for this challenge.</p>';
                solutionContent.style.display = 'block';
                return;
            }
            
            solutionContent.innerHTML = `
                <div class="solution-warning">
                    ⚠ <strong>Warning:</strong> Try to understand the solution rather than just copying it. Learning comes from understanding the logic!
                </div>
                
                <div class="solution-code">
                    <h5>HTML Solution:</h5>
                    <pre><code>${solution.html.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>
                    
                    <h5>CSS Solution:</h5>
                    <pre><code>${solution.css}</code></pre>
                    
                    <h5>JavaScript Solution:</h5>
                    <pre><code>${solution.js}</code></pre>
                </div>
                
                <div class="solution-explanation">
                    <h5>📝 Explanation:</h5>
                    <p>${solution.explanation}</p>
                </div>
            `;
            
            solutionContent.style.display = 'block';
            document.getElementById('reveal-solution').textContent = 'Solution Revealed';
            document.getElementById('reveal-solution').disabled = true;
        };
    }
});