// Date and time manipulation utilities
export class DateTime {
    // Date creation utilities
    static now() {
        return new Date();
    }

    static create(year, month, day, hour = 0, minute = 0, second = 0) {
        return new Date(year, month - 1, day, hour, minute, second);
    }

    static fromString(dateString) {
        return new Date(dateString);
    }

    static fromTimestamp(timestamp) {
        return new Date(timestamp);
    }

    // Formatting utilities
    static format(date, format = 'YYYY-MM-DD') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hour = String(d.getHours()).padStart(2, '0');
        const minute = String(d.getMinutes()).padStart(2, '0');
        const second = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hour)
            .replace('mm', minute)
            .replace('ss', second);
    }

    static timeAgo(date) {
        const now = new Date();
        const diff = now - new Date(date);
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
        if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        return 'just now';
    }

    // Date arithmetic
    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static addHours(date, hours) {
        const result = new Date(date);
        result.setHours(result.getHours() + hours);
        return result;
    }

    static addMinutes(date, minutes) {
        const result = new Date(date);
        result.setMinutes(result.getMinutes() + minutes);
        return result;
    }

    // Date comparison
    static isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.toDateString() === d2.toDateString();
    }

    static isToday(date) {
        return this.isSameDay(date, new Date());
    }

    static isYesterday(date) {
        const yesterday = this.addDays(new Date(), -1);
        return this.isSameDay(date, yesterday);
    }

    static isTomorrow(date) {
        const tomorrow = this.addDays(new Date(), 1);
        return this.isSameDay(date, tomorrow);
    }

    // Date ranges
    static daysBetween(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    static isInRange(date, startDate, endDate) {
        const d = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return d >= start && d <= end;
    }

    // Timezone utilities
    static getTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    static toUTC(date) {
        const d = new Date(date);
        return new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    }

    static fromUTC(date) {
        const d = new Date(date);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    }
}

export default DateTime;