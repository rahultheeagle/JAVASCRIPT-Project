// Utility Module - ES6 Modules Example

// Named exports
export const formatDate = (date, locale = 'en-US') => {
    return new Intl.DateTimeFormat(locale).format(new Date(date));
};

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
};

export const throttle = (func, limit) => {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func.apply(null, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Array utilities
export const chunk = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
};

export const unique = array => [...new Set(array)];

export const groupBy = (array, key) => {
    return array.reduce((groups, item) => {
        const group = item[key];
        groups[group] = groups[group] || [];
        groups[group].push(item);
        return groups;
    }, {});
};

// Object utilities
export const pick = (obj, keys) => {
    return keys.reduce((result, key) => {
        if (key in obj) result[key] = obj[key];
        return result;
    }, {});
};

export const omit = (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
};

// Validation utilities
export const isEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const isUrl = url => /^https?:\/\/.+\..+/.test(url);
export const isEmpty = value => value == null || value === '' || (Array.isArray(value) && value.length === 0);

// Default export
const utils = {
    formatDate,
    capitalize,
    debounce,
    throttle,
    chunk,
    unique,
    groupBy,
    pick,
    omit,
    isEmail,
    isUrl,
    isEmpty
};

export default utils;