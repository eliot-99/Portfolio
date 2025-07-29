// =============== FOOTER EFFECTS - DEDICATED FILE ===============

// =============== FOOTER SOCIAL ICONS ENHANCED EFFECTS ===============

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
        
        // Enhanced hover effects
        link.addEventListener('mouseenter', function() {
            const iconBg = this.querySelector('.social-icon-bg');
            const ripple = this.querySelector('.social-ripple');
            
            if (iconBg) {
                iconBg.style.opacity = '1';
                iconBg.style.transform = 'scale(1.3)';
            }
            
            // Subtle ripple on hover
            if (ripple) {
                ripple.style.width = '60px';
                ripple.style.height = '60px';
                ripple.style.opacity = '0.2';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const iconBg = this.querySelector('.social-icon-bg');
            const ripple = this.querySelector('.social-ripple');
            
            if (iconBg) {
                iconBg.style.opacity = '0';
                iconBg.style.transform = 'scale(1)';
            }
            
            if (ripple) {
                ripple.style.width = '0px';
                ripple.style.height = '0px';
                ripple.style.opacity = '0';
            }
        });
        
        // Touch effects for mobile
        link.addEventListener('touchstart', function(e) {
            this.classList.add('touch-feedback');
            
            const iconBg = this.querySelector('.social-icon-bg');
            if (iconBg) {
                iconBg.style.opacity = '1';
                iconBg.style.transform = 'scale(1.2)';
            }
        });
        
        link.addEventListener('touchend', function(e) {
            this.classList.remove('touch-feedback');
            
            const iconBg = this.querySelector('.social-icon-bg');
            if (iconBg) {
                setTimeout(() => {
                    iconBg.style.opacity = '0';
                    iconBg.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
}

// =============== FOOTER LOVE MESSAGE EFFECTS ===============

function initFooterLoveEffects() {
    const loveHeart = document.querySelector('.love-heart');
    const creatorName = document.querySelector('.creator-name');
    
    if (loveHeart) {
        loveHeart.addEventListener('click', createFloatingHearts);
        loveHeart.addEventListener('touchstart', (e) => {
            e.preventDefault();
            createFloatingHearts(e);
        });
    }
    
    if (creatorName) {
        creatorName.addEventListener('click', createNameSparkles);
    }
}

function createFloatingHearts(e) {
    const heart = e.target;
    const rect = heart.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create multiple floating hearts
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const floatingHeart = document.createElement('div');
            floatingHeart.className = 'heart-particle';
            floatingHeart.textContent = '❤️';
            
            // Random position around the clicked heart
            const angle = (Math.PI * 2 * i) / 6;
            const distance = 20 + Math.random() * 30;
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;
            
            floatingHeart.style.left = startX + 'px';
            floatingHeart.style.top = startY + 'px';
            floatingHeart.style.fontSize = (0.8 + Math.random() * 0.4) + 'rem';
            
            document.body.appendChild(floatingHeart);
            
            // Remove after animation
            setTimeout(() => {
                if (floatingHeart.parentNode) {
                    floatingHeart.parentNode.removeChild(floatingHeart);
                }
            }, 2000);
        }, i * 100);
    }
    
    // Add pulse effect to the main heart
    heart.style.animation = 'heartExplode 0.6s ease-out';
    setTimeout(() => {
        heart.style.animation = 'heartBeat 2s ease-in-out infinite';
    }, 600);
}

function createNameSparkles(e) {
    const name = e.target;
    const rect = name.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Create sparkle particles
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.className = 'name-sparkle';
            sparkle.textContent = '✨';
            
            // Random position around the name
            const angle = (Math.PI * 2 * i) / 8;
            const distance = 30 + Math.random() * 40;
            const startX = centerX + Math.cos(angle) * distance;
            const startY = centerY + Math.sin(angle) * distance;
            
            sparkle.style.position = 'fixed';
            sparkle.style.left = startX + 'px';
            sparkle.style.top = startY + 'px';
            sparkle.style.fontSize = '0.8rem';
            sparkle.style.color = '#64ffda';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            sparkle.style.animation = 'sparkleFloat 1.5s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            // Remove after animation
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 1500);
        }, i * 80);
    }
}

// Add required animations dynamically
function addFooterAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleFloat {
            0% {
                opacity: 1;
                transform: translateY(0) scale(1) rotate(0deg);
            }
            100% {
                opacity: 0;
                transform: translateY(-80px) scale(0.3) rotate(360deg);
            }
        }
        
        .name-sparkle {
            filter: drop-shadow(0 0 8px rgba(100, 255, 218, 0.6));
        }
        
        .touch-feedback {
            transform: scale(0.95);
            transition: transform 0.1s ease;
        }
    `;
    document.head.appendChild(style);
}

// =============== INITIALIZATION ===============

// Initialize all footer effects
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing footer effects...');
    initFooterSocialEffects();
    initFooterLoveEffects();
    addFooterAnimations();
    console.log('Footer effects initialized successfully!');
});

// Fallback initialization
window.addEventListener('load', function() {
    initFooterSocialEffects();
    initFooterLoveEffects();
});