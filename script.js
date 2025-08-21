// Logo image handling
function loadLogo() {
    const logoImages = document.querySelectorAll('.logo-image, .hero-logo-image');
    
    logoImages.forEach(img => {
        img.onload = function() {
            this.style.display = 'block';
        };
        
        img.onerror = function() {
            this.style.display = 'none';
        };
    });
}

// Navigation functionality
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Content Manager - Loads content from separate files
class ContentManager {
    constructor() {
        this.loadAllContent();
    }

    async loadAllContent() {
        try {
            await Promise.all([
                this.loadAboutContent(),
                this.loadServicesContent(),
                this.loadPricingContent(),
                this.loadClientsContent(),
                this.loadTestimonialsContent(),
                this.loadContactContent(),
                this.loadBlogContent()
            ]);
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    async loadAboutContent() {
        try {
            const response = await fetch('about.md?v=' + Date.now());
            const html = await response.text();
            document.getElementById('about-content').innerHTML = html;
        } catch (error) {
            console.error('Error loading about content:', error);
            document.getElementById('about-content').innerHTML = '<p>Content loading error</p>';
        }
    }

    async loadServicesContent() {
        try {
            const response = await fetch('services.md');
            const html = await response.text();
            document.getElementById('services-content').innerHTML = html;
        } catch (error) {
            console.error('Error loading services content:', error);
            document.getElementById('services-content').innerHTML = '<p>Content loading error</p>';
        }
    }

    async loadPricingContent() {
        try {
            const response = await fetch('pricing.md');
            const html = await response.text();
            document.getElementById('pricing-content').innerHTML = html;
        } catch (error) {
            console.error('Error loading pricing content:', error);
            document.getElementById('pricing-content').innerHTML = '<p>Content loading error</p>';
        }
    }

    async loadClientsContent() {
        try {
            const response = await fetch('clients.md');
            const html = await response.text();
            document.getElementById('clients-content').innerHTML = html;
        } catch (error) {
            console.error('Error loading clients content:', error);
            document.getElementById('clients-content').innerHTML = '<p>Content loading error</p>';
        }
    }

    async loadTestimonialsContent() {
        try {
            const response = await fetch('testimonials.md');
            const html = await response.text();
            document.getElementById('testimonials-content').innerHTML = html;
        } catch (error) {
            console.error('Error loading testimonials content:', error);
            document.getElementById('testimonials-content').innerHTML = '<p>Content loading error</p>';
        }
    }

    async loadContactContent() {
        try {
            const response = await fetch('get_in_touch.md?v=' + Date.now());
            const html = await response.text();
            document.getElementById('contact-info').innerHTML = html;
        } catch (error) {
            console.error('Error loading contact content:', error);
            document.getElementById('contact-info').innerHTML = '<p>Content loading error</p>';
        }
    }

    async loadBlogContent() {
        try {
            const response = await fetch('blog_posts.json');
            const blogPosts = await response.json();
            this.renderBlogPosts(blogPosts);
        } catch (error) {
            console.error('Error loading blog content:', error);
            document.getElementById('blog-posts').innerHTML = '<p>Blog content loading error</p>';
        }
    }

    markdownToHtml(markdown) {
        // Simple markdown to HTML converter
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            // Blockquotes
            .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
            // Lists
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            // Paragraphs
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(?!<[h|b|u|o])(.*$)/gim, '<p>$1</p>');

        // Wrap lists properly
        html = html.replace(/<li>(.*?)<\/li>/g, '<ul><li>$1</li></ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        return html;
    }

    renderBlogPosts(blogPosts) {
        const blogContainer = document.getElementById('blog-posts');
        blogContainer.innerHTML = '';

        if (blogPosts.length === 0) {
            blogContainer.innerHTML = `
                <div class="blog-empty">
                    <p>No blog posts available at the moment.</p>
                </div>
            `;
            return;
        }

        blogPosts.forEach(post => {
            const blogCard = this.createBlogCard(post);
            blogContainer.appendChild(blogCard);
        });
    }

    createBlogCard(post) {
        const card = document.createElement('div');
        card.className = 'blog-card';
        
        const date = new Date(post.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        card.innerHTML = `
            <div class="blog-card-header">
                <h3 class="blog-card-title">${post.title}</h3>
                <div class="blog-card-meta">
                    <span>${date}</span>
                    <span>•</span>
                    <span>${post.category}</span>
                </div>
            </div>
            <div class="blog-card-content">
                <p class="blog-card-excerpt">${post.excerpt}</p>
                <span class="blog-card-category">${post.category}</span>
            </div>
        `;

        // Add click event to expand full content
        card.addEventListener('click', () => this.showFullPost(post));
        
        return card;
    }

    showFullPost(post) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        
        const date = new Date(post.date).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        modal.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>${post.title}</h2>
                <div class="blog-post-meta">
                    <span>${date}</span>
                    <span>•</span>
                    <span>${post.category}</span>
                </div>
                <div class="blog-post-content">
                    ${post.content.replace(/\n/g, '<br>')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// Email protection function - Enhanced bot protection with mobile support
function showEmail(event) {
    // Prevent any default behavior (navigation, scrolling, etc.)
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
        // More sophisticated obfuscation to prevent bot scraping
        const parts = ['sue', 'trust-fundraising', 'co', 'uk'];
        const email = parts[0] + '@' + parts[1] + '.' + parts[2] + '.' + parts[3];
        
        // Update the link to show the email and make it clickable
        emailLink.innerHTML = email;
        emailLink.href = 'mailto:' + email;
        
        // Remove all event handlers to prevent conflicts
        emailLink.onclick = null;
        emailLink.removeEventListener('click', showEmail);
        emailLink.removeEventListener('touchstart', showEmail);
        
        // Add visual feedback and delay to prevent bot detection
        emailLink.style.color = '#2563eb';
        emailLink.style.fontWeight = '600';
        
        // Add a subtle animation
        emailLink.style.transition = 'all 0.3s ease';
        emailLink.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            emailLink.style.transform = 'scale(1)';
        }, 300);
        
        // Prevent any further navigation
        return false;
    }
    return false;
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization - Defer non-critical CSS
function loadNonCriticalCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    link.media = 'print';
    link.onload = function() {
        this.media = 'all';
    };
    document.head.appendChild(link);
}

// Mobile navigation functionality
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    console.log('Mobile nav init - Hamburger found:', !!hamburger);
    console.log('Mobile nav init - Nav menu found:', !!navMenu);
    console.log('Mobile nav init - Window width:', window.innerWidth);
    console.log('Mobile nav init - Hamburger element:', hamburger);
    console.log('Mobile nav init - Nav menu element:', navMenu);
    
    if (hamburger && navMenu) {
        // Add a simple test click to see if the element is clickable
        hamburger.style.border = '2px solid red';
        hamburger.style.backgroundColor = 'yellow';
        
        hamburger.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Hamburger clicked!');
            console.log('Nav menu classes before:', navMenu.className);
            console.log('Hamburger classes before:', hamburger.className);
            
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            
            console.log('Nav menu classes after:', navMenu.className);
            console.log('Hamburger classes after:', hamburger.className);
            console.log('Is active?', navMenu.classList.contains('active'));
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
        
        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Initialize build info
function initBuildInfo() {
    const buildDate = document.getElementById('build-date');
    const buildHash = document.getElementById('build-hash');
    
    if (buildDate) {
        // Check if build date is already set in HTML (from build process)
        if (buildDate.textContent.trim() === '') {
            // Fallback: set current date if not set by build process
            const now = new Date();
            const dateString = now.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            buildDate.textContent = `Built: ${dateString}`;
        }
    }
    
    if (buildHash) {
        // Check if build hash is already set in HTML (from build process)
        if (buildHash.textContent.trim() === '' || buildHash.textContent === 'dev') {
            // Fallback: generate a timestamp-based hash for development
            const timestamp = Date.now().toString(36);
            buildHash.textContent = timestamp.substring(0, 7);
        }
    }
}

// Initialize email link with proper event handling
function initEmailLink() {
    const emailLink = document.getElementById('email-link');
    if (emailLink) {
        // Remove any existing onclick attribute to prevent conflicts
        emailLink.removeAttribute('onclick');
        
        // Remove any existing event listeners to prevent duplicates
        emailLink.removeEventListener('click', showEmail);
        emailLink.removeEventListener('touchstart', showEmail);
        
        // Add event listeners for both click and touch with proper options
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showEmail(e);
        }, { passive: false });
        
        emailLink.addEventListener('touchstart', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showEmail(e);
        }, { passive: false });
        
        // Add visual feedback for touch
        emailLink.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        }, { passive: true });
        
        emailLink.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        }, { passive: true });
    } else {
        console.warn('Email link not found');
    }
}

