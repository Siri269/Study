class FocusLearnApp {
    constructor() {
        this.userData = this.loadUserData();
        this.timerState = {
            isRunning: false,
            timeLeft: 25 * 60, // 25 minutes in seconds
            totalTime: 25 * 60,
            interval: null
        };
        this.init();
    }

    init() {
        this.initParticles();
        this.initAnimations();
        this.initCarousel();
        this.updateProgress();
        this.bindEvents();
        this.startBackgroundAnimations();
    }

    // Particle System using p5.js
    initParticles() {
        new p5((p) => {
            let particles = [];
            const numParticles = 50;

            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('particles-canvas');
                
                for (let i = 0; i < numParticles; i++) {
                    particles.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 6),
                        opacity: p.random(0.1, 0.3)
                    });
                }
            };

            p.draw = () => {
                p.clear();
                
                particles.forEach(particle => {
                    // Update position
                    particle.x += particle.vx;
                    particle.y += particle.vy;

                    // Wrap around edges
                    if (particle.x < 0) particle.x = p.width;
                    if (particle.x > p.width) particle.x = 0;
                    if (particle.y < 0) particle.y = p.height;
                    if (particle.y > p.height) particle.y = 0;

                    // Draw particle
                    p.fill(255, 107, 107, particle.opacity * 255);
                    p.noStroke();
                    p.circle(particle.x, particle.y, particle.size);
                });

                // Draw connections
                particles.forEach((particle, i) => {
                    particles.slice(i + 1).forEach(other => {
                        const distance = p.dist(particle.x, particle.y, other.x, other.y);
                        if (distance < 100) {
                            p.stroke(78, 205, 196, (1 - distance / 100) * 50);
                            p.strokeWeight(1);
                            p.line(particle.x, particle.y, other.x, other.y);
                        }
                    });
                });
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }

    // Initialize animations using Anime.js
    initAnimations() {
        // Animate hero text
        if (document.querySelector('[data-splitting]')) {
            Splitting();
            
            anime({
                targets: '[data-splitting] .char',
                translateY: [100, 0],
                opacity: [0, 1],
                easing: 'easeOutExpo',
                duration: 1400,
                delay: anime.stagger(30)
            });
        }

        // Animate progress rings on scroll
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressRings();
                }
            });
        }, observerOptions);

        const progressSection = document.querySelector('#features');
        if (progressSection) {
            observer.observe(progressSection);
        }
    }

    // Animate progress rings
    animateProgressRings() {
        const dailyProgress = document.getElementById('daily-progress');
        const weeklyProgress = document.getElementById('weekly-progress');
        
        if (dailyProgress) {
            anime({
                targets: dailyProgress,
                strokeDashoffset: [351.86, 175.93],
                duration: 2000,
                easing: 'easeOutExpo'
            });
        }

        if (weeklyProgress) {
            anime({
                targets: weeklyProgress,
                strokeDashoffset: [351.86, 87.97],
                duration: 2000,
                easing: 'easeOutExpo',
                delay: 500
            });
        }
    }

    // Initialize achievement carousel
    initCarousel() {
        if (document.getElementById('achievement-carousel')) {
            new Splide('#achievement-carousel', {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 3000,
                pauseOnHover: true,
                breakpoints: {
                    768: {
                        perPage: 1,
                    },
                    1024: {
                        perPage: 2,
                    }
                }
            }).mount();
        }
    }

    // Update progress displays
    updateProgress() {
        const data = this.userData;
        
        // Update daily progress
        const dailyPercentage = Math.round((data.dailyMinutes / data.dailyGoal) * 100);
        const dailyElement = document.getElementById('daily-percentage');
        if (dailyElement) {
            dailyElement.textContent = `${dailyPercentage}%`;
        }

        // Update total XP
        const xpElement = document.getElementById('total-xp');
        if (xpElement) {
            xpElement.textContent = data.totalXP.toLocaleString();
        }

        // Update XP bar
        const xpProgress = (data.xpInLevel / data.xpForNextLevel) * 100;
        const xpBar = document.querySelector('.xp-bar');
        if (xpBar) {
            xpBar.style.width = `${xpProgress}%`;
        }
    }

    // Bind event listeners
    bindEvents() {
        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Button hover effects
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                anime({
                    targets: button,
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });

            button.addEventListener('mouseleave', () => {
                anime({
                    targets: button,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
    }

    // Start background animations
    startBackgroundAnimations() {
        // Floating animation for achievement cards
        anime({
            targets: '.achievement-card',
            translateY: [0, -5, 0],
            duration: 3000,
            easing: 'easeInOutSine',
            loop: true,
            delay: anime.stagger(200)
        });

        // Pulse animation for XP bar
        anime({
            targets: '.xp-bar',
            opacity: [0.8, 1, 0.8],
            duration: 2000,
            easing: 'easeInOutSine',
            loop: true
        });
    }

    // Timer functionality
    startTimer() {
        if (!this.timerState.isRunning) {
            this.timerState.isRunning = true;
            this.timerState.interval = setInterval(() => {
                this.updateTimer();
            }, 1000);

            // Update button states
            document.getElementById('timer-start').classList.add('hidden');
            document.getElementById('timer-pause').classList.remove('hidden');
        }
    }

    pauseTimer() {
        if (this.timerState.isRunning) {
            this.timerState.isRunning = false;
            clearInterval(this.timerState.interval);

            // Update button states
            document.getElementById('timer-start').classList.remove('hidden');
            document.getElementById('timer-pause').classList.add('hidden');
        }
    }

    updateTimer() {
        if (this.timerState.timeLeft > 0) {
            this.timerState.timeLeft--;
            this.updateTimerDisplay();
            this.updateTimerProgress();
        } else {
            this.completeTimer();
        }
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timerState.timeLeft / 60);
        const seconds = this.timerState.timeLeft % 60;
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    updateTimerProgress() {
        const progress = 1 - (this.timerState.timeLeft / this.timerState.totalTime);
        const circumference = 2 * Math.PI * 88; // radius = 88
        const offset = circumference * (1 - progress);
        
        const progressCircle = document.getElementById('timer-progress');
        if (progressCircle) {
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    completeTimer() {
        this.pauseTimer();
        this.timerState.timeLeft = this.timerState.totalTime;
        this.updateTimerDisplay();
        
        // Show completion animation
        this.showTimerComplete();
        
        // Update user data
        this.userData.dailyMinutes += 25;
        this.userData.totalXP += 50;
        this.saveUserData();
        this.updateProgress();
    }

    showTimerComplete() {
        // Create celebration effect
        const modal = document.getElementById('focus-modal');
        const celebration = document.createElement('div');
        celebration.className = 'fixed inset-0 flex items-center justify-center z-50';
        celebration.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
                <div class="text-6xl mb-4">🎉</div>
                <h3 class="text-2xl font-bold text-gray-900 mb-2">Session Complete!</h3>
                <p class="text-gray-600 mb-4">Great job! You earned 50 XP</p>
                <button onclick="this.parentElement.parentElement.remove()" class="bg-secondary text-white px-6 py-2 rounded-xl font-semibold">
                    Awesome!
                </button>
            </div>
        `;
        document.body.appendChild(celebration);

        // Animate celebration
        anime({
            targets: celebration.querySelector('div'),
            scale: [0, 1],
            opacity: [0, 1],
            duration: 500,
            easing: 'easeOutBack'
        });

        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (celebration.parentElement) {
                celebration.remove();
            }
        }, 3000);
    }

    // Data management
    loadUserData() {
        const defaultData = {
            dailyMinutes: 12.5,
            dailyGoal: 25,
            streak: 7,
            totalXP: 2450,
            level: 12,
            xpInLevel: 350,
            xpForNextLevel: 500,
            achievements: ['speed-demon', 'week-warrior', 'precision-master', 'champion'],
            lastVisit: new Date().toISOString()
        };

        const saved = localStorage.getItem('focusLearnData');
        return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
    }

    saveUserData() {
        this.userData.lastVisit = new Date().toISOString();
        localStorage.setItem('focusLearnData', JSON.stringify(this.userData));
    }

    // Utility functions
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-xl text-white font-semibold transform translate-x-full transition-transform duration-300 ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global functions for HTML onclick handlers
function startFocusSession() {
    const modal = document.getElementById('focus-modal');
    if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Reset timer
        app.timerState.timeLeft = app.timerState.totalTime;
        app.updateTimerDisplay();
        
        // Animate modal in
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [0.8, 1],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
}

function closeFocusModal() {
    const modal = document.getElementById('focus-modal');
    if (modal) {
        app.pauseTimer();
        
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [1, 0.8],
            opacity: [1, 0],
            duration: 200,
            easing: 'easeInQuad',
            complete: () => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }
}

function startTimer() {
    app.startTimer();
}

function pauseTimer() {
    app.pauseTimer();
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FocusLearnApp();
});

// Handle page visibility changes for timer
document.addEventListener('visibilitychange', () => {
    if (document.hidden && app && app.timerState.isRunning) {
        // Page is hidden, could pause timer or reduce updates
        console.log('Page hidden - timer continues in background');
    }
});

// Export for other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FocusLearnApp;
}
