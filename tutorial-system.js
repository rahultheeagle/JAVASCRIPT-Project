class TutorialSystem {
    constructor() {
        this.currentStep = 0;
        this.tutorials = {
            'html-basics': {
                title: 'HTML Basics Tutorial',
                steps: [
                    {
                        title: 'Create HTML Document',
                        description: 'Start with the basic HTML document structure including DOCTYPE, html, head, and body tags.',
                        code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <title>My Page</title>\n</head>\n<body>\n    <h1>Hello World!</h1>\n</body>\n</html>',
                        check: (code) => code.includes('<!DOCTYPE html>') && code.includes('<html') && code.includes('<head>') && code.includes('<body>')
                    },
                    {
                        title: 'Add Headings',
                        description: 'Add different heading levels (h1, h2, h3) to structure your content.',
                        code: '<h1>Main Title</h1>\n<h2>Subtitle</h2>\n<h3>Section Title</h3>',
                        check: (code) => code.includes('<h1>') && code.includes('<h2>') && code.includes('<h3>')
                    },
                    {
                        title: 'Create Paragraphs',
                        description: 'Add paragraph elements with text content.',
                        code: '<p>This is a paragraph of text.</p>\n<p>This is another paragraph.</p>',
                        check: (code) => (code.match(/<p>/g) || []).length >= 2
                    },
                    {
                        title: 'Add Links',
                        description: 'Create hyperlinks using anchor tags with href attributes.',
                        code: '<a href="https://example.com">Visit Example</a>\n<a href="#section">Go to Section</a>',
                        check: (code) => code.includes('<a href=') && code.includes('</a>')
                    },
                    {
                        title: 'Insert Images',
                        description: 'Add images using img tags with src and alt attributes.',
                        code: '<img src="image.jpg" alt="Description">',
                        check: (code) => code.includes('<img') && code.includes('src=') && code.includes('alt=')
                    }
                ]
            }
        };
        this.currentTutorial = 'html-basics';
        this.initializeElements();
        this.loadTutorial();
    }

    initializeElements() {
        this.stepsList = document.getElementById('steps-list');
        this.tutorialTitle = document.getElementById('tutorial-title');
        this.stepTitle = document.getElementById('step-title');
        this.stepDescription = document.getElementById('step-description');
        this.codeExample = document.getElementById('code-example');
        this.userCode = document.getElementById('user-code');
        this.checkBtn = document.getElementById('check-code');
        this.feedback = document.getElementById('feedback');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.progressFill = document.getElementById('tutorial-progress');
        this.progressText = document.getElementById('progress-text');

        this.checkBtn.addEventListener('click', () => this.checkCode());
        this.prevBtn.addEventListener('click', () => this.previousStep());
        this.nextBtn.addEventListener('click', () => this.nextStep());
    }

    loadTutorial() {
        const tutorial = this.tutorials[this.currentTutorial];
        this.tutorialTitle.textContent = tutorial.title;
        this.renderSteps();
        this.loadStep(0);
    }

    renderSteps() {
        const tutorial = this.tutorials[this.currentTutorial];
        this.stepsList.innerHTML = '';
        
        tutorial.steps.forEach((step, index) => {
            const stepItem = document.createElement('div');
            stepItem.className = 'step-item';
            stepItem.textContent = `${index + 1}. ${step.title}`;
            stepItem.addEventListener('click', () => this.loadStep(index));
            this.stepsList.appendChild(stepItem);
        });
    }

    loadStep(stepIndex) {
        const tutorial = this.tutorials[this.currentTutorial];
        const step = tutorial.steps[stepIndex];
        
        this.currentStep = stepIndex;
        this.stepTitle.textContent = `Step ${stepIndex + 1}: ${step.title}`;
        this.stepDescription.innerHTML = `<p>${step.description}</p>`;
        this.codeExample.innerHTML = `<pre><code>${this.escapeHtml(step.code)}</code></pre>`;
        
        this.userCode.value = '';
        this.feedback.style.display = 'none';
        
        this.updateProgress();
        this.updateNavigation();
        this.updateStepsList();
    }

    checkCode() {
        const tutorial = this.tutorials[this.currentTutorial];
        const step = tutorial.steps[this.currentStep];
        const userCode = this.userCode.value.trim();
        
        if (!userCode) {
            this.showFeedback('Please enter some code to check.', 'error');
            return;
        }
        
        if (step.check(userCode)) {
            this.showFeedback('Great job! Your code is correct. Click Next to continue.', 'success');
            this.nextBtn.disabled = false;
            this.markStepCompleted();
        } else {
            this.showFeedback('Not quite right. Check the example and try again.', 'error');
        }
    }

    showFeedback(message, type) {
        this.feedback.textContent = message;
        this.feedback.className = `feedback ${type}`;
        this.feedback.style.display = 'block';
    }

    markStepCompleted() {
        const stepItems = this.stepsList.querySelectorAll('.step-item');
        stepItems[this.currentStep].classList.add('completed');
    }

    updateProgress() {
        const tutorial = this.tutorials[this.currentTutorial];
        const progress = ((this.currentStep + 1) / tutorial.steps.length) * 100;
        this.progressFill.style.width = `${progress}%`;
        this.progressText.textContent = `Step ${this.currentStep + 1} of ${tutorial.steps.length}`;
    }

    updateNavigation() {
        const tutorial = this.tutorials[this.currentTutorial];
        this.prevBtn.disabled = this.currentStep === 0;
        this.nextBtn.disabled = true; // Enabled only after correct code
        
        if (this.currentStep === tutorial.steps.length - 1) {
            this.nextBtn.textContent = 'Complete Tutorial';
        } else {
            this.nextBtn.textContent = 'Next';
        }
    }

    updateStepsList() {
        const stepItems = this.stepsList.querySelectorAll('.step-item');
        stepItems.forEach((item, index) => {
            item.classList.remove('active');
            if (index === this.currentStep) {
                item.classList.add('active');
            }
        });
    }

    previousStep() {
        if (this.currentStep > 0) {
            this.loadStep(this.currentStep - 1);
        }
    }

    nextStep() {
        const tutorial = this.tutorials[this.currentTutorial];
        if (this.currentStep < tutorial.steps.length - 1) {
            this.loadStep(this.currentStep + 1);
        } else {
            this.completeTutorial();
        }
    }

    completeTutorial() {
        alert('Congratulations! You completed the HTML Basics tutorial!');
        // Award XP if systems are available
        if (window.xpSystem) {
            window.xpSystem.awardXP(200, 'Tutorial Completed: HTML Basics');
        }
        window.location.href = 'index.html';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize tutorial system
document.addEventListener('DOMContentLoaded', () => {
    new TutorialSystem();
});