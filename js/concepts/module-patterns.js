// Module patterns implementation
export class ModulePatterns {
    // Revealing Module Pattern
    static createRevealingModule(name) {
        return (function(moduleName) {
            let privateVar = 0;
            const privateArray = [];

            function privateMethod() {
                console.log(`Private method called in ${moduleName}`);
            }

            function publicMethod() {
                privateVar++;
                privateMethod();
                return privateVar;
            }

            function addItem(item) {
                privateArray.push(item);
                return privateArray.length;
            }

            function getItems() {
                return [...privateArray];
            }

            function reset() {
                privateVar = 0;
                privateArray.length = 0;
            }

            // Reveal public interface
            return {
                name: moduleName,
                increment: publicMethod,
                add: addItem,
                getAll: getItems,
                clear: reset,
                get count() { return privateVar; },
                get items() { return this.getAll(); }
            };
        })(name);
    }

    // Namespace Pattern
    static createNamespace(name) {
        const parts = name.split('.');
        let current = window;

        parts.forEach(part => {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        });

        return current;
    }

    // Singleton Pattern
    static createSingleton(name, factory) {
        let instance;

        return {
            getInstance: function(...args) {
                if (!instance) {
                    instance = factory.apply(this, args);
                    instance.name = name;
                }
                return instance;
            }
        };
    }

    // Observer Pattern
    static createObserver() {
        const observers = [];

        return {
            subscribe: function(callback) {
                observers.push(callback);
                return () => {
                    const index = observers.indexOf(callback);
                    if (index > -1) observers.splice(index, 1);
                };
            },

            notify: function(data) {
                observers.forEach(callback => callback(data));
            },

            get count() {
                return observers.length;
            }
        };
    }

    // Pub/Sub Pattern
    static createPubSub() {
        const events = {};

        return {
            subscribe: function(event, callback) {
                if (!events[event]) {
                    events[event] = [];
                }
                events[event].push(callback);

                return () => {
                    const index = events[event].indexOf(callback);
                    if (index > -1) events[event].splice(index, 1);
                };
            },

            publish: function(event, data) {
                if (events[event]) {
                    events[event].forEach(callback => callback(data));
                }
            },

            unsubscribe: function(event, callback) {
                if (events[event]) {
                    const index = events[event].indexOf(callback);
                    if (index > -1) events[event].splice(index, 1);
                }
            },

            getEvents: function() {
                return Object.keys(events);
            }
        };
    }

    // Factory Pattern
    static createFactory(types) {
        return {
            create: function(type, ...args) {
                if (types[type]) {
                    return new types[type](...args);
                }
                throw new Error(`Unknown type: ${type}`);
            },

            register: function(type, constructor) {
                types[type] = constructor;
            },

            getTypes: function() {
                return Object.keys(types);
            }
        };
    }

    // Mixin Pattern
    static createMixin(methods) {
        return {
            mixInto: function(target) {
                Object.assign(target.prototype, methods);
                return target;
            },

            mixIntoObject: function(target) {
                Object.assign(target, methods);
                return target;
            }
        };
    }

    // Command Pattern
    static createCommand() {
        const history = [];
        let currentIndex = -1;

        return {
            execute: function(command) {
                // Remove any commands after current index
                history.splice(currentIndex + 1);
                
                // Execute and add to history
                const result = command.execute();
                history.push(command);
                currentIndex++;
                
                return result;
            },

            undo: function() {
                if (currentIndex >= 0) {
                    const command = history[currentIndex];
                    if (command.undo) {
                        command.undo();
                    }
                    currentIndex--;
                    return true;
                }
                return false;
            },

            redo: function() {
                if (currentIndex < history.length - 1) {
                    currentIndex++;
                    const command = history[currentIndex];
                    command.execute();
                    return true;
                }
                return false;
            },

            canUndo: function() {
                return currentIndex >= 0;
            },

            canRedo: function() {
                return currentIndex < history.length - 1;
            },

            clear: function() {
                history.length = 0;
                currentIndex = -1;
            }
        };
    }

    // State Machine Pattern
    static createStateMachine(initialState, states) {
        let currentState = initialState;

        return {
            getCurrentState: function() {
                return currentState;
            },

            transition: function(event) {
                const state = states[currentState];
                if (state && state.transitions && state.transitions[event]) {
                    const newState = state.transitions[event];
                    
                    // Exit current state
                    if (state.onExit) state.onExit();
                    
                    // Change state
                    currentState = newState;
                    
                    // Enter new state
                    const nextState = states[newState];
                    if (nextState && nextState.onEnter) {
                        nextState.onEnter();
                    }
                    
                    return true;
                }
                return false;
            },

            can: function(event) {
                const state = states[currentState];
                return state && state.transitions && state.transitions[event];
            }
        };
    }
}

// ES6 Class-based patterns
export class BaseComponent {
    constructor(element) {
        this.element = element;
        this.events = new Map();
        this.init();
    }

    init() {
        // Override in subclasses
    }

    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }

    emit(event, data) {
        if (this.events.has(event)) {
            this.events.get(event).forEach(callback => callback(data));
        }
    }

    destroy() {
        this.events.clear();
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}

export class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    off(event, callback) {
        if (this.events[event]) {
            const index = this.events[event].indexOf(callback);
            if (index > -1) {
                this.events[event].splice(index, 1);
            }
        }
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(...args));
        }
    }

    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }
}

export default ModulePatterns;