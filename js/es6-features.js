// ES6+ Features - Arrow functions, destructuring, modules

// Arrow Functions
const ES6Features = {
    // Basic arrow functions
    add: (a, b) => a + b,
    multiply: (a, b) => a * b,
    
    // Single parameter (no parentheses needed)
    square: x => x * x,
    
    // No parameters
    getRandom: () => Math.random(),
    
    // Block body with return
    processArray: arr => {
        const filtered = arr.filter(x => x > 0);
        return filtered.map(x => x * 2);
    },
    
    // Arrow function as callback
    sortNumbers: arr => arr.sort((a, b) => a - b),
    
    // Higher-order functions
    createMultiplier: factor => num => num * factor,
    
    // Async arrow functions
    fetchData: async url => {
        const response = await fetch(url);
        return response.json();
    }
};

// Destructuring Examples
class DestructuringExamples {
    // Array destructuring
    static arrayDestructuring() {
        const numbers = [1, 2, 3, 4, 5];
        
        // Basic destructuring
        const [first, second] = numbers;
        
        // Skip elements
        const [, , third] = numbers;
        
        // Rest operator
        const [head, ...tail] = numbers;
        
        // Default values
        const [a = 0, b = 0, c = 0] = [10, 20];
        
        return { first, second, third, head, tail, a, b, c };
    }
    
    // Object destructuring
    static objectDestructuring() {
        const user = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            address: {
                city: 'New York',
                country: 'USA'
            }
        };
        
        // Basic destructuring
        const { name, email } = user;
        
        // Rename variables
        const { name: userName, id: userId } = user;
        
        // Default values
        const { age = 25, role = 'user' } = user;
        
        // Nested destructuring
        const { address: { city, country } } = user;
        
        return { name, email, userName, userId, age, role, city, country };
    }
    
    // Function parameter destructuring
    static createUser({ name, email, age = 18, role = 'user' }) {
        return { name, email, age, role, id: Date.now() };
    }
    
    // Array destructuring in functions
    static getCoordinates([x, y, z = 0]) {
        return { x, y, z };
    }
    
    // Mixed destructuring
    static processData({ users, settings: { theme, language = 'en' } }) {
        const [firstUser, ...otherUsers] = users;
        return { firstUser, otherUsers, theme, language };
    }
}

// Template Literals and Enhanced Object Literals
class ModernSyntax {
    constructor(name, version) {
        this.name = name;
        this.version = version;
    }
    
    // Template literals
    getInfo() {
        return `${this.name} v${this.version}`;
    }
    
    // Enhanced object literals
    static createConfig(env, debug = false) {
        const apiUrl = env === 'prod' ? 'https://api.prod.com' : 'https://api.dev.com';
        
        return {
            env,
            debug,
            apiUrl,
            // Method shorthand
            log(message) {
                console.log(`[${env}] ${message}`);
            },
            // Computed property names
            [`${env}_settings`]: {
                timeout: env === 'prod' ? 5000 : 10000
            }
        };
    }
    
    // Spread operator
    static mergeObjects(...objects) {
        return { ...objects.reduce((acc, obj) => ({ ...acc, ...obj }), {}) };
    }
    
    // Rest parameters
    static sum(...numbers) {
        return numbers.reduce((total, num) => total + num, 0);
    }
}

// Classes and Inheritance
class BaseComponent {
    constructor(element, options = {}) {
        this.element = element;
        this.options = { ...this.defaultOptions, ...options };
        this.init();
    }
    
    get defaultOptions() {
        return {
            autoInit: true,
            debug: false
        };
    }
    
    init() {
        if (this.options.autoInit) {
            this.render();
        }
    }
    
    render() {
        // Base render method
    }
    
    // Static method
    static create(selector, options) {
        const element = document.querySelector(selector);
        return element ? new this(element, options) : null;
    }
}

class Button extends BaseComponent {
    get defaultOptions() {
        return {
            ...super.defaultOptions,
            variant: 'primary',
            size: 'medium'
        };
    }
    
    render() {
        const { variant, size } = this.options;
        this.element.className = `btn btn--${variant} btn--${size}`;
    }
    
