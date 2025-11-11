// API Module - Demonstrates async/await and modules

// Base API configuration
const API_BASE = 'https://jsonplaceholder.typicode.com';

// HTTP client with modern features
class ApiClient {
    constructor(baseUrl = API_BASE) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    // Generic request method with destructuring
    async request(endpoint, { method = 'GET', headers = {}, body, ...options } = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            method,
            headers: { ...this.defaultHeaders, ...headers },
            ...options
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

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

    // Arrow function methods
    get = (endpoint, options) => this.request(endpoint, { method: 'GET', ...options });
    post = (endpoint, body, options) => this.request(endpoint, { method: 'POST', body, ...options });
    put = (endpoint, body, options) => this.request(endpoint, { method: 'PUT', body, ...options });
    delete = (endpoint, options) => this.request(endpoint, { method: 'DELETE', ...options });
}

// User API with destructuring and arrow functions
export const userApi = {
    client: new ApiClient(),

    // Get all users with optional filtering
    getUsers: async (filters = {}) => {
        const { limit, page, ...queryParams } = filters;
        const query = new URLSearchParams(queryParams).toString();
        const endpoint = `/users${query ? `?${query}` : ''}`;
        
        return await userApi.client.get(endpoint);
    },

    // Get user by ID with error handling
    getUser: async (id) => {
        if (!id) throw new Error('User ID is required');
        return await userApi.client.get(`/users/${id}`);
    },

    // Create user with validation
    createUser: async (userData) => {
        const { name, email, ...otherData } = userData;
        
        if (!name || !email) {
            throw new Error('Name and email are required');
        }

        return await userApi.client.post('/users', { name, email, ...otherData });
    },

    // Update user with partial data
    updateUser: async (id, updates) => {
        return await userApi.client.put(`/users/${id}`, updates);
    },

    // Delete user
    deleteUser: async (id) => {
        return await userApi.client.delete(`/users/${id}`);
    },

    // Batch operations with Promise.all
    getMultipleUsers: async (ids) => {
        const promises = ids.map(id => userApi.getUser(id));
        return await Promise.all(promises);
    },

    // Search users with debouncing
    searchUsers: (() => {
        let timeoutId;
        return async (query, delay = 300) => {
            return new Promise((resolve) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(async () => {
                    try {
                        const users = await userApi.getUsers();
                        const filtered = users.filter(user => 
                            user.name.toLowerCase().includes(query.toLowerCase()) ||
                            user.email.toLowerCase().includes(query.toLowerCase())
                        );
                        resolve(filtered);
                    } catch (error) {
                        resolve([]);
                    }
                }, delay);
            });
        };
    })()
};

// Posts API
export const postsApi = {
    client: new ApiClient(),

    getPosts: async ({ userId, limit = 10, offset = 0 } = {}) => {
        let endpoint = '/posts';
        const params = new URLSearchParams();
        
        if (userId) params.append('userId', userId);
        if (limit) params.append('_limit', limit);
        if (offset) params.append('_start', offset);
        
        if (params.toString()) {
            endpoint += `?${params.toString()}`;
        }

        return await postsApi.client.get(endpoint);
    },

    getPost: async (id) => {
        return await postsApi.client.get(`/posts/${id}`);
    },

    createPost: async ({ title, body, userId }) => {
        return await postsApi.client.post('/posts', { title, body, userId });
    }
};

// Combined API operations
export const combinedApi = {
    // Get user with their posts
    getUserWithPosts: async (userId) => {
        try {
            const [user, posts] = await Promise.all([
                userApi.getUser(userId),
                postsApi.getPosts({ userId })
            ]);

            return { ...user, posts };
        } catch (error) {
            console.error('Failed to get user with posts:', error);
            throw error;
        }
    },

    // Get multiple users with their post counts
    getUsersWithPostCounts: async (userIds) => {
        const users = await userApi.getMultipleUsers(userIds);
        
        const usersWithCounts = await Promise.all(
            users.map(async (user) => {
                try {
                    const posts = await postsApi.getPosts({ userId: user.id });
                    return { ...user, postCount: posts.length };
                } catch {
                    return { ...user, postCount: 0 };
                }
            })
        );

        return usersWithCounts;
    }
};

// Default export
export default {
    userApi,
    postsApi,
    combinedApi,
    ApiClient
};