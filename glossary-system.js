class GlossarySystem {
    constructor() {
        this.currentFilter = 'all';
        this.searchTerm = '';
        this.terms = [
            { name: 'API', category: 'General', definition: 'Application Programming Interface - a set of protocols and tools for building software applications.', example: 'fetch("https://api.example.com/data")', tags: ['Web', 'Backend'] },
            { name: 'Array', category: 'JavaScript', definition: 'A data structure that stores multiple values in a single variable.', example: 'let fruits = ["apple", "banana", "orange"];', tags: ['Data Structure', 'JavaScript'] },
            { name: 'Boolean', category: 'JavaScript', definition: 'A data type that represents true or false values.', example: 'let isActive = true;', tags: ['Data Type', 'JavaScript'] },
            { name: 'CSS', category: 'Styling', definition: 'Cascading Style Sheets - used to style and layout web pages.', example: 'body { color: blue; }', tags: ['Styling', 'Web'] },
            { name: 'DOM', category: 'Web', definition: 'Document Object Model - programming interface for HTML documents.', example: 'document.getElementById("myId")', tags: ['Web', 'JavaScript'] },
            { name: 'Element', category: 'HTML', definition: 'A component of an HTML document defined by tags.', example: '<p>This is a paragraph element</p>', tags: ['HTML', 'Web'] },
            { name: 'Function', category: 'JavaScript', definition: 'A block of code designed to perform a particular task.', example: 'function greet() { return "Hello"; }', tags: ['JavaScript', 'Programming'] },
            { name: 'Git', category: 'Tools', definition: 'A distributed version control system for tracking changes in code.', example: 'git commit -m "Add new feature"', tags: ['Version Control', 'Tools'] },
            { name: 'HTML', category: 'Markup', definition: 'HyperText Markup Language - standard markup language for web pages.', example: '<h1>Hello World</h1>', tags: ['Markup', 'Web'] },
            { name: 'IDE', category: 'Tools', definition: 'Integrated Development Environment - software for writing and debugging code.', example: 'Visual Studio Code, WebStorm', tags: ['Tools', 'Development'] },
            { name: 'JSON', category: 'Data', definition: 'JavaScript Object Notation - lightweight data interchange format.', example: '{"name": "John", "age": 30}', tags: ['Data Format', 'JavaScript'] },
            { name: 'Keyword', category: 'Programming', definition: 'Reserved words in programming languages with special meaning.', example: 'let, const, function, if, else', tags: ['Programming', 'Syntax'] },
            { name: 'Loop', category: 'Programming', definition: 'A programming construct that repeats a block of code.', example: 'for (let i = 0; i < 5; i++) { }', tags: ['Control Flow', 'Programming'] },
            { name: 'Method', category: 'Programming', definition: 'A function that belongs to an object or class.', example: 'array.push("item")', tags: ['OOP', 'Programming'] },
            { name: 'Node.js', category: 'Runtime', definition: 'JavaScript runtime built on Chrome\'s V8 engine for server-side development.', example: 'const http = require("http");', tags: ['Backend', 'JavaScript'] },
            { name: 'Object', category: 'JavaScript', definition: 'A collection of key-value pairs in JavaScript.', example: 'let person = {name: "John", age: 25};', tags: ['Data Structure', 'JavaScript'] },
            { name: 'Property', category: 'Programming', definition: 'A characteristic or attribute of an object.', example: 'person.name or person["name"]', tags: ['OOP', 'JavaScript'] },
            { name: 'Query', category: 'Database', definition: 'A request for data or information from a database.', example: 'SELECT * FROM users WHERE age > 18', tags: ['Database', 'SQL'] },
            { name: 'Repository', category: 'Git', definition: 'A storage location for software packages or project files.', example: 'GitHub repository, Git repo', tags: ['Version Control', 'Git'] },
            { name: 'Selector', category: 'CSS', definition: 'A pattern used to select HTML elements for styling.', example: '.class-name, #id-name, element', tags: ['CSS', 'Styling'] },
            { name: 'Tag', category: 'HTML', definition: 'Keywords enclosed in angle brackets that define HTML elements.', example: '<div>, <p>, <h1>, <img>', tags: ['HTML', 'Markup'] },
            { name: 'URL', category: 'Web', definition: 'Uniform Resource Locator - web address of a resource.', example: 'https://www.example.com/page', tags: ['Web', 'Internet'] },
            { name: 'Variable', category: 'Programming', definition: 'A storage location with an associated name that contains data.', example: 'let name = "John";', tags: ['Programming', 'Data'] },
            { name: 'Webpack', category: 'Tools', definition: 'A module bundler for JavaScript applications.', example: 'webpack.config.js configuration', tags: ['Build Tools', 'JavaScript'] },
            { name: 'XML', category: 'Data', definition: 'eXtensible Markup Language - markup language for storing data.', example: '<user><name>John</name></user>', tags: ['Data Format', 'Markup'] }
        ];
        this.filteredTerms = [...this.terms];
        this.initializeElements();
        this.bindEvents();
        this.renderTerms();
    }

    initializeElements() {
        this.searchInput = document.getElementById('search-input');
        this.letterBtns = document.querySelectorAll('.letter-btn');
        this.resultsCount = document.getElementById('results-count');
        this.glossaryList = document.getElementById('glossary-list');
    }

    bindEvents() {
        this.searchInput.addEventListener('input', () => {
            this.searchTerm = this.searchInput.value.toLowerCase();
            this.filterTerms();
        });

        this.letterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.currentFilter = btn.dataset.letter;
                this.updateActiveFilter();
                this.filterTerms();
            });
        });
    }

    updateActiveFilter() {
        this.letterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.letter === this.currentFilter);
        });
    }

    filterTerms() {
        this.filteredTerms = this.terms.filter(term => {
            const matchesSearch = !this.searchTerm || 
                term.name.toLowerCase().includes(this.searchTerm) ||
                term.definition.toLowerCase().includes(this.searchTerm) ||
                term.category.toLowerCase().includes(this.searchTerm) ||
                term.tags.some(tag => tag.toLowerCase().includes(this.searchTerm));

            const matchesLetter = this.currentFilter === 'all' || 
                term.name.toLowerCase().startsWith(this.currentFilter);

            return matchesSearch && matchesLetter;
        });

        this.renderTerms();
    }

    renderTerms() {
        this.resultsCount.textContent = `${this.filteredTerms.length} terms found`;

        if (this.filteredTerms.length === 0) {
            this.glossaryList.innerHTML = '<div class="no-results">No terms found matching your search.</div>';
            return;
        }

        this.glossaryList.innerHTML = this.filteredTerms.map(term => `
            <div class="glossary-term">
                <div class="term-header">
                    <h3 class="term-name">${this.highlightText(term.name)}</h3>
                    <span class="term-category">${term.category}</span>
                </div>
                <div class="term-definition">${this.highlightText(term.definition)}</div>
                ${term.example ? `<div class="term-example">${this.escapeHtml(term.example)}</div>` : ''}
                <div class="term-tags">
                    ${term.tags.map(tag => `<span class="term-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    highlightText(text) {
        if (!this.searchTerm) return text;
        
        const regex = new RegExp(`(${this.escapeRegex(this.searchTerm)})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}

// Initialize glossary system
document.addEventListener('DOMContentLoaded', () => {
    new GlossarySystem();
});