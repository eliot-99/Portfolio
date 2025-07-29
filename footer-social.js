// =============== FOOTER SOCIAL ICONS FUNCTIONALITY ===============

function initFooterSocialEffects() {
    const socialLinks = document.querySelectorAll('.social-link-enhanced');
    
    socialLinks.forEach(link => {
        // Enhanced click effect with ripple
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create ripple effect
            const ripple = this.querySelector('.social-ripple');
            if (ripple) {
                // Reset ripple
                ripple.style.width = '0px';
                ripple.style.height = '0px';
                ripple.style.opacity = '0';
                
                // Trigger ripple animation
                setTimeout(() => {
                    ripple.style.width = '120px';
                    ripple.style.height = '120px';
                    ripple.style.opacity = '0.6';
                }, 10);
                
                // Fade out ripple
                setTimeout(() => {
                    ripple.style.opacity = '0';
                }, 600);
            }
            
            // Add click scale effect
            this.style.transform = 'translateY(-3px) scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
            
            // Open link after animation
            setTimeout(() => {
                window.open(this.href, '_blank');
            }, 150);
        });
        
        // Add hover effects
        link.addEventListener('mouseenter', function() {
            const bg = this.querySelector('.social-icon-bg');
            if (bg) {
                bg.style.opacity = '1';
                bg.style.transform = 'scale(1.2)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const bg = this.querySelector('.social-icon-bg');
            if (bg) {
                bg.style.opacity = '0';
                bg.style.transform = 'scale(1)';
            }
        });
    });
}

// =============== SCROLL TO TOP FUNCTIONALITY ===============

function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'translateY(-3px) scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Add hover effects
        scrollToTopBtn.addEventListener('mouseenter', function() {
            const bg = this.querySelector('.scroll-top-bg');
            const glow = this.querySelector('.scroll-top-glow');
            if (bg) {
                bg.style.opacity = '1';
                bg.style.transform = 'scale(1.2)';
            }
            if (glow) {
                glow.style.opacity = '1';
            }
        });
        
        scrollToTopBtn.addEventListener('mouseleave', function() {
            const bg = this.querySelector('.scroll-top-bg');
            const glow = this.querySelector('.scroll-top-glow');
            if (bg) {
                bg.style.opacity = '0';
                bg.style.transform = 'scale(1)';
            }
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    }
}

// =============== INTERACTIVE LOVE MESSAGE FUNCTIONALITY ===============

