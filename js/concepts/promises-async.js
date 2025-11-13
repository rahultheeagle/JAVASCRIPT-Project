// Promises and async/await implementation
export class PromisesAsync {
    // Promise utilities
    static delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static timeout(promise, ms) {
        return Promise.race([
            promise,
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout')), ms)
            )
        ]);
    }

    static retry(fn, attempts = 3, delay = 1000) {
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

    // Async iteration utilities
    static async series(promises) {
        const results = [];
        for (const promise of promises) {
            results.push(await promise);
        }
        return results;
    }

    static async parallel(promises, limit = Infinity) {
        if (limit === Infinity) {
            return Promise.all(promises);
        }

        const results = [];
        for (let i = 0; i < promises.length; i += limit) {
            const batch = promises.slice(i, i + limit);
            const batchResults = await Promise.all(batch);
            results.push(...batchResults);
        }
        return results;
    }

    static async waterfall(functions, initialValue) {
        let result = initialValue;
        for (const fn of functions) {
            result = await fn(result);
        }
        return result;
    }

    // Promise-based API wrappers
    static promisify(fn) {
        return (...args) => {
            return new Promise((resolve, reject) => {
                fn(...args, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            });
        };
    }

    static async fetchWithRetry(url, options = {}, retries = 3) {
        return this.retry(async () => {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        }, retries);
    }

    // Async queue implementation
    static createQueue(concurrency = 1) {
        const queue = [];
        let running = 0;

        const process = async () => {
            if (running >= concurrency || queue.length === 0) return;
            
            running++;
            const { fn, resolve, reject } = queue.shift();
            
            try {
                const result = await fn();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                running--;
                process();
            }
        };

        return {
            add: (fn) => {
                return new Promise((resolve, reject) => {
                    queue.push({ fn, resolve, reject });
                    process();
                });
            },
            size: () => queue.length,
            running: () => running
        };
    }

    // Observable-like pattern with promises
    static createObservable(producer) {
        const observers = [];
        
        const observable = {
            subscribe: (observer) => {
                observers.push(observer);
                return () => {
                    const index = observers.indexOf(observer);
                    if (index > -1) observers.splice(index, 1);
                };
            },
            
            emit: (value) => {
                observers.forEach(observer => {
                    if (typeof observer === 'function') {
                        observer(value);
                    } else if (observer.next) {
                        observer.next(value);
                    }
                });
            }
        };

        if (producer) producer(observable);
        return observable;
    }

    // Async state management
    static createAsyncState(initialValue) {
        let state = {
            data: initialValue,
            loading: false,
            error: null
        };

        const subscribers = [];

        return {
            get: () => ({ ...state }),
            
            set: async (asyncFn) => {
                state = { ...state, loading: true, error: null };
                this.notify();

                try {
                    const data = await asyncFn(state.data);
                    state = { data, loading: false, error: null };
                } catch (error) {
                    state = { ...state, loading: false, error };
                }
                
                this.notify();
                return state;
            },

            subscribe: (callback) => {
                subscribers.push(callback);
                return () => {
                    const index = subscribers.indexOf(callback);
                    if (index > -1) subscribers.splice(index, 1);
                };
            },

            notify: () => {
                subscribers.forEach(callback => callback({ ...state }));
            }
        };
    }
}

export default PromisesAsync;