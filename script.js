// Profile System with Local Storage Persistence
class ProfileSystem {
    constructor() {
        this.profileData = this.loadProfile();
        this.initializeElements();
        this.bindEvents();
        this.updateProfileDisplay();
    }

    // Load profile from localStorage
    loadProfile() {
        const saved = localStorage.getItem('codequest_profile');
        return saved ? JSON.parse(saved) : {
            username: 'Guest',
            email: '',
            avatarUrl: 'https://via.placeholder.com/50'
        };
    }

    // Save profile to localStorage
    saveProfile() {
        localStorage.setItem('codequest_profile', JSON.stringify(this.profileData));
    }

    // Initialize DOM elements
    initializeElements() {
        this.profileName = document.getElementById('profile-name');
        this.profileAvatar = document.getElementById('profile-avatar');
        this.editBtn = document.getElementById('edit-profile-btn');
        this.modal = document.getElementById('profile-modal');
        this.closeBtn = document.querySelector('.close');
        this.profileForm = document.getElementById('profile-form');
        this.usernameInput = document.getElementById('username');
        this.emailInput = document.getElementById('email');
        this.avatarInput = document.getElementById('avatar-url');
    }

    // Bind event listeners
    bindEvents() {
        this.editBtn.addEventListener('click', () => this.openModal());
        this.closeBtn.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
        this.profileForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Update profile display
    updateProfileDisplay() {
        this.profileName.textContent = this.profileData.username;
        this.profileAvatar.src = this.profileData.avatarUrl;
        this.profileAvatar.onerror = () => {
            this.profileAvatar.src = 'https://via.placeholder.com/50';
        };
    }

    // Open profile modal
    openModal() {
        this.usernameInput.value = this.profileData.username;
        this.emailInput.value = this.profileData.email;
        this.avatarInput.value = this.profileData.avatarUrl;
        this.modal.style.display = 'block';
    }

    // Close profile modal
    closeModal() {
        this.modal.style.display = 'none';
    }

    // Handle form submission
    handleSubmit(e) {
        e.preventDefault();
        
        this.profileData.username = this.usernameInput.value.trim() || 'Guest';
        this.profileData.email = this.emailInput.value.trim();
        this.profileData.avatarUrl = this.avatarInput.value.trim() || 'https://via.placeholder.com/50';
        
        this.saveProfile();
        this.updateProfileDisplay();
        this.closeModal();
        
        // Show success message
        this.showNotification('Profile updated successfully!');
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize Profile System when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    new ProfileSystem();
});

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(style);