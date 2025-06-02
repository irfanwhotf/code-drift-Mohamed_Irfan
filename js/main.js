document.addEventListener('DOMContentLoaded', () => {
    // Initialize all the components
    initializeNavigation();
    initializeTestimonialSlider();
    initializeScrollEffects();
    animateOnScroll();
});

/**
 * Handles navigation menu functionality including:
 * - Mobile menu toggle
 * - Smooth scrolling for navigation links
 * - Header styling on scroll
 */
function initializeNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('header');

    // Toggle mobile menu
    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle navigation
            nav.classList.toggle('active');
            burger.classList.toggle('active');

            // Animate links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                burger.classList.remove('active');
                
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });

    // Change header style on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Add active class to nav links based on current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage === '' && link.getAttribute('href') === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Initializes the testimonial slider with:
 * - Auto-sliding functionality
 * - Manual navigation (prev/next buttons and dots)
 */
function initializeTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000;

    // Function to move to a specific slide
    const goToSlide = (index) => {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide and dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    };

    // Next slide function
    const nextSlide = () => {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    };

    // Previous slide function
    const prevSlide = () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    };

    // Auto slide
    const startSlideInterval = () => {
        slideInterval = setInterval(nextSlide, intervalTime);
    };

    // Event listeners for navigation
    if (prevBtn) prevBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        prevSlide();
        startSlideInterval();
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        clearInterval(slideInterval);
        nextSlide();
        startSlideInterval();
    });

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            goToSlide(index);
            startSlideInterval();
        });
    });

    // Start the auto slide
    startSlideInterval();
}

/**
 * Initializes scroll-related effects:
 * - Smooth scrolling for anchor links
 * - Back-to-top button visibility
 */
function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add back-to-top button functionality if it exists
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Animates elements when they come into view while scrolling
 */
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!animatedElements.length) return;

    const elementInView = (el, percentageScroll = 100) => {
        const elementTop = el.getBoundingClientRect().top;
        return (
            elementTop <= 
            ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100))
        );
    };

    const displayScrollElement = (element) => {
        element.classList.add('scrolled');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('scrolled');
    };

    const handleScrollAnimation = () => {
        animatedElements.forEach((el) => {
            if (elementInView(el, 85)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        handleScrollAnimation();
    });

    // Initialize on page load
    handleScrollAnimation();
}

/**
 * Form validation for contact forms
 * @param {HTMLFormElement} form - The form element to validate
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea');
    let isValid = true;

    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            markInvalid(input, 'This field is required');
            isValid = false;
        } else if (input.type === 'email' && input.value && !isValidEmail(input.value)) {
            markInvalid(input, 'Please enter a valid email address');
            isValid = false;
        } else {
            markValid(input);
        }
    });

    return isValid;
}

/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Marks a form field as invalid
 * @param {HTMLElement} element - The input element to mark
 * @param {string} message - The error message
 */
function markInvalid(element, message) {
    element.classList.add('invalid');
    element.classList.remove('valid');
    
    // Find or create error message element
    let errorElement = element.parentNode.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        element.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

/**
 * Marks a form field as valid
 * @param {HTMLElement} element - The input element to mark
 */
function markValid(element) {
    element.classList.remove('invalid');
    element.classList.add('valid');
    
    // Remove error message if it exists
    const errorElement = element.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * Toggles visibility of the portfolio filter categories
 * @param {string} category - The category to filter by, or 'all'
 */
function filterPortfolio(category) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Update active button state
    filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Filter items
    portfolioItems.forEach(item => {
        if (category === 'all' || item.classList.contains(category)) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
            }, 50);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
}

// Export functions for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeNavigation,
        initializeTestimonialSlider,
        initializeScrollEffects,
        animateOnScroll,
        validateForm,
        isValidEmail,
        filterPortfolio
    };
}
