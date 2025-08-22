// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
            // Track page load performance
        }
    }
});

// Start performance monitoring
try {
    performanceObserver.observe({entryTypes: ['navigation', 'paint', 'largest-contentful-paint']});
} catch (e) {
    // Performance API not supported in this browser
}

// Error handling for uncaught errors
window.addEventListener('error', function(event) {
    // Log error to console in development, send to analytics in production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.error('JavaScript Error:', event.error);
    }
    // In production, you might want to send this to an error tracking service
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    try {
    
    // Add loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="loading-logo">
                <img src="assets/Asset 5.svg" alt="Loading..." style="width: 60px; height: 60px; animation: spin 2s linear infinite;">
            </div>
            <div class="loading-text">Loading My Universe...</div>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000000;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        transition: opacity 0.5s ease;
    `;
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after everything is loaded
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
                // Trigger entrance animations
                triggerEntranceAnimations();
            }, 500);
        }, 1000);
    });
    
    function triggerEntranceAnimations() {
        const homeSection = document.querySelector('.home');
        if (homeSection) {
            homeSection.classList.add('loaded');
        }
    }
    
    // Navbar Logo Animations
    const navbarLogo = document.querySelector('.navbar-logo');
    const logoLink = document.querySelector('.logo-link');
    
    // Add click animation to logo
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            navbarLogo.classList.add('spin');
            
            // Remove spin class after animation
            setTimeout(() => {
                navbarLogo.classList.remove('spin');
                // Smooth scroll to top
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 800);
        });
        
        // Add special animation on double click
        let clickTimeout;
        logoLink.addEventListener('dblclick', function(e) {
            e.preventDefault();
            clearTimeout(clickTimeout);
            
            // Add special double-click effect
            navbarLogo.style.animation = 'none';
            setTimeout(() => {
                navbarLogo.style.animation = 'logoEntrance 0.6s ease-out, logoBreathe 4s ease-in-out infinite 0.6s';
            }, 10);
        });
    }
    
    // Interactive Infinite Zoom Grid
    function initInteractiveGrid() {
        const grid = document.getElementById('infinite-grid');
        const homeSection = document.querySelector('.home');
        
        if (!grid || !homeSection) return;
        
        let mouseX = 0;
        let mouseY = 0;
        let isMouseInHome = false;
        
        // Mouse movement interaction
        homeSection.addEventListener('mousemove', (e) => {
            const rect = homeSection.getBoundingClientRect();
            mouseX = (e.clientX - rect.left) / rect.width;
            mouseY = (e.clientY - rect.top) / rect.height;
            
            // Apply dynamic transform based on mouse position
            const translateX = (mouseX - 0.5) * 20;
            const translateY = (mouseY - 0.5) * 20;
            const scale = 1 + (mouseX * 0.1);
            
            grid.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px) scale(${scale})`;
            grid.style.filter = `hue-rotate(${mouseX * 60}deg) brightness(${1 + mouseY * 0.2})`;
        });
        
        // Mouse enter/leave effects
        homeSection.addEventListener('mouseenter', () => {
            isMouseInHome = true;
            grid.style.transition = 'filter 0.3s ease';
            grid.style.animationPlayState = 'paused';
        });
        
        homeSection.addEventListener('mouseleave', () => {
            isMouseInHome = false;
            grid.style.transition = 'all 0.5s ease';
            grid.style.transform = 'translate(-50%, -50%)';
            grid.style.filter = 'none';
            grid.style.animationPlayState = 'running';
        });
        
        // Click interaction - create ripple effect (disabled on smaller screens)
        homeSection.addEventListener('click', (e) => {
            if (e.target.closest('.home-content')) return; // Don't trigger on content clicks
            
            // Disable ripple effect on smaller screens (768px and below)
            if (window.innerWidth <= 768) return;
            
            const rect = homeSection.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            createGridRipple(x, y);
        });
        
        // Scroll-based animation speed adjustment
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.pageYOffset;
                    const homeHeight = homeSection.offsetHeight;
                    const scrollProgress = Math.min(scrollY / homeHeight, 1);
                    
                    // Adjust animation speed based on scroll
                    const animationSpeed = 1 + scrollProgress * 0.5;
                    grid.style.animationDuration = `${20 / animationSpeed}s`;
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // Touch interactions for mobile
        if ('ontouchstart' in window) {
            let touchStartTime = 0;
            
            homeSection.addEventListener('touchstart', (e) => {
                touchStartTime = Date.now();
                const touch = e.touches[0];
                const rect = homeSection.getBoundingClientRect();
                const x = ((touch.clientX - rect.left) / rect.width) * 100;
                const y = ((touch.clientY - rect.top) / rect.height) * 100;
                
                // Disable touch ripple feedback on smaller screens (768px and below)
                if (window.innerWidth > 768) {
                    createGridRipple(x, y);
                }
            });
            
            homeSection.addEventListener('touchmove', (e) => {
                if (window.innerWidth <= 768) return;
                e.preventDefault();
                const touch = e.touches[0];
                const rect = homeSection.getBoundingClientRect();
                const touchX = (touch.clientX - rect.left) / rect.width;
                const touchY = (touch.clientY - rect.top) / rect.height;
                
                // Apply subtle transform on touch move
                const translateX = (touchX - 0.5) * 10;
                const translateY = (touchY - 0.5) * 10;
                
                grid.style.transform = `translate(-50%, -50%) translate(${translateX}px, ${translateY}px)`;
            });
            
            homeSection.addEventListener('touchend', () => {
                // Reset transform on touch end
                grid.style.transition = 'transform 0.5s ease';
                grid.style.transform = 'translate(-50%, -50%)';
                
                setTimeout(() => {
                    grid.style.transition = '';
                }, 500);
            });
        }
    }
    
    // Create grid ripple effect
    function createGridRipple(x, y) {
        const ripple = document.createElement('div');
        ripple.className = 'grid-ripple';
        ripple.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: 0;
            height: 0;
            border: 2px solid rgba(100, 255, 218, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 2;
            animation: gridRippleEffect 1.5s ease-out forwards;
        `;
        
        document.querySelector('.infinite-grid-container').appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 1500);
    }
    
    // Initialize interactive grid
    initInteractiveGrid();
    
    // Interactive About Section Animations will be initialized later
    
    // Enhanced Mobile Navigation System
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;

    if (navToggle && navMenu) {
        
        // Toggle mobile menu
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle classes
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('show');
            body.classList.toggle('menu-open');
            
            // Move menu outside of hidden parent when showing
            if (navMenu.classList.contains('show')) {
                // Move to body to escape hidden parent
                document.body.appendChild(navMenu);
                
                // Add close button if it doesn't exist
                if (!navMenu.querySelector('.mobile-close-btn')) {
                    const closeBtn = document.createElement('button');
                    closeBtn.className = 'mobile-close-btn';
                    closeBtn.innerHTML = '✕';
                    closeBtn.style.cssText = `
                        position: absolute;
                        top: 2rem;
                        right: 2rem;
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: white;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        font-size: 1.2rem;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 10001;
                        transition: all 0.3s ease;
                    `;
                    
                    // Add hover effects
                    closeBtn.addEventListener('mouseenter', () => {
                        closeBtn.style.background = 'rgba(255, 107, 107, 0.2)';
                        closeBtn.style.borderColor = 'rgba(255, 107, 107, 0.5)';
                        closeBtn.style.transform = 'scale(1.1)';
                    });
                    
                    closeBtn.addEventListener('mouseleave', () => {
                        closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
                        closeBtn.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        closeBtn.style.transform = 'scale(1)';
                    });
                    
                    closeBtn.addEventListener('click', () => {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('show');
                        body.classList.remove('menu-open');
                        
                        // Move menu back to original parent
                        const navCenter = document.querySelector('.nav-center');
                        if (navCenter) {
                            navCenter.appendChild(navMenu);
                        }
                    });
                    
                    navMenu.appendChild(closeBtn);
                }
            } else {
                // Move back to original parent when hiding
                const navCenter = document.querySelector('.nav-center');
                if (navCenter) {
                    navCenter.appendChild(navMenu);
                }
                
                // Remove close button
                const closeBtn = navMenu.querySelector('.mobile-close-btn');
                if (closeBtn) {
                    closeBtn.remove();
                }
            }
        });

        // Close menu when clicking on nav links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
                body.classList.remove('menu-open');
                
                // Remove close button
                const closeBtn = navMenu.querySelector('.mobile-close-btn');
                if (closeBtn) {
                    closeBtn.remove();
                }
                
                // Move menu back to original parent
                const navCenter = document.querySelector('.nav-center');
                if (navCenter && navMenu.parentNode !== navCenter) {
                    navCenter.appendChild(navMenu);
                }
            });
        });

        // Close menu when clicking outside (with delay to avoid immediate closing)
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (navMenu.classList.contains('show') && 
                    !navToggle.contains(e.target) && 
                    !navMenu.contains(e.target)) {
                    
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('show');
                    body.classList.remove('menu-open');
                    
                    // Remove close button
                    const closeBtn = navMenu.querySelector('.mobile-close-btn');
                    if (closeBtn) {
                        closeBtn.remove();
                    }
                    
                    // Move menu back to original parent
                    const navCenter = document.querySelector('.nav-center');
                    if (navCenter && navMenu.parentNode !== navCenter) {
                        navCenter.appendChild(navMenu);
                    }
                }
            });
        }, 100);

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('show')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
                body.classList.remove('menu-open');
                
                // Remove close button
                const closeBtn = navMenu.querySelector('.mobile-close-btn');
                if (closeBtn) {
                    closeBtn.remove();
                }
                
                // Move menu back to original parent
                const navCenter = document.querySelector('.nav-center');
                if (navCenter && navMenu.parentNode !== navCenter) {
                    navCenter.appendChild(navMenu);
                }
            }
        });

        // Handle window resize - close menu if window becomes large
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu.classList.contains('show')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('show');
                body.classList.remove('menu-open');
                
                // Remove close button
                const closeBtn = navMenu.querySelector('.mobile-close-btn');
                if (closeBtn) {
                    closeBtn.remove();
                }
                
                // Move menu back to original parent
                const navCenter = document.querySelector('.nav-center');
                if (navCenter && navMenu.parentNode !== navCenter) {
                    navCenter.appendChild(navMenu);
                }
            }
        });
    }

    // Active navigation link highlighting
    function setActiveNav() {
        const sections = document.querySelectorAll('.section');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                correspondingNavLink?.classList.add('active');
            } else {
                correspondingNavLink?.classList.remove('active');
            }
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Typewriter effect
    function initTypewriter() {
        const phrases = [
            "Python Developer",
            "Machine Learning Enthusiast", 
            "Creative Visual Designer",
            "AI/ML Student",
            "Data Science Explorer"
        ];

        if (typeof TypeIt !== 'undefined') {
            new TypeIt("#typewriter", {
                strings: phrases,
                speed: 50,
                breakLines: false,
                loop: true,
                deleteSpeed: 30,
                nextStringDelay: 2000
            }).go();
        } else {
            // Fallback if TypeIt is not loaded
            let currentPhrase = 0;
            const typewriterElement = document.getElementById('typewriter');
            
            function typePhrase() {
                if (typewriterElement) {
                    typewriterElement.textContent = phrases[currentPhrase];
                    currentPhrase = (currentPhrase + 1) % phrases.length;
                }
            }
            
            typePhrase();
            setInterval(typePhrase, 3000);
        }
    }

    // Initialize typewriter after a short delay
    setTimeout(initTypewriter, 2500);

    // Enhanced Particle System with Performance Optimization
    let particleAnimationId;
    let particlesEnabled = true;
    
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            particlesEnabled = false;
            return;
        }

        // Adjust particle count based on screen size and performance
        const isMobile = window.innerWidth <= 768;
        const isLowEnd = navigator.hardwareConcurrency <= 4;
        let particleCount = isMobile ? 20 : (isLowEnd ? 30 : 50);

        // Clear existing particles
        particlesContainer.innerHTML = '';

        // Use DocumentFragment for better performance
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < particleCount; i++) {
            createParticle(i, fragment);
        }
        
        particlesContainer.appendChild(fragment);

        function createParticle(index, container = particlesContainer) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random starting position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = (Math.random() * 12 + index * 0.2) + 's';
            particle.style.animationDuration = (Math.random() * 8 + 12) + 's';
            
            // Enhanced random properties
            const opacity = Math.random() * 0.6 + 0.2;
            particle.style.opacity = opacity;
            
            const size = Math.random() * (isMobile ? 2 : 3) + (isMobile ? 1 : 1.5);
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Add some variation in colors
            const hue = Math.random() * 60; // Subtle color variation
            particle.style.background = `hsl(${hue}, 20%, ${80 + Math.random() * 20}%)`;
            particle.style.boxShadow = `0 0 ${size * 2}px rgba(255, 255, 255, ${opacity * 0.5})`;
            
            // Use transform for better performance
            particle.style.willChange = 'transform, opacity';
            
            if (container === particlesContainer) {
                container.appendChild(particle);
            } else {
                container.appendChild(particle);
            }
            
            // Remove particle after animation and create new one
            const animationDuration = (Math.random() * 8 + 12) * 1000;
            setTimeout(() => {
                if (particle.parentNode && particlesEnabled) {
                    particle.parentNode.removeChild(particle);
                    createParticle(index);
                }
            }, animationDuration);
        }
    }
    
    // Performance monitoring
    function checkPerformance() {
        let fps = 0;
        let lastTime = performance.now();
        
        function measureFPS() {
            const currentTime = performance.now();
            fps = 1000 / (currentTime - lastTime);
            lastTime = currentTime;
            
            // If FPS drops below 30, reduce particles
            if (fps < 30 && particlesEnabled) {
                const particles = document.querySelectorAll('.particle');
                if (particles.length > 20) {
                    // Remove every other particle
                    particles.forEach((particle, index) => {
                        if (index % 2 === 0) {
                            particle.remove();
                        }
                    });
                }
            }
            
            if (particlesEnabled) {
                requestAnimationFrame(measureFPS);
            }
        }
        
        requestAnimationFrame(measureFPS);
    }

    // Counter Animation
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const options = {
            threshold: 0.7
        };

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const statItem = counter.closest('.stat-item');
                    
                    if (!statItem) {
                        return;
                    }
                    
                    const targetAttr = statItem.getAttribute('data-target');
                    const target = parseInt(targetAttr);
                    
                    // If no target found or invalid, skip this counter
                    if (!targetAttr || isNaN(target)) {
                        return;
                    }
                    
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60 FPS
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current >= target) {
                            counter.textContent = target;
                        } else {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        }
                    };

                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, options);

        counters.forEach((counter, index) => {
            counterObserver.observe(counter);
        });
    }

    // Floating elements animation
    function initFloatingElements() {
        const floatingItems = document.querySelectorAll('.floating-item');
        
        floatingItems.forEach((item, index) => {
            const speed = item.getAttribute('data-speed') || 1;
            item.style.animationDuration = (20 / speed) + 's';
            item.style.animationDelay = (index * -4) + 's';
        });
    }

    // Mouse move parallax effect
    function initParallax() {
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth;
            mouseY = e.clientY / window.innerHeight;
        });

        function updateParallax() {
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;

            const shapes = document.querySelectorAll('.shape');
            const floatingItems = document.querySelectorAll('.floating-item');

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const x = targetX * speed * 20;
                const y = targetY * speed * 20;
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });

            floatingItems.forEach((item, index) => {
                const speed = (index + 1) * 0.3;
                const x = targetX * speed * 15;
                const y = targetY * speed * 15;
                item.style.transform += ` translate(${x}px, ${y}px)`;
            });

            requestAnimationFrame(updateParallax);
        }

        updateParallax();
    }

    // Initialize enhanced features
    setTimeout(() => {
        createParticles();
        animateCounters();
        initFloatingElements();
        initParallax();
        initResponsiveFeatures();
        initInteractiveEffects();
        checkPerformance();
    }, 1000);
    
    // Accessibility improvements
    function initAccessibility() {
        // Add focus indicators
        const focusableElements = document.querySelectorAll('a, button, [tabindex]');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid rgba(255, 255, 255, 0.8)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
        
        // Keyboard navigation for stats
        const statItems = document.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Statistic ${index + 1}`);
        });
    }
    
    // Initialize accessibility features
    initAccessibility();

    // Interactive effects for better user engagement
    function initInteractiveEffects() {
        // Enhanced profile image interactions
        const profileImg = document.getElementById('profile-img');
        if (profileImg) {
            profileImg.addEventListener('mouseenter', () => {
                profileImg.style.transform = 'scale(1.05)';
                profileImg.style.filter = 'grayscale(50%) contrast(120%) brightness(120%)';
                // Create ripple effect (disabled on smaller screens)
                if (window.innerWidth > 768) {
                    createImageRipple(profileImg);
                }
            });
            
            profileImg.addEventListener('mouseleave', () => {
                profileImg.style.transform = 'scale(1)';
                profileImg.style.filter = 'grayscale(100%) contrast(110%) brightness(110%)';
            });
        }
        
        // Interactive social icons
        const socialIcons = document.querySelectorAll('.social-icon');
        socialIcons.forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                icon.style.transform = 'translateY(-5px) scale(1.1)';
                createIconGlow(icon);
            });
            
            icon.addEventListener('mouseleave', () => {
                icon.style.transform = 'translateY(0) scale(1)';
            });
            
            // Add click animation
            icon.addEventListener('click', (e) => {
                createClickWave(e.target, e.clientX, e.clientY);
            });
        });
        
        // Interactive stat items with navigation
        const statItems = document.querySelectorAll('.home-stats .stat-item');
        
        // Define navigation mapping for stat items
        const statNavigation = {
            'Major Projects': 'projects',
            'Years Study': 'education',
            'Certificates': 'certificates',
            'Achievements': 'achievements'
        };
        
        statItems.forEach(item => {
            // Add hover effects
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px) scale(1.05)';
                item.style.boxShadow = '0 10px 30px rgba(255, 255, 255, 0.1)';
                item.style.cursor = 'pointer';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
                item.style.boxShadow = 'none';
            });
            
            // Add click navigation
            item.addEventListener('click', (e) => {
                const statLabel = item.querySelector('.stat-label').textContent;
                const targetSection = statNavigation[statLabel];
                
                if (targetSection) {
                    // Add click animation
                    item.style.transform = 'translateY(-5px) scale(0.95)';
                    
                    // Create ripple effect (disabled on smaller screens)
                    if (window.innerWidth > 768) {
                        createStatRipple(item, e);
                    }
                    
                    // Navigate to section after animation
                    setTimeout(() => {
                        const targetElement = document.getElementById(targetSection);
                        if (targetElement) {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                            
                            // Update active nav link
                            updateActiveNavLink(targetSection);
                        }
                        
                        // Reset transform
                        setTimeout(() => {
                            item.style.transform = 'translateY(0) scale(1)';
                        }, 200);
                    }, 150);
                }
            });
            
            // Add touch feedback for mobile
            item.addEventListener('touchstart', (e) => {
                item.style.transform = 'translateY(-5px) scale(0.98)';
                createStatRipple(item, e.touches[0]);
            });
            
            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.style.transform = 'translateY(0) scale(1)';
                }, 100);
            });
        });
        
        // Cursor trail effect
        if (window.innerWidth > 768) {
            initCursorTrail();
        }
    }
    
    // Create ripple effect for stat items
    function createStatRipple(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            animation: statRippleEffect 0.6s ease-out forwards;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Update active navigation link
    function updateActiveNavLink(sectionId) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
    
    // Create ripple effect for profile image
    function createImageRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'image-ripple';
        ripple.style.position = 'absolute';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.border = '2px solid rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '1';
        
        element.parentElement.appendChild(ripple);
        
        ripple.animate([
            { width: '0', height: '0', opacity: 1 },
            { width: '320px', height: '320px', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => ripple.remove();
    }
    
    // Create glow effect for icons
    function createIconGlow(element) {
        const glow = document.createElement('div');
        glow.className = 'icon-glow';
        glow.style.position = 'absolute';
        glow.style.top = '50%';
        glow.style.left = '50%';
        glow.style.transform = 'translate(-50%, -50%)';
        glow.style.width = '40px';
        glow.style.height = '40px';
        glow.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%)';
        glow.style.borderRadius = '50%';
        glow.style.pointerEvents = 'none';
        glow.style.zIndex = '-1';
        
        element.style.position = 'relative';
        element.appendChild(glow);
        
        setTimeout(() => glow.remove(), 500);
    }
    
    // Create click wave effect
    function createClickWave(element, x, y) {
        const wave = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        wave.style.position = 'absolute';
        wave.style.left = (x - rect.left - size / 2) + 'px';
        wave.style.top = (y - rect.top - size / 2) + 'px';
        wave.style.width = wave.style.height = size + 'px';
        wave.style.borderRadius = '50%';
        wave.style.background = 'rgba(255, 255, 255, 0.3)';
        wave.style.transform = 'scale(0)';
        wave.style.pointerEvents = 'none';
        wave.style.zIndex = '1000';
        
        element.style.position = 'relative';
        element.appendChild(wave);
        
        wave.animate([
            { transform: 'scale(0)', opacity: 1 },
            { transform: 'scale(1)', opacity: 0 }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => wave.remove();
    }
    
    // Cursor trail effect for desktop
    function initCursorTrail() {
        const trail = [];
        const trailLength = 5;
        
        document.addEventListener('mousemove', (e) => {
            trail.push({ x: e.clientX, y: e.clientY, time: Date.now() });
            
            if (trail.length > trailLength) {
                trail.shift();
            }
            
            // Create trail particles
            if (Math.random() < 0.3) {
                createTrailParticle(e.clientX, e.clientY);
            }
        });
    }
    
    // Create cursor trail particles
    function createTrailParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.background = 'rgba(255, 255, 255, 0.6)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        particle.style.transform = 'translate(-50%, -50%)';
        
        document.body.appendChild(particle);
        
        particle.animate([
            { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
            { opacity: 0, transform: 'translate(-50%, -50%) scale(0)' }
        ], {
            duration: 1000,
            easing: 'ease-out'
        }).onfinish = () => particle.remove();
    }

    // Responsive features and window resize handler
    function initResponsiveFeatures() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Recreate particles with new count for screen size
                createParticles();
                
                // Adjust animations for mobile
                const isMobile = window.innerWidth <= 768;
                const homeSection = document.querySelector('.home');
                
                if (homeSection) {
                    if (isMobile) {
                        homeSection.classList.add('mobile-optimized');
                    } else {
                        homeSection.classList.remove('mobile-optimized');
                    }
                }
                
                // Update floating elements
                updateFloatingElements();
            }, 300);
        });
        
        // Initial mobile check
        const isMobile = window.innerWidth <= 768;
        const homeSection = document.querySelector('.home');
        if (homeSection && isMobile) {
            homeSection.classList.add('mobile-optimized');
        }
    }
    
    // Enhanced floating elements with better mobile support
    function updateFloatingElements() {
        const floatingItems = document.querySelectorAll('.floating-item');
        const isMobile = window.innerWidth <= 768;
        
        floatingItems.forEach((item, index) => {
            const speed = item.getAttribute('data-speed') || 1;
            const duration = isMobile ? (30 / speed) : (20 / speed);
            item.style.animationDuration = duration + 's';
            item.style.animationDelay = (index * (isMobile ? -6 : -4)) + 's';
            
            if (isMobile) {
                item.style.fontSize = '1.2rem';
                item.style.opacity = '0.2';
            } else {
                item.style.fontSize = '2rem';
                item.style.opacity = '0.3';
            }
        });
    }

    // Profile image loading fallback
    function handleImageLoad() {
        const profileImg = document.getElementById('profile-img');
        const aboutImg = document.getElementById('about-img');
        
        if (profileImg) {
            profileImg.onerror = function() {
                this.src = 'https://via.placeholder.com/280x280/666666/ffffff?text=SG';
                this.style.filter = 'grayscale(100%) contrast(110%) brightness(110%)';
            };
        }
        
        if (aboutImg) {
            aboutImg.onerror = function() {
                this.src = 'https://via.placeholder.com/300x300/666666/ffffff?text=SG';
                this.style.filter = 'grayscale(100%) contrast(110%)';
            };
        }

        // Design gallery image fallbacks
        const designImages = document.querySelectorAll('.design-image img');
        const designPlaceholders = [
            'https://via.placeholder.com/400x250/666666/ffffff?text=Logo+Design',
            'https://via.placeholder.com/400x250/666666/ffffff?text=UI/UX+Design',
            'https://via.placeholder.com/400x250/666666/ffffff?text=Poster+Design',
            'https://via.placeholder.com/400x250/666666/ffffff?text=Brand+Identity',
            'https://via.placeholder.com/400x250/666666/ffffff?text=Digital+Art',
            'https://via.placeholder.com/400x250/666666/ffffff?text=Social+Media'
        ];

        designImages.forEach((img, index) => {
            img.onerror = function() {
                this.src = designPlaceholders[index] || 'https://via.placeholder.com/400x250/666666/ffffff?text=Design';
                this.style.filter = 'grayscale(100%) contrast(110%)';
            };
        });
    }

    // Scroll animations
    function animateOnScroll() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Progress bar animation
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            const barVisible = 200;
            
            if (barTop < window.innerHeight - barVisible) {
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth;
            }
        });
    }

    // Header background change on scroll
    function updateHeader() {
        const header = document.querySelector('.header');
        const scrollY = window.pageYOffset;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(0, 0, 0, 0.95)';
            header.style.boxShadow = 'none';
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate progress bars when skills section is visible
                if (entry.target.classList.contains('skills')) {
                    setTimeout(animateProgressBars, 500);
                }
            }
        });
    }, observerOptions);

    // Observe sections for animations
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Modern Contact form handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Enhanced validation
            if (!name || !email || !subject || !message) {
                showModernFormStatus('error', 'Please fill in all fields.');
                return;
            }
            
            if (!isValidEmail(email)) {
                showModernFormStatus('error', 'Please enter a valid email address.');
                return;
            }
            
            // Show loading state
            const submitButton = contactForm.querySelector('.submit-btn');
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            
            // Create enhanced email content
            const emailContent = {
                to: 'saptarshi0777@gmail.com',
                from: email,
                from_name: name,
                subject: `Portfolio Contact: ${subject}`,
                message: message,
                html: `
                    <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f9fa;">
                        <div style="background: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); border: 1px solid #e9ecef;">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <h1 style="color: #2c3e50; font-size: 28px; margin: 0 0 10px 0; font-weight: 700;">New Contact Message</h1>
                                <div style="width: 60px; height: 4px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto; border-radius: 2px;"></div>
                            </div>
                            
                            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: 600; color: #555; width: 100px;">From:</td>
                                        <td style="padding: 8px 0; color: #333;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: 600; color: #555;">Email:</td>
                                        <td style="padding: 8px 0; color: #333;">${email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: 600; color: #555;">Subject:</td>
                                        <td style="padding: 8px 0; color: #333;">${subject}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; font-weight: 600; color: #555;">Date:</td>
                                        <td style="padding: 8px 0; color: #333;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background: #ffffff; padding: 25px; border: 2px solid #e9ecef; border-radius: 12px; margin-bottom: 25px;">
                                <h3 style="color: #555; font-size: 16px; margin: 0 0 15px 0; font-weight: 600;">Message:</h3>
                                <div style="color: #333; line-height: 1.7; font-size: 15px; white-space: pre-wrap;">${message}</div>
                            </div>
                            
                            <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <p style="margin: 0; color: #6c757d; font-size: 13px;">
                                    📧 This message was sent from your portfolio website contact form<br>
                                    🌐 <strong>saptarshighosh.dev</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                `
            };
            
            // Enhanced form submission using EmailJS or fallback
            sendEnhancedEmail(emailContent)
                .then(() => {
                    showModernFormStatus('success', 'Message sent successfully! I\'ll get back to you soon.');
                    contactForm.reset();
                    
                    // Reset form labels
                    const labels = contactForm.querySelectorAll('label');
                    labels.forEach(label => {
                        label.style.top = '1rem';
                        label.style.fontSize = '1rem';
                        label.style.color = 'rgba(255, 255, 255, 0.6)';
                        label.style.transform = 'scale(1)';
                    });
                    
                    // Add success animation
                    createModernSuccessEffect();
                })
                .catch((error) => {
                    showModernFormStatus('error', 'Failed to send message. Please try again or contact me directly.');
                })
                .finally(() => {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                });
        });
        
        // Enhanced form interactions for modern design
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            // Add modern focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                animateFormBorder(this);
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
            
            // Add input validation feedback
            input.addEventListener('input', function() {
                validateModernInput(this);
            });
        });
    }
    
    // Enhanced email sending function
    async function sendEnhancedEmail(emailData) {
        // Try EmailJS first (if configured)
        if (typeof emailjs !== 'undefined') {
            try {
                const result = await emailjs.send(
                    'service_loas8ko', // Your EmailJS service ID
                    'template_qpbtsb7', // Your EmailJS template ID
                    {
                        to_email: emailData.to,
                        from_name: emailData.from_name,
                        from_email: emailData.from,
                        subject: emailData.subject,
                        message: emailData.message,
                        html_message: emailData.html
                    }
                );
                return result;
            } catch (error) {
                // EmailJS failed, using fallback method
            }
        }
        
        // Fallback: Create mailto link (opens user's email client)
        const mailtoLink = `mailto:${emailData.to}?subject=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.message)}`;
        window.open(mailtoLink);
        
        // Simulate success for user experience
        return Promise.resolve();
    }
    
    // Modern form status display function
    function showModernFormStatus(type, message = '') {
        if (!formStatus) return;
        
        // Reset all status messages
        const statusMessages = formStatus.querySelectorAll('.status-message');
        statusMessages.forEach(msg => msg.classList.remove('show'));
        
        // Show appropriate status message
        const statusElement = formStatus.querySelector(`.status-message.${type}`);
        if (statusElement) {
            statusElement.classList.add('show');
            
            // Update message if provided
            if (message) {
                const messageSpan = statusElement.querySelector('span');
                if (messageSpan) {
                    messageSpan.textContent = message;
                }
            }
            
            // Auto-hide after delay
            setTimeout(() => {
                statusElement.classList.remove('show');
            }, 5000);
        }
    }
    
    // Animate form border on focus
    function animateFormBorder(input) {
        const formBorder = input.parentElement.querySelector('.form-border');
        if (formBorder) {
            formBorder.style.width = '100%';
        }
    }
    
    // Validate modern input
    function validateModernInput(input) {
        const value = input.value.trim();
        const inputGroup = input.parentElement;
        
        // Remove previous validation classes
        inputGroup.classList.remove('valid', 'invalid');
        
        // Basic validation
        if (value) {
            if (input.type === 'email') {
                if (isValidEmail(value)) {
                    inputGroup.classList.add('valid');
                } else {
                    inputGroup.classList.add('invalid');
                }
            } else {
                inputGroup.classList.add('valid');
            }
        }
    }
    
    // Create modern success effect
    function createModernSuccessEffect() {
        const container = document.querySelector('.contact-form-wrapper');
        if (!container) return;
        
        // Create success ripple effect
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            background: rgba(129, 199, 132, 0.3);
            border: 2px solid #81c784;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: successRipple 1s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;
        
        container.appendChild(ripple);
        
        // Create floating success particles
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 6px;
                height: 6px;
                background: #81c784;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
            `;
            
            container.appendChild(particle);
            
            // Animate particle
            const angle = (i / 8) * Math.PI * 2;
            const distance = 80 + Math.random() * 40;
            const duration = 800 + Math.random() * 400;
            
            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
                    opacity: 0.8
                },
                {
                    transform: `translate(${Math.cos(angle) * distance * 1.3}px, ${Math.sin(angle) * distance * 1.3}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => {
                particle.remove();
            };
        }
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Add scroll event listeners
    window.addEventListener('scroll', () => {
        setActiveNav();
        updateHeader();
        animateOnScroll();
    });

    // Add resize event listener
    window.addEventListener('resize', () => {
        // Close mobile menu on resize
        if (navMenu && navToggle) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('show');
            body.classList.remove('menu-open');
        }
    });

    // Initialize animations on page load
    animateOnScroll();
    updateHeader();

    // Smooth reveal animation for page load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });

    // Add hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add hover effects for certificate cards
    const certificateCards = document.querySelectorAll('.certificate-card');
    certificateCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.certificate-icon');
            icon.style.transform = 'scale(1.1)';
            icon.style.background = '#666666';
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.certificate-icon');
            icon.style.transform = 'scale(1)';
            icon.style.background = '#333333';
        });
    });

    // Add typing effect to section titles
    function animateSectionTitles() {
        const titles = document.querySelectorAll('.section-title');
        
        const titleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const title = entry.target;
                    const text = title.textContent;
                    title.textContent = '';
                    
                    let i = 0;
                    // Faster animation for About Me title, normal for others
                    const speed = title.classList.contains('animate-title') ? 50 : 100;
                    
                    const typeInterval = setInterval(() => {
                        title.textContent += text.charAt(i);
                        i++;
                        if (i >= text.length) {
                            clearInterval(typeInterval);
                            
                            // If this is the About Me title, trigger typewriter
                            if (title.classList.contains('animate-title')) {
                                setTimeout(() => {
                                    triggerTypewriter();
                                }, 300);
                            }
                        }
                    }, speed);
                    
                    titleObserver.unobserve(title);
                }
            });
        }, observerOptions);

        titles.forEach(title => {
            titleObserver.observe(title);
        });
    }

    // Initialize section title animations
    setTimeout(animateSectionTitles, 1000);

    // Add parallax effect to home section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const homeSection = document.querySelector('.home');
        
        if (homeSection) {
            homeSection.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });

    // Preloader (optional)
    function hidePreloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    hidePreloader();

    // Initialize image handling
    handleImageLoad();

    // Enhanced Education Animation
    function animateEducation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate');
                    }, index * 200);
                }
            });
        }, { threshold: 0.3 });

        timelineItems.forEach(item => observer.observe(item));
    }

    // Skills Constellation Animation
    function animateSkillsConstellation() {
        const skillsSection = document.querySelector('.skills');
        const floatingSkills = document.querySelectorAll('.floating-skill');
        const meterFills = document.querySelectorAll('.meter-fill');

        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Animate meter fills
                    meterFills.forEach((fill, index) => {
                        setTimeout(() => {
                            const targetWidth = fill.getAttribute('data-width');
                            fill.style.width = targetWidth;
                        }, index * 100);
                    });

                    // Add hover effects for skills
                    floatingSkills.forEach((skill, index) => {
                        skill.style.animationDelay = (index * 0.1) + 's';
                        skill.style.animation = 'skillFloat 3s ease-in-out infinite';
                    });
                }
            });
        }, { threshold: 0.5 });

        if (skillsSection) skillsObserver.observe(skillsSection);
    }

    // Legacy 3D Gallery functionality removed - using Creative Universe instead

    // Design Filter functionality
    function initDesignFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                // Here you can add filtering logic for design cards
            });
        });
    }

    // Enhanced Counter Animation for Design Stats
    function animateDesignCounters() {
        const designCounters = document.querySelectorAll('.design-stats .stat-number');
        const designSection = document.querySelector('.designs');
        
        const designObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    designCounters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000;
                        const increment = target / (duration / 16);
                        let current = 0;

                        const updateCounter = () => {
                            current += increment;
                            if (current >= target) {
                                counter.textContent = target + '+';
                            } else {
                                counter.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            }
                        };

                        updateCounter();
                    });
                    designObserver.unobserve(designSection);
                }
            });
        }, { threshold: 0.7 });

        if (designSection) designObserver.observe(designSection);
    }

    // Enhanced Scroll Indicator
    function enhanceScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                const aboutSection = document.getElementById('about');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }
    }

    // Category Card Interactions
    function initCategoryCards() {
        const categoryCards = document.querySelectorAll('.category-card');
        
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.getAttribute('data-category');
                // Add visual feedback
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = '';
                }, 150);
            });
        });
    }

    // Enhanced Navbar Scroll Effect
    function initNavbarScrollEffect() {
        const header = document.querySelector('.header');
        const navLinks = document.querySelectorAll('.nav-link');
        const navToggle = document.querySelector('.nav-toggle');
        const navCenter = document.querySelector('.nav-center');
        
        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle - handled by main navigation system above

        // Active nav link highlighting
        const sections = document.querySelectorAll('.section');
        
        function updateActiveNavLink() {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', updateActiveNavLink);
    }

    // Button Animation Enhancement
    function enhanceButtonAnimations() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect on click (disabled on smaller screens)
            button.addEventListener('click', function(e) {
                // Disable ripple effect on smaller screens (768px and below)
                if (window.innerWidth <= 768) return;
                
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Initialize all enhanced features
    setTimeout(() => {
        animateEducation();
        animateSkillsConstellation();
        // init3DGallery(); // Removed - using Creative Universe instead
        initDesignFilters();
        animateDesignCounters();
        enhanceScrollIndicator();
        initCategoryCards();
        initNavbarScrollEffect();
        enhanceButtonAnimations();
        // Initialize About section animations
        initAboutAnimations();
        // Initialize creative navbar
        initCreativeNavbar();
        // Initialize creative education timeline
        initEducationTimeline();
        // Initialize Interactive Background
        initInteractiveBackground();
        // Initialize Projects Interactive Background
        initProjectsInteractiveBackground();
        // Initialize Revolutionary Creative Universe
        initCreativeUniverse();
        // Initialize Modern Contact Section
        initModernContactSection();
        // Initialize AOS animations
        initAOSAnimations();
        // Initialize EmailJS
        initEmailJS();
    }, 1000);

    // Initialize all animations and effects
    } catch (error) {
        // Handle any initialization errors gracefully
        console.error('Error during portfolio initialization:', error);
        
        // Ensure basic functionality still works
        if (document.body) {
            document.body.classList.add('fallback-mode');
        }
    }
});

