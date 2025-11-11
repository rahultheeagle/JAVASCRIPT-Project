class MultiStepForms {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.formData = {};
        this.init();
    }

    init() {
        this.createFormHTML();
        this.bindEvents();
        this.updateProgress();
    }

    createFormHTML() {
        const container = document.getElementById('multi-step-container');
        if (!container) return;

        container.innerHTML = `
            <div class="form-progress">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="step-indicators">
                    ${Array.from({length: this.totalSteps}, (_, i) => 
                        `<div class="step-indicator" data-step="${i + 1}">
                            <span>${i + 1}</span>
                            <label>${this.getStepLabel(i + 1)}</label>
                        </div>`
                    ).join('')}
                </div>
            </div>

            <form class="multi-step-form">
                <div class="form-step active" data-step="1">
                    <h3>Account Information</h3>
                    <input type="text" name="username" placeholder="Username" required>
                    <input type="email" name="email" placeholder="Email" required>
                    <input type="password" name="password" placeholder="Password" required>
                    <input type="password" name="confirmPassword" placeholder="Confirm Password" required>
                </div>

                <div class="form-step" data-step="2">
                    <h3>Personal Details</h3>
                    <input type="text" name="firstName" placeholder="First Name" required>
                    <input type="text" name="lastName" placeholder="Last Name" required>
                    <input type="date" name="birthDate" required>
                    <select name="country" required>
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="IN">India</option>
                    </select>
                </div>

                <div class="form-step" data-step="3">
                    <h3>Learning Preferences</h3>
                    <label>Experience Level:</label>
                    <div class="radio-group">
                        <label><input type="radio" name="experience" value="beginner"> Beginner</label>
                        <label><input type="radio" name="experience" value="intermediate"> Intermediate</label>
                        <label><input type="radio" name="experience" value="advanced"> Advanced</label>
                    </div>
                    <label>Interests:</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" name="interests" value="web"> Web Development</label>
                        <label><input type="checkbox" name="interests" value="mobile"> Mobile Development</label>
                        <label><input type="checkbox" name="interests" value="data"> Data Science</label>
                        <label><input type="checkbox" name="interests" value="ai"> AI/ML</label>
                    </div>
                </div>

                <div class="form-step" data-step="4">
                    <h3>Review & Confirm</h3>
                    <div class="review-section"></div>
                </div>

                <div class="form-navigation">
                    <button type="button" class="btn-prev" disabled>Previous</button>
                    <button type="button" class="btn-next">Next</button>
                    <button type="submit" class="btn-submit" style="display: none;">Complete Registration</button>
                </div>
            </form>
        `;
    }

    getStepLabel(step) {
        const labels = ['Account', 'Personal', 'Preferences', 'Review'];
        return labels[step - 1];
    }

    bindEvents() {
        const form = document.querySelector('.multi-step-form');
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');
        const submitBtn = document.querySelector('.btn-submit');

        nextBtn?.addEventListener('click', () => this.nextStep());
        prevBtn?.addEventListener('click', () => this.prevStep());
        form?.addEventListener('submit', (e) => this.handleSubmit(e));

        // Real-time validation
        form?.addEventListener('input', (e) => this.validateField(e.target));
    }

    nextStep() {
        if (!this.validateCurrentStep()) return;
        
        this.saveCurrentStepData();
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            this.updateProgress();
            
            if (this.currentStep === this.totalSteps) {
                this.showReview();
            }
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            this.updateProgress();
        }
    }

    validateCurrentStep() {
        const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        // Special validation for step 1 (password confirmation)
        if (this.currentStep === 1) {
            const password = currentStepEl.querySelector('input[name="password"]').value;
            const confirmPassword = currentStepEl.querySelector('input[name="confirmPassword"]').value;
            
            if (password !== confirmPassword) {
                this.showFieldError(currentStepEl.querySelector('input[name="confirmPassword"]'), 'Passwords do not match');
                isValid = false;
            }
        }

        return isValid;
    }

    validateField(field) {
        this.clearFieldError(field);
        
        if (field.hasAttribute('required') && !field.value.trim()) {
            this.showFieldError(field, 'This field is required');
            return false;
        }

        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                this.showFieldError(field, 'Please enter a valid email');
                return false;
            }
        }

        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        let errorEl = field.parentNode.querySelector('.field-error');
        if (!errorEl) {
            errorEl = document.createElement('div');
            errorEl.className = 'field-error';
            field.parentNode.appendChild(errorEl);
        }
        errorEl.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorEl = field.parentNode.querySelector('.field-error');
        if (errorEl) errorEl.remove();
    }

    saveCurrentStepData() {
        const currentStepEl = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        const inputs = currentStepEl.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            if (input.type === 'checkbox') {
                if (!this.formData[input.name]) this.formData[input.name] = [];
                if (input.checked && !this.formData[input.name].includes(input.value)) {
                    this.formData[input.name].push(input.value);
                }
            } else if (input.type === 'radio') {
                if (input.checked) {
                    this.formData[input.name] = input.value;
                }
            } else {
                this.formData[input.name] = input.value;
            }
        });
    }

    updateStepDisplay() {
        document.querySelectorAll('.form-step').forEach(step => {
            step.classList.remove('active');
        });
        
        document.querySelector(`.form-step[data-step="${this.currentStep}"]`)?.classList.add('active');
        
        // Update navigation buttons
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');
        const submitBtn = document.querySelector('.btn-submit');
        
        prevBtn.disabled = this.currentStep === 1;
        
        if (this.currentStep === this.totalSteps) {
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }

    updateProgress() {
        const progress = (this.currentStep / this.totalSteps) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
        
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            indicator.classList.toggle('completed', index < this.currentStep - 1);
            indicator.classList.toggle('active', index === this.currentStep - 1);
        });
    }

    showReview() {
        const reviewSection = document.querySelector('.review-section');
        reviewSection.innerHTML = `
            <div class="review-item">
                <strong>Username:</strong> ${this.formData.username}
            </div>
            <div class="review-item">
                <strong>Email:</strong> ${this.formData.email}
            </div>
            <div class="review-item">
                <strong>Name:</strong> ${this.formData.firstName} ${this.formData.lastName}
            </div>
            <div class="review-item">
                <strong>Country:</strong> ${this.formData.country}
            </div>
            <div class="review-item">
                <strong>Experience:</strong> ${this.formData.experience}
            </div>
            <div class="review-item">
                <strong>Interests:</strong> ${this.formData.interests?.join(', ') || 'None selected'}
            </div>
        `;
    }

    handleSubmit(e) {
        e.preventDefault();
        this.saveCurrentStepData();
        
        // Save to storage
        if (window.storageManager) {
            window.storageManager.setItem('userProfile', this.formData);
        }
        
        // Show success message
        this.showSuccess();
    }

    showSuccess() {
        const container = document.getElementById('multi-step-container');
        container.innerHTML = `
            <div class="success-message">
                <div class="success-icon">✓</div>
                <h3>Registration Complete!</h3>
                <p>Welcome to CodeQuest, ${this.formData.firstName}!</p>
                <button class="btn-primary" onclick="window.location.href='index.html'">Go to Dashboard</button>
            </div>
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('multi-step-container')) {
        window.multiStepForms = new MultiStepForms();
    }
});