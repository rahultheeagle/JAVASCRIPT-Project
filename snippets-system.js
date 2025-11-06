class SnippetsSystem {
    constructor() {
        this.currentCategory = 'html';
        this.snippets = {
            html: [
                {
                    title: 'Basic HTML Template',
                    code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`,
                    description: 'Standard HTML5 document structure'
                },
                {
                    title: 'Navigation Menu',
                    code: `<nav>
    <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
    </ul>
</nav>`,
                    description: 'Simple navigation menu with links'
                },
                {
                    title: 'Contact Form',
                    code: `<form>
    <label for="name">Name:</label>
    <input type="text" id="name" required>
    
    <label for="email">Email:</label>
    <input type="email" id="email" required>
    
    <label for="message">Message:</label>
    <textarea id="message" required></textarea>
    
    <button type="submit">Send</button>
</form>`,
                    description: 'Basic contact form with validation'
                }
            ],
            css: [
                {
                    title: 'Flexbox Center',
                    code: `.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}`,
                    description: 'Center content using flexbox'
                },
                {
                    title: 'CSS Grid Layout',
                    code: `.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    padding: 20px;
}`,
                    description: 'Responsive grid layout'
                },
                {
                    title: 'Button Hover Effect',
                    code: `.button {
    background: #667eea;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.button:hover {
    background: #5a6fd8;
    transform: translateY(-2px);
}`,
                    description: 'Animated button with hover effect'
                }
            ],
            javascript: [
                {
                    title: 'DOM Element Selection',
                    code: `// Select elements
const element = document.getElementById('myId');
const elements = document.querySelectorAll('.myClass');
const firstElement = document.querySelector('.myClass');

// Modify content
element.textContent = 'New text';
element.innerHTML = '<strong>Bold text</strong>';`,
                    description: 'Common DOM selection and manipulation'
                },
                {
                    title: 'Event Listener',
                    code: `const button = document.getElementById('myButton');

button.addEventListener('click', function() {
    console.log('Button clicked!');
});

// Arrow function version
button.addEventListener('click', () => {
    console.log('Button clicked!');
});`,
                    description: 'Add click event listeners to elements'
                },
                {
                    title: 'Fetch API Request',
                    code: `fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });`,
                    description: 'Make HTTP requests with fetch API'
                }
            ]
        };
        this.initializeElements();
        this.bindEvents();
        this.loadCategory('html');
    }

    initializeElements() {
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.categoryTitle = document.getElementById('category-title');
        this.searchInput = document.getElementById('search-input');
        this.snippetsGrid = document.getElementById('snippets-grid');
    }

    bindEvents() {
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.loadCategory(category);
            });
        });

        this.searchInput.addEventListener('input', () => {
            this.filterSnippets();
        });
    }

    loadCategory(category) {
        this.currentCategory = category;
        
        // Update active category button
        this.categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update title
        this.categoryTitle.textContent = `${category.toUpperCase()} Snippets`;
        
        // Clear search
        this.searchInput.value = '';
        
        // Render snippets
        this.renderSnippets(this.snippets[category]);
    }

    filterSnippets() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const categorySnippets = this.snippets[this.currentCategory];
        
        if (!searchTerm) {
            this.renderSnippets(categorySnippets);
            return;
        }

        const filtered = categorySnippets.filter(snippet => 
            snippet.title.toLowerCase().includes(searchTerm) ||
            snippet.description.toLowerCase().includes(searchTerm) ||
            snippet.code.toLowerCase().includes(searchTerm)
        );

        this.renderSnippets(filtered);
    }

    renderSnippets(snippets) {
        if (snippets.length === 0) {
            this.snippetsGrid.innerHTML = '<div class="no-results">No snippets found</div>';
            return;
        }

        this.snippetsGrid.innerHTML = snippets.map((snippet, index) => `
            <div class="snippet-card">
                <div class="snippet-header">
                    <h3 class="snippet-title">${snippet.title}</h3>
                    <button class="copy-btn" onclick="snippetsSystem.copyCode(${index})">Copy</button>
                </div>
                <div class="snippet-code">${this.escapeHtml(snippet.code)}</div>
                <div class="snippet-description">${snippet.description}</div>
            </div>
        `).join('');
    }

    copyCode(index) {
        const snippet = this.snippets[this.currentCategory][index];
        const copyBtn = document.querySelectorAll('.copy-btn')[index];
        
        navigator.clipboard.writeText(snippet.code).then(() => {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = snippet.code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.textContent = 'Copy';
                copyBtn.classList.remove('copied');
            }, 2000);
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize snippets system
let snippetsSystem;
document.addEventListener('DOMContentLoaded', () => {
    snippetsSystem = new SnippetsSystem();
});