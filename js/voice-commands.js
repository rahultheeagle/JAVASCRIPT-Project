// Voice Commands System - Speech recognition for coding
class VoiceCommandsSystem {
    constructor() {
        this.storageManager = window.StorageManager;
        this.recognition = null;
        this.isListening = false;
        this.commands = this.initializeCommands();
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.createVoicePanel();
        this.setupEventListeners();
    }

    setupSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateVoiceStatus('Listening...');
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateVoiceStatus('Ready');
        };

        this.recognition.onresult = (event) => {
            this.handleSpeechResult(event);
        };

        this.recognition.onerror = (event) => {
            this.handleSpeechError(event);
        };
    }

    initializeCommands() {
        return {
            // Editor commands
            'new line': () => this.insertText('\n'),
            'tab': () => this.insertText('    '),
            'delete line': () => this.deleteLine(),
            'clear editor': () => this.clearEditor(),
            'save code': () => this.saveCode(),
            'run code': () => this.runCode(),
            
            // HTML commands
            'create div': () => this.insertText('<div></div>'),
            'create paragraph': () => this.insertText('<p></p>'),
            'create heading': () => this.insertText('<h1></h1>'),
            'create button': () => this.insertText('<button></button>'),
            'create input': () => this.insertText('<input type="text">'),
            'create form': () => this.insertText('<form></form>'),
            'create link': () => this.insertText('<a href=""></a>'),
            'create image': () => this.insertText('<img src="" alt="">'),
            
            // CSS commands
            'add color': () => this.insertText('color: ;'),
            'add background': () => this.insertText('background: ;'),
            'add margin': () => this.insertText('margin: ;'),
            'add padding': () => this.insertText('padding: ;'),
            'add border': () => this.insertText('border: ;'),
            'add width': () => this.insertText('width: ;'),
            'add height': () => this.insertText('height: ;'),
            'flex box': () => this.insertText('display: flex;'),
            'css grid': () => this.insertText('display: grid;'),
            
            // JavaScript commands
            'create function': () => this.insertText('function () {\n    \n}'),
            'create variable': () => this.insertText('let  = ;'),
            'create constant': () => this.insertText('const  = ;'),
            'console log': () => this.insertText('console.log();'),
            'if statement': () => this.insertText('if () {\n    \n}'),
            'for loop': () => this.insertText('for (let i = 0; i < ; i++) {\n    \n}'),
            'add event listener': () => this.insertText('addEventListener("click", function() {\n    \n});'),
            
            // Navigation commands
            'switch to html': () => this.switchTab('html'),
            'switch to css': () => this.switchTab('css'),
            'switch to javascript': () => this.switchTab('js'),
            'go to editor': () => window.location.href = 'editor.html',
            'go to challenges': () => window.location.href = 'challenges.html',
            'go to dashboard': () => window.location.href = 'index.html'
        };
    }

    createVoicePanel() {
        if (document.getElementById('voice-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'voice-panel';
        panel.className = 'voice-panel';
        panel.innerHTML = `
            <div class="voice-header">
                <h4>🎤 Voice Commands</h4>
                <button id="toggle-voice-panel" class="toggle-btn">−</button>
            </div>
            <div class="voice-content">
                <div class="voice-controls">
                    <button id="start-listening" class="voice-btn primary">🎤 Start Listening</button>
                    <button id="stop-listening" class="voice-btn secondary" disabled>⏹️ Stop</button>
                    <button id="voice-help" class="voice-btn secondary">❓ Commands</button>
                </div>
                <div class="voice-status">
                    <div class="status-indicator" id="voice-status">Ready</div>
                    <div class="last-command" id="last-command">Say a command...</div>
                </div>
                <div id="voice-display" class="voice-display">
                    <p class="voice-intro">🗣️ Use voice commands to code faster! Click "Start Listening" and try saying commands like:</p>
                    <ul class="command-examples">
                        <li>"create div"</li>
                        <li>"add color"</li>
                        <li>"console log"</li>
                        <li>"switch to css"</li>
                    </ul>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        this.setupPanelListeners();
    }

    setupEventListeners() {
        // Keyboard shortcut to toggle voice
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'm') {
                e.preventDefault();
                this.toggleListening();
            }
        });
    }

    setupPanelListeners() {
        document.getElementById('toggle-voice-panel').addEventListener('click', () => {
            const panel = document.getElementById('voice-panel');
            panel.classList.toggle('collapsed');
        });

        document.getElementById('start-listening').addEventListener('click', () => this.startListening());
        document.getElementById('stop-listening').addEventListener('click', () => this.stopListening());
        document.getElementById('voice-help').addEventListener('click', () => this.showCommands());
    }

    startListening() {
        if (!this.recognition) {
            this.showMessage('Speech recognition not supported in this browser', 'error');
            return;
        }

        try {
            this.recognition.start();
            document.getElementById('start-listening').disabled = true;
            document.getElementById('stop-listening').disabled = false;
            this.updateVoiceStatus('Starting...');
        } catch (error) {
            this.handleSpeechError({ error: 'not-allowed' });
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        document.getElementById('start-listening').disabled = false;
        document.getElementById('stop-listening').disabled = true;
        this.updateVoiceStatus('Stopped');
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    handleSpeechResult(event) {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        if (finalTranscript) {
            this.processCommand(finalTranscript.toLowerCase().trim());
        }

        // Show interim results
        if (interimTranscript) {
            document.getElementById('last-command').textContent = `Hearing: "${interimTranscript}"`;
        }
    }

    processCommand(transcript) {
        document.getElementById('last-command').textContent = `Last: "${transcript}"`;
        
        // Check for exact matches first
        if (this.commands[transcript]) {
            this.executeCommand(transcript);
            return;
        }

        // Check for partial matches
        const matchedCommand = Object.keys(this.commands).find(cmd => 
            transcript.includes(cmd) || cmd.includes(transcript)
        );

        if (matchedCommand) {
            this.executeCommand(matchedCommand);
            return;
        }

        // Handle dynamic commands
        this.handleDynamicCommands(transcript);
    }

    handleDynamicCommands(transcript) {
        // Handle "type [text]" command
        if (transcript.startsWith('type ')) {
            const text = transcript.substring(5);
            this.insertText(text);
            this.showCommandFeedback(`Typed: "${text}"`);
            return;
        }

        // Handle "create heading [number]"
        const headingMatch = transcript.match(/create heading (\d)/);
        if (headingMatch) {
            const level = headingMatch[1];
            this.insertText(`<h${level}></h${level}>`);
            this.showCommandFeedback(`Created H${level} heading`);
            return;
        }

        // Handle "set color [color]"
        if (transcript.startsWith('set color ')) {
            const color = transcript.substring(10);
            this.insertText(`color: ${color};`);
            this.showCommandFeedback(`Set color to ${color}`);
            return;
        }

        // Handle "go to line [number]"
        const lineMatch = transcript.match(/go to line (\d+)/);
        if (lineMatch) {
            const lineNumber = parseInt(lineMatch[1]);
            this.goToLine(lineNumber);
            this.showCommandFeedback(`Went to line ${lineNumber}`);
            return;
        }

        this.showCommandFeedback(`Command not recognized: "${transcript}"`);
    }

    executeCommand(command) {
        try {
            this.commands[command]();
            this.showCommandFeedback(`Executed: ${command}`);
        } catch (error) {
            this.showCommandFeedback(`Error executing: ${command}`);
        }
    }

    insertText(text) {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
            const cursorPos = activeEditor.selectionStart;
            const textBefore = activeEditor.value.substring(0, cursorPos);
            const textAfter = activeEditor.value.substring(activeEditor.selectionEnd);
            
            activeEditor.value = textBefore + text + textAfter;
            activeEditor.selectionStart = activeEditor.selectionEnd = cursorPos + text.length;
            activeEditor.focus();
            
            // Trigger input event for editor updates
            activeEditor.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    deleteLine() {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
            const lines = activeEditor.value.split('\n');
            const cursorPos = activeEditor.selectionStart;
            const textBeforeCursor = activeEditor.value.substring(0, cursorPos);
            const currentLineIndex = textBeforeCursor.split('\n').length - 1;
            
            lines.splice(currentLineIndex, 1);
            activeEditor.value = lines.join('\n');
            activeEditor.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    clearEditor() {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
            activeEditor.value = '';
            activeEditor.dispatchEvent(new Event('input', { bubbles: true }));
        }
    }

    saveCode() {
        const saveBtn = document.getElementById('save-code');
        if (saveBtn) saveBtn.click();
    }

    runCode() {
        const runBtn = document.getElementById('run-code');
        if (runBtn) runBtn.click();
    }

    switchTab(language) {
        const tab = document.querySelector(`[data-lang="${language}"]`);
        if (tab) tab.click();
    }

    goToLine(lineNumber) {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
            const lines = activeEditor.value.split('\n');
            if (lineNumber > 0 && lineNumber <= lines.length) {
                const position = lines.slice(0, lineNumber - 1).join('\n').length + (lineNumber > 1 ? 1 : 0);
                activeEditor.selectionStart = activeEditor.selectionEnd = position;
                activeEditor.focus();
            }
        }
    }

    getActiveEditor() {
        // Try to find focused editor first
        const focusedEditor = document.querySelector('textarea:focus');
        if (focusedEditor) return focusedEditor;
        
        // Fall back to visible editor
        const editors = ['html-editor', 'css-editor', 'js-editor'];
        for (const editorId of editors) {
            const editor = document.getElementById(editorId);
            if (editor && editor.offsetParent !== null) {
                return editor;
            }
        }
        
        // Return first available editor
        return document.querySelector('textarea[id*="editor"]');
    }

    updateVoiceStatus(status) {
        const statusEl = document.getElementById('voice-status');
        if (statusEl) {
            statusEl.textContent = status;
            statusEl.className = `status-indicator ${status.toLowerCase().replace(' ', '-')}`;
        }
    }

    showCommandFeedback(message) {
        const display = document.getElementById('voice-display');
        if (display) {
            display.innerHTML = `
                <div class="command-feedback">
                    <p>✅ ${message}</p>
                </div>
            `;
            
            setTimeout(() => {
                this.showWelcome();
            }, 3000);
        }
    }

    showCommands() {
        const display = document.getElementById('voice-display');
        display.innerHTML = `
            <div class="commands-help">
                <h5>Available Voice Commands:</h5>
                <div class="command-categories">
                    <div class="command-category">
                        <h6>Editor:</h6>
                        <ul>
                            <li>"new line" - Add new line</li>
                            <li>"tab" - Add indentation</li>
                            <li>"delete line" - Remove current line</li>
                            <li>"clear editor" - Clear all text</li>
                            <li>"save code" - Save current code</li>
                            <li>"run code" - Execute code</li>
                        </ul>
                    </div>
                    <div class="command-category">
                        <h6>HTML:</h6>
                        <ul>
                            <li>"create div" - Add div element</li>
                            <li>"create paragraph" - Add p element</li>
                            <li>"create heading" - Add h1 element</li>
                            <li>"create button" - Add button element</li>
                        </ul>
                    </div>
                    <div class="command-category">
                        <h6>CSS:</h6>
                        <ul>
                            <li>"add color" - Add color property</li>
                            <li>"add background" - Add background</li>
                            <li>"flex box" - Add display flex</li>
                            <li>"css grid" - Add display grid</li>
                        </ul>
                    </div>
                    <div class="command-category">
                        <h6>JavaScript:</h6>
                        <ul>
                            <li>"create function" - Add function</li>
                            <li>"console log" - Add console.log</li>
                            <li>"if statement" - Add if condition</li>
                            <li>"for loop" - Add for loop</li>
                        </ul>
                    </div>
                </div>
                <p class="shortcut-info">💡 Press Ctrl+M to toggle voice recognition</p>
            </div>
        `;
    }

    showWelcome() {
        const display = document.getElementById('voice-display');
        display.innerHTML = `
            <p class="voice-intro">🗣️ Use voice commands to code faster! Click "Start Listening" and try saying commands like:</p>
            <ul class="command-examples">
                <li>"create div"</li>
                <li>"add color"</li>
                <li>"console log"</li>
                <li>"switch to css"</li>
            </ul>
        `;
    }

    handleSpeechError(event) {
        let errorMessage = 'Speech recognition error';
        
        switch (event.error) {
            case 'not-allowed':
                errorMessage = 'Microphone access denied. Please allow microphone access.';
                break;
            case 'no-speech':
                errorMessage = 'No speech detected. Try speaking louder.';
                break;
            case 'audio-capture':
                errorMessage = 'No microphone found. Please check your microphone.';
                break;
            case 'network':
                errorMessage = 'Network error. Please check your connection.';
                break;
        }
        
        this.showMessage(errorMessage, 'error');
        this.stopListening();
    }

    showMessage(text, type = 'info') {
        const notification = document.createElement('div');
        notification.className = 'voice-notification';
        notification.innerHTML = `
            <div class="voice-message ${type}">
                <span>${text}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize voice commands system
document.addEventListener('DOMContentLoaded', () => {
    window.voiceCommands = new VoiceCommandsSystem();
});