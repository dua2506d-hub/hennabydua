/**
 * HennaByDua - Luxury & Elegant Mehndi Artist Website
 * Vanilla JavaScript (script.js)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. STICKY NAVBAR & SCROLL DETECTOR
     ========================================================================== */
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header sticky styling
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('active');
      } else {
        backToTopBtn.classList.remove('active');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initial check

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION TOGGLE & DRAWER
     ========================================================================== */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function toggleMobileMenu() {
    if (!mobileToggle || !navMenu) return;
    const isOpen = navMenu.classList.contains('active');

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    if (mobileToggle) mobileToggle.classList.add('active');
    if (navMenu) navMenu.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileToggle) mobileToggle.classList.remove('active');
    if (navMenu) navMenu.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close mobile drawer when clicking nav links (except dropdown trigger)
  const navLinks = document.querySelectorAll('.nav-menu .nav-link:not(.dropdown-trigger)');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 991) {
        closeMobileMenu();
      }
    });
  });

  // Mobile dropdown toggle
  const dropdownTrigger = document.querySelector('.dropdown-trigger');
  const dropdownMenu = document.querySelector('.dropdown-menu');

  if (dropdownTrigger && dropdownMenu) {
    dropdownTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 991) {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
      }
    });
  }

  // Close drawer on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
      closeLightbox();
      closeSubmissionModal();
    }
  });

  /* ==========================================================================
     3. ACTIVE NAVIGATION HIGHLIGHTING
     ========================================================================== */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.nav-link, .dropdown-link');

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
      // If inside dropdown, also activate parent dropdown-trigger
      const parentItem = link.closest('.nav-item');
      if (parentItem) {
        const parentTrigger = parentItem.querySelector('.dropdown-trigger');
        if (parentTrigger) parentTrigger.classList.add('active');
      }
    }
  });

  /* ==========================================================================
     4. GALLERY CATEGORY FILTERS
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Toggle active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach(item => {
          const category = item.getAttribute('data-category');

          if (filterValue === 'all' || category === filterValue || (filterValue === 'bridal' && category.includes('bridal'))) {
            item.classList.remove('hide');
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.classList.add('hide');
          }
        });
      });
    });
  }

  /* ==========================================================================
     5. LIGHTBOX IMAGE PREVIEW
     ========================================================================== */
  const lightboxModal = document.querySelector('.lightbox-modal');
  let currentLightboxIndex = 0;
  let activeLightboxItems = [];

  function updateLightboxItems() {
    activeLightboxItems = Array.from(document.querySelectorAll('.gallery-item:not(.hide)'));
  }

  function openLightbox(index) {
    updateLightboxItems();
    if (activeLightboxItems.length === 0 || !lightboxModal) return;

    currentLightboxIndex = index;
    const item = activeLightboxItems[currentLightboxIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.querySelector('.gallery-title')?.textContent || 'Mehndi Design';
    const tag = item.querySelector('.gallery-category-tag')?.textContent || 'HennaByDua Art';

    const lightboxImg = lightboxModal.querySelector('.lightbox-img');
    const lightboxTitle = lightboxModal.querySelector('.lightbox-title');
    const lightboxDesc = lightboxModal.querySelector('.lightbox-desc');

    if (lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || title;
    }
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = tag;

    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function nextLightbox() {
    updateLightboxItems();
    if (activeLightboxItems.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex + 1) % activeLightboxItems.length;
    openLightbox(currentLightboxIndex);
  }

  function prevLightbox() {
    updateLightboxItems();
    if (activeLightboxItems.length === 0) return;
    currentLightboxIndex = (currentLightboxIndex - 1 + activeLightboxItems.length) % activeLightboxItems.length;
    openLightbox(currentLightboxIndex);
  }

  // Click on gallery items to open lightbox
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      updateLightboxItems();
      const itemIndex = activeLightboxItems.indexOf(item);
      if (itemIndex !== -1) {
        openLightbox(itemIndex);
      }
    });
  });

  if (lightboxModal) {
    const closeBtn = lightboxModal.querySelector('.lightbox-close');
    const nextBtn = lightboxModal.querySelector('.lightbox-next');
    const prevBtn = lightboxModal.querySelector('.lightbox-prev');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });

    // Click outside lightbox content to close
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    });
  }

  /* ==========================================================================
     6. BOOKING FORM VALIDATION & WHATSAPP INTEGRATION
     ========================================================================== */
  const bookingForm = document.getElementById('bookingForm');
  const whatsappQuickBtn = document.getElementById('whatsappBookingBtn');
  const submissionModal = document.getElementById('submissionModal');
  const closeSubmissionBtn = document.getElementById('closeSubmissionBtn');

  // Pre-fill service/package from URL params
  function handleUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const packageParam = urlParams.get('package');

    const serviceSelect = document.getElementById('mehndiService');
    if (serviceSelect) {
      if (serviceParam) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase().includes(serviceParam.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      } else if (packageParam) {
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.toLowerCase().includes(packageParam.toLowerCase())) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    }

    // Set minimum date to today for event date picker
    const dateInput = document.getElementById('eventDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.setAttribute('min', today);
    }
  }

  handleUrlParams();

  // Helper validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
    return cleaned.length >= 7 && /^\d+$/.test(cleaned);
  }

  function setFieldError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    field.classList.add('error');
    field.classList.remove('valid');
    const errSpan = group.querySelector('.error-msg');
    if (errSpan) errSpan.textContent = message;
  }

  function clearFieldError(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    field.classList.remove('error');
    field.classList.add('valid');
  }

  if (bookingForm) {
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const eventDateInput = document.getElementById('eventDate');
    const eventTypeInput = document.getElementById('eventType');
    const mehndiServiceInput = document.getElementById('mehndiService');
    const locationInput = document.getElementById('location');
    const messageInput = document.getElementById('message');
    const termsCheckbox = document.getElementById('termsCheck');

    // Real-time blur checks
    if (fullNameInput) {
      fullNameInput.addEventListener('blur', () => {
        if (!fullNameInput.value.trim()) {
          setFieldError(fullNameInput, 'Please enter your full name.');
        } else if (fullNameInput.value.trim().length < 2) {
          setFieldError(fullNameInput, 'Name must be at least 2 characters.');
        } else {
          clearFieldError(fullNameInput);
        }
      });
    }

    if (phoneInput) {
      phoneInput.addEventListener('blur', () => {
        if (!phoneInput.value.trim()) {
          setFieldError(phoneInput, 'Please enter your contact phone number.');
        } else if (!validatePhone(phoneInput.value.trim())) {
          setFieldError(phoneInput, 'Please enter a valid phone number (at least 7 digits).');
        } else {
          clearFieldError(phoneInput);
        }
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        if (!emailInput.value.trim()) {
          setFieldError(emailInput, 'Please enter your email address.');
        } else if (!validateEmail(emailInput.value.trim())) {
          setFieldError(emailInput, 'Please enter a valid email address.');
        } else {
          clearFieldError(emailInput);
        }
      });
    }

    if (eventDateInput) {
      eventDateInput.addEventListener('change', () => {
        if (!eventDateInput.value) {
          setFieldError(eventDateInput, 'Please choose your event date.');
        } else {
          clearFieldError(eventDateInput);
        }
      });
    }

    if (mehndiServiceInput) {
      mehndiServiceInput.addEventListener('change', () => {
        if (!mehndiServiceInput.value) {
          setFieldError(mehndiServiceInput, 'Please select a mehndi service or package.');
        } else {
          clearFieldError(mehndiServiceInput);
        }
      });
    }

    // Form submission
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      if (!fullNameInput.value.trim() || fullNameInput.value.trim().length < 2) {
        setFieldError(fullNameInput, 'Please enter your full name.');
        isValid = false;
      } else {
        clearFieldError(fullNameInput);
      }

      if (!phoneInput.value.trim() || !validatePhone(phoneInput.value.trim())) {
        setFieldError(phoneInput, 'Please enter a valid phone number.');
        isValid = false;
      } else {
        clearFieldError(phoneInput);
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
        setFieldError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        clearFieldError(emailInput);
      }

      if (!eventDateInput.value) {
        setFieldError(eventDateInput, 'Please choose your event date.');
        isValid = false;
      } else {
        clearFieldError(eventDateInput);
      }

      if (!mehndiServiceInput.value) {
        setFieldError(mehndiServiceInput, 'Please select a mehndi service or package.');
        isValid = false;
      } else {
        clearFieldError(mehndiServiceInput);
      }

      if (termsCheckbox && !termsCheckbox.checked) {
        alert('Please review and accept our booking policy and henna care guidelines to proceed.');
        isValid = false;
      }

      if (isValid) {
        // Populate modal data
        const summaryName = document.getElementById('summaryName');
        const summaryService = document.getElementById('summaryService');
        const summaryDate = document.getElementById('summaryDate');

        if (summaryName) summaryName.textContent = fullNameInput.value.trim();
        if (summaryService) summaryService.textContent = mehndiServiceInput.options[mehndiServiceInput.selectedIndex].text;
        if (summaryDate) summaryDate.textContent = eventDateInput.value;

        if (submissionModal) {
          submissionModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }

        bookingForm.reset();
      } else {
        // Scroll to first error
        const firstError = bookingForm.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  function closeSubmissionModal() {
    if (submissionModal) {
      submissionModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (closeSubmissionBtn) {
    closeSubmissionBtn.addEventListener('click', closeSubmissionModal);
  }

  // Quick WhatsApp Booking Button
  function triggerWhatsAppBooking() {
    const fullName = document.getElementById('fullName')?.value.trim() || '';
    const phone = document.getElementById('phone')?.value.trim() || '';
    const eventDate = document.getElementById('eventDate')?.value || '';
    const eventType = document.getElementById('eventType')?.value || '';
    const mehndiService = document.getElementById('mehndiService')?.value || '';
    const location = document.getElementById('location')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';

    let text = 'Hello HennaByDua! ✨ I would like to inquire about booking an appointment.';

    if (fullName) text += `\n\n*Name:* ${fullName}`;
    if (phone) text += `\n*Phone:* ${phone}`;
    if (eventDate) text += `\n*Event Date:* ${eventDate}`;
    if (eventType) text += `\n*Event Type:* ${eventType}`;
    if (mehndiService) text += `\n*Service Requested:* ${mehndiService}`;
    if (location) text += `\n*Location:* ${location}`;
    if (message) text += `\n*Notes/Details:* ${message}`;

    text += '\n\nPlease let me know your availability and booking process. Thank you!';

    // Placeholder editable phone number for HennaByDua
    const whatsappNumber = '12345678900';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

  if (whatsappQuickBtn) {
    whatsappQuickBtn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerWhatsAppBooking();
    });
  }

  // Any other WhatsApp booking buttons on home/services pages
  const allWhatsAppTriggers = document.querySelectorAll('.btn-whatsapp-trigger');
  allWhatsAppTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerWhatsAppBooking();
    });
  });

  /* ==========================================================================
     7. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const content = otherItem.querySelector('.faq-content');
          if (content) content.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove('active');
        const content = item.querySelector('.faq-content');
        if (content) content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        const content = item.querySelector('.faq-content');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  /* ==========================================================================
     8. SCROLL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if browser doesn't support IntersectionObserver
    animatedElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     9. NEWSLETTER SUBSCRIPTION FEEDBACK
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && validateEmail(input.value.trim())) {
        alert('Thank you for subscribing to HennaByDua Bridal Stories & Care Guides! ✨');
        input.value = '';
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }

});