// Modern Contact Section Initialization
function initModernContactSection() {
    
    // Initialize Contact Cards Animation
    initContactCardsAnimation();
    
    // Initialize Interactive Background Effects
    initSubtleBackgroundEffects();
    
    // Initialize Form Interactions
    initModernFormInteractions();
    
    // Initialize Orb Click Effects
    initOrbClickEffects();
    
    // Initialize Memory Game
    initMemoryGame();
    
    // Initialize Game Teasers
    initGameTeasers();
}

// Contact Cards Animation
function initContactCardsAnimation() {
    const contactCards = document.querySelectorAll('.info-card');
    const socialLinks = document.querySelectorAll('.social-link');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Animate contact cards
    contactCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        cardObserver.observe(card);
    });
    
    // Animate social links with stagger
    socialLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateY(20px) scale(0.9)';
        link.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0) scale(1)';
        }, 1000 + index * 80);
    });
}

// Interactive Background Effects
function initSubtleBackgroundEffects() {
    const contactSection = document.querySelector('.modern-contact');
    if (!contactSection) return;
    
    let isMouseInSection = false;
    let lastCursorTrail = 0;
    
    // Enhanced mouse interaction
    contactSection.addEventListener('mousemove', (e) => {
        const rect = contactSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // Interactive parallax on background overlay
        const bgOverlay = contactSection.querySelector('.contact-bg-overlay');
        if (bgOverlay) {
            bgOverlay.style.transform = `translate(${x * 15}px, ${y * 15}px)`;
        }
        
        // Enhanced particle movement
        const particles = contactSection.querySelector('.contact-particles-subtle');
        if (particles) {
            particles.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        }
        
        // Interactive floating orbs
        const orbs = contactSection.querySelectorAll('.floating-orb');
        orbs.forEach((orb, index) => {
            const orbRect = orb.getBoundingClientRect();
            const orbCenterX = orbRect.left + orbRect.width / 2 - rect.left;
            const orbCenterY = orbRect.top + orbRect.height / 2 - rect.top;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - orbCenterX, 2) + Math.pow(mouseY - orbCenterY, 2)
            );
            
            const maxDistance = 150;
            const influence = Math.max(0, (maxDistance - distance) / maxDistance);
            
            if (influence > 0) {
                const moveX = (mouseX - orbCenterX) * influence * 0.3;
                const moveY = (mouseY - orbCenterY) * influence * 0.3;
                const scale = 1 + influence * 0.5;
                
                orb.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
                orb.style.opacity = 0.1 + influence * 0.15;
            } else {
                orb.style.transform = '';
                orb.style.opacity = '';
            }
        });
        
        // Interactive geometric shapes
        const shapes = contactSection.querySelectorAll('.geo-shape');
        shapes.forEach((shape, index) => {
            const shapeRect = shape.getBoundingClientRect();
            const shapeCenterX = shapeRect.left + shapeRect.width / 2 - rect.left;
            const shapeCenterY = shapeRect.top + shapeRect.height / 2 - rect.top;
            
            const distance = Math.sqrt(
                Math.pow(mouseX - shapeCenterX, 2) + Math.pow(mouseY - shapeCenterY, 2)
            );
            
            const maxDistance = 120;
            const influence = Math.max(0, (maxDistance - distance) / maxDistance);
            
            if (influence > 0) {
                const rotation = influence * 360;
                const scale = 1 + influence * 0.8;
                shape.style.transform = `rotate(${rotation}deg) scale(${scale})`;
                shape.style.opacity = 0.05 + influence * 0.2;
            } else {
                shape.style.transform = '';
                shape.style.opacity = '';
            }
        });
        
        // Enhanced connection lines response
        const lines = contactSection.querySelectorAll('.connection-line');
        lines.forEach((line, index) => {
            const lineRect = line.getBoundingClientRect();
            const lineCenterY = lineRect.top + lineRect.height / 2 - rect.top;
            
            const distance = Math.abs(mouseY - lineCenterY);
            const maxDistance = 100;
            const influence = Math.max(0, (maxDistance - distance) / maxDistance);
            
            if (influence > 0) {
                line.style.opacity = influence * 0.8;
                line.style.height = (1 + influence * 2) + 'px';
                line.style.boxShadow = `0 0 ${influence * 10}px rgba(255, 255, 255, ${influence * 0.3})`;
            } else {
                line.style.opacity = '';
                line.style.height = '';
                line.style.boxShadow = '';
            }
        });
        
        // Create touch effect for desktop interaction
        const now = Date.now();
        if (now - lastCursorTrail > 100) { // Throttle effect creation
            createInteractiveEffect(e.clientX, e.clientY);
            lastCursorTrail = now;
        }
    });
    
    // Enhanced mouse enter effect
    contactSection.addEventListener('mouseenter', () => {
        isMouseInSection = true;
        contactSection.style.background = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #0f0f0f 100%)';
        
        // Enhance orb visibility
        const orbs = contactSection.querySelectorAll('.floating-orb');
        orbs.forEach(orb => {
            orb.style.background = 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 70%)';
        });
    });
    
    // Reset on mouse leave
    contactSection.addEventListener('mouseleave', () => {
        isMouseInSection = false;
        
        // Reset background
        contactSection.style.background = '';
        
        // Reset all interactive elements
        const bgOverlay = contactSection.querySelector('.contact-bg-overlay');
        const particles = contactSection.querySelector('.contact-particles-subtle');
        const orbs = contactSection.querySelectorAll('.floating-orb');
        const shapes = contactSection.querySelectorAll('.geo-shape');
        const lines = contactSection.querySelectorAll('.connection-line');
        
        if (bgOverlay) bgOverlay.style.transform = '';
        if (particles) particles.style.transform = '';
        
        orbs.forEach(orb => {
            orb.style.transform = '';
            orb.style.opacity = '';
            orb.style.background = '';
        });
        
        shapes.forEach(shape => {
            shape.style.transform = '';
            shape.style.opacity = '';
        });
        
        lines.forEach(line => {
            line.style.opacity = '';
            line.style.height = '';
            line.style.boxShadow = '';
        });
    });
}

