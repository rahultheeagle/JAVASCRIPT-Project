// Advanced Search and Filter System
class SearchFilterSystem {
    constructor() {
        this.challenges = {};
        this.filteredChallenges = {};
        this.currentFilters = {
            search: '',
            difficulty: 'all',
            topic: 'all',
            status: 'all',
            timeRange: 'all'
        };
        this.searchHistory = this.loadSearchHistory();
        this.favoriteSearches = this.loadFavoriteSearches();
        
        this.initializeSystem();
    }

    // Initialize the search and filter system
    initializeSystem() {
        this.loadChallengeData();
        this.createSearchInterface();
        this.bindEvents();
        this.loadSavedFilters();
    }

    // Load challenge data
    loadChallengeData() {
        this.challenges = {
            'html-basics': [
                { id: 1, title: 'Basic HTML Structure', description: 'Create a simple HTML document with head and body', difficulty: 'easy', xp: 10, topics: ['html', 'structure', 'basics'], keywords: ['doctype', 'head', 'body'] },
                { id: 2, title: 'Headings and Paragraphs', description: 'Use different heading levels and paragraphs', difficulty: 'easy', xp: 15, topics: ['html', 'text', 'headings'], keywords: ['h1', 'h2', 'h3', 'p', 'text'] },
                { id: 3, title: 'Lists and Links', description: 'Create ordered/unordered lists and hyperlinks', difficulty: 'easy', xp: 20, topics: ['html', 'lists', 'links'], keywords: ['ul', 'ol', 'li', 'a', 'href'] },
                { id: 4, title: 'Images and Attributes', description: 'Add images with proper attributes', difficulty: 'easy', xp: 20, topics: ['html', 'media', 'attributes'], keywords: ['img', 'src', 'alt', 'attributes'] },
                { id: 5, title: 'Tables', description: 'Create a structured table with headers', difficulty: 'medium', xp: 25, topics: ['html', 'tables', 'data'], keywords: ['table', 'tr', 'td', 'th', 'thead'] },
                { id: 6, title: 'Forms and Inputs', description: 'Build a contact form with various input types', difficulty: 'medium', xp: 30, topics: ['html', 'forms', 'inputs'], keywords: ['form', 'input', 'textarea', 'select', 'button'] },
                { id: 7, title: 'Semantic HTML', description: 'Use semantic elements like article, section, nav', difficulty: 'medium', xp: 35, topics: ['html', 'semantic', 'accessibility'], keywords: ['article', 'section', 'nav', 'header', 'footer'] },
                { id: 8, title: 'HTML5 Elements', description: 'Implement audio, video, and canvas elements', difficulty: 'hard', xp: 40, topics: ['html5', 'media', 'canvas'], keywords: ['audio', 'video', 'canvas', 'html5'] },
                { id: 9, title: 'Accessibility Features', description: 'Add ARIA labels and accessibility attributes', difficulty: 'hard', xp: 45, topics: ['html', 'accessibility', 'aria'], keywords: ['aria', 'accessibility', 'screen-reader', 'labels'] },
                { id: 10, title: 'Complete HTML Page', description: 'Build a full webpage with all learned elements', difficulty: 'hard', xp: 50, topics: ['html', 'project', 'complete'], keywords: ['webpage', 'complete', 'project', 'full'] }
            ],
            'css-styling': [
                { id: 1, title: 'Basic CSS Selectors', description: 'Style elements using different CSS selectors', difficulty: 'easy', xp: 10, topics: ['css', 'selectors', 'basics'], keywords: ['selector', 'class', 'id', 'element'] },
                { id: 2, title: 'Colors and Fonts', description: 'Apply colors, fonts, and text styling', difficulty: 'easy', xp: 15, topics: ['css', 'colors', 'typography'], keywords: ['color', 'font', 'text', 'typography'] },
                { id: 3, title: 'Box Model', description: 'Understand margin, padding, border, and content', difficulty: 'easy', xp: 20, topics: ['css', 'box-model', 'layout'], keywords: ['margin', 'padding', 'border', 'box-model'] },
                { id: 4, title: 'Layout with Flexbox', description: 'Create flexible layouts using flexbox', difficulty: 'medium', xp: 25, topics: ['css', 'flexbox', 'layout'], keywords: ['flexbox', 'flex', 'layout', 'responsive'] },
                { id: 5, title: 'CSS Grid Layout', description: 'Build complex layouts with CSS Grid', difficulty: 'medium', xp: 30, topics: ['css', 'grid', 'layout'], keywords: ['grid', 'layout', 'responsive', 'complex'] },
                { id: 6, title: 'Responsive Design', description: 'Make layouts responsive with media queries', difficulty: 'medium', xp: 35, topics: ['css', 'responsive', 'mobile'], keywords: ['responsive', 'media-query', 'mobile', 'breakpoint'] },
                { id: 7, title: 'CSS Animations', description: 'Create smooth animations and transitions', difficulty: 'hard', xp: 40, topics: ['css', 'animations', 'effects'], keywords: ['animation', 'transition', 'keyframes', 'effects'] },
                { id: 8, title: 'CSS Variables', description: 'Use custom properties for dynamic styling', difficulty: 'hard', xp: 40, topics: ['css', 'variables', 'dynamic'], keywords: ['variables', 'custom-properties', 'dynamic', 'css-vars'] },
                { id: 9, title: 'Advanced Selectors', description: 'Master pseudo-classes and pseudo-elements', difficulty: 'hard', xp: 45, topics: ['css', 'selectors', 'advanced'], keywords: ['pseudo-class', 'pseudo-element', 'advanced', 'selectors'] },
                { id: 10, title: 'Complete CSS Theme', description: 'Design a full website theme', difficulty: 'hard', xp: 50, topics: ['css', 'theme', 'project'], keywords: ['theme', 'design', 'complete', 'project'] }
            ],
            'js-fundamentals': [
                { id: 1, title: 'Variables and Data Types', description: 'Declare variables and work with different data types', difficulty: 'easy', xp: 10, topics: ['javascript', 'variables', 'data-types'], keywords: ['var', 'let', 'const', 'string', 'number', 'boolean'] },
                { id: 2, title: 'Functions', description: 'Create and call functions with parameters', difficulty: 'easy', xp: 15, topics: ['javascript', 'functions', 'basics'], keywords: ['function', 'parameters', 'return', 'call'] },
                { id: 3, title: 'Conditionals', description: 'Use if/else statements and logical operators', difficulty: 'easy', xp: 20, topics: ['javascript', 'conditionals', 'logic'], keywords: ['if', 'else', 'switch', 'logical', 'operators'] },
                { id: 4, title: 'Loops', description: 'Implement for and while loops', difficulty: 'easy', xp: 20, topics: ['javascript', 'loops', 'iteration'], keywords: ['for', 'while', 'loop', 'iteration', 'break'] },
                { id: 5, title: 'Arrays', description: 'Work with arrays and array methods', difficulty: 'medium', xp: 25, topics: ['javascript', 'arrays', 'data-structures'], keywords: ['array', 'push', 'pop', 'map', 'filter'] },
                { id: 6, title: 'Objects', description: 'Create and manipulate JavaScript objects', difficulty: 'medium', xp: 30, topics: ['javascript', 'objects', 'data-structures'], keywords: ['object', 'property', 'method', 'this', 'constructor'] },
                { id: 7, title: 'DOM Manipulation', description: 'Select and modify HTML elements', difficulty: 'medium', xp: 35, topics: ['javascript', 'dom', 'manipulation'], keywords: ['dom', 'element', 'querySelector', 'innerHTML', 'event'] },
                { id: 8, title: 'Event Handling', description: 'Handle user interactions with events', difficulty: 'hard', xp: 40, topics: ['javascript', 'events', 'interaction'], keywords: ['event', 'listener', 'click', 'interaction', 'handler'] },
                { id: 9, title: 'Async JavaScript', description: 'Work with promises and async/await', difficulty: 'hard', xp: 45, topics: ['javascript', 'async', 'promises'], keywords: ['async', 'await', 'promise', 'fetch', 'api'] },
                { id: 10, title: 'Local Storage', description: 'Store and retrieve data in the browser', difficulty: 'hard', xp: 50, topics: ['javascript', 'storage', 'data'], keywords: ['localStorage', 'storage', 'data', 'persist', 'browser'] }
            ],
            'mini-projects': [
                { id: 1, title: 'Personal Portfolio', description: 'Build a responsive personal portfolio website', difficulty: 'medium', xp: 100, topics: ['project', 'portfolio', 'responsive'], keywords: ['portfolio', 'responsive', 'website', 'personal'] },
                { id: 2, title: 'Todo List App', description: 'Create an interactive todo list with local storage', difficulty: 'medium', xp: 120, topics: ['project', 'app', 'storage'], keywords: ['todo', 'app', 'interactive', 'storage'] },
                { id: 3, title: 'Weather Dashboard', description: 'Build a weather app with API integration', difficulty: 'hard', xp: 150, topics: ['project', 'api', 'dashboard'], keywords: ['weather', 'api', 'dashboard', 'integration'] },
                { id: 4, title: 'Calculator', description: 'Develop a functional calculator with JavaScript', difficulty: 'hard', xp: 130, topics: ['project', 'calculator', 'math'], keywords: ['calculator', 'math', 'functional', 'operations'] },
                { id: 5, title: 'Quiz Game', description: 'Create an interactive quiz game with scoring', difficulty: 'hard', xp: 180, topics: ['project', 'game', 'interactive'], keywords: ['quiz', 'game', 'interactive', 'scoring'] }
            ]
        };
    }

