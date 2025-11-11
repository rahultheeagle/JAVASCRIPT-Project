// Animation Controller - Manage loading, success, error animations
class AnimationController {
    constructor() {
        this.activeAnimations = new Map();
    }

    // Show loading animation
    showLoading(element, type = 'spinner') {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        this.clearAnimations(target);

        switch (type) {
            case 'spinner':
                target.innerHTML = '<div class="loading-spinner"></div>';
                break;
            case 'dots':
                target.innerHTML = '<span class="loading-dots">Loading</span>';
                break;
            case 'pulse':
                target.classList.add('loading-pulse');
                break;
            case 'bounce':
                target.classList.add('loading-bounce');
                break;
            case 'progress':
                target.innerHTML = '<div class="loading-progress"></div>';
                break;
            case 'skeleton':
                target.classList.add('loading-skeleton');
                break;
        }

        this.activeAnimations.set(target, type);
    }

    // Show success animation
    showSuccess(element, message = 'Success!', duration = 3000) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        this.clearAnimations(target);

        target.innerHTML = `
            <div class="success-checkmark"></div>
            <div class="success-message">${message}</div>
        `;

        target.classList.add('animate-success');

        if (duration > 0) {
            setTimeout(() => {
                this.clearAnimations(target);
            }, duration);
        }
    }

    // Show error animation
    showError(element, message = 'Error occurred!', type = 'shake') {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        this.clearAnimations(target);

        target.innerHTML = `<div class="error-message">${message}</div>`;

        switch (type) {
            case 'shake':
                target.classList.add('error-shake');
                break;
            case 'pulse':
                target.classList.add('error-pulse');
                break;
            case 'wobble':
                target.classList.add('error-wobble');
                break;
        }

        // Remove error animation after completion
        setTimeout(() => {
            target.classList.remove('error-shake', 'error-pulse', 'error-wobble');
        }, 500);
    }

    // Clear all animations
    clearAnimations(element) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        // Remove all animation classes
        const animationClasses = [
            'loading-pulse', 'loading-bounce', 'loading-skeleton',
            'animate-success', 'animate-error', 'animate-loading',
            'error-shake', 'error-pulse', 'error-wobble',
            'fade-in', 'fade-out', 'slide-in', 'slide-out', 'zoom-in'
        ];

        animationClasses.forEach(cls => target.classList.remove(cls));
        this.activeAnimations.delete(target);
    }

    // Animate element with custom animation
    animate(element, animationType, duration = 300) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        target.classList.add(animationType);

        return new Promise(resolve => {
            setTimeout(() => {
                target.classList.remove(animationType);
                resolve();
            }, duration);
        });
    }

    // Chain animations
    async chainAnimations(element, animations) {
        for (const { type, duration = 300, delay = 0 } of animations) {
            if (delay > 0) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            await this.animate(element, type, duration);
        }
    }

    // Simulate async operation with loading states
    async simulateOperation(element, operation, options = {}) {
        const {
            loadingType = 'spinner',
            successMessage = 'Operation completed!',
            errorMessage = 'Operation failed!',
            duration = 2000
        } = options;

        try {
            this.showLoading(element, loadingType);
            
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, duration));
            
            // Execute the actual operation if provided
            if (typeof operation === 'function') {
                await operation();
            }
            
            this.showSuccess(element, successMessage);
            return true;
        } catch (error) {
            this.showError(element, errorMessage);
            return false;
        }
    }

    // Add hover animations
    addHoverAnimation(element, animationType) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        target.classList.add(`hover-${animationType}`);
    }

    // Create loading overlay
    createLoadingOverlay(container, message = 'Loading...') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
        
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (target) {
            target.style.position = 'relative';
            target.appendChild(overlay);
        }

        return overlay;
    }

    // Remove loading overlay
    removeLoadingOverlay(container) {
        const target = typeof container === 'string' ? document.querySelector(container) : container;
        if (!target) return;

        const overlay = target.querySelector('.loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Get animation status
    isAnimating(element) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        return this.activeAnimations.has(target);
    }

    // Stop all animations
    stopAllAnimations() {
        this.activeAnimations.forEach((type, element) => {
            this.clearAnimations(element);
        });
        this.activeAnimations.clear();
    }
}

// Global instance
window.animationController = new AnimationController();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}