// Modern Form Interactions
function initModernFormInteractions() {
    const formGroups = document.querySelectorAll('.modern-contact-form .form-group');
    
    // Add enhanced form group animations
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 800 + index * 150);
        
        // Add hover effects
        const input = group.querySelector('input, textarea');
        if (input) {
            input.addEventListener('focus', () => {
                group.classList.add('focused');
                createFocusRipple(group);
            });
            
            input.addEventListener('blur', () => {
                group.classList.remove('focused');
            });
        }
    });
    
    // Animate submit button
    const submitBtn = document.querySelector('.submit-btn');
    if (submitBtn) {
        submitBtn.style.opacity = '0';
        submitBtn.style.transform = 'translateY(20px)';
        submitBtn.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            submitBtn.style.opacity = '1';
            submitBtn.style.transform = 'translateY(0)';
        }, 1200);
    }
}

// Create focus ripple effect
function createFocusRipple(formGroup) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4));
        transform: translateX(-50%);
        animation: focusRipple 0.3s ease-out forwards;
        pointer-events: none;
        z-index: 10;
    `;
    
    formGroup.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 300);
}

// Create interactive effect
function createInteractiveEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'touch-ripple';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    effect.style.width = '20px';
    effect.style.height = '20px';
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.remove();
        }
    }, 800);
}

// Enhanced orb and shape interaction on click
function initOrbClickEffects() {
    const orbs = document.querySelectorAll('.floating-orb');
    const shapes = document.querySelectorAll('.geo-shape');
    
    // Orb interactions
    orbs.forEach(orb => {
        orb.addEventListener('click', (e) => {
            e.stopPropagation();
            // Create ripple effect from orb (disabled on smaller screens)
            if (window.innerWidth > 768) {
                createOrbRipple(e.target);
            }
            
            // Create burst particles
            createOrbBurst(e.clientX, e.clientY);
        });
        
        // Make orbs interactive
        orb.style.cursor = 'pointer';
        orb.style.pointerEvents = 'auto';
    });
    
    // Shape interactions
    shapes.forEach(shape => {
        shape.addEventListener('click', (e) => {
            e.stopPropagation();
            // Create shape burst effect
            createShapeBurst(e.clientX, e.clientY, shape.classList[1]);
            
            // Add temporary glow effect
            shape.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.5)';
            setTimeout(() => {
                shape.style.boxShadow = '';
            }, 500);
        });
        
        // Make shapes interactive
        shape.style.cursor = 'pointer';
        shape.style.pointerEvents = 'auto';
    });
}

// Create orb ripple effect
function createOrbRipple(orb) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: orbRippleEffect 1s ease-out forwards;
        pointer-events: none;
        z-index: 1000;
    `;
    
    orb.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 1000);
}