    // Create search interface
    createSearchInterface() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-filter-container';
        searchContainer.innerHTML = `
            <div class="search-header">
                <h3>🔍 Search & Filter Challenges</h3>
                <button class="toggle-advanced" id="toggleAdvanced">Advanced Filters</button>
            </div>
            
            <div class="search-main">
                <div class="search-input-container">
                    <input type="text" id="challengeSearch" placeholder="Search challenges by title, description, or keywords..." class="search-input">
                    <button class="search-btn" id="searchBtn">🔍</button>
                    <button class="clear-search" id="clearSearch">✕</button>
                </div>
                
                <div class="quick-filters">
                    <div class="filter-group">
                        <label>Difficulty:</label>
                        <select id="difficultyFilter" class="filter-select">
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Category:</label>
                        <select id="topicFilter" class="filter-select">
                            <option value="all">All Categories</option>
                            <option value="html-basics">HTML Basics</option>
                            <option value="css-styling">CSS Styling</option>
                            <option value="js-fundamentals">JavaScript</option>
                            <option value="mini-projects">Projects</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Status:</label>
                        <select id="statusFilter" class="filter-select">
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="available">Available</option>
                            <option value="locked">Locked</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="advanced-filters" id="advancedFilters" style="display: none;">
                <div class="advanced-grid">
                    <div class="filter-group">
                        <label>XP Range:</label>
                        <div class="range-inputs">
                            <input type="number" id="minXP" placeholder="Min XP" class="range-input">
                            <span>to</span>
                            <input type="number" id="maxXP" placeholder="Max XP" class="range-input">
                        </div>
                    </div>
                    
                    <div class="filter-group">
                        <label>Topics:</label>
                        <div class="topic-tags" id="topicTags"></div>
                    </div>
                    
                    <div class="filter-group">
                        <label>Keywords:</label>
                        <input type="text" id="keywordFilter" placeholder="Enter keywords separated by commas" class="keyword-input">
                    </div>
                    
                    <div class="filter-group">
                        <label>Sort By:</label>
                        <select id="sortBy" class="filter-select">
                            <option value="default">Default Order</option>
                            <option value="title">Title (A-Z)</option>
                            <option value="difficulty">Difficulty</option>
                            <option value="xp">XP Points</option>
                            <option value="recent">Recently Added</option>
                        </select>
                    </div>
                </div>
                
                <div class="filter-actions">
                    <button class="save-filter-btn" id="saveFilter">💾 Save Filter</button>
                    <button class="reset-filter-btn" id="resetFilters">🔄 Reset All</button>
                    <button class="export-results-btn" id="exportResults">📤 Export Results</button>
                </div>
            </div>
            
            <div class="search-stats" id="searchStats">
                <span class="results-count">0 challenges found</span>
                <div class="search-suggestions" id="searchSuggestions"></div>
            </div>
            
            <div class="saved-searches" id="savedSearches" style="display: none;">
                <h4>💾 Saved Searches</h4>
                <div class="saved-list" id="savedList"></div>
            </div>
        `;
        