// Touch-friendly interactions
function initTouchOptimizations() {
    // Add touch feedback to buttons and links
    const touchElements = document.querySelectorAll('.btn, .nav-link, .contact-item');
    
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
}

// Performance optimization for mobile
function initMobilePerformance() {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition-duration', '0.1s');
    }
    
    // Optimize for mobile network conditions
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            // Load lower quality images for slow connections
            const images = document.querySelectorAll('img[data-src-slow]');
            images.forEach(img => {
                img.src = img.dataset.srcSlow;
            });
        }
    }
}



// Back to top button functionality
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Show/hide button on scroll
    window.addEventListener('scroll', toggleBackToTop);
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', scrollToTop);
    
    // Keyboard accessibility
    backToTopButton.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });
}

// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize logo loading
    loadLogo();
    
    // Initialize content manager
    new ContentManager();
    
    // Initialize lazy loading
    initLazyLoading();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize touch optimizations
    initTouchOptimizations();
    
    // Initialize mobile performance optimizations
    initMobilePerformance();
    

    
    // Initialize back to top button
    initBackToTop();
    
    // Initialize email link with proper event handling (with delay for DOM)
    setTimeout(initEmailLink, 200);
    
    // Initialize build info
    initBuildInfo();
    
    // Fallback initialization for mobile compatibility
    setTimeout(() => {
        // Re-initialize breadcrumbs if needed
        const breadcrumbList = document.querySelector('.breadcrumb-list');
        if (breadcrumbList && breadcrumbList.children.length === 0) {
            initBreadcrumbNavigation();
        }
        
        // Re-initialize email link if needed
        const emailLink = document.getElementById('email-link');
        if (emailLink && !emailLink.hasAttribute('data-initialized')) {
            emailLink.setAttribute('data-initialized', 'true');
            initEmailLink();
        }
    }, 500);
    
    // Load non-critical CSS after page load
    setTimeout(loadNonCriticalCSS, 1000);
});

// Add CSS for blog display
const style = document.createElement('style');
style.textContent = `
    .blog-post-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.875rem;
        color: #6b7280;
        margin-bottom: 1.5rem;
    }
    
    .blog-post-content {
        line-height: 1.8;
        color: #4b5563;
    }
    
    .blog-empty {
        text-align: center;
        padding: 3rem;
        color: #6b7280;
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}); 