// Create orb burst particles
function createOrbBurst(x, y) {
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle burst
        const angle = (i / 6) * Math.PI * 2;
        const distance = 60 + Math.random() * 40;
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
                opacity: 0.8
            },
            {
                transform: `translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Create shape burst particles
function createShapeBurst(x, y, shapeType) {
    const particleCount = shapeType === 'geo-triangle' ? 3 : 
                         shapeType === 'geo-square' ? 4 : 
                         shapeType === 'geo-hexagon' ? 6 : 5;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        
        // Create particles that match the shape
        let particleStyle = '';
        switch(shapeType) {
            case 'geo-triangle':
                particleStyle = `
                    width: 0;
                    height: 0;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-bottom: 10px solid rgba(255, 255, 255, 0.8);
                `;
                break;
            case 'geo-square':
                particleStyle = `
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.8);
                    transform: rotate(45deg);
                `;
                break;
            case 'geo-circle':
                particleStyle = `
                    width: 8px;
                    height: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                `;
                break;
            case 'geo-hexagon':
                particleStyle = `
                    width: 6px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.8);
                    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
                `;
                break;
            default:
                particleStyle = `
                    width: 6px;
                    height: 6px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 50%;
                `;
        }
        
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 1000;
            ${particleStyle}
        `;
        
        document.body.appendChild(particle);
        
        // Animate shape burst
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 40 + Math.random() * 30;
        const duration = 600 + Math.random() * 300;
        
        particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.2) rotate(${angle * 180 / Math.PI}deg)`,
                opacity: 0.9
            },
            {
                transform: `translate(${Math.cos(angle) * distance * 1.3}px, ${Math.sin(angle) * distance * 1.3}px) scale(0) rotate(${angle * 360 / Math.PI}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Add modern contact animation styles dynamically
function addModernContactAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes successRipple {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
        
        @keyframes focusRipple {
            0% {
                width: 0;
                opacity: 1;
            }
            100% {
                width: 100%;
                opacity: 0.8;
            }
        }
        
        .form-group.valid .form-border {
            background: linear-gradient(90deg, #81c784, #66bb6a) !important;
        }
        
        .form-group.invalid .form-border {
            background: linear-gradient(90deg, #e57373, #ef5350) !important;
        }
        
        .form-group.focused {
            transform: translateY(-2px);
        }
        
        @keyframes cardShimmer {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(100%);
            }
        }
        
        .info-card:hover::before {
            animation: cardShimmer 0.6s ease-out;
        }
        
        @keyframes socialPulse {
            0% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
            }
        }
        
        .social-link:hover {
            animation: socialPulse 1s ease-out;
        }
        
        @keyframes buttonGlow {
            0%, 100% {
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
            }
            50% {
                box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1);
            }
        }
        
        .submit-btn:hover {
            animation: buttonGlow 2s ease-in-out infinite;
        }
        
        @keyframes statusSlideUp {
            0% {
                transform: translateY(20px);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .status-message.show {
            animation: statusSlideUp 0.3s ease-out;
        }
        
        .modern-contact .highlight-text::after {
            animation: underlineGlow 2s ease-in-out infinite;
        }
        
        @keyframes underlineGlow {
            0%, 100% { 
                opacity: 0.3; 
                transform: scaleX(0.8);
            }
            50% { 
                opacity: 1; 
                transform: scaleX(1);
            }
        }
        
        @keyframes orbRippleEffect {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(4);
                opacity: 0;
            }
        }
        
        .floating-orb {
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .floating-orb:hover {
            transform: scale(1.1) !important;
            opacity: 0.2 !important;
        }
        
        .geometric-shapes .geo-shape {
            cursor: pointer;
        }
        
        .geometric-shapes .geo-shape:hover {
            opacity: 0.3 !important;
            animation-play-state: paused;
        }
        
        @keyframes urgentTimer {
            0%, 100% {
                transform: scale(1);
                color: #ff4757;
            }
            50% {
                transform: scale(1.1);
                color: #fff;
                text-shadow: 0 0 10px #ff4757;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize modern contact animations styles
addModernContactAnimationStyles();

// Memory Game Logic
function initMemoryGame() {
    const gameBoard = document.getElementById('game-board');
    const startBtn = document.getElementById('start-game');
    const resetBtn = document.getElementById('reset-game');
    const gameMessage = document.getElementById('game-message');
    const gameCompletion = document.getElementById('game-completion');
    const levelDisplay = document.getElementById('game-level');
    const scoreDisplay = document.getElementById('game-score');
    const livesDisplay = document.getElementById('game-lives');
    const timerDisplay = document.getElementById('game-timer');
    
    if (!gameBoard) return;
    
    let gameState = {
        sequence: [],
        playerSequence: [],
        level: 1,
        score: 0,
        lives: 3,
        isPlaying: false,
        isPlayerTurn: false,
        gameStarted: false,
        timeLimit: 0,
        timeRemaining: 0,
        timerInterval: null
    };
    
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const tiles = document.querySelectorAll('.game-tile');
    
    // Sound frequencies for each color (using Web Audio API)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sounds = {
        red: 329.63,    // E4
        blue: 261.63,   // C4
        green: 392.00,  // G4
        yellow: 440.00, // A4
        purple: 493.88, // B4
        orange: 523.25  // C5
    };
    
    // Play sound for tile
    function playSound(color, duration = 300) {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(sounds[color], audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }
    
    // Play error sound
    function playErrorSound() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.type = 'sawtooth';
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
    
    // Update game display
    function updateDisplay() {
        levelDisplay.textContent = gameState.level;
        scoreDisplay.textContent = gameState.score;
        
        const hearts = '❤️'.repeat(gameState.lives) + '💔'.repeat(3 - gameState.lives);
        livesDisplay.textContent = hearts;
        
        if (gameState.isPlayerTurn && gameState.timeLimit > 0) {
            timerDisplay.textContent = gameState.timeRemaining + 's';
        } else {
            timerDisplay.textContent = '--';
        }
    }
    
    // Start player timer
    function startPlayerTimer() {
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
        }
        
        // Calculate time limit based on level (gets shorter as level increases)
        gameState.timeLimit = Math.max(8 - gameState.level, 3) + gameState.sequence.length;
        gameState.timeRemaining = gameState.timeLimit;
        
        gameState.timerInterval = setInterval(() => {
            gameState.timeRemaining--;
            updateDisplay();
            
            // Add urgency visual effects
            if (gameState.timeRemaining <= 3) {
                timerDisplay.style.color = '#ff4757';
                timerDisplay.style.animation = 'urgentTimer 0.5s ease-in-out infinite';
            }
            
            if (gameState.timeRemaining <= 0) {
                clearInterval(gameState.timerInterval);
                timeUp();
            }
        }, 1000);
    }
    
    // Stop player timer
    function stopPlayerTimer() {
        if (gameState.timerInterval) {
            clearInterval(gameState.timerInterval);
            gameState.timerInterval = null;
        }
        timerDisplay.style.color = '#ffa726';
        timerDisplay.style.animation = '';
    }
    
    // Time up handler
    function timeUp() {
        gameState.lives--;
        gameState.isPlayerTurn = false;
        
        // Flash all tiles red to indicate time up
        tiles.forEach(tile => {
            tile.classList.add('wrong');
        });
        
        playErrorSound();
        
        setTimeout(() => {
            tiles.forEach(tile => {
                tile.classList.remove('wrong');
            });
        }, 500);
        
        if (gameState.lives <= 0) {
            gameOver();
        } else {
            gameMessage.innerHTML = `<p>⏰ Time's up! ${gameState.lives} lives remaining</p>`;
            setTimeout(() => {
                showSequence();
            }, 1500);
        }
        
        updateDisplay();
    }
    
    // Flash tile animation
    function flashTile(tile, duration = 400) {
        return new Promise(resolve => {
            const color = tile.dataset.color;
            tile.classList.add('active');
            playSound(color, duration);
            
            setTimeout(() => {
                tile.classList.remove('active');
                setTimeout(resolve, 50);
            }, duration);
        });
    }
    
    // Show sequence to player
    async function showSequence() {
        gameState.isPlayerTurn = false;
        stopPlayerTimer();
        gameMessage.innerHTML = '<p>🧠 Watch carefully...</p>';
        
        // Calculate delays that get faster as level increases
        const baseDelay = Math.max(300 - (gameState.level * 30), 100);
        const flashDuration = Math.max(500 - (gameState.level * 40), 250);
        
        for (let i = 0; i < gameState.sequence.length; i++) {
            await new Promise(resolve => setTimeout(resolve, baseDelay));
            const colorIndex = gameState.sequence[i];
            const tile = tiles[colorIndex];
            await flashTile(tile, flashDuration);
        }
        
        gameState.isPlayerTurn = true;
        gameState.playerSequence = [];
        gameMessage.innerHTML = '<p>⚡ Your turn! Beat the timer!</p>';
        
        // Start the countdown timer
        startPlayerTimer();
    }
    
    // Add new step to sequence
    function addSequenceStep() {
        const randomColor = Math.floor(Math.random() * colors.length);
        gameState.sequence.push(randomColor);
    }
    
    // Check player input
    function checkPlayerInput(colorIndex) {
        const currentStep = gameState.playerSequence.length - 1;
        
        if (gameState.sequence[currentStep] === colorIndex) {
            // Correct!
            if (gameState.playerSequence.length === gameState.sequence.length) {
                // Level completed!
                stopPlayerTimer();
                gameState.score += gameState.level * 15; // More points per level
                gameState.level++;
                
                if (gameState.level > 8) {
                    // Game completed!
                    gameWon();
                } else {
                    setTimeout(() => {
                        gameMessage.innerHTML = `<p>🎉 Level ${gameState.level - 1} Complete! Speed increases...</p>`;
                        setTimeout(nextLevel, 1000);
                    }, 500);
                }
            }
        } else {
            // Wrong!
            stopPlayerTimer();
            gameState.lives--;
            const tile = tiles[colorIndex];
            tile.classList.add('wrong');
            playErrorSound();
            
            setTimeout(() => {
                tile.classList.remove('wrong');
            }, 500);
            
            if (gameState.lives <= 0) {
                gameOver();
            } else {
                gameMessage.innerHTML = `<p>❌ Wrong! ${gameState.lives} lives remaining. Focus harder!</p>`;
                setTimeout(() => {
                    showSequence();
                }, 1500);
            }
        }
        
        updateDisplay();
    }
    
    // Next level
    function nextLevel() {
        addSequenceStep();
        setTimeout(showSequence, 500);
    }
    
    // Game won
    function gameWon() {
        gameState.isPlaying = false;
        gameState.isPlayerTurn = false;
        stopPlayerTimer();
        
        gameMessage.innerHTML = '<p>🏆 ELITE COMPLETED! You mastered all 8 levels!</p>';
        gameCompletion.style.display = 'block';
        resetBtn.style.display = 'inline-flex';
        
        // Add celebration effect
        createGameCelebration();
    }
    
    // Game over
    function gameOver() {
        gameState.isPlaying = false;
        gameState.isPlayerTurn = false;
        stopPlayerTimer();
        
        gameMessage.innerHTML = `<p>💀 Game Over! Final Score: ${gameState.score}</p>`;
        resetBtn.style.display = 'inline-flex';
        
        // Show completion if score is decent (higher threshold due to increased difficulty)
        if (gameState.score >= 60) {
            setTimeout(() => {
                gameCompletion.style.display = 'block';
            }, 1000);
        }
    }
    
    // Start new game
    function startGame() {
        // Resume audio context if needed
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        gameState = {
            sequence: [],
            playerSequence: [],
            level: 1,
            score: 0,
            lives: 3,
            isPlaying: true,
            isPlayerTurn: false,
            gameStarted: true,
            timeLimit: 0,
            timeRemaining: 0,
            timerInterval: null
        };
        
        gameCompletion.style.display = 'none';
        startBtn.style.display = 'none';
        resetBtn.style.display = 'none';
        
        updateDisplay();
        addSequenceStep();
        
        setTimeout(() => {
            showSequence();
        }, 500);
    }
    
    // Reset game
    function resetGame() {
        stopPlayerTimer();
        
        gameState = {
            sequence: [],
            playerSequence: [],
            level: 1,
            score: 0,
            lives: 3,
            isPlaying: false,
            isPlayerTurn: false,
            gameStarted: false,
            timeLimit: 0,
            timeRemaining: 0,
            timerInterval: null
        };
        
        gameCompletion.style.display = 'none';
        startBtn.style.display = 'inline-flex';
        resetBtn.style.display = 'none';
        gameMessage.innerHTML = '<p>Press "Start Game" to begin the elite challenge!</p>';
        
        updateDisplay();
    }
    
    // Create celebration effect
    function createGameCelebration() {
        const colors = ['#ff4757', '#3742fa', '#5f27cd', '#feca57', '#9c27b0', '#ff9800'];
        
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                document.body.appendChild(particle);
                
                const angle = (Math.random() * 360) * (Math.PI / 180);
                const distance = 100 + Math.random() * 100;
                const duration = 1000 + Math.random() * 500;
                
                particle.animate([
                    {
                        transform: 'translate(-50%, -50%) scale(0)',
                        opacity: 1
                    },
                    {
                        transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
                        opacity: 0.8
                    },
                    {
                        transform: `translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0)`,
                        opacity: 0
                    }
                ], {
                    duration: duration,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                }).onfinish = () => {
                    particle.remove();
                };
            }, i * 50);
        }
    }
    
    // Event listeners
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);
    
    // Tile click handlers
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => {
            if (!gameState.isPlayerTurn || !gameState.isPlaying) return;
            
            const color = tile.dataset.color;
            gameState.playerSequence.push(index);
            
            // Visual feedback
            flashTile(tile, 200);
            
            // Check input after animation
            setTimeout(() => {
                checkPlayerInput(index);
            }, 300);
        });
        
        // Prevent context menu on right click
        tile.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    });
    
    // Initialize display
    updateDisplay();
}

