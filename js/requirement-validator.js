// Requirement Validator - Check for specific HTML tags, CSS properties, JS functions
class RequirementValidator {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Validate button
        document.getElementById('validate-requirements').addEventListener('click', () => {
            this.validateRequirements();
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-tab`);
        });
    }

    validateRequirements() {
        const htmlCode = document.getElementById('html-code').value;
        const cssCode = document.getElementById('css-code').value;
        const jsCode = document.getElementById('js-code').value;

        const requirements = this.getSelectedRequirements();
        const results = [];

        requirements.forEach(req => {
            let found = false;
            
            switch (req.type) {
                case 'html':
                    found = this.checkHTMLTag(htmlCode, req.value);
                    break;
                case 'css':
                    found = this.checkCSSProperty(cssCode, req.value);
                    break;
                case 'js':
                    found = this.checkJSFunction(jsCode, req.value);
                    break;
            }

            results.push({
                type: req.type,
                value: req.value,
                label: req.label,
                found: found
            });
        });

        this.displayResults(results);
    }

    getSelectedRequirements() {
        const requirements = [];
        document.querySelectorAll('.requirement-item input:checked').forEach(checkbox => {
            requirements.push({
                type: checkbox.dataset.type,
                value: checkbox.dataset.value,
                label: checkbox.nextElementSibling.textContent
            });
        });
        return requirements;
    }

    checkHTMLTag(html, tagName) {
        const regex = new RegExp(`<${tagName}[^>]*>`, 'i');
        return regex.test(html);
    }

    checkCSSProperty(css, property) {
        const regex = new RegExp(`${property}\\s*:`, 'i');
        return regex.test(css);
    }

    checkJSFunction(js, functionName) {
        // Handle different JS patterns
        if (functionName.startsWith('.')) {
            // Array methods like .map, .filter
            const method = functionName.substring(1);
            const regex = new RegExp(`\\.${method}\\s*\\(`, 'i');
            return regex.test(js);
        } else if (functionName.includes('.')) {
            // Object methods like console.log, document.getElementById
            const escapedFunction = functionName.replace('.', '\\.');
            const regex = new RegExp(`${escapedFunction}\\s*\\(`, 'i');
            return regex.test(js);
        } else {
            // Regular functions
            const regex = new RegExp(`(function\\s+${functionName}|${functionName}\\s*=|${functionName}\\s*\\()`, 'i');
            return regex.test(js);
        }
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('validation-results');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No requirements selected.</p>';
            return;
        }

        const passedCount = results.filter(r => r.found).length;
        const totalCount = results.length;
        
        const summaryClass = passedCount === totalCount ? 'success' : 'partial';
        
        resultsContainer.innerHTML = `
            <div class="results-summary ${summaryClass}">
                <h4>${passedCount}/${totalCount} Requirements Met</h4>
            </div>
            <div class="requirement-results">
                ${results.map(result => this.renderRequirementResult(result)).join('')}
            </div>
        `;
    }

    renderRequirementResult(result) {
        const statusIcon = result.found ? '✅' : '❌';
        const statusClass = result.found ? 'met' : 'missing';
        
        return `
            <div class="requirement-result ${statusClass}">
                <span class="status-icon">${statusIcon}</span>
                <span class="requirement-label">${result.label}</span>
                <span class="requirement-type">(${result.type.toUpperCase()})</span>
            </div>
        `;
    }
}

// Initialize validator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RequirementValidator();
});