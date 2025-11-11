// Authentication feature module
import storage from '../services/storage.js';
import api from '../services/api.js';

export class AuthFeature {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
    }

    init() {
        this.loadUser();
        this.setupEventListeners();
    }

    loadUser() {
        const user = storage.get('user');
        if (user) {
            this.currentUser = user;
            this.isAuthenticated = true;
            this.updateUI();
        }
    }

    async login(credentials) {
        try {
            const user = await api.mockRequest('/auth/login');
            this.currentUser = { ...user, ...credentials };
            this.isAuthenticated = true;
            
            storage.set('user', this.currentUser);
            this.updateUI();
            
            return { success: true, user: this.currentUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.currentUser = null;
        this.isAuthenticated = false;
        storage.remove('user');
        this.updateUI();
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-auth="login"]')) {
                this.showLoginForm();
            }
            if (e.target.matches('[data-auth="logout"]')) {
                this.logout();
            }
        });
    }

    showLoginForm() {
        const modal = document.createElement('div');
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h3>Login</h3>
                <form id="login-form">
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <button type="submit">Login</button>
                </form>
            </div>
        `;
        
        modal.querySelector('form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const credentials = Object.fromEntries(formData);
            
            const result = await this.login(credentials);
            if (result.success) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }

    updateUI() {
        const userDisplay = document.querySelector('[data-user-display]');
        if (userDisplay) {
            userDisplay.textContent = this.isAuthenticated 
                ? `Welcome, ${this.currentUser.email}` 
                : 'Guest';
        }
    }

    requireAuth(callback) {
        if (this.isAuthenticated) {
            callback();
        } else {
            this.showLoginForm();
        }
    }
}

export default new AuthFeature();