// Initialize Game Teasers and Interactive Elements
function initGameTeasers() {
    // Animate counter numbers on scroll into view
    function animateCounters() {
        const counters = document.querySelectorAll('.teaser-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // Start animation with a slight delay for each counter
            setTimeout(() => {
                updateCounter();
            }, Math.random() * 500);
        });
    }
    
    // Intersection Observer for counter animation
    const gameSection = document.querySelector('.contact-game-section');
    if (gameSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(gameSection);
    }
    
    // Dare button functionality
    const dareButton = document.getElementById('dare-button');
    const startGameBtn = document.getElementById('start-game');
    
    if (dareButton && startGameBtn) {
        dareButton.addEventListener('click', () => {
            // Create excitement particle burst
            createDareParticleBurst(dareButton);
            
            // Scroll to game and auto-start
            setTimeout(() => {
                const gameBoard = document.getElementById('game-board');
                if (gameBoard) {
                    gameBoard.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                    
                    // Auto-start game after scroll
                    setTimeout(() => {
                        if (startGameBtn.style.display !== 'none') {
                            startGameBtn.click();
                        }
                    }, 800);
                }
            }, 200);
        });
        
        // Hover effects for dare button
        dareButton.addEventListener('mouseenter', () => {
            dareButton.style.transform = 'translateY(-5px) scale(1.05)';
            createDareHoverEffect(dareButton);
        });
        
        dareButton.addEventListener('mouseleave', () => {
            dareButton.style.transform = '';
        });
    }
    
    // Interactive stat teasers
    const statTeasers = document.querySelectorAll('.stat-teaser');
    statTeasers.forEach((teaser, index) => {
        teaser.addEventListener('click', () => {
            // Create mini explosion
            createStatTeaserEffect(teaser);
            
            // Show tooltip-like messages
            const messages = [
                "Most people quit at level 5! 😰",
                "Lightning fast reflexes needed! ⚡",
                "6 colors = 6x the challenge! 🌈"
            ];
            
            showTeaserMessage(teaser, messages[index]);
        });
        
        // Add pulsing effect on hover
        teaser.addEventListener('mouseenter', () => {
            teaser.style.animation = 'teaserPulse 0.6s ease-in-out infinite';
        });
        
        teaser.addEventListener('mouseleave', () => {
            teaser.style.animation = '';
        });
    });
}

// Create dare button particle burst
function createDareParticleBurst(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 6px;
            height: 6px;
            background: #ff4757;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 12) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const duration = 800 + Math.random() * 400;
        
        particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.5)`,
                opacity: 0.8
            },
            {
                transform: `translate(${Math.cos(angle) * distance * 1.2}px, ${Math.sin(angle) * distance * 1.2}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Create dare hover effect
function createDareHoverEffect(element) {
    const rect = element.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        const spark = document.createElement('div');
        spark.style.cssText = `
            position: fixed;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            width: 3px;
            height: 3px;
            background: #ffffff;
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
        `;
        
        document.body.appendChild(spark);
        
        spark.animate([
            { opacity: 1, transform: 'scale(0)' },
            { opacity: 0.8, transform: 'scale(1.5)' },
            { opacity: 0, transform: 'scale(0)' }
        ], {
            duration: 600,
            easing: 'ease-out'
        }).onfinish = () => {
            spark.remove();
        };
    }
}

// Create stat teaser effect
function createStatTeaserEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 4px;
            height: 4px;
            background: #ff4757;
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 6) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        
        particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
                opacity: 0
            }
        ], {
            duration: 500,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Show teaser message
function showTeaserMessage(element, message) {
    const tooltip = document.createElement('div');
    tooltip.style.cssText = `
        position: fixed;
        background: rgba(255, 69, 87, 0.95);
        color: white;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 0.9rem;
        font-weight: 600;
        z-index: 1001;
        pointer-events: none;
        white-space: nowrap;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    tooltip.textContent = message;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
    
    tooltip.animate([
        { opacity: 0, transform: 'translateY(10px) scale(0.8)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
        { opacity: 1, transform: 'translateY(0) scale(1)' },
        { opacity: 0, transform: 'translateY(-10px) scale(0.8)' }
    ], {
        duration: 2500,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }).onfinish = () => {
        tooltip.remove();
    };
}

// Initialize AOS animations
function initAOSAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            delay: 100
        });
    }
}

// Initialize EmailJS
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        // Initialize EmailJS with your public key
        emailjs.init("rOPElA2pm0xrCAtmn");
    }
}

// Add custom cursor effect (optional)
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Add performance optimization
let ticking = false;

function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Scroll-based animations go here
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Global typewriter trigger function
let typewriterTriggered = false;

function triggerTypewriter() {
    if (typewriterTriggered) return;
    typewriterTriggered = true;
    
    const typewriterText = document.getElementById('typewriter-text');
    const fullText = "I'm Saptarshi Ghosh, a Final-year B.Tech CSE (AI/ML) student at UEM Kolkata with a CGPA of 8.46. I'm passionate about developing cutting-edge AI solutions and creating impactful designs. As a Vice Chancellor's Award recipient and Lead Designer for Ureckon fest, I combine technical excellence with creative innovation to solve real-world problems through technology.";
    
    if (typewriterText) {
        let charIndex = 0;
        let typingSpeed = 50;
        let displayText = '';
        
        // Clear any existing text
        typewriterText.textContent = '';
        
        function typeText() {
            if (charIndex < fullText.length) {
                const currentChar = fullText.charAt(charIndex);
                displayText += currentChar;
                
                // Show text with blinking cursor while typing
                typewriterText.innerHTML = displayText + '<span class="typing-cursor">|</span>';
                
                charIndex++;
                
                // Vary typing speed for more realistic effect
                let nextDelay = typingSpeed;
                if (currentChar === '.' || currentChar === ',') {
                    nextDelay = typingSpeed * 3; // Pause at punctuation
                } else if (currentChar === ' ') {
                    nextDelay = typingSpeed * 0.5; // Slightly faster for spaces
                }
                
                setTimeout(typeText, nextDelay);
            } else {
                // Remove cursor when typing is complete
                setTimeout(() => {
                    typewriterText.innerHTML = displayText;
                }, 1500);
            }
        }
        
        typeText();
    }
}

// Interactive About Section Functions
function initAboutAnimations() {
    
    // Progress Bar Animations
    const progressBars = document.querySelectorAll('.progress-bar');
    
    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.getAttribute('data-progress');
                    setTimeout(() => {
                        progressBar.style.width = progress + '%';
                    }, 200);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }
    
    // Tilt Effect for Interactive Cards
    const interactiveCards = document.querySelectorAll('[data-tilt]');
    
    interactiveCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            try {
                const cardRect = card.getBoundingClientRect();
                const cardCenterX = cardRect.left + cardRect.width / 2;
                const cardCenterY = cardRect.top + cardRect.height / 2;
                
                const mouseX = e.clientX - cardCenterX;
                const mouseY = e.clientY - cardCenterY;
                
                const rotateX = (mouseY / cardRect.height) * -10;
                const rotateY = (mouseX / cardRect.width) * 10;
                
                card.style.transform = `translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            } catch (error) {
                console.log('Tilt animation error:', error);
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
        });
    });
    
    // Badge Interaction
    const badgeItems = document.querySelectorAll('.badge-item');
    badgeItems.forEach((badge, index) => {
        badge.addEventListener('click', () => {
            // Add special click animation
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = 'badgeBounce 0.6s ease-out';
            }, 10);
            
            // Show tooltip longer on click
            const tooltip = badge.getAttribute('data-tooltip');
            if (tooltip) {
                showCustomTooltip(badge, tooltip, 3000);
            }
        });
    });
    
    // Interactive Image Effects
    const interactiveImage = document.querySelector('.interactive-image');
    if (interactiveImage) {
        interactiveImage.addEventListener('click', () => {
            // Create sparkle effect on click
            createSparkleEffect(interactiveImage);
        });
    }
    
    // Floating Stats Animation
    const statBubbles = document.querySelectorAll('.stat-bubble');
    statBubbles.forEach((bubble, index) => {
        bubble.addEventListener('mouseenter', () => {
            // Add extra float animation
            bubble.style.animation = `float 1s ease-in-out infinite, extraFloat 0.3s ease-out forwards`;
        });
        
        bubble.addEventListener('mouseleave', () => {
            bubble.style.animation = `float 3s ease-in-out infinite ${index}s`;
        });
    });
}