function initInteractiveLoveMessage() {
    const loveMessage = document.querySelector('.interactive-love-message');
    const heart = document.querySelector('.interactive-heart');
    const creator = document.querySelector('.interactive-creator');
    
    if (!loveMessage) return;
    
    let clickCount = 0;
    
    // Create sparkles function
    function createSparkles(x, y, count = 8) {
        const sparklesContainer = document.querySelector('.sparkles-container') || createSparklesContainer();
        
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #ffffff;
                border-radius: 50%;
                opacity: 0;
                box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
                animation: sparkleFloat 2s ease-out forwards;
            `;
            
            // Random position around click point
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;
            
            sparkle.style.left = (x + offsetX) + 'px';
            sparkle.style.top = (y + offsetY) + 'px';
            sparkle.style.animationDelay = (Math.random() * 0.5) + 's';
            
            sparklesContainer.appendChild(sparkle);
            
            // Remove sparkle after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 2000);
        }
    }
    
    function createSparklesContainer() {
        const container = document.createElement('div');
        container.className = 'sparkles-container';
        container.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            z-index: 10;
        `;
        loveMessage.appendChild(container);
        return container;
    }
    
    // Heart click effect
    if (heart) {
        heart.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Add ripple effect
            loveMessage.classList.add('clicked');
            setTimeout(() => {
                loveMessage.classList.remove('clicked');
            }, 600);
            
            // Create sparkles at heart position
            const rect = heart.getBoundingClientRect();
            const containerRect = loveMessage.getBoundingClientRect();
            const x = rect.left + rect.width / 2 - containerRect.left;
            const y = rect.top + rect.height / 2 - containerRect.top;
            
            createSparkles(x, y, 12);
            
            // Special heart animation
            heart.style.animation = 'none';
            setTimeout(() => {
                heart.style.animation = 'heartPulse 0.6s ease-in-out 3';
                setTimeout(() => {
                    heart.style.animation = 'heartBeat 2s ease-in-out infinite';
                }, 1800);
            }, 10);
        });
    }
    
    // Creator name click effect
    if (creator) {
        creator.addEventListener('click', function(e) {
            e.stopPropagation();
            clickCount++;
            
            // Different effects based on click count
            if (clickCount === 1) {
                this.style.transform = 'scale(1.1) rotate(2deg)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 300);
            } else if (clickCount === 2) {
                this.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #64ffda 50%, #ff6b6b 100%)';
                this.style.backgroundClip = 'text';
                this.style.webkitBackgroundClip = 'text';
                this.style.webkitTextFillColor = 'transparent';
                setTimeout(() => {
                    this.style.background = 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)';
                    this.style.backgroundClip = 'text';
                    this.style.webkitBackgroundClip = 'text';
                    this.style.webkitTextFillColor = 'transparent';
                }, 2000);
            } else if (clickCount >= 3) {
                // Easter egg: Create sparkles and show appreciation message
                const rect = creator.getBoundingClientRect();
                const containerRect = loveMessage.getBoundingClientRect();
                const x = rect.left + rect.width / 2 - containerRect.left;
                const y = rect.top + rect.height / 2 - containerRect.top;
                
                createSparkles(x, y, 20);
                
                // Show temporary appreciation message
                const appreciation = document.createElement('div');
                appreciation.innerHTML = 'Thanks for the love! 🚀';
                appreciation.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0, 0, 0, 0.9);
                    color: #64ffda;
                    padding: 1rem 2rem;
                    border-radius: 30px;
                    font-size: 1.2rem;
                    font-weight: 600;
                    z-index: 10000;
                    border: 1px solid rgba(100, 255, 218, 0.3);
                    box-shadow: 0 0 30px rgba(100, 255, 218, 0.3);
                    opacity: 0;
                    transition: all 0.4s ease;
                `;
                
                document.body.appendChild(appreciation);
                
                setTimeout(() => {
                    appreciation.style.opacity = '1';
                    appreciation.style.transform = 'translate(-50%, -50%) scale(1.05)';
                }, 10);
                
                setTimeout(() => {
                    appreciation.style.opacity = '0';
                    appreciation.style.transform = 'translate(-50%, -50%) scale(0.9)';
                    setTimeout(() => {
                        if (appreciation.parentNode) {
                            appreciation.parentNode.removeChild(appreciation);
                        }
                    }, 400);
                }, 2500);
                
                clickCount = 0; // Reset counter
            }
        });
    }
    
    // Whole message click effect
    loveMessage.addEventListener('click', function(e) {
        if (e.target === heart || e.target === creator) return;
        
        // Add gentle ripple effect
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 600);
        
        // Random sparkles
        const rect = this.getBoundingClientRect();
        const x = Math.random() * (rect.width - 40) + 20;
        const y = Math.random() * (rect.height - 40) + 20;
        
        createSparkles(x, y, 6);
    });
    
    // Hover effects with mouse tracking
    loveMessage.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Subtle parallax effect
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        this.style.transform = `translateY(-2px) rotateX(${deltaY * 2}deg) rotateY(${deltaX * 2}deg)`;
    });
    
    loveMessage.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
}

// =============== INITIALIZE ALL FOOTER FUNCTIONALITY ===============

// Initialize all footer functionality when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initInteractiveLoveMessage();
        initFooterSocialEffects();
        initScrollToTop();
    });
} else {
    initInteractiveLoveMessage();
    initFooterSocialEffects();
    initScrollToTop();
}

// Also initialize when page loads (backup)
window.addEventListener('load', function() {
    initInteractiveLoveMessage();
    initFooterSocialEffects();
    initScrollToTop();
});