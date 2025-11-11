class ProgressBars {
    constructor() {
        this.bars = new Map();
        this.init();
    }

    init() {
        this.createStyles();
    }

    createStyles() {
        if (document.getElementById('progress-bar-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'progress-bar-styles';
        style.textContent = `
            .progress-bar-animated {
                position: relative;
                overflow: hidden;
            }
            
            .progress-bar-animated::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: shimmer 2s infinite;
            }
            
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(style);
    }

    create(container, options = {}) {
        const {
            value = 0,
            max = 100,
            type = 'default',
            showText = true,
            animated = true,
            color = null,
            height = '8px',
            label = '',
            id = `progress-${Date.now()}`
        } = options;

        const progressEl = document.createElement('div');
        progressEl.className = `progress-container ${type}`;
        progressEl.innerHTML = `
            ${label ? `<div class="progress-label">${label}</div>` : ''}
            <div class="progress-bar" style="height: ${height}">
                <div class="progress-fill ${animated ? 'progress-bar-animated' : ''}" 
                     style="${color ? `background: ${color};` : ''}"></div>
                ${showText ? '<div class="progress-text">0%</div>' : ''}
            </div>
        `;

        if (typeof container === 'string') {
            container = document.querySelector(container);
        }
        
        container.appendChild(progressEl);
        
        const bar = {
            element: progressEl,
            fill: progressEl.querySelector('.progress-fill'),
            text: progressEl.querySelector('.progress-text'),
            value: 0,
            max: max,
            type: type
        };
        
        this.bars.set(id, bar);
        this.update(id, value);
        
        return id;
    }

    update(id, value, options = {}) {
        const bar = this.bars.get(id);
        if (!bar) return;

        const { duration = 800, easing = 'ease-out' } = options;
        const percentage = Math.min(Math.max((value / bar.max) * 100, 0), 100);
        
        bar.value = value;
        bar.fill.style.transition = `width ${duration}ms ${easing}`;
        bar.fill.style.width = `${percentage}%`;
        
        if (bar.text) {
            bar.text.textContent = `${Math.round(percentage)}%`;
        }

        // Add completion effects
        if (percentage >= 100) {
            this.onComplete(bar);
        }
    }

    onComplete(bar) {
        bar.fill.classList.add('completed');
        
        // Show completion toast if available
        if (window.toastSystem && bar.type !== 'silent') {
            const messages = {
                lesson: 'Lesson completed! 🎉',
                challenge: 'Challenge completed! 💪',
                upload: 'Upload completed! ✅',
                download: 'Download completed! 📥',
                default: 'Task completed! ✨'
            };
            
            window.toastSystem.success(messages[bar.type] || messages.default);
        }
    }

    increment(id, amount = 1, options = {}) {
        const bar = this.bars.get(id);
        if (!bar) return;
        
        this.update(id, bar.value + amount, options);
    }

    setMax(id, max) {
        const bar = this.bars.get(id);
        if (!bar) return;
        
        bar.max = max;
        this.update(id, bar.value);
    }

    reset(id) {
        const bar = this.bars.get(id);
        if (!bar) return;
        
        bar.fill.classList.remove('completed');
        this.update(id, 0, { duration: 300 });
    }

    remove(id) {
        const bar = this.bars.get(id);
        if (!bar) return;
        
        bar.element.remove();
        this.bars.delete(id);
    }

    // Quick creation methods
    createLessonProgress(container, label = 'Lesson Progress') {
        return this.create(container, {
            type: 'lesson',
            label: label,
            color: 'var(--primary-color)',
            height: '12px'
        });
    }

    createChallengeProgress(container, label = 'Challenge Progress') {
        return this.create(container, {
            type: 'challenge',
            label: label,
            color: 'var(--success-color)',
            height: '10px'
        });
    }

    createUploadProgress(container, label = 'Uploading...') {
        return this.create(container, {
            type: 'upload',
            label: label,
            color: '#3b82f6',
            height: '6px'
        });
    }

    createXPProgress(container, current, next, label = 'XP Progress') {
        const id = this.create(container, {
            type: 'silent',
            label: `${label} (${current}/${next})`,
            max: next,
            color: '#8b5cf6',
            height: '14px'
        });
        
        this.update(id, current);
        return id;
    }

    // Simulate progress for demos
    simulate(id, duration = 3000) {
        const bar = this.bars.get(id);
        if (!bar) return;
        
        const steps = 20;
        const stepValue = bar.max / steps;
        const stepDuration = duration / steps;
        
        let currentStep = 0;
        
        const interval = setInterval(() => {
            currentStep++;
            this.update(id, currentStep * stepValue, { duration: stepDuration });
            
            if (currentStep >= steps) {
                clearInterval(interval);
            }
        }, stepDuration);
    }
}

// Initialize progress bars system
document.addEventListener('DOMContentLoaded', () => {
    window.progressBars = new ProgressBars();
});