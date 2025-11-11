// Advanced Drag-and-Drop Code Blocks System
class DragDropCodeSystem {
    constructor() {
        this.codeBlocks = {};
        this.workspace = null;
        this.draggedElement = null;
        this.dropZones = [];
        this.generatedCode = { html: '', css: '', js: '' };
        this.blockCounter = 0;
        
        this.initializeCodeBlocks();
        this.createWorkspace();
        this.bindEvents();
    }

    // Initialize available code blocks
    initializeCodeBlocks() {
        this.codeBlocks = {
            html: {
                structure: [
                    { id: 'div', name: 'Div Container', code: '<div class="container">\n  <!-- Content here -->\n</div>', icon: '📦' },
                    { id: 'header', name: 'Header', code: '<header>\n  <h1>Title</h1>\n</header>', icon: '🏠' },
                    { id: 'nav', name: 'Navigation', code: '<nav>\n  <ul>\n    <li><a href="#">Home</a></li>\n  </ul>\n</nav>', icon: '🧭' },
                    { id: 'section', name: 'Section', code: '<section>\n  <h2>Section Title</h2>\n  <p>Content</p>\n</section>', icon: '📄' },
                    { id: 'footer', name: 'Footer', code: '<footer>\n  <p>&copy; 2024</p>\n</footer>', icon: '🦶' }
                ],
                content: [
                    { id: 'h1', name: 'Heading 1', code: '<h1>Main Title</h1>', icon: '📝' },
                    { id: 'h2', name: 'Heading 2', code: '<h2>Subtitle</h2>', icon: '📝' },
                    { id: 'p', name: 'Paragraph', code: '<p>Your text here</p>', icon: '📄' },
                    { id: 'img', name: 'Image', code: '<img src="image.jpg" alt="Description">', icon: '🖼️' },
                    { id: 'a', name: 'Link', code: '<a href="#" target="_blank">Link Text</a>', icon: '🔗' },
                    { id: 'button', name: 'Button', code: '<button onclick="handleClick()">Click Me</button>', icon: '🔘' }
                ],
                forms: [
                    { id: 'form', name: 'Form', code: '<form>\n  <input type="text" placeholder="Enter text">\n  <button type="submit">Submit</button>\n</form>', icon: '📋' },
                    { id: 'input', name: 'Text Input', code: '<input type="text" placeholder="Enter text">', icon: '📝' },
                    { id: 'textarea', name: 'Text Area', code: '<textarea placeholder="Enter message"></textarea>', icon: '📄' },
                    { id: 'select', name: 'Dropdown', code: '<select>\n  <option>Option 1</option>\n  <option>Option 2</option>\n</select>', icon: '📋' }
                ],
                lists: [
                    { id: 'ul', name: 'Unordered List', code: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>', icon: '📝' },
                    { id: 'ol', name: 'Ordered List', code: '<ol>\n  <li>First</li>\n  <li>Second</li>\n</ol>', icon: '🔢' },
                    { id: 'table', name: 'Table', code: '<table>\n  <tr>\n    <th>Header</th>\n  </tr>\n  <tr>\n    <td>Data</td>\n  </tr>\n</table>', icon: '📊' }
                ]
            },
            css: {
                layout: [
                    { id: 'flexbox', name: 'Flexbox', code: '.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}', icon: '📐' },
                    { id: 'grid', name: 'CSS Grid', code: '.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}', icon: '⚏' },
                    { id: 'center', name: 'Center Element', code: '.center {\n  margin: 0 auto;\n  text-align: center;\n}', icon: '🎯' },
                    { id: 'responsive', name: 'Responsive', code: '@media (max-width: 768px) {\n  .container {\n    flex-direction: column;\n  }\n}', icon: '📱' }
                ],
                styling: [
                    { id: 'colors', name: 'Colors', code: '.element {\n  color: #333;\n  background-color: #f0f0f0;\n}', icon: '🎨' },
                    { id: 'typography', name: 'Typography', code: '.text {\n  font-family: Arial, sans-serif;\n  font-size: 16px;\n  font-weight: bold;\n}', icon: '🔤' },
                    { id: 'spacing', name: 'Spacing', code: '.spaced {\n  margin: 20px;\n  padding: 15px;\n}', icon: '📏' },
                    { id: 'border', name: 'Border', code: '.bordered {\n  border: 2px solid #ccc;\n  border-radius: 8px;\n}', icon: '🔲' }
                ],
                effects: [
                    { id: 'shadow', name: 'Box Shadow', code: '.shadow {\n  box-shadow: 0 4px 8px rgba(0,0,0,0.1);\n}', icon: '🌫️' },
                    { id: 'transition', name: 'Transition', code: '.smooth {\n  transition: all 0.3s ease;\n}', icon: '🔄' },
                    { id: 'hover', name: 'Hover Effect', code: '.hover:hover {\n  transform: scale(1.05);\n  opacity: 0.8;\n}', icon: '👆' },
                    { id: 'animation', name: 'Animation', code: '@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-10px); }\n}\n.bounce {\n  animation: bounce 1s infinite;\n}', icon: '🎬' }
                ]
            },
            javascript: {
                variables: [
                    { id: 'let', name: 'Let Variable', code: 'let variableName = "value";', icon: '📦' },
                    { id: 'const', name: 'Const Variable', code: 'const CONSTANT = "value";', icon: '🔒' },
                    { id: 'array', name: 'Array', code: 'const items = ["item1", "item2", "item3"];', icon: '📋' },
                    { id: 'object', name: 'Object', code: 'const obj = {\n  property: "value",\n  method: function() {\n    return this.property;\n  }\n};', icon: '🗂️' }
                ],
                functions: [
                    { id: 'function', name: 'Function', code: 'function functionName() {\n  // Your code here\n  return result;\n}', icon: '⚙️' },
                    { id: 'arrow', name: 'Arrow Function', code: 'const arrowFunction = () => {\n  // Your code here\n};', icon: '➡️' },
                    { id: 'async', name: 'Async Function', code: 'async function fetchData() {\n  const response = await fetch("url");\n  return response.json();\n}', icon: '⏳' }
                ],
                control: [
                    { id: 'if', name: 'If Statement', code: 'if (condition) {\n  // Code if true\n} else {\n  // Code if false\n}', icon: '🔀' },
                    { id: 'for', name: 'For Loop', code: 'for (let i = 0; i < array.length; i++) {\n  console.log(array[i]);\n}', icon: '🔄' },
                    { id: 'while', name: 'While Loop', code: 'while (condition) {\n  // Code to repeat\n}', icon: '🔁' },
                    { id: 'switch', name: 'Switch Statement', code: 'switch (variable) {\n  case "value1":\n    // Code\n    break;\n  default:\n    // Default code\n}', icon: '🎛️' }
                ],
                dom: [
                    { id: 'getElementById', name: 'Get Element', code: 'const element = document.getElementById("id");', icon: '🎯' },
                    { id: 'addEventListener', name: 'Event Listener', code: 'element.addEventListener("click", function() {\n  // Handle click\n});', icon: '👂' },
                    { id: 'innerHTML', name: 'Set Content', code: 'element.innerHTML = "New content";', icon: '📝' },
                    { id: 'createElement', name: 'Create Element', code: 'const newElement = document.createElement("div");\nnewElement.textContent = "Hello";\nparent.appendChild(newElement);', icon: '🏗️' }
                ]
            }
        };
    }

    // Create the drag-and-drop workspace
    createWorkspace() {
        const workspace = document.createElement('div');
        workspace.className = 'drag-drop-workspace';
        workspace.innerHTML = `
            <div class="workspace-header">
                <h2>🎨 Visual Code Builder</h2>
                <div class="workspace-controls">
                    <button class="control-btn" id="clearWorkspace">🗑️ Clear</button>
                    <button class="control-btn" id="generateCode">⚡ Generate Code</button>
                    <button class="control-btn" id="previewCode">👁️ Preview</button>
                    <button class="control-btn" id="exportCode">💾 Export</button>
                </div>
            </div>
            
            <div class="workspace-content">
                <div class="blocks-panel">
                    <div class="panel-header">
                        <h3>Code Blocks</h3>
                        <div class="language-tabs">
                            <button class="lang-tab active" data-lang="html">HTML</button>
                            <button class="lang-tab" data-lang="css">CSS</button>
                            <button class="lang-tab" data-lang="javascript">JS</button>
                        </div>
                    </div>
                    <div class="blocks-container" id="blocksContainer">
                        ${this.renderBlockCategories('html')}
                    </div>
                </div>
                
                <div class="canvas-panel">
                    <div class="canvas-header">
                        <h3>Canvas</h3>
                        <div class="canvas-controls">
                            <button class="canvas-btn" id="zoomIn">🔍+</button>
                            <button class="canvas-btn" id="zoomOut">🔍-</button>
                            <button class="canvas-btn" id="resetZoom">🔄</button>
                        </div>
                    </div>
                    <div class="canvas-area" id="canvasArea">
                        <div class="drop-zone main-drop-zone" data-type="main">
                            <div class="drop-zone-placeholder">
                                <span class="placeholder-icon">📦</span>
                                <span class="placeholder-text">Drag code blocks here to start building</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="properties-panel">
                    <div class="panel-header">
                        <h3>Properties</h3>
                    </div>
                    <div class="properties-content" id="propertiesContent">
                        <div class="no-selection">
                            <span>Select a block to edit properties</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="code-output" id="codeOutput" style="display: none;">
                <div class="output-header">
                    <h3>Generated Code</h3>
                    <button class="close-output" id="closeOutput">✕</button>
                </div>
                <div class="output-tabs">
                    <button class="output-tab active" data-output="html">HTML</button>
                    <button class="output-tab" data-output="css">CSS</button>
                    <button class="output-tab" data-output="js">JavaScript</button>
                </div>
                <div class="output-content">
                    <pre><code id="outputCode"></code></pre>
                    <button class="copy-code-btn" id="copyCode">📋 Copy</button>
                </div>
            </div>
            
            <div class="preview-modal" id="previewModal" style="display: none;">
                <div class="modal-overlay"></div>
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Code Preview</h3>
                        <button class="modal-close" id="closePreview">✕</button>
                    </div>
                    <div class="preview-frame">
                        <iframe id="previewFrame"></iframe>
                    </div>
                </div>
            </div>
        `;
        
        return workspace;
    }

    // Render block categories for a language
    renderBlockCategories(language) {
        const categories = this.codeBlocks[language];
        let html = '';
        
        Object.entries(categories).forEach(([categoryName, blocks]) => {
            html += `
                <div class="block-category">
                    <div class="category-header">
                        <h4>${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)}</h4>
                        <button class="category-toggle">▼</button>
                    </div>
                    <div class="category-blocks">
                        ${blocks.map(block => `
                            <div class="code-block" draggable="true" data-block-id="${block.id}" data-language="${language}">
                                <span class="block-icon">${block.icon}</span>
                                <span class="block-name">${block.name}</span>
                                <div class="block-preview">${this.escapeHtml(block.code.substring(0, 50))}...</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        return html;
    }

    // Initialize the workspace in the page
    initializeWorkspace() {
        // Find a suitable container or create one
        let container = document.querySelector('.drag-drop-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'drag-drop-container';
            
            // Insert after challenges content or at the end of body
            const challengesContent = document.querySelector('.challenges-content');
            if (challengesContent) {
                challengesContent.parentNode.insertBefore(container, challengesContent.nextSibling);
            } else {
                document.body.appendChild(container);
            }
        }
        
        this.workspace = this.createWorkspace();
        container.appendChild(this.workspace);
        
        this.bindWorkspaceEvents();
    }

    // Bind event listeners
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeWorkspace();
        });
    }

