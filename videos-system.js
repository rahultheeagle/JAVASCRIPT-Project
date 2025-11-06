class VideosSystem {
    constructor() {
        this.currentCategory = 'html';
        this.videos = {
            html: [
                {
                    title: 'HTML Basics for Beginners',
                    description: 'Learn the fundamentals of HTML including tags, elements, and document structure.',
                    duration: '15:30',
                    thumbnail: 'https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg',
                    videoId: 'UB1O30fR-EE'
                },
                {
                    title: 'HTML Forms Complete Guide',
                    description: 'Master HTML forms with input types, validation, and best practices.',
                    duration: '22:45',
                    thumbnail: 'https://img.youtube.com/vi/fNcJuPIZ2WE/maxresdefault.jpg',
                    videoId: 'fNcJuPIZ2WE'
                },
                {
                    title: 'Semantic HTML Elements',
                    description: 'Understanding semantic HTML5 elements for better structure and accessibility.',
                    duration: '18:20',
                    thumbnail: 'https://img.youtube.com/vi/ZThq93Yuwd0/maxresdefault.jpg',
                    videoId: 'ZThq93Yuwd0'
                }
            ],
            css: [
                {
                    title: 'CSS Flexbox Tutorial',
                    description: 'Complete guide to CSS Flexbox layout with practical examples.',
                    duration: '25:15',
                    thumbnail: 'https://img.youtube.com/vi/JJSoEo8JSnc/maxresdefault.jpg',
                    videoId: 'JJSoEo8JSnc'
                },
                {
                    title: 'CSS Grid Layout',
                    description: 'Learn CSS Grid for creating complex responsive layouts easily.',
                    duration: '30:40',
                    thumbnail: 'https://img.youtube.com/vi/jV8B24rSN5o/maxresdefault.jpg',
                    videoId: 'jV8B24rSN5o'
                },
                {
                    title: 'CSS Animations & Transitions',
                    description: 'Create smooth animations and transitions with CSS.',
                    duration: '20:30',
                    thumbnail: 'https://img.youtube.com/vi/zHUpx90NerM/maxresdefault.jpg',
                    videoId: 'zHUpx90NerM'
                }
            ],
            javascript: [
                {
                    title: 'JavaScript Fundamentals',
                    description: 'Learn JavaScript basics including variables, functions, and control structures.',
                    duration: '45:20',
                    thumbnail: 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
                    videoId: 'PkZNo7MFNFg'
                },
                {
                    title: 'DOM Manipulation',
                    description: 'Master DOM manipulation techniques for interactive web pages.',
                    duration: '35:15',
                    thumbnail: 'https://img.youtube.com/vi/5fb2aPlgoys/maxresdefault.jpg',
                    videoId: '5fb2aPlgoys'
                },
                {
                    title: 'Async JavaScript & Promises',
                    description: 'Understanding asynchronous JavaScript, promises, and async/await.',
                    duration: '28:45',
                    thumbnail: 'https://img.youtube.com/vi/PoRJizFvM7s/maxresdefault.jpg',
                    videoId: 'PoRJizFvM7s'
                }
            ],
            projects: [
                {
                    title: 'Build a Todo App',
                    description: 'Create a complete todo application using HTML, CSS, and JavaScript.',
                    duration: '60:30',
                    thumbnail: 'https://img.youtube.com/vi/Ttf3CEsEwMQ/maxresdefault.jpg',
                    videoId: 'Ttf3CEsEwMQ'
                },
                {
                    title: 'Responsive Portfolio Website',
                    description: 'Build a professional portfolio website from scratch.',
                    duration: '75:20',
                    thumbnail: 'https://img.youtube.com/vi/xV7S8BhIeBo/maxresdefault.jpg',
                    videoId: 'xV7S8BhIeBo'
                }
            ]
        };
        this.initializeElements();
        this.bindEvents();
        this.loadCategory('html');
    }

    initializeElements() {
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.categoryTitle = document.getElementById('category-title');
        this.videoCount = document.getElementById('video-count');
        this.videosGrid = document.getElementById('videos-grid');
        this.videoModal = document.getElementById('video-modal');
        this.videoIframe = document.getElementById('video-iframe');
        this.modalTitle = document.getElementById('modal-title');
        this.modalDescription = document.getElementById('modal-description');
        this.closeModal = document.querySelector('.close-modal');
    }

    bindEvents() {
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.loadCategory(category);
            });
        });

        this.closeModal.addEventListener('click', () => {
            this.closeVideoModal();
        });

        this.videoModal.addEventListener('click', (e) => {
            if (e.target === this.videoModal) {
                this.closeVideoModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeVideoModal();
            }
        });
    }

    loadCategory(category) {
        this.currentCategory = category;
        
        // Update active category button
        this.categoryBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update title and count
        this.categoryTitle.textContent = `${category.toUpperCase()} Video Tutorials`;
        this.videoCount.textContent = `${this.videos[category].length} videos`;
        
        // Render videos
        this.renderVideos(this.videos[category]);
    }

    renderVideos(videos) {
        this.videosGrid.innerHTML = videos.map((video, index) => `
            <div class="video-card" onclick="videosSystem.openVideo(${index})">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" onerror="this.src='https://via.placeholder.com/300x180?text=Video'">
                    <div class="play-button">▶</div>
                </div>
                <div class="video-info">
                    <div class="video-title">${video.title}</div>
                    <div class="video-description">${video.description}</div>
                    <div class="video-duration">${video.duration}</div>
                </div>
            </div>
        `).join('');
    }

    openVideo(index) {
        const video = this.videos[this.currentCategory][index];
        const embedUrl = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`;
        
        this.videoIframe.src = embedUrl;
        this.modalTitle.textContent = video.title;
        this.modalDescription.textContent = video.description;
        this.videoModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeVideoModal() {
        this.videoModal.style.display = 'none';
        this.videoIframe.src = '';
        document.body.style.overflow = 'auto';
    }
}

// Initialize videos system
let videosSystem;
document.addEventListener('DOMContentLoaded', () => {
    videosSystem = new VideosSystem();
});