// JavaScript Concepts Interactive Examples

// 1. Local Storage API
function testLocalStorage() {
    const data = { name: 'John', age: 30, skills: ['JS', 'CSS', 'HTML'] };
    
    // Store data
    localStorage.setItem('testUser', JSON.stringify(data));
    
    // Retrieve data
    const retrieved = JSON.parse(localStorage.getItem('testUser'));
    
    // Display result
    document.getElementById('localStorage-result').textContent = 
        `Stored and retrieved: ${JSON.stringify(retrieved, null, 2)}`;
    
    // Clean up
    setTimeout(() => localStorage.removeItem('testUser'), 3000);
}

// 2. Array Methods
function testArrayMethods() {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    const doubled = numbers.map(n => n * 2);
    const evens = numbers.filter(n => n % 2 === 0);
    const sum = numbers.reduce((acc, n) => acc + n, 0);
    
    const result = `Original: [${numbers.join(', ')}]
Doubled: [${doubled.join(', ')}]
Evens: [${evens.join(', ')}]
Sum: ${sum}`;
    
    document.getElementById('arrayMethods-result').textContent = result;
}

// 3. Template Literals
function testTemplateLiterals() {
    const user = { name: 'Alice', age: 25, city: 'New York' };
    
    const message = `Hello ${user.name}!
You are ${user.age} years old.
Living in ${user.city}.
Next year you'll be ${user.age + 1}.`;
    
    const html = `<div class="user-card">
  <h3>${user.name}</h3>
  <p>Age: ${user.age}</p>
  <p>City: ${user.city}</p>
</div>`;
    
    document.getElementById('templateLiterals-result').textContent = 
        `Message:\n${message}\n\nHTML:\n${html}`;
}

// 4. Event Delegation
document.addEventListener('click', (e) => {
    if (e.target.matches('.btn')) {
        const result = `Clicked: ${e.target.textContent} at ${new Date().toLocaleTimeString()}`;
        document.getElementById('eventDelegation-result').textContent = result;
    }
});

// 5. Promises & Async/Await
function testPromises() {
    const resultDiv = document.getElementById('promises-result');
    resultDiv.textContent = 'Loading...';
    
    const fetchData = () => new Promise(resolve => 
        setTimeout(() => resolve('Data loaded successfully!'), 1500)
    );
    
    async function loadData() {
        try {
            const result = await fetchData();
            return `${result} (loaded at ${new Date().toLocaleTimeString()})`;
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }
    
    loadData().then(result => {
        resultDiv.textContent = result;
    });
}

// 6. JSON Operations
function testJSON() {
    const originalObj = {
        name: 'CodeQuest',
        version: '1.0',
        features: ['tutorials', 'challenges', 'gamification'],
        settings: { theme: 'light', notifications: true }
    };
    
    // Object to JSON
    const jsonString = JSON.stringify(originalObj, null, 2);
    
    // JSON back to object
    const parsedObj = JSON.parse(jsonString);
    
    const result = `Original object:
${JSON.stringify(originalObj, null, 2)}

JSON string length: ${jsonString.length} characters

Parsed back successfully: ${JSON.stringify(parsedObj) === JSON.stringify(originalObj)}`;
    
    document.getElementById('json-result').textContent = result;
}

// 7. Date & Time Manipulation
function testDateTime() {
    const now = new Date();
    const timestamp = Date.now();
    
    // Format dates
    const formatted = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Add 7 days
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Calculate difference
    const daysDiff = Math.ceil((future - now) / (1000 * 60 * 60 * 24));
    
    const result = `Current: ${formatted}
Time: ${now.toLocaleTimeString()}
Timestamp: ${timestamp}
7 days later: ${future.toLocaleDateString()}
Days difference: ${daysDiff}`;
    
    document.getElementById('dateTime-result').textContent = result;
}

// 8. Regular Expressions
function testRegex() {
    const email = document.getElementById('email-input').value || 'test@example.com';
    
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phone: /^\(\d{3}\)\s\d{3}-\d{4}$/,
        strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    };
    
    const emailValid = patterns.email.test(email);
    const domain = email.match(/@([^.]+\..+)$/)?.[1] || 'No domain found';
    
    const result = `Email: ${email}
Valid: ${emailValid}
Domain: ${domain}
Pattern: ${patterns.email.source}`;
    
    document.getElementById('regex-result').textContent = result;
}

// 9. Custom Events
function testCustomEvents() {
    const resultDiv = document.getElementById('customEvents-result');
    
    // Create custom event listener
    document.addEventListener('userAction', (e) => {
        const { action, timestamp, data } = e.detail;
        resultDiv.textContent = `Custom event received!
Action: ${action}
Time: ${new Date(timestamp).toLocaleTimeString()}
Data: ${JSON.stringify(data)}`;
    });
    
    // Dispatch custom event
    const customEvent = new CustomEvent('userAction', {
        detail: {
            action: 'button_click',
            timestamp: Date.now(),
            data: { userId: 123, page: 'concepts' }
        }
    });
    
    document.dispatchEvent(customEvent);
}

// 10. Classes & Module Pattern
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.createdAt = new Date();
    }
    
    greet() {
        return `Hello, I'm ${this.name}!`;
    }
    
    getAge() {
        const now = new Date();
        const diffTime = Math.abs(now - this.createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `Account created ${diffDays} days ago`;
    }
    
    static create(data) {
        return new User(data.name, data.email);
    }
    
    static validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

function testClasses() {
    // Create instance
    const user1 = new User('Alice', 'alice@example.com');
    
    // Use static method
    const user2 = User.create({ name: 'Bob', email: 'bob@example.com' });
    
    // Test methods
    const greeting1 = user1.greet();
    const age1 = user1.getAge();
    const emailValid = User.validateEmail('test@example.com');
    
    const result = `User 1: ${greeting1}
${age1}

User 2: ${user2.greet()}
Email: ${user2.email}

Static method test:
Email validation: ${emailValid}

Class features demonstrated:
- Constructor
- Instance methods
- Static methods
- Property access`;
    
    document.getElementById('classes-result').textContent = result;
}