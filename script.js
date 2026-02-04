// Website Functionality for KirkBot2 AI Consulting

document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Initialize all components
    initializeNavigation();
    initializeScrollEffects();
    initializeContactForms();
    initializeBookingModal();
    initializeAnimations();
    initializeAnalytics();
    
    console.log('KirkBot2 Website Initialized Successfully');
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile navigation toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll animations and effects
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.service-card, .portfolio-item, .why-point').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Contact form handling
function initializeContactForms() {
    const quickContactForm = document.getElementById('quickContactForm');
    const consultationBooking = document.getElementById('consultationBooking');
    
    // Quick contact form
    if (quickContactForm) {
        quickContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmission(this);
        });
    }
    
    // Consultation booking form
    if (consultationBooking) {
        consultationBooking.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission(this);
        });
    }
}

function handleContactFormSubmission(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        service: formData.get('service'),
        message: formData.get('message'),
        timestamp: new Date().toISOString(),
        source: 'quick-contact-form'
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    // Process the form submission
    processContactSubmission(data)
        .then(response => {
            showFormSuccess(form, 'Message sent successfully! I\'ll get back to you within 24 hours.');
            form.reset();
            
            // Track conversion
            trackEvent('contact_form_submitted', {
                service: data.service,
                source: 'quick-contact'
            });
        })
        .catch(error => {
            showFormError(form, 'Sorry, there was an error sending your message. Please try again.');
            console.error('Form submission error:', error);
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

function handleBookingSubmission(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        service: formData.get('service'),
        preferredTime: formData.get('time'),
        timestamp: new Date().toISOString(),
        source: 'booking-modal'
    };
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Scheduling...';
    submitButton.disabled = true;
    
    // Process the booking
    processBookingSubmission(data)
        .then(response => {
            showFormSuccess(form, 'Consultation scheduled! You\'ll receive a confirmation email shortly.');
            form.reset();
            closeModal();
            
            // Track conversion
            trackEvent('consultation_booked', {
                service: data.service,
                preferredTime: data.preferredTime
            });
        })
        .catch(error => {
            showFormError(form, 'Sorry, there was an error scheduling your consultation. Please try again.');
            console.error('Booking error:', error);
        })
        .finally(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
}

// Process contact submission (sends to backend/CRM)
async function processContactSubmission(data) {
    // In a real implementation, this would send to your backend
    // For now, we'll simulate the submission and store locally
    console.log('Processing contact submission:', data);
    
    // Store submission in localStorage for demo purposes
    const submissions = JSON.parse(localStorage.getItem('kirkbot2_submissions') || '[]');
    submissions.push(data);
    localStorage.setItem('kirkbot2_submissions', JSON.stringify(submissions));
    
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ success: true, id: Date.now() });
        }, 1000);
    });
}

// Process booking submission
async function processBookingSubmission(data) {
    console.log('Processing booking submission:', data);
    
    // Store booking in localStorage for demo purposes
    const bookings = JSON.parse(localStorage.getItem('kirkbot2_bookings') || '[]');
    bookings.push(data);
    localStorage.setItem('kirkbot2_bookings', JSON.stringify(bookings));
    
    // Simulate calendar integration
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ 
                success: true, 
                bookingId: Date.now(),
                confirmationUrl: '#'
            });
        }, 1500);
    });
}

// Booking modal functionality
function initializeBookingModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    const bookingOptions = document.querySelectorAll('.booking-option');
    
    // Close modal handlers
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Booking option handlers
    bookingOptions.forEach(option => {
        option.addEventListener('click', function() {
            const timeSlot = this.getAttribute('onclick').match(/'([^']+)'/)[1];
            showBookingForm(timeSlot);
        });
    });
}

function openBooking(service = 'consultation') {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    
    // Pre-fill service if provided
    const serviceSelect = document.getElementById('bookingService');
    if (serviceSelect && service !== 'consultation') {
        serviceSelect.value = service;
    }
    
    // Track modal opening
    trackEvent('booking_modal_opened', { service: service });
}

function closeModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'none';
    
    // Reset form
    const bookingForm = document.getElementById('bookingForm');
    const bookingOptions = document.querySelector('.booking-options');
    
    if (bookingForm) bookingForm.style.display = 'none';
    if (bookingOptions) bookingOptions.style.display = 'grid';
}

function showBookingForm(timeSlot) {
    const bookingOptions = document.querySelector('.booking-options');
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingOptions) bookingOptions.style.display = 'none';
    if (bookingForm) bookingForm.style.display = 'block';
    
    // Store time slot preference
    localStorage.setItem('preferredTimeSlot', timeSlot);
}

// Form success/error handling
function showFormSuccess(form, message) {
    // Remove any existing alerts
    const existingAlert = form.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create success message
    const alert = document.createElement('div');
    alert.className = 'form-alert success';
    alert.textContent = message;
    alert.style.cssText = `
        background: #10b981;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        text-align: center;
    `;
    
    form.insertBefore(alert, form.firstChild);
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}

function showFormError(form, message) {
    // Remove any existing alerts
    const existingAlert = form.querySelector('.form-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create error message
    const alert = document.createElement('div');
    alert.className = 'form-alert error';
    alert.textContent = message;
    alert.style.cssText = `
        background: #ef4444;
        color: white;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 1rem;
        text-align: center;
    `;
    
    form.insertBefore(alert, form.firstChild);
    
    // Remove after 8 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.remove();
        }
    }, 8000);
}

// Animation system
function initializeAnimations() {
    // Animate numbers in stats
    const animateNumbers = () => {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseFloat(stat.textContent);
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format the number
                if (stat.textContent.includes('%')) {
                    stat.textContent = current.toFixed(0) + '%';
                } else if (stat.textContent.includes('x')) {
                    stat.textContent = current.toFixed(1) + 'x';
                } else {
                    stat.textContent = current.toFixed(0);
                }
            }, 16);
        });
    };
    
    // Trigger number animation when stats section is visible
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // Add hover effects to cards
    document.querySelectorAll('.service-card, .portfolio-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-5px) scale(1)';
        });
    });
}

// Analytics and tracking
function initializeAnalytics() {
    // Page view tracking
    trackEvent('page_view', {
        page: window.location.pathname,
        title: document.title,
        timestamp: new Date().toISOString()
    });
    
    // Track button clicks
    document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-service').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent('button_click', {
                button_text: buttonText,
                button_class: this.className,
                page: window.location.pathname
            });
        });
    });
    
    // Track service card interactions
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            const serviceTitle = this.querySelector('h3').textContent;
            trackEvent('service_card_interaction', {
                service: serviceTitle,
                page: window.location.pathname
            });
        });
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            
            // Track milestone scroll depths
            if (maxScroll === 25 || maxScroll === 50 || maxScroll === 75 || maxScroll === 90) {
                trackEvent('scroll_depth', {
                    depth: maxScroll,
                    page: window.location.pathname
                });
            }
        }
    });
    
    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            duration_seconds: timeOnPage,
            page: window.location.pathname
        });
    });
}

function trackEvent(eventName, data = {}) {
    // Enhanced analytics tracking
    const eventData = {
        event: eventName,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        ...data
    };
    
    // Store in localStorage for demo purposes
    const events = JSON.parse(localStorage.getItem('kirkbot2_analytics') || '[]');
    events.push(eventData);
    localStorage.setItem('kirkbot2_analytics', JSON.stringify(events));
    
    // In a real implementation, you would send this to your analytics service
    console.log('Analytics Event:', eventData);
    
    // You could also send to Google Analytics, Plausible, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, data);
    }
}

// Performance optimization
function optimizeImages() {
    // Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Service worker registration (for PWA functionality)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    optimizeImages();
    registerServiceWorker();
});

// Export functions for external use
window.KirkBot2Website = {
    openBooking,
    closeModal,
    trackEvent,
    processContactSubmission,
    processBookingSubmission
};