// Helper Functions
function showCustomTooltip(element, text, duration = 2000) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.8rem;
        z-index: 1000;
        pointer-events: none;
        white-space: nowrap;
        transform: translateY(-100%);
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    element.style.position = 'relative';
    element.appendChild(tooltip);
    
    // Position tooltip
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.top = '-45px';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // Remove tooltip
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 300);
    }, duration);
}

function createSparkleEffect(container) {
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: linear-gradient(45deg, #ffd700, #ffffff);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        const rect = container.getBoundingClientRect();
        const x = Math.random() * rect.width;
        const y = Math.random() * rect.height;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        
        container.appendChild(sparkle);
        
        // Animate sparkle
        sparkle.animate([
            { transform: 'scale(0) rotate(0deg)', opacity: 1 },
            { transform: 'scale(1.5) rotate(180deg)', opacity: 0.8 },
            { transform: 'scale(0) rotate(360deg)', opacity: 0 }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => {
            sparkle.remove();
        };
    }
}

// Creative Navbar Functions
function initCreativeNavbar() {
    console.log('Initializing creative navbar...');
    
    // Scroll progress bar
    const progressBar = document.querySelector('.progress-bar-nav');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = scrollPercent + '%';
        }
    });
    
    // Active nav link highlighting
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Add ripple effect
            const ripple = document.querySelector('.theme-ripple');
            ripple.style.width = '60px';
            ripple.style.height = '60px';
            
            setTimeout(() => {
                ripple.style.width = '0';
                ripple.style.height = '0';
            }, 400);
            
            // Toggle theme icon
            if (themeIcon.textContent === '🌙') {
                themeIcon.textContent = '☀️';
            } else {
                themeIcon.textContent = '🌙';
            }
        });
    }
    
    // Navigation system is handled above - no duplicate handlers needed
    
    console.log('Creative navbar initialized successfully!');
}

// Creative Education Timeline Functions
function initEducationTimeline() {
    console.log('Initializing creative education timeline...');
    
    // Progress bar animation
    const progressFill = document.getElementById('education-progress');
    if (progressFill) {
        // Animate progress to 75% (currently in 3rd year)
        setTimeout(() => {
            progressFill.style.width = '75%';
        }, 1000);
    } else {
        console.log('Warning: Education progress bar not found');
    }
    
    // Timeline milestone animations
    const milestones = document.querySelectorAll('.timeline-milestone');
    
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Add special animation for milestone cards
                const card = entry.target.querySelector('.milestone-card');
                if (card) {
                    setTimeout(() => {
                        card.style.transform = 'translateY(0)';
                        card.style.opacity = '1';
                    }, 300);
                }
                
                timelineObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    });
    
    milestones.forEach(milestone => {
        timelineObserver.observe(milestone);
    });
    
    // Animate growth chart bars
    const growthBars = document.querySelectorAll('.growth-bar');
    
    const growthObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bars = entry.target.querySelectorAll('.growth-bar');
                bars.forEach((bar, index) => {
                    setTimeout(() => {
                        const growth = bar.getAttribute('data-growth');
                        bar.style.height = growth + '%';
                    }, index * 200);
                });
                growthObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const growthChart = document.querySelector('.growth-chart');
    if (growthChart) {
        growthObserver.observe(growthChart);
    }
    
    // Subject bubble interactions
    const subjectBubbles = document.querySelectorAll('.subject-bubble');
    
    subjectBubbles.forEach(bubble => {
        bubble.addEventListener('mouseenter', () => {
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(100, 255, 218, 0.3), transparent);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: subjectRipple 0.6s ease-out;
                pointer-events: none;
                z-index: -1;
            `;
            
            bubble.style.position = 'relative';
            bubble.appendChild(ripple);
            
            setTimeout(() => {
                if (bubble.contains(ripple)) {
                    bubble.removeChild(ripple);
                }
            }, 600);
        });
    });
    
    // Milestone marker interactions
    const milestoneMarkers = document.querySelectorAll('.milestone-marker');
    
    milestoneMarkers.forEach(marker => {
        marker.addEventListener('mouseenter', () => {
            // Enhance pulse animation
            const pulse = marker.querySelector('.marker-pulse');
            if (pulse) {
                pulse.style.animation = 'markerPulse 1s ease-in-out infinite';
            }
        });
        
        marker.addEventListener('mouseleave', () => {
            const pulse = marker.querySelector('.marker-pulse');
            if (pulse) {
                pulse.style.animation = 'markerPulse 3s ease-in-out infinite';
            }
        });
    });
    
    // Dashboard insight cards animation
    const insightCards = document.querySelectorAll('.insight-card');
    
    const insightObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
                insightObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    insightCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        insightObserver.observe(card);
    });
    
    // Add particle trail to timeline path
    createTimelineParticles();
    
    console.log('Creative education timeline initialized successfully!');
}

// Timeline particle effects
function createTimelineParticles() {
    const timelinePath = document.querySelector('.path-line');
    if (!timelinePath) return;
    
    setInterval(() => {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #64ffda, transparent);
            border-radius: 50%;
            left: 50%;
            top: 0;
            transform: translateX(-50%);
            animation: timelineParticleMove 3s ease-in-out forwards;
            pointer-events: none;
            z-index: 1;
        `;
        
        timelinePath.appendChild(particle);
        
        setTimeout(() => {
            if (timelinePath.contains(particle)) {
                timelinePath.removeChild(particle);
            }
        }, 3000);
        
    }, 2000);
}

