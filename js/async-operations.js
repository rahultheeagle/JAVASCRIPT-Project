class AsyncOperations {
    constructor() {
        this.cache = new Map();
        this.timers = new Map();
        this.requests = new Map();
    }

    // Simulated API calls
    async get(url, options = {}) {
        const { delay = 1000, cache = false, fail = false } = options;
        
        if (cache && this.cache.has(url)) {
            return this.cache.get(url);
        }

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (fail) {
                    reject(new Error(`Failed to fetch ${url}`));
                    return;
                }

                const data = this.generateMockData(url);
                if (cache) this.cache.set(url, data);
                resolve(data);
            }, delay);
        });
    }

    async post(url, data, options = {}) {
        const { delay = 800, fail = false } = options;
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (fail) {
                    reject(new Error(`Failed to post to ${url}`));
                    return;
                }

                resolve({
                    success: true,
                    id: Date.now(),
                    data,
                    timestamp: new Date().toISOString()
                });
            }, delay);
        });
    }

    async put(url, data, options = {}) {
        const { delay = 600, fail = false } = options;
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (fail) {
                    reject(new Error(`Failed to update ${url}`));
                    return;
                }

                resolve({
                    success: true,
                    updated: data,
                    timestamp: new Date().toISOString()
                });
            }, delay);
        });
    }

    async delete(url, options = {}) {
        const { delay = 500, fail = false } = options;
        
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (fail) {
                    reject(new Error(`Failed to delete ${url}`));
                    return;
                }

                resolve({
                    success: true,
                    deleted: true,
                    timestamp: new Date().toISOString()
                });
            }, delay);
        });
    }

    // Batch requests
    async batch(requests) {
        const promises = requests.map(req => {
            const { method, url, data, options } = req;
            return this[method](url, data, options);
        });
        
        return Promise.all(promises);
    }

    async batchSettled(requests) {
        const promises = requests.map(req => {
            const { method, url, data, options } = req;
            return this[method](url, data, options);
        });
        
        return Promise.allSettled(promises);
    }

    // Timer operations
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    timeout(promise, ms) {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), ms)
            )
        ]);
    }

    retry(fn, attempts = 3, delay = 1000) {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < attempts; i++) {
                try {
                    const result = await fn();
                    resolve(result);
                    return;
                } catch (error) {
                    if (i === attempts - 1) {
                        reject(error);
                        return;
                    }
                    await this.delay(delay);
                }
            }
        });
    }

    // Polling
    poll(fn, interval = 1000, maxAttempts = 10) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const timer = setInterval(async () => {
                try {
                    attempts++;
                    const result = await fn();
                    if (result) {
                        clearInterval(timer);
                        resolve(result);
                    } else if (attempts >= maxAttempts) {
                        clearInterval(timer);
                        reject(new Error('Max polling attempts reached'));
                    }
                } catch (error) {
                    clearInterval(timer);
                    reject(error);
                }
            }, interval);
        });
    }

    // Debounced async operations
    debounce(fn, delay = 300) {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            return new Promise((resolve, reject) => {
                timeoutId = setTimeout(async () => {
                    try {
                        const result = await fn(...args);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                }, delay);
            });
        };
    }

    // Throttled async operations
    throttle(fn, delay = 1000) {
        let lastCall = 0;
        return async (...args) => {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                return fn(...args);
            }
            throw new Error('Throttled');
        };
    }

    // Queue operations
    async queue(operations) {
        const results = [];
        for (const op of operations) {
            const result = await op();
            results.push(result);
        }
        return results;
    }

    // Progress tracking
    async withProgress(promise, onProgress) {
        const startTime = Date.now();
        
        const progressTimer = setInterval(() => {
            const elapsed = Date.now() - startTime;
            onProgress({ elapsed, status: 'running' });
        }, 100);

        try {
            const result = await promise;
            clearInterval(progressTimer);
            onProgress({ elapsed: Date.now() - startTime, status: 'completed' });
            return result;
        } catch (error) {
            clearInterval(progressTimer);
            onProgress({ elapsed: Date.now() - startTime, status: 'failed', error });
            throw error;
        }
    }

    // Mock data generation
    generateMockData(url) {
        const endpoints = {
            '/users': [
                { id: 1, name: 'John Doe', email: 'john@example.com' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
            ],
            '/posts': [
                { id: 1, title: 'First Post', content: 'Hello world' },
                { id: 2, title: 'Second Post', content: 'Another post' }
            ],
            '/products': [
                { id: 1, name: 'Laptop', price: 999 },
                { id: 2, name: 'Phone', price: 599 }
            ],
            '/challenges': [
                { id: 1, title: 'Array Methods', difficulty: 'Easy' },
                { id: 2, title: 'Async/Await', difficulty: 'Hard' }
            ]
        };

        return endpoints[url] || { message: 'Mock data', url, timestamp: Date.now() };
    }

    // Utility methods
    async parallel(promises) {
        return Promise.all(promises);
    }

    async series(promises) {
        const results = [];
        for (const promise of promises) {
            results.push(await promise);
        }
        return results;
    }

    async race(promises) {
        return Promise.race(promises);
    }

    // Timer management
    setTimer(name, callback, delay) {
        if (this.timers.has(name)) {
            clearTimeout(this.timers.get(name));
        }
        
        const timerId = setTimeout(() => {
            callback();
            this.timers.delete(name);
        }, delay);
        
        this.timers.set(name, timerId);
        return timerId;
    }

    clearTimer(name) {
        if (this.timers.has(name)) {
            clearTimeout(this.timers.get(name));
            this.timers.delete(name);
        }
    }

    setInterval(name, callback, interval) {
        if (this.timers.has(name)) {
            clearInterval(this.timers.get(name));
        }
        
        const intervalId = setInterval(callback, interval);
        this.timers.set(name, intervalId);
        return intervalId;
    }

    clearInterval(name) {
        if (this.timers.has(name)) {
            clearInterval(this.timers.get(name));
            this.timers.delete(name);
        }
    }

    clearAllTimers() {
        this.timers.forEach((timerId, name) => {
            clearTimeout(timerId);
            clearInterval(timerId);
        });
        this.timers.clear();
    }

    // Request cancellation
    cancelableRequest(url, options = {}) {
        let cancelled = false;
        
        const promise = new Promise(async (resolve, reject) => {
            try {
                if (cancelled) {
                    reject(new Error('Request cancelled'));
                    return;
                }
                
                const result = await this.get(url, options);
                if (cancelled) {
                    reject(new Error('Request cancelled'));
                } else {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        });

        return {
            promise,
            cancel: () => { cancelled = true; }
        };
    }
}

// Global instance
const asyncOps = new AsyncOperations();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsyncOperations;
}