class ResourcesSystem {
    constructor() {
        this.currentTab = 'documentation';
        this.resources = {
            documentation: [
                {
                    name: 'MDN Web Docs',
                    type: 'Official Documentation',
                    description: 'The most comprehensive and authoritative web development documentation by Mozilla.',
                    url: 'https://developer.mozilla.org/',
                    icon: 'mdn',
                    tags: ['HTML', 'CSS', 'JavaScript', 'Web APIs']
                },
                {
                    name: 'W3Schools',
                    type: 'Learning Platform',
                    description: 'Easy-to-understand tutorials and references for web development technologies.',
                    url: 'https://www.w3schools.com/',
                    icon: 'w3schools',
                    tags: ['HTML', 'CSS', 'JavaScript', 'SQL', 'Python']
                },
                {
                    name: 'CSS-Tricks',
                    type: 'CSS Resource',
                    description: 'Daily articles about CSS, HTML, JavaScript, and all things related to web design.',
                    url: 'https://css-tricks.com/',
                    icon: 'css-tricks',
                    tags: ['CSS', 'Flexbox', 'Grid', 'Animations']
                },
                {
                    name: 'JavaScript.info',
                    type: 'JavaScript Guide',
                    description: 'Modern JavaScript tutorial covering everything from basics to advanced concepts.',
                    url: 'https://javascript.info/',
                    icon: 'javascript',
                    tags: ['JavaScript', 'ES6+', 'Async', 'DOM']
                }
            ],
            tutorials: [
                {
                    name: 'freeCodeCamp',
                    type: 'Interactive Learning',
                    description: 'Free coding bootcamp with hands-on projects and certifications.',
                    url: 'https://www.freecodecamp.org/',
                    icon: 'freecodecamp',
                    tags: ['Full Stack', 'Projects', 'Certifications']
                },
                {
                    name: 'Codecademy',
                    type: 'Interactive Courses',
                    description: 'Interactive coding lessons with immediate feedback and practice.',
                    url: 'https://www.codecademy.com/',
                    icon: 'codecademy',
                    tags: ['Interactive', 'Beginner Friendly', 'Multiple Languages']
                },
                {
                    name: 'Mozilla Developer',
                    type: 'Learning Area',
                    description: 'Structured learning path for web development from Mozilla.',
                    url: 'https://developer.mozilla.org/en-US/docs/Learn',
                    icon: 'mozilla',
                    tags: ['Structured', 'Beginner', 'Progressive']
                }
            ],
            tools: [
                {
                    name: 'CodePen',
                    type: 'Online Editor',
                    description: 'Online code editor for front-end development with live preview.',
                    url: 'https://codepen.io/',
                    icon: 'codepen',
                    tags: ['HTML', 'CSS', 'JavaScript', 'Live Preview']
                },
                {
                    name: 'GitHub',
                    type: 'Version Control',
                    description: 'Code hosting platform with version control and collaboration features.',
                    url: 'https://github.com/',
                    icon: 'github',
                    tags: ['Git', 'Collaboration', 'Open Source']
                },
                {
                    name: 'Stack Overflow',
                    type: 'Q&A Community',
                    description: 'Programming Q&A community where developers help each other solve problems.',
                    url: 'https://stackoverflow.com/',
                    icon: 'stackoverflow',
                    tags: ['Q&A', 'Community', 'Problem Solving']
                }
            ],
            practice: [
                {
                    name: 'LeetCode',
                    type: 'Coding Challenges',
                    description: 'Platform for practicing coding problems and preparing for technical interviews.',
                    url: 'https://leetcode.com/',
                    icon: 'codecademy',
                    tags: ['Algorithms', 'Data Structures', 'Interview Prep']
                },
                {
                    name: 'HackerRank',
                    type: 'Coding Practice',
                    description: 'Coding challenges and competitions to improve programming skills.',
                    url: 'https://www.hackerrank.com/',
                    icon: 'freecodecamp',
                    tags: ['Challenges', 'Competitions', 'Skill Assessment']
                },
                {
                    name: 'Codewars',
                    type: 'Coding Kata',
                    description: 'Improve coding skills through martial arts inspired coding challenges.',
                    url: 'https://www.codewars.com/',
                    icon: 'github',
                    tags: ['Kata', 'Community', 'Multiple Languages']
                }
            ]
        };
        this.initializeElements();
        this.bindEvents();
        this.loadTab('documentation');
    }

    initializeElements() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.content = document.getElementById('resources-content');
    }

    bindEvents() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.loadTab(tab);
            });
        });
    }

    loadTab(tab) {
        this.currentTab = tab;
        
        // Update active tab
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Render content
        this.renderResources(this.resources[tab], tab);
    }

    renderResources(resources, category) {
        const categoryTitles = {
            documentation: 'Documentation & References',
            tutorials: 'Learning Platforms & Tutorials',
            tools: 'Development Tools & Utilities',
            practice: 'Coding Practice & Challenges'
        };

        this.content.innerHTML = `
            <h2 class="section-title">${categoryTitles[category]}</h2>
            <div class="resources-grid">
                ${resources.map(resource => `
                    <a href="${resource.url}" target="_blank" rel="noopener noreferrer" class="resource-card">
                        <div class="resource-header">
                            <div class="resource-icon ${resource.icon}">
                                ${this.getIconSymbol(resource.icon)}
                            </div>
                            <div class="resource-info">
                                <h3>${resource.name}</h3>
                                <div class="resource-type">${resource.type}</div>
                            </div>
                        </div>
                        <div class="resource-description">${resource.description}</div>
                        <div class="resource-tags">
                            ${resource.tags.map(tag => `<span class="resource-tag">${tag}</span>`).join('')}
                        </div>
                        <div class="external-link">Visit ${resource.name}</div>
                    </a>
                `).join('')}
            </div>
        `;
    }

    getIconSymbol(iconType) {
        const icons = {
            mdn: '📚',
            w3schools: '🎓',
            mozilla: '🦊',
            freecodecamp: '🔥',
            codecademy: '💻',
            codepen: '✏️',
            github: '🐙',
            stackoverflow: '❓',
            'css-tricks': '🎨',
            javascript: 'JS'
        };
        return icons[iconType] || '🔗';
    }
}

// Initialize resources system
document.addEventListener('DOMContentLoaded', () => {
    new ResourcesSystem();
});