// CSS Animations added via JavaScript
const additionalStyles = `
@keyframes subjectRipple {
    0% { width: 0; height: 0; opacity: 1; }
    100% { width: 60px; height: 60px; opacity: 0; }
}

@keyframes timelineParticleMove {
    0% { 
        top: 0; 
        opacity: 0; 
        transform: translateX(-50%) scale(0.5);
    }
    20% { 
        opacity: 1; 
        transform: translateX(-50%) scale(1);
    }
    80% { 
        opacity: 1; 
        transform: translateX(-50%) scale(1);
    }
    100% { 
        top: 100%; 
        opacity: 0; 
        transform: translateX(-50%) scale(0.5);
    }
}
@keyframes badgeBounce {
    0%, 100% { transform: scale(1) rotateY(0deg); }
    25% { transform: scale(1.2) rotateY(90deg); }
    75% { transform: scale(1.1) rotateY(270deg); }
}

@keyframes extraFloat {
    0% { transform: translateY(0px); }
    100% { transform: translateY(-15px); }
}
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Interactive Background System
function initInteractiveBackground() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let connectionLines = [];

    // Canvas setup
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.pulse = Math.random() * 0.02 + 0.01;
            this.pulseDirection = 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Pulse effect
            this.opacity += this.pulse * this.pulseDirection;
            if (this.opacity >= 0.7 || this.opacity <= 0.1) {
                this.pulseDirection *= -1;
            }

            // Attract to mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.vx += dx * force * 0.0001;
                this.vy += dy * force * 0.0001;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
            ctx.fill();
            
            // Add glow effect
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#00ffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.2, this.size * 0.5), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Create particles
    function createParticles() {
        particles = [];
        const particleCount = Math.min(50, Math.floor(canvas.width * canvas.height / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    // Draw connections
    function drawConnections() {
        particles.forEach((particle, i) => {
            // Connect to nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[j].x - particle.x;
                const dy = particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.save();
                    const opacity = (100 - distance) / 100 * 0.2;
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }

            // Connect to mouse
            const dx = mouse.x - particle.x;
            const dy = mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.save();
                const opacity = (120 - distance) / 120 * 0.4;
                ctx.globalAlpha = opacity;
                ctx.strokeStyle = '#00ffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                ctx.restore();
            }
        });
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        drawConnections();
        requestAnimationFrame(animate);
    }

    // Mouse movement
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Touch support
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    });

    // Initialize
    createParticles();
    animate();

    // Grid interaction
    const techGrid = document.querySelector('.tech-grid');
    if (techGrid) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / canvas.width) * 100;
            const y = ((e.clientY - rect.top) / canvas.height) * 100;
            
            techGrid.style.background = `
                linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                radial-gradient(circle at ${x}% ${y}%, rgba(0, 255, 255, 0.1) 0%, transparent 50%)
            `;
        });

        canvas.addEventListener('mouseleave', () => {
            techGrid.style.background = `
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `;
        });
    }
}

// Projects Interactive Background System
function initProjectsInteractiveBackground() {
    const canvas = document.getElementById('projectsCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let codeParticles = [];
    let dataNodes = [];
    let mouse = { x: 0, y: 0 };

    // Canvas setup
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Code Particle class
    class CodeParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.color = Math.random() > 0.5 ? '#666666' : '#888888';
            this.shape = Math.floor(Math.random() * 3); // 0: circle, 1: square, 2: triangle
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse attraction
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                this.vx += dx * force * 0.0002;
                this.vy += dy * force * 0.0002;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            if (this.shape === 0) {
                // Circle
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(0.5, this.size), 0, Math.PI * 2);
                ctx.fill();
            } else if (this.shape === 1) {
                // Square
                ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
            } else {
                // Triangle
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.size);
                ctx.lineTo(this.x - this.size, this.y + this.size);
                ctx.lineTo(this.x + this.size, this.y + this.size);
                ctx.closePath();
                ctx.fill();
            }
            
            ctx.restore();
        }
    }

    // Data Node class
    class DataNode {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 4 + 2;
            this.pulseSpeed = Math.random() * 0.05 + 0.02;
            this.pulse = 0;
            this.connections = [];
        }

        update() {
            this.pulse += this.pulseSpeed;
        }

        draw() {
            ctx.save();
            
            // Main node
            const pulseSize = Math.max(0.5, this.size + Math.sin(this.pulse) * 2);
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = '#777777';
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Outer ring
            ctx.globalAlpha = 0.2;
            ctx.strokeStyle = '#555555';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(1, pulseSize + 5), 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.restore();
        }
    }

    // Create particles and nodes
    function createParticles() {
        codeParticles = [];
        dataNodes = [];
        
        const particleCount = Math.min(30, Math.floor(canvas.width * canvas.height / 20000));
        const nodeCount = Math.min(8, Math.floor(canvas.width * canvas.height / 80000));
        
        for (let i = 0; i < particleCount; i++) {
            codeParticles.push(new CodeParticle());
        }
        
        for (let i = 0; i < nodeCount; i++) {
            dataNodes.push(new DataNode());
        }
    }

    // Draw connections between nodes
    function drawConnections() {
        dataNodes.forEach((node, i) => {
            for (let j = i + 1; j < dataNodes.length; j++) {
                const dx = dataNodes[j].x - node.x;
                const dy = dataNodes[j].y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 200) {
                    ctx.save();
                    const opacity = (200 - distance) / 200 * 0.3;
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = '#555555';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([5, 10]);
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(dataNodes[j].x, dataNodes[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        });
    }

    // Draw data streams
    function drawDataStreams() {
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 5; i++) {
            const x = (i / 4) * canvas.width;
            const streamHeight = Math.sin(time + i) * 20 + 30;
            
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = '#444444';
            ctx.lineWidth = 2;
            ctx.setLineDash([10, 5]);
            ctx.lineDashOffset = -time * 50;
            
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, streamHeight);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, canvas.height - streamHeight);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
            
            ctx.restore();
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw data streams
        drawDataStreams();
        
        // Update and draw particles
        codeParticles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        // Update and draw nodes
        dataNodes.forEach(node => {
            node.update();
            node.draw();
        });

        // Draw connections
        drawConnections();

        requestAnimationFrame(animate);
    }

    // Mouse events
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Touch events
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    });

    // Initialize
    createParticles();
    animate();

    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
            // Create particle burst effect
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const particle = new CodeParticle();
                    particle.x = Math.random() * canvas.width;
                    particle.y = Math.random() * canvas.height;
                    particle.color = '#777777';
                    particle.size = 3;
                    codeParticles.push(particle);
                    
                    // Remove after animation
                    setTimeout(() => {
                        const idx = codeParticles.indexOf(particle);
                        if (idx > -1) codeParticles.splice(idx, 1);
                    }, 3000);
                }, i * 100);
            }
        });
    });

    // Stats animation for projects section
    const projectsSection = document.querySelector('.projects');
    const statNumbers = document.querySelectorAll('.projects-stats .stat-number');
    
    const projectsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateStat = () => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target + (target === 85 ? '%' : '');
                        } else {
                            stat.textContent = Math.floor(current);
                            requestAnimationFrame(updateStat);
                        }
                    };

                    updateStat();
                });
                projectsObserver.unobserve(projectsSection);
            }
        });
    }, { threshold: 0.3 });

    if (projectsSection) projectsObserver.observe(projectsSection);
}

// REVOLUTIONARY CREATIVE UNIVERSE SYSTEM
function initCreativeUniverse() {
    console.log('Initializing Creative Universe...');
    const canvas = document.getElementById('universeCanvas');
    if (!canvas) {
        console.log('Warning: Universe canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    let universeParticles = [];
    let neuralNodes = [];
    let energyWaves = [];
    let mouse = { x: 0, y: 0 };
    let time = 0;

    // Canvas setup
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Universe Particle class
    class UniverseParticle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 3 + 1;
            this.opacity = Math.random() * 0.8 + 0.2;
            this.color = this.getRandomColor();
            this.trail = [];
            this.maxTrail = 8;
            this.energy = Math.random() * 100;
            this.frequency = Math.random() * 0.02 + 0.01;
        }

        getRandomColor() {
            const colors = ['#ffffff', '#f8f8ff', '#e6e6fa', '#dcdcdc'];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            // Store trail with energy
            this.trail.push({ 
                x: this.x, 
                y: this.y, 
                energy: this.energy 
            });
            if (this.trail.length > this.maxTrail) {
                this.trail.shift();
            }

            // Energy-based movement
            this.energy += Math.sin(time * this.frequency) * 2;
            this.x += this.vx + Math.sin(this.energy * 0.01) * 0.5;
            this.y += this.vy + Math.cos(this.energy * 0.01) * 0.5;

            // Quantum tunneling effect
            if (this.x < -50) this.x = canvas.width + 50;
            if (this.x > canvas.width + 50) this.x = -50;
            if (this.y < -50) this.y = canvas.height + 50;
            if (this.y > canvas.height + 50) this.y = -50;

            // Mouse quantum entanglement
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150;
                this.vx += dx * force * 0.0005;
                this.vy += dy * force * 0.0005;
                this.energy += force * 10;
            }
        }

        draw() {
            // Draw quantum trail
            this.trail.forEach((point, index) => {
                ctx.save();
                const alpha = (index / this.trail.length) * this.opacity * 0.4;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.beginPath();
                ctx.arc(point.x, point.y, Math.max(0.3, this.size * 0.6), 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });

            // Draw main particle with energy field
            ctx.save();
            ctx.globalAlpha = this.opacity;
            
            // Energy field
            const energyRadius = Math.max(0.5, this.size + Math.sin(this.energy * 0.05) * 3);
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, energyRadius, 0, Math.PI * 2);
            ctx.fill();
            
            // Core particle
            ctx.shadowBlur = 5;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(0.2, this.size * 0.5), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Neural Node class
    class NeuralNode {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 6 + 3;
            this.pulseSpeed = Math.random() * 0.03 + 0.01;
            this.pulse = 0;
            this.connections = [];
            this.energy = 0;
        }

        update() {
            this.pulse += this.pulseSpeed;
            this.energy = Math.sin(this.pulse) * 50 + 50;
        }

        draw() {
            ctx.save();
            
            // Neural core
            const pulseSize = Math.max(0.5, this.size + Math.sin(this.pulse) * 3);
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = '#ffffff';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ffffff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Energy rings
            for (let i = 1; i <= 3; i++) {
                ctx.globalAlpha = 0.3 / i;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.arc(this.x, this.y, Math.max(1, pulseSize + (i * 10)), 0, Math.PI * 2);
                ctx.stroke();
            }
            
            ctx.restore();
        }
    }

    // Energy Wave class
    class EnergyWave {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = 0;
            this.maxRadius = Math.random() * 200 + 100;
            this.speed = Math.random() * 2 + 1;
            this.opacity = 1;
        }

        update() {
            this.radius += this.speed;
            this.opacity = 1 - (this.radius / this.maxRadius);
            
            if (this.radius >= this.maxRadius) {
                this.radius = 0;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.opacity = 1;
            }
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity * 0.3;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 10]);
            ctx.lineDashOffset = -time * 0.1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, Math.max(1, this.radius), 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    // Create universe elements
    function createUniverse() {
        universeParticles = [];
        neuralNodes = [];
        energyWaves = [];
        
        const particleCount = Math.min(40, Math.floor(canvas.width * canvas.height / 20000));
        const nodeCount = Math.min(12, Math.floor(canvas.width * canvas.height / 60000));
        const waveCount = 5;
        
        for (let i = 0; i < particleCount; i++) {
            universeParticles.push(new UniverseParticle());
        }
        
        for (let i = 0; i < nodeCount; i++) {
            neuralNodes.push(new NeuralNode());
        }
        
        for (let i = 0; i < waveCount; i++) {
            energyWaves.push(new EnergyWave());
        }
    }

    // Draw neural connections
    function drawNeuralConnections() {
        neuralNodes.forEach((node, i) => {
            for (let j = i + 1; j < neuralNodes.length; j++) {
                const dx = neuralNodes[j].x - node.x;
                const dy = neuralNodes[j].y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 250) {
                    ctx.save();
                    const opacity = (250 - distance) / 250 * 0.4;
                    ctx.globalAlpha = opacity;
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.setLineDash([3, 6]);
                    ctx.lineDashOffset = -time * 0.05;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(neuralNodes[j].x, neuralNodes[j].y);
                    ctx.stroke();
                    ctx.restore();
                }
            }
        });
    }

    // Draw quantum field
    function drawQuantumField() {
        const fieldTime = time * 0.01;
        
        for (let x = 0; x < canvas.width; x += 100) {
            for (let y = 0; y < canvas.height; y += 100) {
                const wave = Math.sin(x * 0.01 + fieldTime) * Math.cos(y * 0.01 + fieldTime);
                const intensity = (wave + 1) * 0.5;
                
                ctx.save();
                ctx.globalAlpha = intensity * 0.1;
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
    }

    // Animation loop
    function animate() {
        try {
            time += 1;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw quantum field
        drawQuantumField();
        
        // Update and draw energy waves
        energyWaves.forEach(wave => {
            wave.update();
            wave.draw();
        });

        // Update and draw particles with safety checks
        universeParticles.forEach((particle, index) => {
            try {
                // Safety check for particle properties
                if (particle.size <= 0) particle.size = 1;
                if (particle.opacity < 0) particle.opacity = 0;
                if (particle.opacity > 1) particle.opacity = 1;
                
                particle.update();
                particle.draw();
            } catch (error) {
                console.warn('Particle error:', error, 'Removing particle at index:', index);
                // Remove problematic particle
                universeParticles.splice(index, 1);
            }
        });

        // Update and draw neural nodes
        neuralNodes.forEach(node => {
            try {
                node.update();
                node.draw();
            } catch (error) {
                console.warn('Neural node error:', error);
            }
        });

        // Draw neural connections
        drawNeuralConnections();

            requestAnimationFrame(animate);
        } catch (error) {
            console.error('Animation error:', error);
            // Continue animation even if there's an error
            setTimeout(() => requestAnimationFrame(animate), 100);
        }
    }

    // Mouse events
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Touch events
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        mouse.x = touch.clientX - rect.left;
        mouse.y = touch.clientY - rect.top;
    });

    // Disable complex canvas animation for better performance
    console.log('Canvas animation disabled - using CSS animations instead');

    // Ensure the first dimension space is visible on load
    setTimeout(() => {
        const firstDimensionSpace = document.querySelector('.dimension-space.active');
        if (firstDimensionSpace) {
            firstDimensionSpace.style.opacity = '1';
            firstDimensionSpace.style.display = 'block';
            console.log('Creative universe gallery initialized successfully!');
        } else {
            console.log('Warning: No active dimension space found');
        }
    }, 500);

    // Dimension switching functionality
    const dimensionTabs = document.querySelectorAll('.dimension-tab');
    const dimensionSpaces = document.querySelectorAll('.dimension-space');

    console.log('Found dimension tabs:', dimensionTabs.length);
    console.log('Found dimension spaces:', dimensionSpaces.length);

    dimensionTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const dimension = tab.getAttribute('data-dimension');
            console.log('Switching to dimension:', dimension);
            
            // Update active tab
            dimensionTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update active dimension space
            dimensionSpaces.forEach(space => {
                space.classList.remove('active');
                space.style.opacity = '0';
                space.style.display = 'none';
                if (space.getAttribute('data-space') === dimension) {
                    space.classList.add('active');
                    space.style.display = 'block';
                    setTimeout(() => {
                        space.style.opacity = '1';
                    }, 100);
                }
            });

            // Create universe explosion effect
            for (let i = 0; i < 15; i++) {
                setTimeout(() => {
                    const particle = new UniverseParticle();
                    particle.x = mouse.x || canvas.width / 2;
                    particle.y = mouse.y || canvas.height / 2;
                    particle.size = 6;
                    particle.opacity = 1;
                    particle.energy = 200;
                    universeParticles.push(particle);
                    
                    // Remove after animation
                    setTimeout(() => {
                        const idx = universeParticles.indexOf(particle);
                        if (idx > -1) universeParticles.splice(idx, 1);
                    }, 3000);
                }, i * 50);
            }
        });
    });

    // Holo card interactions
    const holoCards = document.querySelectorAll('.holo-card');
    holoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Create quantum burst effect
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const wave = new EnergyWave();
                    wave.x = Math.random() * canvas.width;
                    wave.y = Math.random() * canvas.height;
                    wave.maxRadius = 150;
                    energyWaves.push(wave);
                    
                    setTimeout(() => {
                        const idx = energyWaves.indexOf(wave);
                        if (idx > -1) energyWaves.splice(idx, 1);
                    }, 2000);
                }, i * 100);
            }
        });
    });

    // MONOCHROMATIC PORTFOLIO SHOWCASE
    console.log('🎨 Initializing Monochromatic Portfolio...');
    
    const imageRing = document.getElementById('imageRing');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (imageRing) {
        console.log('✅ Portfolio grid element found!');
        
        // Portfolio data with proper categorization
        const portfolioItems = [
            { 
                src: 'assets/My Designs/dirrection.png', 
                title: 'URECKON Event Poster', 
                category: 'design',
                type: 'Event Design'
            },
            { 
                src: 'assets/My Designs/TShirt Design Competition Poster 2025 final.png', 
                title: 'T-Shirt Design Competition', 
                category: 'design',
                type: 'Competition Poster'
            },
            { 
                src: 'assets/My Designs/LM10.png', 
                title: 'Messi Poster', 
                category: 'design',
                type: 'Concept Poster'
            },
            { 
                src: 'assets/My Designs/Trap Poster.png', 
                title: 'Trap Music Event', 
                category: 'branding',
                type: 'Music Poster'
            },
            { 
                src: 'assets/My Designs/Ananya  Chakraborty And The Bohemian Baul.png', 
                title: 'Ananya Chakraborty And The Bohemian Baul', 
                category: 'branding',
                type: 'Music Poster'
            },
            { 
                src: 'assets/My Designs/through the lens.png', 
                title: 'Through The Lens', 
                category: 'design',
                type: 'Photography Event'
            },
            { 
                src: 'assets/My Designs/Star Sprint AstroNomical Quiz Compedition-2.png', 
                title: 'Astronomy Quiz Competition', 
                category: 'design',
                type: 'Educational Event'
            },
            { 
                src: 'assets/My Designs/Subho_Bijoya_poster_var_2_Saptarshi_Ghosh.png', 
                title: 'Subho Bijoya Poster', 
                category: 'design',
                type: 'Social Event'
            },
            { 
                src: 'assets/My Designs/Professor sonku o ufo - Saptarshi Ghosh_6296770327.png', 
                title: 'Professor Sonku O Ufo', 
                category: 'design',
                type: 'Concept Poster'
            },
            { 
                src: 'assets/My Designs/RG KAR CASE POSTER.png', 
                title: 'Social Justice Campaign', 
                category: 'design',
                type: 'Awareness Poster'
            },
            { 
                src: 'assets/My Designs/Shawarma.png', 
                title: 'Shawarma Design', 
                category: 'branding',
                type: 'Food Branding'
            },
            { 
                src: 'assets/My Designs/Momo.png', 
                title: 'Momo Design', 
                category: 'branding',
                type: 'Food Branding'
            },
            { 
                src: 'assets/My Designs/Red Velvet Shake.png', 
                title: 'Red Velvet Shake', 
                category: 'branding',
                type: 'Beverage Design'
            },
            { 
                src: 'assets/My Designs/Cold Coffee.png', 
                title: 'Cold Coffee', 
                category: 'branding',
                type: 'Beverage Design'
            },
            { 
                src: 'assets/My Designs/BGMI 1ST page.png', 
                title: 'BGMI', 
                category: 'branding',
                type: 'Gaming Event'
            },
            { 
                src: 'assets/My Designs/Auto expo poster.png', 
                title: 'Auto Expo', 
                category: 'branding',
                type: 'Auto Expo Event'
            },
            { 
                src: 'assets/Photograph/SSP_0811 - Copy.jpg', 
                title: 'Street Photography', 
                category: 'photography',
                type: 'Daily Life'
            },
            { 
                src: 'assets/Photograph/SSP_0189.jpg', 
                title: 'A Smiling Baba ', 
                category: 'photography',
                type: 'Portrait Photography'
            },
            { 
                src: 'assets/Photograph/SSP_0171_bird.jpg', 
                title: 'Bird Portrait', 
                category: 'photography',
                type: 'Wildlife Photography'
            },
            { 
                src: 'assets/Photograph/bird-7.jpg', 
                title: 'Avian Beauty', 
                category: 'photography',
                type: 'Wildlife Photography'
            },
            { 
                src: 'assets/Photograph/SSP_0198_k.jpg', 
                title: 'Maa er agomon', 
                category: 'photography',
                type: 'Street Photography'
            },
            { 
                src: 'assets/Photograph/IMG_20250501_194033188.jpg', 
                title: 'Lightning', 
                category: 'photography',
                type: 'Nature Photography'
            },
            { 
                src: 'assets/Photograph/PXL_20230309_173251751.jpg', 
                title: 'Bee', 
                category: 'photography',
                type: 'Macro Photography'
            },
            { 
                src: 'assets/Photograph/SSP_0045_moon.jpg', 
                title: 'Moon', 
                category: 'photography',
                type: 'Moon Photography'
            }
            ,
            { 
                src: 'assets/Photograph/235841431_323931962849018_2076678060919381447_n.jpg', 
                title: 'Spider', 
                category: 'photography',
                type: 'Macro Photography'
            }
            ,
            { 
                src: 'assets/Photograph/daily-life-6.jpg', 
                title: 'Life struggle in mountains', 
                category: 'photography',
                type: 'Daily Life'
            }
            ,
            { 
                src: 'assets/Photograph/DSC_0090_monkey.jpg', 
                title: 'Monkey', 
                category: 'photography',
                type: 'Wildlife'
            }
            ,
            { 
                src: 'assets/Photograph/SSP_0063_k.jpg', 
                title: 'Offering of the Eyes of Maa', 
                category: 'photography',
                type: 'Daily Life'
            }
            ,
            { 
                src: 'assets/Photograph/SSP_0224.JPG', 
                title: 'The Owl', 
                category: 'photography',
                type: 'Wildlife'
            }
            ,
            { 
                src: 'assets/Photograph/SSP_0328.jpg', 
                title: 'The bird', 
                category: 'photography',
                type: 'Wildlife'
            }
            ,
            { 
                src: 'assets/Photograph/SSP_0742_dec.jpg', 
                title: 'The bird taking flight', 
                category: 'photography',
                type: 'Wildlife'
            }
            ,
            { 
                src: 'assets/Photograph/SSP_0298.jpg', 
                title: 'The boat in Ganges', 
                category: 'photography',
                type: 'Landscape'
            }
        ];

        let currentFilter = 'all';
        let visibleItems = 8; // Start with 8 items
        let allItems = [];

        // Create portfolio item element
        function createPortfolioItem(item, index) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'ring-image';
            itemDiv.setAttribute('data-category', item.category);
            itemDiv.style.opacity = '0';
            itemDiv.style.transform = 'translateY(30px)';
            
            // Create image
            const img = document.createElement('img');
            img.className = 'portfolio-image';
            img.src = item.src;
            img.alt = item.title;
            img.loading = 'lazy';
            
            // Create category badge
            const badge = document.createElement('div');
            badge.className = 'category-badge';
            badge.textContent = item.type;
            
            // Create info overlay
            const infoDiv = document.createElement('div');
            infoDiv.className = 'ring-image-info';
            infoDiv.innerHTML = `
                <div class="image-title">${item.title}</div>
                <div class="image-category">${item.type}</div>
            `;
            
            itemDiv.appendChild(img);
            itemDiv.appendChild(badge);
            itemDiv.appendChild(infoDiv);
            
            // Add click handler
            itemDiv.addEventListener('click', () => {
                console.log(`🖼️ Viewing: ${item.title} - ${item.type}`);
                
                // Add click animation
                itemDiv.style.transform = 'translateY(-5px) scale(0.98)';
                setTimeout(() => {
                    itemDiv.style.transform = 'translateY(-10px) scale(1)';
                }, 150);
            });
            
            // Add entrance animation and staggered shine delay
            setTimeout(() => {
                itemDiv.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                itemDiv.style.opacity = '1';
                itemDiv.style.transform = 'translateY(0)';
                
                // Add staggered animation delay for shine effects
                const shineDelay = (index * 0.5) + 's';
                itemDiv.style.setProperty('--shine-delay', shineDelay);
                itemDiv.style.animationDelay = shineDelay;
                
                // Set image shine delay
                const img = itemDiv.querySelector('.portfolio-image');
                if (img) {
                    img.style.setProperty('--image-shine-delay', (index * 0.7) + 's');
                }
            }, index * 100);
            
            allItems.push(itemDiv);
            return itemDiv;
        }

        // Render portfolio items
        function renderPortfolio(filter = 'all') {
            imageRing.innerHTML = '';
            
            const filteredItems = filter === 'all' 
                ? portfolioItems 
                : portfolioItems.filter(item => item.category === filter);
            
            const itemsToShow = filteredItems.slice(0, visibleItems);
            
            itemsToShow.forEach((item, index) => {
                const itemElement = createPortfolioItem(item, index);
                imageRing.appendChild(itemElement);
            });
            
            // Update load more button
            if (filteredItems.length > visibleItems) {
                loadMoreBtn.style.display = 'inline-block';
                loadMoreBtn.textContent = `View More Work (${filteredItems.length - visibleItems} remaining)`;
            } else {
                loadMoreBtn.style.display = 'none';
            }
            
            console.log(`📊 Rendered ${itemsToShow.length} items (filter: ${filter})`);
        }

        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Get filter value
                currentFilter = btn.getAttribute('data-filter');
                visibleItems = 8; // Reset visible items
                
                // Add loading effect
                imageRing.style.opacity = '0.5';
                imageRing.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    renderPortfolio(currentFilter);
                    imageRing.style.opacity = '1';
                    imageRing.style.transform = 'translateY(0)';
                }, 300);
                
                console.log(`🔍 Filter changed to: ${currentFilter}`);
            });
        });

        // Load more functionality
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                visibleItems += 6; // Show 6 more items
                
                // Add loading animation
                loadMoreBtn.style.opacity = '0.5';
                loadMoreBtn.textContent = 'Loading...';
                
                setTimeout(() => {
                    renderPortfolio(currentFilter);
                    loadMoreBtn.style.opacity = '1';
                }, 600);
                
                console.log(`📈 Loading more items. Now showing: ${visibleItems}`);
            });
        }

        // Create floating background elements
        function createFloatingElements() {
            const floatingContainer = document.createElement('div');
            floatingContainer.className = 'portfolio-floating-elements';
            
            // Create floating dots
            for (let i = 0; i < 15; i++) {
                const dot = document.createElement('div');
                
                // Random size class
                const sizes = ['', 'large', 'small'];
                const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
                dot.className = `floating-dot ${randomSize}`;
                
                // Random position
                const randomTop = Math.random() * 90 + 5; // 5% to 95%
                const randomLeft = Math.random() * 90 + 5; // 5% to 95%
                const randomDelay = Math.random() * 8; // 0 to 8 seconds
                const randomDuration = Math.random() * 4 + 6; // 6 to 10 seconds
                
                dot.style.top = randomTop + '%';
                dot.style.left = randomLeft + '%';
                dot.style.animationDelay = randomDelay + 's';
                dot.style.animationDuration = randomDuration + 's';
                
                floatingContainer.appendChild(dot);
            }
            
            // Create light streaks
            for (let i = 0; i < 5; i++) {
                const streak = document.createElement('div');
                streak.className = 'light-streak';
                
                // Random position
                const randomTop = Math.random() * 80 + 10;
                const randomLeft = Math.random() * 90 + 5;
                const randomDelay = Math.random() * 12;
                
                streak.style.top = randomTop + '%';
                streak.style.left = randomLeft + '%';
                streak.style.animationDelay = randomDelay + 's';
                
                floatingContainer.appendChild(streak);
            }
            
            document.querySelector('.portfolio-ring-section').appendChild(floatingContainer);
            console.log('✨ Created floating dots and light streaks');
        }

        // Initialize portfolio and animations
        createFloatingElements();
        renderPortfolio('all');
        
        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // Observe portfolio items as they're created
        const originalAppendChild = imageRing.appendChild;
        imageRing.appendChild = function(child) {
            originalAppendChild.call(this, child);
            observer.observe(child);
        };

        console.log(`✨ Monochromatic Portfolio created with ${portfolioItems.length} items`);
    } else {
        console.error('❌ Portfolio grid element not found!');
    }

    // Lazy loading for images with quantum effect
    const images = document.querySelectorAll('.holo-card img');
    console.log('Found images for lazy loading:', images.length);
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                console.log('Loading image:', img.src);
                
                // Set initial state
                img.style.opacity = '0';
                img.style.transition = 'opacity 1s ease';
                
                // Handle successful load
                img.onload = () => {
                    console.log('Image loaded successfully:', img.src);
                    img.style.opacity = '1';
                    
                    // Create loading effect only if canvas exists
                    if (canvas && universeParticles) {
                        for (let i = 0; i < 3; i++) {
                            setTimeout(() => {
                                const particle = new UniverseParticle();
                                particle.x = Math.random() * canvas.width;
                                particle.y = Math.random() * canvas.height;
                                particle.color = '#ffffff';
                                particle.size = 4;
                                particle.opacity = 0.8;
                                universeParticles.push(particle);
                                
                                setTimeout(() => {
                                    const idx = universeParticles.indexOf(particle);
                                    if (idx > -1) universeParticles.splice(idx, 1);
                                }, 2000);
                            }, i * 200);
                        }
                    }
                };
                
                // Handle load error
                img.onerror = () => {
                    console.error('Failed to load image:', img.src);
                    img.style.opacity = '1';
                    img.alt = 'Image not found';
                };
                
                // If image is already loaded (cached)
                if (img.complete) {
                    img.style.opacity = '1';
                }
                
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
    
    // Final initialization check
    setTimeout(() => {
        console.log('=== CREATIVE UNIVERSE INITIALIZATION COMPLETE ===');
        console.log('Canvas:', canvas ? 'Found' : 'Not found');
        console.log('Dimension tabs:', dimensionTabs.length);
        console.log('Dimension spaces:', dimensionSpaces.length);
        console.log('Holo cards:', holoCards.length);
        console.log('Images:', images.length);
        console.log('Active dimension space:', document.querySelector('.dimension-space.active') ? 'Found' : 'Not found');
        console.log('=== END INITIALIZATION CHECK ===');
    }, 1000);
}

// ===== ACHIEVEMENT COUNTER ANIMATION =====
function animateAchievementCounters() {
    const counters = document.querySelectorAll('.achievement-stats .stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.parentElement.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += step;
                if (current > target) current = target;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// Initialize achievement counters when the section is in view
const achievementObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateAchievementCounters();
            achievementObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Observe the achievements section
const achievementsSection = document.querySelector('.achievements');
if (achievementsSection) {
    achievementObserver.observe(achievementsSection);
}

// ===== CREATIVE INTERACTIVE FOOTER FUNCTIONALITY =====

// Initialize Footer Interactions
function initCreativeFooter() {
    console.log('Initializing Creative Footer...');
    
    // Scroll to Top Functionality
    initScrollToTop();
    
    // Heart Interaction Effects
    initHeartInteractions();
    
    // Enhanced Social Link Effects
    initEnhancedSocialLinks();
    
    // Footer Particle System
    initFooterParticleSystem();
    
    // Dynamic Footer Background
    initDynamicFooterBackground();
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const threshold = 300;
        
        if (scrolled > threshold) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.transform = 'translateY(0)';
            scrollToTopBtn.style.pointerEvents = 'auto';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.transform = 'translateY(20px)';
            scrollToTopBtn.style.pointerEvents = 'none';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Add click animation
        scrollToTopBtn.style.transform = 'translateY(-2px) scale(0.95)';
        
        // Create ripple effect
        createScrollTopRipple(scrollToTopBtn);
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Reset animation
        setTimeout(() => {
            scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
        }, 200);
    });
}

// Create scroll to top ripple effect
function createScrollTopRipple(button) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(100, 255, 218, 0.4);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: scrollTopRipple 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    // Add ripple animation keyframe
    if (!document.querySelector('#scrollTopRippleStyle')) {
        const style = document.createElement('style');
        style.id = 'scrollTopRippleStyle';
        style.textContent = `
            @keyframes scrollTopRipple {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Heart Interaction Effects
function initHeartInteractions() {
    const heartContainer = document.querySelector('.love-heart-container');
    const heart = document.querySelector('.love-heart');
    
    if (!heartContainer || !heart) return;
    
    // Click interaction
    heartContainer.addEventListener('click', () => {
        // Create heart burst effect
        createHeartBurst(heartContainer);
        
        // Add temporary scale animation
        heart.style.transform = 'scale(1.3)';
        setTimeout(() => {
            heart.style.transform = 'scale(1)';
        }, 300);
        
        // Create floating hearts
        createFloatingHearts(heartContainer);
    });
    
    // Hover effect enhancement
    heartContainer.addEventListener('mouseenter', () => {
        heart.style.filter = 'brightness(1.3) saturate(1.5)';
    });
    
    heartContainer.addEventListener('mouseleave', () => {
        heart.style.filter = 'brightness(1) saturate(1)';
    });
}

// Create heart burst effect
function createHeartBurst(container) {
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '💖';
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            font-size: 1rem;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 80 + Math.random() * 40;
        const duration = 1200 + Math.random() * 400;
        
        particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1.2) rotate(${angle * 180 / Math.PI}deg)`,
                opacity: 0.8
            },
            {
                transform: `translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0) rotate(${angle * 360 / Math.PI}deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

// Create floating hearts
function createFloatingHearts(container) {
    const rect = container.getBoundingClientRect();
    
    for (let i = 0; i < 3; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.style.cssText = `
            position: fixed;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.bottom}px;
            font-size: 0.8rem;
            pointer-events: none;
            z-index: 9999;
            opacity: 0.8;
        `;
        
        document.body.appendChild(heart);
        
        heart.animate([
            {
                transform: 'translateY(0) scale(0.5)',
                opacity: 0.8
            },
            {
                transform: 'translateY(-150px) scale(1)',
                opacity: 0
            }
        ], {
            duration: 2000 + Math.random() * 1000,
            easing: 'ease-out'
        }).onfinish = () => {
            heart.remove();
        };
    }
}

// Enhanced Social Link Effects
function initEnhancedSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link-enhanced');
    
    socialLinks.forEach(link => {
        // Click effect
        link.addEventListener('click', (e) => {
            // Create ripple effect
            const ripple = link.querySelector('.social-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';
                ripple.style.opacity = '0.3';
                
                setTimeout(() => {
                    ripple.style.width = '100px';
                    ripple.style.height = '100px';
                    ripple.style.opacity = '0';
                }, 10);
            }
        });
        
        // Enhanced hover effects
        link.addEventListener('mouseenter', () => {
            // Create hover particles
            createSocialHoverParticles(link);
        });
    });
}

// Create social hover particles
function createSocialHoverParticles(socialLink) {
    const rect = socialLink.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${centerX}px;
            top: ${centerY}px;
            width: 4px;
            height: 4px;
            background: rgba(100, 255, 218, 0.8);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(particle);
        
        const angle = (i / 4) * Math.PI * 2;
        const distance = 30 + Math.random() * 20;
        
        particle.animate([
            {
                transform: 'translate(-50%, -50%) scale(0)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
                opacity: 0.5
            },
            {
                transform: `translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 800,
            easing: 'ease-out'
        }).onfinish = () => {
            particle.remove();
        };
    }
}

