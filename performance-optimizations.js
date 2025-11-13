// Performance Optimizations for CodeQuest Platform
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeInitialLoad();
        this.optimizeCodeExecution();
        this.optimizeAnimations();
        this.optimizeStorage();
        this.setupPerformanceMonitoring();
    }

    // Target: Initial load under 2 seconds
    optimizeInitialLoad() {
        // Lazy load non-critical resources
        this.lazyLoadImages();
        this.deferNonCriticalScripts();
        this.preloadCriticalResources();
        this.optimizeCSS();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        images.forEach(img => imageObserver.observe(img));
    }

    deferNonCriticalScripts() {
        const scripts = ['achievements.js', 'certificates.js', 'pwa.js'];
        scripts.forEach(script => {
            const scriptEl = document.createElement('script');
            scriptEl.src = `js/${script}`;
            scriptEl.defer = true;
            document.head.appendChild(scriptEl);
        });
    }

    preloadCriticalResources() {
        const criticalResources = [
            'css/main.css',
            'css/components.css',
            'js/app.js',
            'js/storage.js'
        ];
        
        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.endsWith('.css') ? 'style' : 'script';
            document.head.appendChild(link);
        });
    }

    optimizeCSS() {
        // Remove unused CSS and inline critical CSS
        const criticalCSS = `
            :root{--primary-color:#667eea;--secondary-color:#764ba2;--success-color:#48bb78;--warning-color:#ed8936;--error-color:#e53e3e;--text-color:#2d3748;--bg-color:#f7fafc;--card-bg:rgba(255,255,255,0.95);--border-radius:15px;--shadow:0 8px 32px rgba(0,0,0,0.1);--transition:all 0.3s ease}
            *{margin:0;padding:0;box-sizing:border-box}
            body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background:linear-gradient(135deg,var(--primary-color) 0%,var(--secondary-color) 100%);min-height:100vh;color:var(--text-color)}
            .container{max-width:1200px;margin:0 auto;padding:20px}
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Target: Code execution under 100ms
    optimizeCodeExecution() {
        this.debounceEvents();
        this.optimizeDOM();
        this.useRequestAnimationFrame();
    }

    debounceEvents() {
        const debounce = (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        };

        // Debounce search and input events
        document.addEventListener('input', debounce((e) => {
            if (e.target.matches('.search-input')) {
                this.performSearch(e.target.value);
            }
        }, 300));
    }

    optimizeDOM() {
        // Use document fragments for batch DOM updates
        this.createDocumentFragment = () => document.createDocumentFragment();
        
        // Cache DOM queries
        this.domCache = new Map();
        this.getElement = (selector) => {
            if (!this.domCache.has(selector)) {
                this.domCache.set(selector, document.querySelector(selector));
            }
            return this.domCache.get(selector);
        };
    }

    useRequestAnimationFrame() {
        // Batch DOM updates using RAF
        let rafId;
        this.scheduleUpdate = (callback) => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(callback);
        };
    }

    // Target: 60fps animations
    optimizeAnimations() {
        this.enableHardwareAcceleration();
        this.optimizeTransitions();
        this.reduceRepaints();
    }

    enableHardwareAcceleration() {
        const animatedElements = document.querySelectorAll('.card, .action-btn, .badge');
        animatedElements.forEach(el => {
            el.style.willChange = 'transform';
            el.style.transform = 'translateZ(0)';
        });
    }

    optimizeTransitions() {
        // Use transform and opacity for smooth animations
        const style = document.createElement('style');
        style.textContent = `
            .optimized-transition {
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                           opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .hover-optimized:hover {
                transform: translateY(-2px) translateZ(0);
            }
        `;
        document.head.appendChild(style);
    }

    reduceRepaints() {
        // Use CSS containment
        const containers = document.querySelectorAll('.card, .modal, .panel');
        containers.forEach(container => {
            container.style.contain = 'layout style paint';
        });
    }

    // Target: Efficient localStorage management
    optimizeStorage() {
        this.compressData();
        this.batchOperations();
        this.cleanupOldData();
    }

    compressData() {
        // Simple compression for localStorage
        const compress = (data) => {
            return JSON.stringify(data).replace(/\s+/g, '');
        };

        const decompress = (data) => {
            return JSON.parse(data);
        };

        // Override StorageManager methods
        const originalSet = StorageManager.set;
        StorageManager.set = function(key, data) {
            return originalSet.call(this, key, compress(data));
        };
    }

    batchOperations() {
        // Batch localStorage operations
        this.storageBatch = [];
        this.batchTimeout = null;

        this.batchSet = (key, value) => {
            this.storageBatch.push({ key, value });
            if (this.batchTimeout) clearTimeout(this.batchTimeout);
            this.batchTimeout = setTimeout(() => this.flushBatch(), 100);
        };

        this.flushBatch = () => {
            this.storageBatch.forEach(({ key, value }) => {
                localStorage.setItem(key, JSON.stringify(value));
            });
            this.storageBatch = [];
        };
    }

    cleanupOldData() {
        // Remove old data to prevent localStorage bloat
        const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
        const now = Date.now();

        Object.keys(localStorage).forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (data.timestamp && (now - data.timestamp) > maxAge) {
                    localStorage.removeItem(key);
                }
            } catch (e) {
                // Invalid JSON, skip
            }
        });
    }

    // Performance monitoring
    setupPerformanceMonitoring() {
        this.metrics = {
            loadTime: 0,
            codeExecutionTime: 0,
            animationFrames: 0,
            storageOperations: 0
        };

        this.measureLoadTime();
        this.measureCodeExecution();
        this.measureAnimationPerformance();
        this.measureStoragePerformance();
    }

    measureLoadTime() {
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.metrics.loadTime = loadTime;
            console.log(`Load time: ${loadTime.toFixed(2)}ms`);
            
            if (loadTime > 2000) {
                console.warn('Load time exceeds 2 second target');
            }
        });
    }

    measureCodeExecution() {
        const originalAddEventListener = EventTarget.prototype.addEventListener;
        EventTarget.prototype.addEventListener = function(type, listener, options) {
            const wrappedListener = (event) => {
                const start = performance.now();
                listener(event);
                const end = performance.now();
                
                if (end - start > 100) {
                    console.warn(`Event handler took ${(end - start).toFixed(2)}ms`);
                }
            };
            
            return originalAddEventListener.call(this, type, wrappedListener, options);
        };
    }

    measureAnimationPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();

        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;
                
                if (fps < 60) {
                    console.warn(`FPS below target: ${fps}`);
                }
            }
            
            requestAnimationFrame(measureFPS);
        };
        
        requestAnimationFrame(measureFPS);
    }

    measureStoragePerformance() {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            const start = performance.now();
            const result = originalSetItem.call(this, key, value);
            const end = performance.now();
            
            if (end - start > 10) {
                console.warn(`Storage operation took ${(end - start).toFixed(2)}ms`);
            }
            
            return result;
        };
    }

    // Lighthouse optimization
    optimizeForLighthouse() {
        this.addMetaTags();
        this.optimizeImages();
        this.addServiceWorker();
        this.improveAccessibility();
    }

    addMetaTags() {
        const metaTags = [
            { name: 'description', content: 'Interactive coding platform for learning JavaScript, HTML, and CSS' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'theme-color', content: '#667eea' }
        ];

        metaTags.forEach(tag => {
            if (!document.querySelector(`meta[name="${tag.name}"]`)) {
                const meta = document.createElement('meta');
                meta.name = tag.name;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    optimizeImages() {
        // Add loading="lazy" to images
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.loading = 'lazy';
            }
        });
    }

    addServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed'));
        }
    }

    improveAccessibility() {
        // Add missing alt attributes
        document.querySelectorAll('img:not([alt])').forEach(img => {
            img.alt = 'CodeQuest platform image';
        });

        // Add focus indicators
        const style = document.createElement('style');
        style.textContent = `
            *:focus {
                outline: 2px solid var(--primary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(style);
    }

    // Performance report
    generateReport() {
        return {
            loadTime: this.metrics.loadTime,
            recommendations: this.getRecommendations(),
            score: this.calculateScore()
        };
    }

    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.loadTime > 2000) {
            recommendations.push('Reduce initial load time by lazy loading resources');
        }
        
        return recommendations;
    }

    calculateScore() {
        let score = 100;
        
        if (this.metrics.loadTime > 2000) score -= 20;
        if (this.metrics.codeExecutionTime > 100) score -= 15;
        
        return Math.max(0, score);
    }
}

// Initialize performance optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
});