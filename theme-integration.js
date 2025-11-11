// Theme Integration Helper
// This script helps integrate theme toggle into existing pages

document.addEventListener('DOMContentLoaded', () => {
    // Wait for theme system to be ready
    setTimeout(() => {
        if (window.themeSystem) {
            initializeThemeIntegration();
        }
    }, 100);
});

function initializeThemeIntegration() {
    // Add theme toggle to existing theme toggle button if it exists
    const existingThemeToggle = document.getElementById('theme-toggle');
    if (existingThemeToggle && !existingThemeToggle.classList.contains('theme-system-integrated')) {
        // Replace existing simple toggle with advanced theme system
        existingThemeToggle.classList.add('theme-system-integrated');
        existingThemeToggle.addEventListener('click', (e) => {
            e.preventDefault();
            window.themeSystem.toggleDropdown();
        });
    }

    // Listen for theme changes and update existing elements
    window.addEventListener('themeChanged', (e) => {
        updateExistingElements(e.detail.theme, e.detail.colors);
    });

    // Update any existing theme-dependent elements
    updateExistingElements(window.themeSystem.getCurrentTheme(), window.themeSystem.getCurrentColors());
}

function updateExistingElements(theme, colors) {
    // Update existing theme toggle button if it exists
    const existingToggle = document.querySelector('.theme-toggle:not(.theme-system-integrated)');
    if (existingToggle) {
        existingToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // Update any custom elements that need theme updates
    updateCustomElements(theme, colors);
    
    // Update charts or graphs if they exist
    updateChartsAndGraphs(theme, colors);
    
    // Update any third-party components
    updateThirdPartyComponents(theme, colors);
}

function updateCustomElements(theme, colors) {
    // Update progress bars
    const progressBars = document.querySelectorAll('.progress-fill, .mini-progress-fill, .xp-fill, .usage-fill, .analysis-fill');
    progressBars.forEach(bar => {
        if (theme === 'dark') {
            bar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
        } else {
            bar.style.background = 'linear-gradient(90deg, #4caf50, #66bb6a)';
        }
    });

    // Update badges and status indicators
    const badges = document.querySelectorAll('.difficulty-badge, .xp-badge, .category-badge, .status-badge');
    badges.forEach(badge => {
        if (theme === 'dark') {
            badge.style.background = colors.surface;
            badge.style.color = colors.text;
            badge.style.borderColor = colors.border;
        }
    });

    // Update notification styles
    const notifications = document.querySelectorAll('.timer-notification, .search-notification');
    notifications.forEach(notification => {
        if (theme === 'dark') {
            notification.style.background = colors.surface;
            notification.style.color = colors.text;
            notification.style.borderLeft = `4px solid ${colors.primary}`;
        }
    });
}

function updateChartsAndGraphs(theme, colors) {
    // Update any chart libraries (Chart.js, D3.js, etc.)
    if (typeof Chart !== 'undefined') {
        Chart.defaults.color = colors.text;
        Chart.defaults.borderColor = colors.border;
        Chart.defaults.backgroundColor = colors.surface;
    }

    // Update custom SVG elements
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
        svg.style.color = colors.text;
        const paths = svg.querySelectorAll('path, circle, rect');
        paths.forEach(path => {
            if (path.getAttribute('fill') && path.getAttribute('fill') !== 'none') {
                path.setAttribute('fill', colors.primary);
            }
            if (path.getAttribute('stroke')) {
                path.setAttribute('stroke', colors.border);
            }
        });
    });
}

function updateThirdPartyComponents(theme, colors) {
    // Update code highlighting if Prism.js or highlight.js is used
    if (typeof Prism !== 'undefined') {
        const codeBlocks = document.querySelectorAll('pre[class*="language-"]');
        codeBlocks.forEach(block => {
            if (theme === 'dark') {
                block.classList.add('dark-theme');
            } else {
                block.classList.remove('dark-theme');
            }
        });
    }

    // Update any modal or popup libraries
    const modals = document.querySelectorAll('.modal, .popup, .tooltip');
    modals.forEach(modal => {
        modal.style.background = colors.surface;
        modal.style.color = colors.text;
        modal.style.borderColor = colors.border;
    });
}

// Helper function to create theme-aware components
function createThemeAwareElement(tagName, className, content) {
    const element = document.createElement(tagName);
    element.className = className;
    element.innerHTML = content;
    
    // Apply current theme colors
    const colors = window.themeSystem.getCurrentColors();
    element.style.background = colors.surface;
    element.style.color = colors.text;
    element.style.borderColor = colors.border;
    
    return element;
}

// Export helper functions for use in other scripts
window.themeIntegration = {
    updateExistingElements,
    updateCustomElements,
    createThemeAwareElement
};