    // Bind workspace-specific events
    bindWorkspaceEvents() {
        // Language tab switching
        this.workspace.querySelectorAll('.lang-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const language = e.target.dataset.lang;
                this.switchLanguage(language);
            });
        });

        // Category toggles
        this.workspace.querySelectorAll('.category-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const category = e.target.closest('.block-category');
                const blocks = category.querySelector('.category-blocks');
                const isOpen = blocks.style.display !== 'none';
                
                blocks.style.display = isOpen ? 'none' : 'block';
                e.target.textContent = isOpen ? '▶' : '▼';
            });
        });

        // Drag and drop events
        this.workspace.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('code-block')) {
                this.handleDragStart(e);
            }
        });

        this.workspace.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.handleDragOver(e);
        });

        this.workspace.addEventListener('drop', (e) => {
            e.preventDefault();
            this.handleDrop(e);
        });

        this.workspace.addEventListener('dragleave', (e) => {
            this.handleDragLeave(e);
        });

        // Control buttons
        document.getElementById('clearWorkspace').addEventListener('click', () => this.clearWorkspace());
        document.getElementById('generateCode').addEventListener('click', () => this.generateCode());
        document.getElementById('previewCode').addEventListener('click', () => this.previewCode());
        document.getElementById('exportCode').addEventListener('click', () => this.exportCode());

        // Canvas controls
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomCanvas(1.2));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomCanvas(0.8));
        document.getElementById('resetZoom').addEventListener('click', () => this.resetZoom());

        // Output controls
        document.getElementById('closeOutput').addEventListener('click', () => this.hideCodeOutput());
        document.getElementById('copyCode').addEventListener('click', () => this.copyGeneratedCode());

        // Preview controls
        document.getElementById('closePreview').addEventListener('click', () => this.hidePreview());

        // Output tabs
        this.workspace.querySelectorAll('.output-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const outputType = e.target.dataset.output;
                this.switchOutputTab(outputType);
            });
        });

        // Block selection
        this.workspace.addEventListener('click', (e) => {
            if (e.target.closest('.dropped-block')) {
                this.selectBlock(e.target.closest('.dropped-block'));
            }
        });
    }

    // Handle drag start
    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        
        // Show drop zones
        this.workspace.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.add('drop-zone-active');
        });
    }

    // Handle drag over
    handleDragOver(e) {
        const dropZone = e.target.closest('.drop-zone');
        if (dropZone) {
            dropZone.classList.add('drop-zone-hover');
        }
    }

    // Handle drag leave
    handleDragLeave(e) {
        const dropZone = e.target.closest('.drop-zone');
        if (dropZone) {
            dropZone.classList.remove('drop-zone-hover');
        }
    }

    // Handle drop
    handleDrop(e) {
        const dropZone = e.target.closest('.drop-zone');
        if (!dropZone || !this.draggedElement) return;

        const blockId = this.draggedElement.dataset.blockId;
        const language = this.draggedElement.dataset.language;
        const blockData = this.findBlockData(blockId, language);

        if (blockData) {
            this.createDroppedBlock(blockData, language, dropZone);
        }

        // Cleanup
        this.draggedElement.classList.remove('dragging');
        this.workspace.querySelectorAll('.drop-zone').forEach(zone => {
            zone.classList.remove('drop-zone-active', 'drop-zone-hover');
        });
        this.draggedElement = null;
    }

    // Find block data by ID and language
    findBlockData(blockId, language) {
        const categories = this.codeBlocks[language];
        for (const category of Object.values(categories)) {
            const block = category.find(b => b.id === blockId);
            if (block) return block;
        }
        return null;
    }

    // Create a dropped block in the canvas
    createDroppedBlock(blockData, language, dropZone) {
        const blockElement = document.createElement('div');
        blockElement.className = `dropped-block ${language}-block`;
        blockElement.dataset.blockId = blockData.id;
        blockElement.dataset.language = language;
        blockElement.dataset.uniqueId = `block_${++this.blockCounter}`;
        
        blockElement.innerHTML = `
            <div class="block-header">
                <span class="block-icon">${blockData.icon}</span>
                <span class="block-title">${blockData.name}</span>
                <div class="block-actions">
                    <button class="block-action edit-block" title="Edit">✏️</button>
                    <button class="block-action delete-block" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="block-content">
                <pre><code>${this.escapeHtml(blockData.code)}</code></pre>
            </div>
            <div class="block-connectors">
                <div class="connector connector-top"></div>
                <div class="connector connector-bottom"></div>
            </div>
        `;

        // Add event listeners
        blockElement.querySelector('.delete-block').addEventListener('click', () => {
            blockElement.remove();
        });

        blockElement.querySelector('.edit-block').addEventListener('click', () => {
            this.editBlock(blockElement);
        });

        // Remove placeholder if this is the first block
        const placeholder = dropZone.querySelector('.drop-zone-placeholder');
        if (placeholder) {
            placeholder.remove();
        }

        dropZone.appendChild(blockElement);
        
        // Create nested drop zones for container blocks
        if (this.isContainerBlock(blockData.id)) {
            this.createNestedDropZone(blockElement);
        }
    }

    // Check if block is a container that can hold other blocks
    isContainerBlock(blockId) {
        const containerBlocks = ['div', 'header', 'nav', 'section', 'footer', 'form', 'ul', 'ol'];
        return containerBlocks.includes(blockId);
    }

    // Create nested drop zone for container blocks
    createNestedDropZone(blockElement) {
        const nestedZone = document.createElement('div');
        nestedZone.className = 'drop-zone nested-drop-zone';
        nestedZone.innerHTML = `
            <div class="drop-zone-placeholder small">
                <span class="placeholder-text">Drop blocks here</span>
            </div>
        `;
        
        blockElement.appendChild(nestedZone);
    }

    // Switch language tab
    switchLanguage(language) {
        // Update active tab
        this.workspace.querySelectorAll('.lang-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.lang === language);
        });

        // Update blocks container
        const blocksContainer = document.getElementById('blocksContainer');
        blocksContainer.innerHTML = this.renderBlockCategories(language);

        // Re-bind category toggle events
        this.workspace.querySelectorAll('.category-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const category = e.target.closest('.block-category');
                const blocks = category.querySelector('.category-blocks');
                const isOpen = blocks.style.display !== 'none';
                
                blocks.style.display = isOpen ? 'none' : 'block';
                e.target.textContent = isOpen ? '▶' : '▼';
            });
        });
    }

    // Generate code from dropped blocks
    generateCode() {
        const canvasArea = document.getElementById('canvasArea');
        const blocks = canvasArea.querySelectorAll('.dropped-block');
        
        this.generatedCode = { html: '', css: '', js: '' };
        
        blocks.forEach(block => {
            const language = block.dataset.language;
            const blockId = block.dataset.blockId;
            const blockData = this.findBlockData(blockId, language);
            
            if (blockData) {
                this.generatedCode[language] += blockData.code + '\n\n';
            }
        });

        this.showCodeOutput();
    }

    // Show code output panel
    showCodeOutput() {
        const outputPanel = document.getElementById('codeOutput');
        outputPanel.style.display = 'block';
        this.switchOutputTab('html');
    }

    // Hide code output panel
    hideCodeOutput() {
        document.getElementById('codeOutput').style.display = 'none';
    }

    // Switch output tab
    switchOutputTab(outputType) {
        // Update active tab
        this.workspace.querySelectorAll('.output-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.output === outputType);
        });

        // Update code content
        const outputCode = document.getElementById('outputCode');
        outputCode.textContent = this.generatedCode[outputType] || '// No code generated';
    }

    // Copy generated code
    copyGeneratedCode() {
        const activeTab = this.workspace.querySelector('.output-tab.active');
        const outputType = activeTab.dataset.output;
        const code = this.generatedCode[outputType];
        
        navigator.clipboard.writeText(code).then(() => {
            const copyBtn = document.getElementById('copyCode');
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '✅ Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        });
    }

    // Preview generated code
    previewCode() {
        this.generateCode();
        
        const html = this.generatedCode.html;
        const css = this.generatedCode.css;
        const js = this.generatedCode.js;
        
        const previewContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>${css}</style>
            </head>
            <body>
                ${html}
                <script>${js}</script>
            </body>
            </html>
        `;
        
        const previewFrame = document.getElementById('previewFrame');
        previewFrame.srcdoc = previewContent;
        
        document.getElementById('previewModal').style.display = 'flex';
    }

    // Hide preview modal
    hidePreview() {
        document.getElementById('previewModal').style.display = 'none';
    }

    // Export generated code
    exportCode() {
        this.generateCode();
        
        const exportData = {
            html: this.generatedCode.html,
            css: this.generatedCode.css,
            js: this.generatedCode.js,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visual-code-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Clear workspace
    clearWorkspace() {
        if (confirm('Clear all blocks from the workspace?')) {
            const canvasArea = document.getElementById('canvasArea');
            canvasArea.innerHTML = `
                <div class="drop-zone main-drop-zone" data-type="main">
                    <div class="drop-zone-placeholder">
                        <span class="placeholder-icon">📦</span>
                        <span class="placeholder-text">Drag code blocks here to start building</span>
                    </div>
                </div>
            `;
        }
    }

    // Canvas zoom controls
    zoomCanvas(factor) {
        const canvasArea = document.getElementById('canvasArea');
        const currentScale = parseFloat(canvasArea.dataset.scale || '1');
        const newScale = Math.max(0.5, Math.min(2, currentScale * factor));
        
        canvasArea.style.transform = `scale(${newScale})`;
        canvasArea.dataset.scale = newScale;
    }

    // Reset canvas zoom
    resetZoom() {
        const canvasArea = document.getElementById('canvasArea');
        canvasArea.style.transform = 'scale(1)';
        canvasArea.dataset.scale = '1';
    }

    // Select block for editing
    selectBlock(blockElement) {
        // Remove previous selection
        this.workspace.querySelectorAll('.dropped-block.selected').forEach(block => {
            block.classList.remove('selected');
        });
        
        // Select current block
        blockElement.classList.add('selected');
        
        // Show properties panel
        this.showBlockProperties(blockElement);
    }

    // Show block properties
    showBlockProperties(blockElement) {
        const propertiesContent = document.getElementById('propertiesContent');
        const blockId = blockElement.dataset.blockId;
        const language = blockElement.dataset.language;
        
        propertiesContent.innerHTML = `
            <div class="property-group">
                <h4>Block Properties</h4>
                <div class="property-item">
                    <label>Block Type:</label>
                    <span>${blockId}</span>
                </div>
                <div class="property-item">
                    <label>Language:</label>
                    <span>${language}</span>
                </div>
                <div class="property-item">
                    <label>Custom CSS Class:</label>
                    <input type="text" class="property-input" placeholder="custom-class">
                </div>
                <div class="property-item">
                    <label>Custom ID:</label>
                    <input type="text" class="property-input" placeholder="custom-id">
                </div>
                <button class="apply-properties">Apply Changes</button>
            </div>
        `;
    }

    // Edit block content
    editBlock(blockElement) {
        const blockContent = blockElement.querySelector('.block-content code');
        const currentCode = blockContent.textContent;
        
        const newCode = prompt('Edit code:', currentCode);
        if (newCode !== null) {
            blockContent.textContent = newCode;
        }
    }

    // Utility function to escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Global instance
window.dragDropSystem = new DragDropCodeSystem();