    onClick(handler) {
        this.element.addEventListener('click', handler);
        return this; // Method chaining
    }
}

// Promises and Async/Await
class AsyncOperations {
    // Promise-based API
    static fetchUser(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (id > 0) {
                    resolve({ id, name: `User ${id}`, email: `user${id}@example.com` });
                } else {
                    reject(new Error('Invalid user ID'));
                }
            }, 1000);
        });
    }
    
    // Async/await
    static async getUserData(id) {
        try {
            const user = await this.fetchUser(id);
            const profile = await this.fetchProfile(user.id);
            return { ...user, ...profile };
        } catch (error) {
            console.error('Error fetching user data:', error);
            throw error;
        }
    }
    
    static async fetchProfile(userId) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ 
                    bio: 'Software developer',
                    location: 'New York',
                    joinDate: new Date().toISOString()
                });
            }, 500);
        });
    }
    
    // Promise.all for parallel operations
    static async fetchMultipleUsers(ids) {
        const promises = ids.map(id => this.fetchUser(id));
        return Promise.all(promises);
    }
    
    // Promise.allSettled for handling failures
    static async fetchUsersWithErrors(ids) {
        const promises = ids.map(id => this.fetchUser(id));
        const results = await Promise.allSettled(promises);
        
        return {
            successful: results.filter(r => r.status === 'fulfilled').map(r => r.value),
            failed: results.filter(r => r.status === 'rejected').map(r => r.reason)
        };
    }
}

// Map, Set, and WeakMap
class CollectionExamples {
    constructor() {
        this.userCache = new Map();
        this.uniqueIds = new Set();
        this.privateData = new WeakMap();
    }
    
    // Map operations
    cacheUser(user) {
        this.userCache.set(user.id, user);
    }
    
    getUser(id) {
        return this.userCache.get(id);
    }
    
    getAllUsers() {
        return Array.from(this.userCache.values());
    }
    
    // Set operations
    addUniqueId(id) {
        this.uniqueIds.add(id);
        return this.uniqueIds.size;
    }
    
    hasId(id) {
        return this.uniqueIds.has(id);
    }
    
    // WeakMap for private data
    setPrivateData(obj, data) {
        this.privateData.set(obj, data);
    }
    
    getPrivateData(obj) {
        return this.privateData.get(obj);
    }
}

// Symbols and Iterators
class AdvancedFeatures {
    constructor() {
        // Private symbol
        this[Symbol.for('private')] = 'secret data';
    }
    
    // Custom iterator
    static *numberGenerator(start, end) {
        for (let i = start; i <= end; i++) {
            yield i;
        }
    }
    
    // Async generator
    static async *asyncNumberGenerator(start, end, delay = 100) {
        for (let i = start; i <= end; i++) {
            await new Promise(resolve => setTimeout(resolve, delay));
            yield i;
        }
    }
    
    // Symbol.iterator implementation
    *[Symbol.iterator]() {
        yield 1;
        yield 2;
        yield 3;
    }
}

// Proxy and Reflect
class ProxyExamples {
    static createObservableObject(obj, onChange) {
        return new Proxy(obj, {
            set(target, property, value) {
                const oldValue = target[property];
                target[property] = value;
                onChange(property, value, oldValue);
                return true;
            },
            
            get(target, property) {
                if (typeof target[property] === 'function') {
                    return target[property].bind(target);
                }
                return target[property];
            }
        });
    }
    
    static createValidatedObject(schema) {
        return new Proxy({}, {
            set(target, property, value) {
                const validator = schema[property];
                if (validator && !validator(value)) {
                    throw new Error(`Invalid value for ${property}`);
                }
                return Reflect.set(target, property, value);
            }
        });
    }
}

// Export all features
export {
    ES6Features,
    DestructuringExamples,
    ModernSyntax,
    BaseComponent,
    Button,
    AsyncOperations,
    CollectionExamples,
    AdvancedFeatures,
    ProxyExamples
};

// Default export
export default {
    ES6Features,
    DestructuringExamples,
    ModernSyntax,
    BaseComponent,
    Button,
    AsyncOperations,
    CollectionExamples,
    AdvancedFeatures,
    ProxyExamples
};