        return searchContainer;
    }

    // Initialize search interface in the page
    initializeSearchInterface() {
        const challengesContent = document.querySelector('.challenges-content');
        if (challengesContent) {
            const searchInterface = this.createSearchInterface();
            challengesContent.insertBefore(searchInterface, challengesContent.firstChild);
            this.populateTopicTags();
            this.updateSavedSearches();
        }
    }

    // Populate topic tags
    populateTopicTags() {
        const topicTags = document.getElementById('topicTags');
        if (!topicTags) return;

        const allTopics = new Set();
        Object.values(this.challenges).flat().forEach(challenge => {
            challenge.topics.forEach(topic => allTopics.add(topic));
        });

        topicTags.innerHTML = Array.from(allTopics).map(topic => `
            <label class="topic-tag">
                <input type="checkbox" value="${topic}" class="topic-checkbox">
                <span class="tag-label">${topic}</span>
            </label>
        `).join('');
    }

    // Bind event listeners
    bindEvents() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeSearchInterface();
            
            // Search input
            const searchInput = document.getElementById('challengeSearch');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    this.currentFilters.search = e.target.value;
                    this.debounceSearch();
                });
                
                searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.performSearch();
                    }
                });
            }

            // Filter selects
            ['difficultyFilter', 'topicFilter', 'statusFilter', 'sortBy'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('change', (e) => {
                        const filterType = id.replace('Filter', '').replace('sortBy', 'sort');
                        this.currentFilters[filterType === 'topic' ? 'topic' : filterType === 'sort' ? 'sort' : filterType] = e.target.value;
                        this.performSearch();
                    });
                }
            });

            // Advanced filters toggle
            const toggleAdvanced = document.getElementById('toggleAdvanced');
            if (toggleAdvanced) {
                toggleAdvanced.addEventListener('click', () => {
                    const advancedFilters = document.getElementById('advancedFilters');
                    const isVisible = advancedFilters.style.display !== 'none';
                    advancedFilters.style.display = isVisible ? 'none' : 'block';
                    toggleAdvanced.textContent = isVisible ? 'Advanced Filters' : 'Hide Advanced';
                });
            }

            // XP range inputs
            ['minXP', 'maxXP'].forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.addEventListener('input', () => {
                        this.debounceSearch();
                    });
                }
            });

            // Keyword filter
            const keywordFilter = document.getElementById('keywordFilter');
            if (keywordFilter) {
                keywordFilter.addEventListener('input', () => {
                    this.debounceSearch();
                });
            }

            // Topic checkboxes
            document.addEventListener('change', (e) => {
                if (e.target.classList.contains('topic-checkbox')) {
                    this.performSearch();
                }
            });

            // Action buttons
            const searchBtn = document.getElementById('searchBtn');
            if (searchBtn) {
                searchBtn.addEventListener('click', () => this.performSearch());
            }

            const clearSearch = document.getElementById('clearSearch');
            if (clearSearch) {
                clearSearch.addEventListener('click', () => this.clearAllFilters());
            }

            const resetFilters = document.getElementById('resetFilters');
            if (resetFilters) {
                resetFilters.addEventListener('click', () => this.resetAllFilters());
            }

            const saveFilter = document.getElementById('saveFilter');
            if (saveFilter) {
                saveFilter.addEventListener('click', () => this.saveCurrentFilter());
            }

            const exportResults = document.getElementById('exportResults');
            if (exportResults) {
                exportResults.addEventListener('click', () => this.exportSearchResults());
            }
        });
    }

    // Debounced search
    debounceSearch() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.performSearch();
        }, 300);
    }

    // Perform search and filtering
    performSearch() {
        const searchTerm = this.currentFilters.search.toLowerCase();
        const difficulty = this.currentFilters.difficulty;
        const topic = this.currentFilters.topic;
        const status = this.currentFilters.status;
        
        // Get XP range
        const minXP = parseInt(document.getElementById('minXP')?.value) || 0;
        const maxXP = parseInt(document.getElementById('maxXP')?.value) || Infinity;
        
        // Get selected topics
        const selectedTopics = Array.from(document.querySelectorAll('.topic-checkbox:checked')).map(cb => cb.value);
        
        // Get keywords
        const keywords = document.getElementById('keywordFilter')?.value.toLowerCase().split(',').map(k => k.trim()).filter(k => k) || [];
        
        // Get completed challenges
        const completedChallenges = JSON.parse(localStorage.getItem('codequest_challenges') || '{}');
        
        this.filteredChallenges = {};
        let totalResults = 0;

        Object.entries(this.challenges).forEach(([category, challenges]) => {
            const filtered = challenges.filter(challenge => {
                // Text search
                const matchesSearch = !searchTerm || 
                    challenge.title.toLowerCase().includes(searchTerm) ||
                    challenge.description.toLowerCase().includes(searchTerm) ||
                    challenge.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm));

                // Difficulty filter
                const matchesDifficulty = difficulty === 'all' || challenge.difficulty === difficulty;

                // Topic/Category filter
                const matchesTopic = topic === 'all' || category === topic;

                // XP range filter
                const matchesXP = challenge.xp >= minXP && challenge.xp <= maxXP;

                // Selected topics filter
                const matchesSelectedTopics = selectedTopics.length === 0 || 
                    selectedTopics.some(selectedTopic => challenge.topics.includes(selectedTopic));

                // Keywords filter
                const matchesKeywords = keywords.length === 0 ||
                    keywords.every(keyword => 
                        challenge.keywords.some(challengeKeyword => 
                            challengeKeyword.toLowerCase().includes(keyword)
                        )
                    );

                // Status filter
                const isCompleted = completedChallenges[category]?.includes(challenge.id) || false;
                const matchesStatus = status === 'all' || 
                    (status === 'completed' && isCompleted) ||
                    (status === 'available' && !isCompleted) ||
                    (status === 'locked' && this.isChallengeLockedByDifficulty(challenge, category, completedChallenges[category] || []));

                return matchesSearch && matchesDifficulty && matchesTopic && matchesXP && 
                       matchesSelectedTopics && matchesKeywords && matchesStatus;
            });

            if (filtered.length > 0) {
                this.filteredChallenges[category] = this.sortChallenges(filtered);
                totalResults += filtered.length;
            }
        });

        this.updateSearchStats(totalResults);
        this.displaySearchResults();
        this.addToSearchHistory(searchTerm);
        this.saveCurrentFilters();
    }

    // Sort challenges based on selected criteria
    sortChallenges(challenges) {
        const sortBy = document.getElementById('sortBy')?.value || 'default';
        
        switch (sortBy) {
            case 'title':
                return challenges.sort((a, b) => a.title.localeCompare(b.title));
            case 'difficulty':
                const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
                return challenges.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
            case 'xp':
                return challenges.sort((a, b) => b.xp - a.xp);
            case 'recent':
                return challenges.sort((a, b) => b.id - a.id);
            default:
                return challenges;
        }
    }

    // Check if challenge is locked (simplified version)
    isChallengeLockedByDifficulty(challenge, category, completedChallenges) {
        const challenges = this.challenges[category];
        const challengeIndex = challenges.findIndex(c => c.id === challenge.id);
        
        if (challengeIndex === 0) return false;
        
        const previousChallenge = challenges[challengeIndex - 1];
        return !completedChallenges.includes(previousChallenge.id);
    }

    // Update search statistics
    updateSearchStats(totalResults) {
        const searchStats = document.getElementById('searchStats');
        if (searchStats) {
            const resultsCount = searchStats.querySelector('.results-count');
            if (resultsCount) {
                resultsCount.textContent = `${totalResults} challenge${totalResults !== 1 ? 's' : ''} found`;
            }
        }
    }

    // Display search results
    displaySearchResults() {
        // Trigger custom event for other components to update
        const event = new CustomEvent('searchResultsUpdated', {
            detail: { filteredChallenges: this.filteredChallenges }
        });
        window.dispatchEvent(event);
    }

    // Clear all filters
    clearAllFilters() {
        document.getElementById('challengeSearch').value = '';
        this.currentFilters.search = '';
        this.performSearch();
    }

    // Reset all filters
    resetAllFilters() {
        // Reset form elements
        document.getElementById('challengeSearch').value = '';
        document.getElementById('difficultyFilter').value = 'all';
        document.getElementById('topicFilter').value = 'all';
        document.getElementById('statusFilter').value = 'all';
        document.getElementById('minXP').value = '';
        document.getElementById('maxXP').value = '';
        document.getElementById('keywordFilter').value = '';
        document.getElementById('sortBy').value = 'default';
        
        // Uncheck all topic checkboxes
        document.querySelectorAll('.topic-checkbox').forEach(cb => cb.checked = false);
        
        // Reset filters object
        this.currentFilters = {
            search: '',
            difficulty: 'all',
            topic: 'all',
            status: 'all',
            timeRange: 'all'
        };
        
        this.performSearch();
    }

    // Save current filter configuration
    saveCurrentFilter() {
        const filterName = prompt('Enter a name for this filter configuration:');
        if (!filterName) return;

        const filterConfig = {
            name: filterName,
            filters: { ...this.currentFilters },
            minXP: document.getElementById('minXP')?.value || '',
            maxXP: document.getElementById('maxXP')?.value || '',
            keywords: document.getElementById('keywordFilter')?.value || '',
            selectedTopics: Array.from(document.querySelectorAll('.topic-checkbox:checked')).map(cb => cb.value),
            sortBy: document.getElementById('sortBy')?.value || 'default',
            timestamp: Date.now()
        };

        this.favoriteSearches.push(filterConfig);
        this.saveFavoriteSearches();
        this.updateSavedSearches();
        
        this.showNotification(`Filter "${filterName}" saved successfully!`, 'success');
    }

    // Export search results
    exportSearchResults() {
        const results = {
            filters: this.currentFilters,
            results: this.filteredChallenges,
            totalCount: Object.values(this.filteredChallenges).flat().length,
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `challenge-search-results-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Search results exported successfully!', 'success');
    }

    // Add to search history
    addToSearchHistory(searchTerm) {
        if (!searchTerm.trim()) return;
        
        // Remove if already exists
        this.searchHistory = this.searchHistory.filter(item => item.term !== searchTerm);
        
        // Add to beginning
        this.searchHistory.unshift({
            term: searchTerm,
            timestamp: Date.now(),
            filters: { ...this.currentFilters }
        });
        
        // Keep only last 20 searches
        this.searchHistory = this.searchHistory.slice(0, 20);
        
        this.saveSearchHistory();
    }

    // Update saved searches display
    updateSavedSearches() {
        const savedList = document.getElementById('savedList');
        if (!savedList) return;

        if (this.favoriteSearches.length === 0) {
            savedList.innerHTML = '<p class="no-saved">No saved searches yet</p>';
            return;
        }

        savedList.innerHTML = this.favoriteSearches.map((search, index) => `
            <div class="saved-search-item">
                <div class="saved-search-info">
                    <strong>${search.name}</strong>
                    <small>${new Date(search.timestamp).toLocaleDateString()}</small>
                </div>
                <div class="saved-search-actions">
                    <button onclick="searchFilterSystem.applySavedFilter(${index})" class="apply-btn">Apply</button>
                    <button onclick="searchFilterSystem.deleteSavedFilter(${index})" class="delete-btn">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Apply saved filter
    applySavedFilter(index) {
        const savedFilter = this.favoriteSearches[index];
        if (!savedFilter) return;

        // Apply filters
        this.currentFilters = { ...savedFilter.filters };
        
        // Update form elements
        document.getElementById('challengeSearch').value = savedFilter.filters.search || '';
        document.getElementById('difficultyFilter').value = savedFilter.filters.difficulty || 'all';
        document.getElementById('topicFilter').value = savedFilter.filters.topic || 'all';
        document.getElementById('statusFilter').value = savedFilter.filters.status || 'all';
        document.getElementById('minXP').value = savedFilter.minXP || '';
        document.getElementById('maxXP').value = savedFilter.maxXP || '';
        document.getElementById('keywordFilter').value = savedFilter.keywords || '';
        document.getElementById('sortBy').value = savedFilter.sortBy || 'default';
        
        // Update topic checkboxes
        document.querySelectorAll('.topic-checkbox').forEach(cb => {
            cb.checked = savedFilter.selectedTopics?.includes(cb.value) || false;
        });
        
        this.performSearch();
        this.showNotification(`Applied filter "${savedFilter.name}"`, 'info');
    }

    // Delete saved filter
    deleteSavedFilter(index) {
        if (confirm('Delete this saved filter?')) {
            const filterName = this.favoriteSearches[index].name;
            this.favoriteSearches.splice(index, 1);
            this.saveFavoriteSearches();
            this.updateSavedSearches();
            this.showNotification(`Deleted filter "${filterName}"`, 'info');
        }
    }

    // Load/save methods
    loadSearchHistory() {
        const saved = localStorage.getItem('codequest_search_history');
        return saved ? JSON.parse(saved) : [];
    }

    saveSearchHistory() {
        localStorage.setItem('codequest_search_history', JSON.stringify(this.searchHistory));
    }

    loadFavoriteSearches() {
        const saved = localStorage.getItem('codequest_favorite_searches');
        return saved ? JSON.parse(saved) : [];
    }

    saveFavoriteSearches() {
        localStorage.setItem('codequest_favorite_searches', JSON.stringify(this.favoriteSearches));
    }

    saveCurrentFilters() {
        localStorage.setItem('codequest_current_filters', JSON.stringify(this.currentFilters));
    }

    loadSavedFilters() {
        const saved = localStorage.getItem('codequest_current_filters');
        if (saved) {
            this.currentFilters = { ...this.currentFilters, ...JSON.parse(saved) };
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `search-notification ${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Get filtered challenges (for external use)
    getFilteredChallenges() {
        return this.filteredChallenges;
    }

    // Get current filters (for external use)
    getCurrentFilters() {
        return this.currentFilters;
    }
}

// Global instance
window.searchFilterSystem = new SearchFilterSystem();