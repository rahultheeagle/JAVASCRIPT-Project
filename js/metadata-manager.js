// Metadata Manager - SEO-friendly meta tags
class MetadataManager {
    constructor() {
        this.defaultMeta = {
            title: 'CodeQuest - Interactive Learning Platform',
            description: 'Learn JavaScript, HTML, and CSS with interactive challenges, tutorials, and gamification. Master web development skills through hands-on coding practice.',
            keywords: 'JavaScript, HTML, CSS, coding, programming, web development, tutorials, challenges, learning platform',
            author: 'CodeQuest Team',
            viewport: 'width=device-width, initial-scale=1.0',
            charset: 'UTF-8',
            robots: 'index, follow',
            language: 'en',
            siteName: 'CodeQuest',
            type: 'website',
            image: 'https://codequest.dev/og-image.jpg',
            url: 'https://codequest.dev'
        };
    }

    // Set page metadata
    setMetadata(meta = {}) {
        const finalMeta = { ...this.defaultMeta, ...meta };
        
        // Basic meta tags
        this.setTag('title', finalMeta.title);
        this.setTag('meta', 'description', finalMeta.description);
        this.setTag('meta', 'keywords', finalMeta.keywords);
        this.setTag('meta', 'author', finalMeta.author);
        this.setTag('meta', 'robots', finalMeta.robots);
        this.setTag('meta', 'language', finalMeta.language);
        
        // Open Graph tags
        this.setTag('meta', 'og:title', finalMeta.title, 'property');
        this.setTag('meta', 'og:description', finalMeta.description, 'property');
        this.setTag('meta', 'og:type', finalMeta.type, 'property');
        this.setTag('meta', 'og:url', finalMeta.url, 'property');
        this.setTag('meta', 'og:image', finalMeta.image, 'property');
        this.setTag('meta', 'og:site_name', finalMeta.siteName, 'property');
        
        // Twitter Card tags
        this.setTag('meta', 'twitter:card', 'summary_large_image');
        this.setTag('meta', 'twitter:title', finalMeta.title);
        this.setTag('meta', 'twitter:description', finalMeta.description);
        this.setTag('meta', 'twitter:image', finalMeta.image);
        
        // Additional SEO tags
        this.setTag('link', 'canonical', finalMeta.url, 'rel', 'href');
        
        return finalMeta;
    }

    // Set individual tag
    setTag(tagType, nameOrRel, content, attribute = 'name', contentAttr = 'content') {
        if (tagType === 'title') {
            document.title = nameOrRel;
            return;
        }

        let element = document.querySelector(`${tagType}[${attribute}="${nameOrRel}"]`);
        
        if (!element) {
            element = document.createElement(tagType);
            element.setAttribute(attribute, nameOrRel);
            document.head.appendChild(element);
        }
        
        if (tagType === 'link') {
            element.setAttribute(contentAttr, content);
        } else {
            element.setAttribute(contentAttr, content);
        }
    }

    // Generate structured data
    setStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);
        
        // Remove existing structured data
        const existing = document.querySelector('script[type="application/ld+json"]');
        if (existing) existing.remove();
        
        document.head.appendChild(script);
    }

    // Page-specific metadata configurations
    getPageMeta(page) {
        const pageMeta = {
            home: {
                title: 'CodeQuest - Interactive Learning Platform | Learn Web Development',
                description: 'Master JavaScript, HTML, and CSS with interactive challenges and tutorials. Start your coding journey with gamified learning.',
                url: 'https://codequest.dev'
            },
            challenges: {
                title: 'Coding Challenges - CodeQuest',
                description: 'Practice coding with interactive JavaScript, HTML, and CSS challenges. Earn XP and level up your programming skills.',
                url: 'https://codequest.dev/challenges'
            },
            tutorials: {
                title: 'Web Development Tutorials - CodeQuest',
                description: 'Step-by-step tutorials for learning JavaScript, HTML, CSS, and modern web development techniques.',
                url: 'https://codequest.dev/tutorials'
            },
            editor: {
                title: 'Code Editor - CodeQuest',
                description: 'Online code editor with live preview for HTML, CSS, and JavaScript. Practice coding in your browser.',
                url: 'https://codequest.dev/editor'
            },
            forms: {
                title: 'Form Validation Demo - CodeQuest',
                description: 'Learn form validation techniques with real-time feedback and comprehensive input validation examples.',
                url: 'https://codequest.dev/forms-demo'
            }
        };

        return pageMeta[page] || {};
    }

    // Initialize page metadata
    initPage(pageName) {
        const pageMeta = this.getPageMeta(pageName);
        this.setMetadata(pageMeta);
        
        // Set structured data for organization
        this.setStructuredData({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "CodeQuest",
            "description": "Interactive coding learning platform",
            "url": "https://codequest.dev",
            "sameAs": [
                "https://github.com/codequest",
                "https://twitter.com/codequest"
            ],
            "offers": {
                "@type": "Course",
                "name": "Web Development Course",
                "description": "Learn JavaScript, HTML, and CSS",
                "provider": {
                    "@type": "Organization",
                    "name": "CodeQuest"
                }
            }
        });
    }
}

// Global instance
window.metadataManager = new MetadataManager();

// Auto-detect page and set metadata
document.addEventListener('DOMContentLoaded', function() {
    const path = window.location.pathname;
    let pageName = 'home';
    
    if (path.includes('challenges')) pageName = 'challenges';
    else if (path.includes('tutorials')) pageName = 'tutorials';
    else if (path.includes('editor')) pageName = 'editor';
    else if (path.includes('forms')) pageName = 'forms';
    
    metadataManager.initPage(pageName);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MetadataManager;
}