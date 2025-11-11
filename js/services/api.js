// API service for HTTP requests
export class ApiService {
    constructor() {
        this.baseUrl = '/api';
        this.defaultOptions = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = { ...this.defaultOptions, ...options };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    get(endpoint, params = {}) {
        const url = new URL(endpoint, this.baseUrl);
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value);
        });
        
        return this.request(url.pathname + url.search);
    }

    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // Mock API for demo purposes
    async mockRequest(endpoint, delay = 1000) {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        const mockData = {
            '/users': [{ id: 1, name: 'John Doe' }],
            '/challenges': [{ id: 1, title: 'Array Methods' }],
            '/progress': { completed: 5, total: 12 }
        };

        return mockData[endpoint] || { message: 'Mock response' };
    }
}

export default new ApiService();