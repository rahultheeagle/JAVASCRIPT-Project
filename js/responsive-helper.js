// Responsive Helper - Mobile-first utilities
class ResponsiveHelper {
    constructor() {
        this.breakpoints = {
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
            '2xl': 1400
        };
        
        this.currentBreakpoint = this.getCurrentBreakpoint();
        this.listeners = new Map();
        this.init();
    }

    // Initialize responsive helper
    init() {
        this.setupMediaQueries();
        this.detectTouchDevice();
        this.handleOrientationChange();
    }

    // Get current breakpoint
    getCurrentBreakpoint() {
        const width = window.innerWidth;
        
        if (width >= this.breakpoints['2xl']) return '2xl';
        if (width >= this.breakpoints.xl) return 'xl';
        if (width >= this.breakpoints.lg) return 'lg';
        if (width >= this.breakpoints.md) return 'md';
        if (width >= this.breakpoints.sm) return 'sm';
        return 'xs';
    }

    // Check if current screen matches breakpoint
    matches(breakpoint) {
        const width = window.innerWidth;
        return width >= (this.breakpoints[breakpoint] || 0);
    }

    // Check if mobile device
    isMobile() {
        return !this.matches('md');
    }

    // Check if tablet
    isTablet() {
        return this.matches('md') && !this.matches('lg');
    }

    // Check if desktop
    isDesktop() {
        return this.matches('lg');
    }

    // Check if touch device
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    // Get viewport dimensions
    getViewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            breakpoint: this.currentBreakpoint
        };
    }

    // Setup media query listeners
    setupMediaQueries() {
        Object.entries(this.breakpoints).forEach(([name, width]) => {
            const mediaQuery = window.matchMedia(`(min-width: ${width}px)`);
            
            mediaQuery.addEventListener('change', (e) => {
                const oldBreakpoint = this.currentBreakpoint;
                this.currentBreakpoint = this.getCurrentBreakpoint();
                
                if (oldBreakpoint !== this.currentBreakpoint) {
                    this.dispatchBreakpointChange(oldBreakpoint, this.currentBreakpoint);
                }
            });
        });
    }

    // Add breakpoint change listener
    onBreakpointChange(callback) {
        const id = Date.now() + Math.random();
        this.listeners.set(id, callback);
        return id;
    }

    // Remove breakpoint change listener
    removeListener(id) {
        this.listeners.delete(id);
    }

    // Dispatch breakpoint change event
    dispatchBreakpointChange(oldBreakpoint, newBreakpoint) {
        const event = new CustomEvent('breakpointchange', {
            detail: { oldBreakpoint, newBreakpoint, viewport: this.getViewport() }
        });
        
        document.dispatchEvent(event);
        
        // Call registered listeners
        this.listeners.forEach(callback => {
            callback(oldBreakpoint, newBreakpoint);
        });
    }

    // Detect touch device and add class
    detectTouchDevice() {
        if (this.isTouchDevice()) {
            document.documentElement.classList.add('touch-device');
        } else {
            document.documentElement.classList.add('no-touch');
        }
    }

    // Handle orientation change
    handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                const oldBreakpoint = this.currentBreakpoint;
                this.currentBreakpoint = this.getCurrentBreakpoint();
                
                if (oldBreakpoint !== this.currentBreakpoint) {
                    this.dispatchBreakpointChange(oldBreakpoint, this.currentBreakpoint);
                }
            }, 100);
        });
    }

    // Show/hide elements based on breakpoint
    showAt(element, breakpoint) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        const show = this.matches(breakpoint);
        target.style.display = show ? '' : 'none';
    }

    // Hide elements at breakpoint
    hideAt(element, breakpoint) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        const hide = this.matches(breakpoint);
        target.style.display = hide ? 'none' : '';
    }

    // Apply responsive classes
    applyResponsiveClasses(element, classes) {
        const target = typeof element === 'string' ? document.querySelector(element) : element;
        if (!target) return;

        // Remove existing responsive classes
        target.className = target.className.replace(/\b(d|col|text|m|p)-(xs|sm|md|lg|xl|2xl)-\S+/g, '');

        // Apply classes for current breakpoint
        const currentClasses = classes[this.currentBreakpoint] || classes.default || [];
        currentClasses.forEach(cls => target.classList.add(cls));
    }

    // Get responsive value
    getResponsiveValue(values) {
        const breakpoints = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
        
        for (const bp of breakpoints) {
            if (values[bp] !== undefined && this.matches(bp)) {
                return values[bp];
            }
        }
        
        return values.default || null;
    }

    // Create responsive image
    createResponsiveImage(sources) {
        const picture = document.createElement('picture');
        
        Object.entries(sources).forEach(([breakpoint, src]) => {
            if (breakpoint === 'default') {
                const img = document.createElement('img');
                img.src = src;
                img.alt = sources.alt || '';
                picture.appendChild(img);
            } else {
                const source = document.createElement('source');
                source.media = `(min-width: ${this.breakpoints[breakpoint]}px)`;
                source.srcset = src;
                picture.appendChild(source);
            }
        });
        
        return picture;
    }

    // Debounced resize handler
    onResize(callback, delay = 250) {
        let timeoutId;
        
        const handler = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                callback(this.getViewport());
            }, delay);
        };
        
        window.addEventListener('resize', handler);
        
        return () => window.removeEventListener('resize', handler);
    }

    // Get device info
    getDeviceInfo() {
        return {
            isMobile: this.isMobile(),
            isTablet: this.isTablet(),
            isDesktop: this.isDesktop(),
            isTouchDevice: this.isTouchDevice(),
            breakpoint: this.currentBreakpoint,
            viewport: this.getViewport(),
            orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
        };
    }
}

// Global instance
window.responsiveHelper = new ResponsiveHelper();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ResponsiveHelper;
}