class CheatSheetSystem {
    constructor() {
        this.currentTab = 'html';
        this.cheatSheets = {
            html: {
                sections: [
                    {
                        title: 'Basic Structure',
                        items: [
                            { title: 'HTML Document', code: '<!DOCTYPE html>\n<html>\n<head>\n  <title>Title</title>\n</head>\n<body>\n  Content\n</body>\n</html>', description: 'Basic HTML5 document structure' },
                            { title: 'Meta Tags', code: '<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">', description: 'Essential meta tags for responsive design' }
                        ]
                    },
                    {
                        title: 'Text Elements',
                        items: [
                            { title: 'Headings', code: '<h1>Heading 1</h1>\n<h2>Heading 2</h2>\n<h3>Heading 3</h3>', description: 'Six levels of headings (h1-h6)' },
                            { title: 'Paragraphs', code: '<p>This is a paragraph.</p>', description: 'Text paragraphs' },
                            { title: 'Links', code: '<a href="https://example.com">Link text</a>', description: 'Hyperlinks to other pages' },
                            { title: 'Images', code: '<img src="image.jpg" alt="Description">', description: 'Display images with alt text' }
                        ]
                    },
                    {
                        title: 'Lists & Forms',
                        items: [
                            { title: 'Unordered List', code: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>', description: 'Bullet point lists' },
                            { title: 'Form Elements', code: '<form>\n  <input type="text" name="name">\n  <button type="submit">Submit</button>\n</form>', description: 'Basic form structure' }
                        ]
                    }
                ],
                table: {
                    title: 'Common HTML Tags',
                    headers: ['Tag', 'Description', 'Example'],
                    rows: [
                        ['<div>', 'Generic container', '<div>Content</div>'],
                        ['<span>', 'Inline container', '<span>Text</span>'],
                        ['<br>', 'Line break', 'Line 1<br>Line 2'],
                        ['<hr>', 'Horizontal rule', '<hr>'],
                        ['<strong>', 'Bold text', '<strong>Bold</strong>'],
                        ['<em>', 'Italic text', '<em>Italic</em>']
                    ]
                }
            },
            css: {
                sections: [
                    {
                        title: 'Selectors',
                        items: [
                            { title: 'Element Selector', code: 'p {\n  color: blue;\n}', description: 'Select all paragraph elements' },
                            { title: 'Class Selector', code: '.my-class {\n  font-size: 16px;\n}', description: 'Select elements with specific class' },
                            { title: 'ID Selector', code: '#my-id {\n  background: red;\n}', description: 'Select element with specific ID' }
                        ]
                    },
                    {
                        title: 'Layout',
                        items: [
                            { title: 'Flexbox', code: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}', description: 'Flexible box layout' },
                            { title: 'Grid', code: '.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 20px;\n}', description: 'CSS Grid layout' },
                            { title: 'Position', code: '.absolute {\n  position: absolute;\n  top: 10px;\n  left: 10px;\n}', description: 'Absolute positioning' }
                        ]
                    },
                    {
                        title: 'Styling',
                        items: [
                            { title: 'Colors', code: 'color: #ff0000;\nbackground: rgb(255, 0, 0);\nborder: 1px solid blue;', description: 'Different color formats' },
                            { title: 'Typography', code: 'font-family: Arial, sans-serif;\nfont-size: 16px;\nfont-weight: bold;', description: 'Text styling properties' }
                        ]
                    }
                ],
                table: {
                    title: 'CSS Properties',
                    headers: ['Property', 'Values', 'Example'],
                    rows: [
                        ['margin', 'px, %, auto', 'margin: 10px;'],
                        ['padding', 'px, %, em', 'padding: 20px;'],
                        ['border', 'width style color', 'border: 1px solid black;'],
                        ['display', 'block, inline, flex, grid', 'display: flex;'],
                        ['width', 'px, %, vw', 'width: 100%;'],
                        ['height', 'px, %, vh', 'height: 200px;']
                    ]
                }
            },
            js: {
                sections: [
                    {
                        title: 'Variables & Data Types',
                        items: [
                            { title: 'Variables', code: 'let name = "John";\nconst age = 25;\nvar city = "NYC";', description: 'Variable declarations' },
                            { title: 'Arrays', code: 'let fruits = ["apple", "banana"];\nfruits.push("orange");\nconsole.log(fruits[0]);', description: 'Array creation and methods' },
                            { title: 'Objects', code: 'let person = {\n  name: "John",\n  age: 30\n};\nconsole.log(person.name);', description: 'Object literals and properties' }
                        ]
                    },
                    {
                        title: 'Functions & Control Flow',
                        items: [
                            { title: 'Functions', code: 'function greet(name) {\n  return "Hello " + name;\n}\n\nconst add = (a, b) => a + b;', description: 'Function declarations and arrow functions' },
                            { title: 'Conditionals', code: 'if (age >= 18) {\n  console.log("Adult");\n} else {\n  console.log("Minor");\n}', description: 'If-else statements' },
                            { title: 'Loops', code: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}\n\narray.forEach(item => {\n  console.log(item);\n});', description: 'For loops and forEach' }
                        ]
                    },
                    {
                        title: 'DOM Manipulation',
                        items: [
                            { title: 'Select Elements', code: 'document.getElementById("myId");\ndocument.querySelector(".class");\ndocument.querySelectorAll("div");', description: 'DOM element selection' },
                            { title: 'Modify Content', code: 'element.textContent = "New text";\nelement.innerHTML = "<b>Bold</b>";\nelement.style.color = "red";', description: 'Change element content and style' },
                            { title: 'Event Listeners', code: 'button.addEventListener("click", () => {\n  console.log("Clicked!");\n});', description: 'Handle user interactions' }
                        ]
                    }
                ],
                table: {
                    title: 'JavaScript Methods',
                    headers: ['Method', 'Description', 'Example'],
                    rows: [
                        ['console.log()', 'Print to console', 'console.log("Hello");'],
                        ['parseInt()', 'Convert to integer', 'parseInt("10");'],
                        ['Math.random()', 'Random number 0-1', 'Math.random();'],
                        ['Array.length', 'Array size', 'arr.length;'],
                        ['String.split()', 'Split string to array', 'str.split(",");'],
                        ['JSON.parse()', 'Parse JSON string', 'JSON.parse(jsonStr);']
                    ]
                }
            }
        };
        this.initializeElements();
        this.bindEvents();
        this.loadTab('html');
    }

    initializeElements() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.content = document.getElementById('cheatsheet-content');
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
        this.renderContent(this.cheatSheets[tab]);
    }

    renderContent(data) {
        const sectionsHTML = data.sections.map(section => `
            <div class="cheat-section">
                <h2 class="section-title">${section.title}</h2>
                <div class="cheat-grid">
                    ${section.items.map(item => `
                        <div class="cheat-item">
                            <div class="cheat-title">${item.title}</div>
                            <div class="cheat-code">${this.escapeHtml(item.code)}</div>
                            <div class="cheat-description">${item.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');

        const tableHTML = `
            <div class="cheat-section">
                <h2 class="section-title">${data.table.title}</h2>
                <table class="quick-ref-table">
                    <thead>
                        <tr>
                            ${data.table.headers.map(header => `<th>${header}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.table.rows.map(row => `
                            <tr>
                                ${row.map(cell => `<td><code>${this.escapeHtml(cell)}</code></td>`).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.content.innerHTML = sectionsHTML + tableHTML;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize cheat sheet system
document.addEventListener('DOMContentLoaded', () => {
    new CheatSheetSystem();
});