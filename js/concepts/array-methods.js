// Array methods implementation and utilities
export class ArrayMethods {
    // Enhanced map with index and array access
    static map(array, callback) {
        return array.map((item, index, arr) => callback(item, index, arr));
    }

    // Enhanced filter with multiple conditions
    static filter(array, callback) {
        return array.filter((item, index, arr) => callback(item, index, arr));
    }

    // Enhanced reduce with initial value handling
    static reduce(array, callback, initialValue) {
        return initialValue !== undefined 
            ? array.reduce(callback, initialValue)
            : array.reduce(callback);
    }

    // Enhanced forEach with break capability
    static forEach(array, callback) {
        for (let i = 0; i < array.length; i++) {
            if (callback(array[i], i, array) === false) break;
        }
    }

    // Utility methods using array methods
    static unique(array) {
        return array.filter((item, index) => array.indexOf(item) === index);
    }

    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = typeof key === 'function' ? key(item) : item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    static sortBy(array, key, direction = 'asc') {
        return [...array].sort((a, b) => {
            const aVal = typeof key === 'function' ? key(a) : a[key];
            const bVal = typeof key === 'function' ? key(b) : b[key];
            
            if (direction === 'desc') return bVal > aVal ? 1 : -1;
            return aVal > bVal ? 1 : -1;
        });
    }

    static chunk(array, size) {
        return array.reduce((chunks, item, index) => {
            const chunkIndex = Math.floor(index / size);
            chunks[chunkIndex] = chunks[chunkIndex] || [];
            chunks[chunkIndex].push(item);
            return chunks;
        }, []);
    }

    static flatten(array) {
        return array.reduce((flat, item) => {
            return flat.concat(Array.isArray(item) ? this.flatten(item) : item);
        }, []);
    }

    static findBy(array, key, value) {
        return array.find(item => 
            typeof key === 'function' ? key(item) === value : item[key] === value
        );
    }

    static sum(array, key) {
        return array.reduce((sum, item) => {
            const value = typeof key === 'function' ? key(item) : (key ? item[key] : item);
            return sum + (Number(value) || 0);
        }, 0);
    }

    static average(array, key) {
        return array.length ? this.sum(array, key) / array.length : 0;
    }

    static pluck(array, key) {
        return array.map(item => typeof key === 'function' ? key(item) : item[key]);
    }
}

export default ArrayMethods;