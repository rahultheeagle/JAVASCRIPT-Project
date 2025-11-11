class DataStructure {
    constructor() {
        this.data = {
            challenges: [],
            lessons: [],
            achievements: [],
            users: [],
            settings: {}
        };
        this.init();
    }

    init() {
        this.loadDefaultData();
        this.loadFromStorage();
    }

    loadDefaultData() {
        this.data = {
            challenges: [
                {
                    id: 'html-basics-1',
                    title: 'Create Your First HTML Page',
                    description: 'Create a basic HTML page with a title and paragraph',
                    difficulty: 'beginner',
                    category: 'html',
                    xp: 50,
                    timeLimit: 300,
                    instructions: 'Create an HTML page with a title "My First Page" and a paragraph saying "Hello World!"',
                    starterCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title></title>\n</head>\n<body>\n    \n</body>\n</html>',
                    solution: '<!DOCTYPE html>\n<html>\n<head>\n    <title>My First Page</title>\n</head>\n<body>\n    <p>Hello World!</p>\n</body>\n</html>',
                    tests: [
                        { description: 'Has title "My First Page"', check: 'document.title === "My First Page"' },
                        { description: 'Contains paragraph with "Hello World!"', check: 'document.querySelector("p")?.textContent.includes("Hello World!")' }
                    ]
                },
                {
                    id: 'css-styling-1',
                    title: 'Style Your First Element',
                    description: 'Add CSS styling to make text red and centered',
                    difficulty: 'beginner',
                    category: 'css',
                    xp: 75,
                    timeLimit: 240,
                    instructions: 'Style the paragraph to be red and center-aligned',
                    starterCode: '<p>Style me!</p>',
                    solution: '<style>\np {\n    color: red;\n    text-align: center;\n}\n</style>\n<p>Style me!</p>',
                    tests: [
                        { description: 'Text is red', check: 'getComputedStyle(document.querySelector("p")).color === "rgb(255, 0, 0)"' },
                        { description: 'Text is centered', check: 'getComputedStyle(document.querySelector("p")).textAlign === "center"' }
                    ]
                },
                {
                    id: 'js-variables-1',
                    title: 'JavaScript Variables',
                    description: 'Create variables and display their values',
                    difficulty: 'beginner',
                    category: 'javascript',
                    xp: 100,
                    timeLimit: 180,
                    instructions: 'Create variables for name and age, then display them in an alert',
                    starterCode: '// Create your variables here\n\n// Display them in an alert',
                    solution: 'let name = "John";\nlet age = 25;\nalert("Name: " + name + ", Age: " + age);',
                    tests: [
                        { description: 'Creates name variable', check: 'typeof name !== "undefined"' },
                        { description: 'Creates age variable', check: 'typeof age !== "undefined"' }
                    ]
                }
            ],
            lessons: [
                {
                    id: 'html-intro',
                    title: 'Introduction to HTML',
                    description: 'Learn the basics of HTML structure and elements',
                    category: 'html',
                    difficulty: 'beginner',
                    duration: 15,
                    content: {
                        sections: [
                            {
                                title: 'What is HTML?',
                                content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages.',
                                code: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Page Title</title>\n</head>\n<body>\n    <h1>My First Heading</h1>\n    <p>My first paragraph.</p>\n</body>\n</html>'
                            },
                            {
                                title: 'HTML Elements',
                                content: 'HTML elements are the building blocks of HTML pages. They are represented by tags.',
                                code: '<h1>This is a heading</h1>\n<p>This is a paragraph</p>\n<a href="https://example.com">This is a link</a>'
                            }
                        ]
                    },
                    quiz: [
                        {
                            question: 'What does HTML stand for?',
                            options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language'],
                            correct: 0
                        }
                    ]
                },
                {
                    id: 'css-intro',
                    title: 'Introduction to CSS',
                    description: 'Learn how to style HTML elements with CSS',
                    category: 'css',
                    difficulty: 'beginner',
                    duration: 20,
                    content: {
                        sections: [
                            {
                                title: 'What is CSS?',
                                content: 'CSS (Cascading Style Sheets) is used to style and layout web pages.',
                                code: 'p {\n    color: blue;\n    font-size: 16px;\n}'
                            }
                        ]
                    },
                    quiz: [
                        {
                            question: 'What does CSS stand for?',
                            options: ['Cascading Style Sheets', 'Computer Style Sheets', 'Creative Style Sheets'],
                            correct: 0
                        }
                    ]
                }
            ],
            achievements: [
                {
                    id: 'first-steps',
                    title: 'First Steps',
                    description: 'Complete your first lesson',
                    icon: '🎯',
                    xp: 100,
                    condition: { type: 'lessons_completed', value: 1 }
                },
                {
                    id: 'challenge-master',
                    title: 'Challenge Master',
                    description: 'Complete 5 challenges',
                    icon: '🏆',
                    xp: 250,
                    condition: { type: 'challenges_completed', value: 5 }
                },
                {
                    id: 'speed-demon',
                    title: 'Speed Demon',
                    description: 'Complete a challenge in under 2 minutes',
                    icon: '⚡',
                    xp: 200,
                    condition: { type: 'challenge_time', value: 120 }
                }
            ],
            categories: [
                { id: 'html', name: 'HTML', color: '#e34c26', icon: '📄' },
                { id: 'css', name: 'CSS', color: '#1572b6', icon: '🎨' },
                { id: 'javascript', name: 'JavaScript', color: '#f7df1e', icon: '⚡' }
            ],
            difficulties: [
                { id: 'beginner', name: 'Beginner', color: '#22c55e' },
                { id: 'intermediate', name: 'Intermediate', color: '#f59e0b' },
                { id: 'advanced', name: 'Advanced', color: '#ef4444' }
            ]
        };
    }

    loadFromStorage() {
        if (window.storageManager) {
            const saved = window.storageManager.getItem('appData');
            if (saved) {
                this.data = { ...this.data, ...saved };
            }
        }
    }

    save() {
        if (window.storageManager) {
            window.storageManager.setItem('appData', this.data);
        }
    }

    // Challenge methods
    getChallenges(filters = {}) {
        let challenges = [...this.data.challenges];
        
        if (filters.category) {
            challenges = challenges.filter(c => c.category === filters.category);
        }
        if (filters.difficulty) {
            challenges = challenges.filter(c => c.difficulty === filters.difficulty);
        }
        if (filters.search) {
            const search = filters.search.toLowerCase();
            challenges = challenges.filter(c => 
                c.title.toLowerCase().includes(search) || 
                c.description.toLowerCase().includes(search)
            );
        }
        
        return challenges;
    }

    getChallenge(id) {
        return this.data.challenges.find(c => c.id === id);
    }

    addChallenge(challenge) {
        challenge.id = challenge.id || `challenge-${Date.now()}`;
        this.data.challenges.push(challenge);
        this.save();
        return challenge.id;
    }

    updateChallenge(id, updates) {
        const index = this.data.challenges.findIndex(c => c.id === id);
        if (index !== -1) {
            this.data.challenges[index] = { ...this.data.challenges[index], ...updates };
            this.save();
            return true;
        }
        return false;
    }

    // Lesson methods
    getLessons(filters = {}) {
        let lessons = [...this.data.lessons];
        
        if (filters.category) {
            lessons = lessons.filter(l => l.category === filters.category);
        }
        if (filters.difficulty) {
            lessons = lessons.filter(l => l.difficulty === filters.difficulty);
        }
        
        return lessons;
    }

    getLesson(id) {
        return this.data.lessons.find(l => l.id === id);
    }

    // Achievement methods
    getAchievements() {
        return [...this.data.achievements];
    }

    getAchievement(id) {
        return this.data.achievements.find(a => a.id === id);
    }

    checkAchievements(userStats) {
        const unlockedAchievements = [];
        
        this.data.achievements.forEach(achievement => {
            if (this.isAchievementUnlocked(achievement, userStats)) {
                unlockedAchievements.push(achievement);
            }
        });
        
        return unlockedAchievements;
    }

    isAchievementUnlocked(achievement, userStats) {
        const { type, value } = achievement.condition;
        
        switch (type) {
            case 'lessons_completed':
                return userStats.lessonsCompleted >= value;
            case 'challenges_completed':
                return userStats.challengesCompleted >= value;
            case 'challenge_time':
                return userStats.bestTime && userStats.bestTime <= value;
            case 'streak_days':
                return userStats.currentStreak >= value;
            default:
                return false;
        }
    }

    // Category and difficulty methods
    getCategories() {
        return [...this.data.categories];
    }

    getDifficulties() {
        return [...this.data.difficulties];
    }

    // Statistics methods
    getStats() {
        return {
            totalChallenges: this.data.challenges.length,
            totalLessons: this.data.lessons.length,
            totalAchievements: this.data.achievements.length,
            categoryCounts: this.getCategoryCounts(),
            difficultyCounts: this.getDifficultyCounts()
        };
    }

    getCategoryCounts() {
        const counts = {};
        this.data.categories.forEach(cat => {
            counts[cat.id] = this.data.challenges.filter(c => c.category === cat.id).length;
        });
        return counts;
    }

    getDifficultyCounts() {
        const counts = {};
        this.data.difficulties.forEach(diff => {
            counts[diff.id] = this.data.challenges.filter(c => c.difficulty === diff.id).length;
        });
        return counts;
    }

    // Export/Import methods
    exportData() {
        return JSON.stringify(this.data, null, 2);
    }

    importData(jsonData) {
        try {
            const imported = JSON.parse(jsonData);
            this.data = { ...this.data, ...imported };
            this.save();
            return true;
        } catch (error) {
            console.error('Failed to import data:', error);
            return false;
        }
    }
}

// Initialize data structure
document.addEventListener('DOMContentLoaded', () => {
    window.dataStructure = new DataStructure();
});