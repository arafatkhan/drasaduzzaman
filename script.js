// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Remove preloader after page load
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Menu Toggle Functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Change icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // Close menu when clicking a link (mobile)
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon.classList.contains('fa-times')) {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
            }
        });
    });

    // Active nav links on scroll
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href').substring(1) === current) {
                li.classList.add('active');
            }
        });
    });

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // FAQ Toggle
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });

    // Testimonial Slider
    const testimonials = document.querySelectorAll('.testimonial-container');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;

    function showSlide(index) {
        testimonials.forEach((slide, i) => {
            if (i === index) {
                slide.style.display = 'block';
            } else {
                slide.style.display = 'none';
            }
        });
    }

    // Initialize slider
    if (testimonials.length > 0) {
        showSlide(currentSlide);

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', function() {
                currentSlide--;
                if (currentSlide < 0) {
                    currentSlide = testimonials.length - 1;
                }
                showSlide(currentSlide);
            });

            nextBtn.addEventListener('click', function() {
                currentSlide++;
                if (currentSlide >= testimonials.length) {
                    currentSlide = 0;
                }
                showSlide(currentSlide);
            });
        }

        // Auto-rotate testimonials
        setInterval(() => {
            currentSlide++;
            if (currentSlide >= testimonials.length) {
                currentSlide = 0;
            }
            showSlide(currentSlide);
        }, 5000);
    }

    // Form validation and submission handling
    const appointmentForm = document.getElementById('bookAppointment');
    const appointmentModal = document.getElementById('appointmentModal');
    const modalClose = document.querySelector('.modal-close');
    const modalBtn = document.querySelector('.modal-btn');

    // Form field validation
    function validateForm() {
        let isValid = true;
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const date = document.getElementById('date');
        const time = document.getElementById('time');
        
        // Reset previous error states
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            group.classList.remove('error');
            const errorMsg = group.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });

        // Validate name
        if (name.value.trim() === '') {
            showError(name, 'অনুগ্রহ করে আপনার নাম লিখুন');
            isValid = false;
        }

        // Validate phone (simple format check)
        if (phone.value.trim() === '') {
            showError(phone, 'অনুগ্রহ করে আপনার মোবাইল নম্বর লিখুন');
            isValid = false;
        } else if (!/^01[3-9]\d{8}$/.test(phone.value.trim())) {
            showError(phone, 'সঠিক মোবাইল নম্বর দিন (উদাহরণঃ 01712345678)');
            isValid = false;
        }

        // Validate date
        if (date.value === '') {
            showError(date, 'অনুগ্রহ করে তারিখ নির্বাচন করুন');
            isValid = false;
        } else {
            // Check if date is in the past
            const selectedDate = new Date(date.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showError(date, 'অতীত তারিখ নির্বাচন করা যাবে না');
                isValid = false;
            }
        }

        // Validate time
        if (time.value === '') {
            showError(time, 'অনুগ্রহ করে সময় নির্বাচন করুন');
            isValid = false;
        }

        return isValid;
    }

    // Show error message
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('error');
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        formGroup.appendChild(errorMessage);
    }

    // Add styles for error messages
    const style = document.createElement('style');
    style.textContent = `
        .form-group.error input, .form-group.error select, .form-group.error textarea {
            border-color: #e74c3c;
        }
        .error-message {
            color: #e74c3c;
            font-size: 14px;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);

    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            if (validateForm()) {
                // Collect form data
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    date: document.getElementById('date').value,
                    time: document.getElementById('time').value,
                    problem: document.getElementById('problem').value.trim()
                };
                
                // Here you would normally send the form data to the server
                console.log('Form data to be sent:', formData);
                
                // Show success modal
                appointmentModal.classList.add('active');
                
                // Reset form
                appointmentForm.reset();
            }
        });
    }

    // Close modal on close button click
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            appointmentModal.classList.remove('active');
        });
    }

    // Close modal on button click
    if (modalBtn) {
        modalBtn.addEventListener('click', function() {
            appointmentModal.classList.remove('active');
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === appointmentModal) {
            appointmentModal.classList.remove('active');
        }
    });

    // Sticky Navbar
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // Add animation to elements when they come into view
    const animateOnScroll = () => {
        const elementsToAnimate = document.querySelectorAll('.service-card, .timeline-content, .appointment-card, .contact-card');
        
        elementsToAnimate.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.transform = 'translateY(-5px)';
                element.style.opacity = '1';
            }
        });
    };

    // Set initial styles for elements to animate
    const setInitialStyles = () => {
        const elementsToAnimate = document.querySelectorAll('.service-card, .timeline-content, .appointment-card, .contact-card');
        
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    };

    setInitialStyles();
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once at load to check for elements in view
    
    // Setup date picker limits (today to 14 days in the future)
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const maxDate = new Date();
        maxDate.setDate(today.getDate() + 14);
        
        // Format dates as YYYY-MM-DD for the input
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        // Set min and max attributes
        dateInput.setAttribute('min', formatDate(today));
        dateInput.setAttribute('max', formatDate(maxDate));
    }
});