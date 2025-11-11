class ConfettiSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.init();
    }

    init() {
        this.createCanvas();
    }

    createCanvas() {
        if (document.getElementById('confetti-canvas')) return;
        
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, options = {}) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
        
        return {
            x: x || Math.random() * this.canvas.width,
            y: y || this.canvas.height * 0.1,
            vx: (Math.random() - 0.5) * 10,
            vy: Math.random() * -15 - 5,
            gravity: 0.3,
            friction: 0.99,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            shape: Math.random() > 0.5 ? 'square' : 'circle'
        };
    }

    burst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(x, y));
        }
        this.animate();
    }

    celebrate(type = 'default') {
        const celebrations = {
            default: () => this.defaultCelebration(),
            challenge: () => this.challengeCelebration(),
            achievement: () => this.achievementCelebration(),
            levelup: () => this.levelUpCelebration()
        };
        
        celebrations[type]?.();
    }

    defaultCelebration() {
        // Center burst
        this.burst(this.canvas.width / 2, this.canvas.height * 0.3, 30);
        
        // Side bursts
        setTimeout(() => {
            this.burst(this.canvas.width * 0.2, this.canvas.height * 0.4, 20);
            this.burst(this.canvas.width * 0.8, this.canvas.height * 0.4, 20);
        }, 200);
    }

    challengeCelebration() {
        // Multiple sequential bursts
        const positions = [
            [this.canvas.width * 0.3, this.canvas.height * 0.2],
            [this.canvas.width * 0.7, this.canvas.height * 0.2],
            [this.canvas.width * 0.5, this.canvas.height * 0.1]
        ];
        
        positions.forEach((pos, i) => {
            setTimeout(() => this.burst(pos[0], pos[1], 40), i * 150);
        });
    }

    achievementCelebration() {
        // Fountain effect from bottom
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = this.canvas.width * (0.3 + i * 0.1);
                this.burst(x, this.canvas.height * 0.8, 25);
            }, i * 100);
        }
    }

    levelUpCelebration() {
        // Explosive celebration
        this.burst(this.canvas.width / 2, this.canvas.height * 0.3, 80);
        
        setTimeout(() => {
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const x = this.canvas.width / 2 + Math.cos(angle) * 200;
                const y = this.canvas.height / 2 + Math.sin(angle) * 200;
                this.burst(x, y, 15);
            }
        }, 300);
    }

    animate() {
        if (this.animationId) return;
        
        const loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                
                // Update physics
                p.vy += p.gravity;
                p.vx *= p.friction;
                p.vy *= p.friction;
                p.x += p.vx;
                p.y += p.vy;
                p.rotation += p.rotationSpeed;
                p.life -= p.decay;
                
                // Remove dead particles
                if (p.life <= 0 || p.y > this.canvas.height + 50) {
                    this.particles.splice(i, 1);
                    continue;
                }
                
                // Draw particle
                this.ctx.save();
                this.ctx.globalAlpha = p.life;
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rotation * Math.PI / 180);
                this.ctx.fillStyle = p.color;
                
                if (p.shape === 'circle') {
                    this.ctx.beginPath();
                    this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    this.ctx.fill();
                } else {
                    this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                }
                
                this.ctx.restore();
            }
            
            if (this.particles.length > 0) {
                this.animationId = requestAnimationFrame(loop);
            } else {
                this.animationId = null;
            }
        };
        
        loop();
    }

    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.particles = [];
        this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Integration with other systems
    onChallengeComplete() {
        this.celebrate('challenge');
        
        // Show toast notification
        if (window.toastSystem) {
            setTimeout(() => {
                window.toastSystem.achievement('Challenge Complete!', 'Amazing work! 🎉', 100, '🏆');
            }, 500);
        }
    }

    onAchievementUnlocked(achievement) {
        this.celebrate('achievement');
        
        if (window.toastSystem) {
            setTimeout(() => {
                window.toastSystem.achievement(achievement.title, achievement.description, achievement.xp, achievement.icon);
            }, 300);
        }
    }

    onLevelUp(newLevel) {
        this.celebrate('levelup');
        
        if (window.toastSystem) {
            setTimeout(() => {
                window.toastSystem.achievement('Level Up!', `Welcome to Level ${newLevel}!`, 500, '⭐');
            }, 400);
        }
    }
}

// Initialize confetti system
document.addEventListener('DOMContentLoaded', () => {
    window.confettiSystem = new ConfettiSystem();
    
    // Auto-trigger on progress bar completion
    if (window.progressBars) {
        const originalOnComplete = window.progressBars.constructor.prototype.onComplete;
        window.progressBars.constructor.prototype.onComplete = function(bar) {
            originalOnComplete.call(this, bar);
            
            if (bar.type === 'challenge' || bar.type === 'lesson') {
                setTimeout(() => window.confettiSystem.celebrate('challenge'), 200);
            }
        };
    }
});