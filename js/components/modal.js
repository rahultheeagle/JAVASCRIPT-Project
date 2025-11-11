// Modal component
import helpers from '../utils/helpers.js';

export class Modal {
    constructor(options = {}) {
        this.options = {
            title: 'Modal',
            content: '',
            closable: true,
            backdrop: true,
            ...options
        };
        this.element = null;
        this.isOpen = false;
    }

    create() {
        this.element = helpers.createElement('div', { className: 'modal-overlay' });
        
        this.element.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${this.options.title}</h3>
                        ${this.options.closable ? '<button class="modal-close">×</button>' : ''}
                    </div>
                    <div class="modal-body">
                        ${this.options.content}
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        return this.element;
    }

    setupEventListeners() {
        if (this.options.closable) {
            this.element.querySelector('.modal-close').addEventListener('click', () => {
                this.close();
            });
        }

        if (this.options.backdrop) {
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) {
                    this.close();
                }
            });
        }
    }

    open() {
        if (!this.element) this.create();
        
        document.body.appendChild(this.element);
        this.isOpen = true;
        
        // Add entrance animation
        setTimeout(() => {
            this.element.classList.add('modal-open');
        }, 10);
        
        return this;
    }

    close() {
        if (!this.isOpen) return;
        
        this.element.classList.remove('modal-open');
        setTimeout(() => {
            if (this.element && this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
            this.isOpen = false;
        }, 300);
        
        return this;
    }

    setTitle(title) {
        if (this.element) {
            this.element.querySelector('.modal-title').textContent = title;
        }
        return this;
    }

    setContent(content) {
        if (this.element) {
            this.element.querySelector('.modal-body').innerHTML = content;
        }
        return this;
    }
}

export default Modal;