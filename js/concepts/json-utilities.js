// JSON parsing and stringifying utilities
export class JSONUtilities {
    // Safe JSON operations
    static safeParse(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.warn('JSON parse error:', error);
            return defaultValue;
        }
    }

    static safeStringify(obj, defaultValue = '{}') {
        try {
            return JSON.stringify(obj);
        } catch (error) {
            console.warn('JSON stringify error:', error);
            return defaultValue;
        }
    }

    // Pretty printing
    static prettyStringify(obj, indent = 2) {
        try {
            return JSON.stringify(obj, null, indent);
        } catch (error) {
            return this.safeStringify(obj);
        }
    }

    // Deep clone using JSON
    static deepClone(obj) {
        return this.safeParse(this.safeStringify(obj), obj);
    }

    // JSON with custom replacer/reviver
    static stringifyWithDates(obj) {
        return JSON.stringify(obj, (key, value) => {
            if (value instanceof Date) {
                return { __type: 'Date', value: value.toISOString() };
            }
            return value;
        });
    }

    static parseWithDates(jsonString) {
        return JSON.parse(jsonString, (key, value) => {
            if (value && value.__type === 'Date') {
                return new Date(value.value);
            }
            return value;
        });
    }

    // JSON validation
    static isValidJSON(str) {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    }

    static validateSchema(obj, schema) {
        const errors = [];
        
        Object.entries(schema).forEach(([key, rules]) => {
            const value = obj[key];
            
            if (rules.required && (value === undefined || value === null)) {
                errors.push(`${key} is required`);
                return;
            }
            
            if (value !== undefined && rules.type && typeof value !== rules.type) {
                errors.push(`${key} must be of type ${rules.type}`);
            }
            
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`${key} must be at least ${rules.minLength} characters`);
            }
        });
        
        return { valid: errors.length === 0, errors };
    }

    // JSON transformation utilities
    static transform(obj, transformers) {
        const result = {};
        
        Object.entries(obj).forEach(([key, value]) => {
            const transformer = transformers[key];
            if (transformer) {
                result[key] = transformer(value);
            } else {
                result[key] = value;
            }
        });
        
        return result;
    }

    static pick(obj, keys) {
        return keys.reduce((result, key) => {
            if (key in obj) result[key] = obj[key];
            return result;
        }, {});
    }

    static omit(obj, keys) {
        const result = { ...obj };
        keys.forEach(key => delete result[key]);
        return result;
    }

    // Nested object utilities
    static get(obj, path, defaultValue = undefined) {
        return path.split('.').reduce((current, key) => 
            current?.[key], obj) ?? defaultValue;
    }

    static set(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((current, key) => {
            current[key] = current[key] || {};
            return current[key];
        }, obj);
        target[lastKey] = value;
        return obj;
    }

    static flatten(obj, prefix = '') {
        const result = {};
        
        Object.entries(obj).forEach(([key, value]) => {
            const newKey = prefix ? `${prefix}.${key}` : key;
            
            if (value && typeof value === 'object' && !Array.isArray(value)) {
                Object.assign(result, this.flatten(value, newKey));
            } else {
                result[newKey] = value;
            }
        });
        
        return result;
    }

    // JSON diff utilities
    static diff(obj1, obj2) {
        const changes = {};
        
        const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
        
        allKeys.forEach(key => {
            const val1 = obj1[key];
            const val2 = obj2[key];
            
            if (val1 !== val2) {
                changes[key] = { from: val1, to: val2 };
            }
        });
        
        return changes;
    }

    static merge(target, ...sources) {
        return sources.reduce((result, source) => {
            Object.entries(source).forEach(([key, value]) => {
                if (value && typeof value === 'object' && !Array.isArray(value)) {
                    result[key] = this.merge(result[key] || {}, value);
                } else {
                    result[key] = value;
                }
            });
            return result;
        }, { ...target });
    }
}

export default JSONUtilities;