
(function () {
    const loader = document.getElementById('loader');
    const loaderFill = document.getElementById('loaderFill');
    let progress = 0;
    const loadInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadInterval);
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = '';
                initAll();
            }, 400);
        }
        loaderFill.style.width = progress + '%';
    }, 150);
    document.body.style.overflow = 'hidden';
})();

function initAll() {
    initParticles();
    initCursor();
    initNavigation();
    initTypingEffect();
    initScrollReveal();
    initCounters();
    initSkillBars();
    initContactForm();
    initTiltCards();
}

// =============================================
// 2) PARTICLE SYSTEM
// =============================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.baseX = this.x;
            this.baseY = this.y;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.density = Math.random() * 30 + 1;
            const colors = [
                'rgba(0, 212, 255,',
                'rgba(123, 47, 255,',
                'rgba(255, 45, 149,',
                'rgba(255, 255, 255,'
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        draw() {
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
        update() {
            // Mouse interaction
            if (mouse.x !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    let force = (mouse.radius - distance) / mouse.radius;
                    let forceX = (dx / distance) * force * this.density * 0.3;
                    let forceY = (dy / distance) * force * this.density * 0.3;
                    this.x -= forceX;
                    this.y -= forceY;
                }
            }
            // Slow drift
            this.x += this.vx;
            this.y += this.vy;

            // Return to base
            let dx = this.baseX - this.x;
            let dy = this.baseY - this.y;
            this.x += dx * 0.01;
            this.y += dy * 0.01;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 200);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    createParticles();

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                let dx = particles[a].x - particles[b].x;
                let dy = particles[a].y - particles[b].y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    let opacity = (1 - dist / 100) * 0.15;
                    ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });
}

// =============================================
// 3) CUSTOM CURSOR
// =============================================
function initCursor() {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;

        cursor.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
        follower.style.transform = `translate(${followerX - 18}px, ${followerY - 18}px)`;
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Hover effect on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-tag, .award-card, .contact-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

// =============================================
// 4) NAVIGATION
// =============================================
function initNavigation() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        updateActiveLink();
    });

    // Mobile toggle
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[href="#${id}"]`);
            if (link) {
                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    }
}

// =============================================
// 5) TYPING EFFECT
// =============================================
function initTypingEffect() {
    const element = document.getElementById('heroTyped');
    if (!element) return;

    const words = [
        'Full Stack Developer',
        'AI/ML Developer',
        'Frontend Developer',
        'Data Analyst',
        'Machine Learning Engineer',
        'Problem Solver',
        'Competitive Programmer'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const currentWord = words[wordIndex];
        if (isDeleting) {
            element.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            element.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 400; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }
    type();
}

// =============================================
// 6) SCROLL REVEAL (Intersection Observer)
// =============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Don't unobserve so we can re-trigger if needed, but keep it simple
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// =============================================
// 7) NUMBER COUNTERS
// =============================================
function initCounters() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));

    function animateCounter(el, target) {
        let current = 0;
        const duration = 2000;
        const start = performance.now();

        function update(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            current = Math.floor(eased * target);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(update);
    }
}

// =============================================
// 8) SKILL BARS ANIMATION
// =============================================
function initSkillBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all skill-bar-fill and education-bar-fill inside this container
                const bars = entry.target.querySelectorAll('.skill-bar-fill, .education-bar-fill');
                bars.forEach((bar, i) => {
                    const width = bar.getAttribute('data-width');
                    if (width) {
                        setTimeout(() => {
                            bar.style.width = width + '%';
                        }, 200 + i * 150);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    // Observe parent containers instead of the tiny bars
    document.querySelectorAll('.skill-category, .education-card').forEach(container => {
        observer.observe(container);
    });
}

// =============================================
// 9) CONTACT FORM
// =============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const message = document.getElementById('formMessage').value;

        // Create mailto link as a simple solution
        const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        window.location.href = `mailto:muralipatnala2486@gmail.com?subject=${subject}&body=${body}`;

        // Visual feedback
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span>Message Sent! ✓</span>';
        btn.style.background = 'linear-gradient(135deg, #28c840, #00d4ff)';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
            form.reset();
        }, 3000);
    });
}

// =============================================
// 10) TILT EFFECT ON CARDS
// =============================================
function initTiltCards() {
    const cards = document.querySelectorAll('.project-card, .award-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            // Move glow effect
            const glow = card.querySelector('.project-card-glow');
            if (glow) {
                glow.style.left = `${x - rect.width}px`;
                glow.style.top = `${y - rect.height}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// =============================================
// 11) SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// =============================================
// 12) MAGNETIC EFFECT ON BUTTONS
// =============================================
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// =============================================
// 13) PARALLAX ON HERO IMAGE
// =============================================
window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    const heroImage = document.querySelector('.hero-image-wrapper');
    if (hero && heroImage) {
        const scrolled = window.scrollY;
        const heroHeight = hero.offsetHeight;
        if (scrolled < heroHeight) {
            heroImage.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    }
});

// =============================================
// 14) RANDOM GLITCH BURST
// =============================================
(function glitchBurst() {
    const glitchEl = document.querySelector('.hero-name.glitch');
    if (!glitchEl) return;

    setInterval(() => {
        glitchEl.style.animation = 'none';
        void glitchEl.offsetWidth; // trigger reflow
        glitchEl.style.animation = '';
        // Briefly intensify
        glitchEl.style.textShadow = `
            ${Math.random() * 10 - 5}px ${Math.random() * 4 - 2}px rgba(0, 212, 255, 0.8),
            ${Math.random() * -10 + 5}px ${Math.random() * 4 - 2}px rgba(255, 45, 149, 0.8)
        `;
        setTimeout(() => {
            glitchEl.style.textShadow = '';
        }, 200);
    }, 4000 + Math.random() * 3000);
})();
