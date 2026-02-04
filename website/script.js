// Navigation toggle functionality
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Form submission handling
const contactForm = document.getElementById('consultationForm');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.classList.add('loading');
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // Send data to email service or webhook
        const response = await sendConsultationRequest(data);
        
        if (response.success) {
            showMessage('Thank you for your consultation request! I\'ll contact you within 24 hours.', 'success');
            contactForm.reset();
            
            // Track conversion
            trackConversion('consultation_request', data);
        } else {
            showMessage('Sorry, there was an error sending your request. Please try again or email me directly.', 'error');
        }
    } catch (error) {
        console.error('Form submission error:', error);
        showMessage('Network error. Please try again or contact me directly at consulting@kirkbot2.ai', 'error');
    } finally {
        // Reset button state
        submitButton.textContent = originalText;
        submitButton.classList.remove('loading');
    }
});

// Send consultation request to webhook
async function sendConsultationRequest(data) {
    // You can replace this with your preferred backend service
    // Options: Formspree, Netlify Forms, Firebase, or custom webhook
    
    // For now, we'll simulate a successful submission
    // In production, uncomment one of the options below
    
    /*
    // Option 1: Formspree (recommended for simplicity)
    const response = await fetch('https://formspree.io/f/your-form-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return { success: response.ok };
    */
    
    /*
    // Option 2: Custom webhook
    const response = await fetch('https://your-webhook-url.com/consultation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...data,
            timestamp: new Date().toISOString(),
            source: 'kirkbot2.ai'
        }),
    });
    return { success: response.ok };
    */
    
    // Simulate successful submission for demo
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { success: true };
}

// Show form messages
function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Insert at the top of the form
    contactForm.insertBefore(messageElement, contactForm.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Analytics tracking
function trackConversion(event, data) {
    // Google Analytics 4 example
    if (typeof gtag !== 'undefined') {
        gtag('event', event, {
            event_category: 'consultation',
            event_label: data.service || 'unknown',
            value: 1
        });
    }
    
    // Simple localStorage tracking for demo
    const conversions = JSON.parse(localStorage.getItem('kirkbot2_conversions') || '[]');
    conversions.push({
        event,
        data: { ...data, timestamp: new Date().toISOString() }
    });
    localStorage.setItem('kirkbot2_conversions', JSON.stringify(conversions));
    
    console.log('Conversion tracked:', { event, data });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .portfolio-item, .testimonial, .pricing-card').forEach(el => {
    observer.observe(el);
});

// Performance optimization: Lazy load images
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in-up');
    }
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll performance
const optimizedScroll = debounce(() => {
    // Scroll-based optimizations
}, 10);

window.addEventListener('scroll', optimizedScroll);

// Service pricing calculator (optional feature)
function calculatePricing(serviceType, scope) {
    const pricing = {
        audit: {
            base: 50,
            max: 200,
            factors: {
                small: 1,
                medium: 1.5,
                large: 2.5,
                enterprise: 4
            }
        },
        optimization: {
            base: 200,
            max: 500,
            factors: {
                simple: 1,
                complex: 2,
                enterprise: 4
            }
        },
        monitoring: {
            base: 50,
            max: 200,
            monthly: true,
            factors: {
                basic: 1,
                advanced: 2,
                enterprise: 3.5
            }
        }
    };
    
    const service = pricing[serviceType];
    if (!service) return null;
    
    const factor = service.factors[scope] || 1;
    const price = Math.min(service.base * factor, service.max);
    
    return {
        price: Math.round(price),
        currency: 'USD',
        monthly: service.monthly || false,
        display: service.monthal ? `$${price}/month` : `$${price}`
    };
}

// FAQ functionality (if FAQ section is added later)
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', () => {
            const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
            
            // Close all other FAQs
            faqItems.forEach(otherItem => {
                const otherAnswer = otherItem.querySelector('.faq-answer');
                otherAnswer.style.maxHeight = '0px';
                otherItem.classList.remove('open');
            });
            
            // Toggle current FAQ
            if (!isOpen) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                item.classList.add('open');
            } else {
                answer.style.maxHeight = '0px';
                item.classList.remove('open');
            }
        });
    });
}

// Testimonial carousel (if needed)
function initTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    if (testimonials.length <= 1) return;
    
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    function nextTestimonial() {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }
    
    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);
    
    // Show first testimonial
    showTestimonial(0);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize components if they exist
    if (document.querySelector('.faq-item')) {
        initFAQ();
    }
    
    if (document.querySelector('.testimonial-carousel')) {
        initTestimonialCarousel();
    }
    
    // Add smooth reveal animations
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .testimonial, .pricing-card');
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });
});

// Error handling for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.textContent = 'Image unavailable';
        this.parentNode.insertBefore(placeholder, this.nextSibling);
    });
});

// Print-friendly styles
window.addEventListener('beforeprint', () => {
    document.body.classList.add('print-mode');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('print-mode');
});

console.log('KirkBot2 website initialized successfully! 🇺🇸');