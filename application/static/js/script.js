// script.js – TajanApplication Landing Page
(function() {
  'use strict';

  // ============================================
  // CUSTOMIZABLE LINKS - EDIT THESE VALUES
  // ============================================
  const LINKS = {
    // Footer social/donation links
    footerBale: '/Iranian_messenger',        
    footerDonationLink: 'https://daramet.com/AliZiro',    
    footerGitHubLink :'https://github.com/Aliziro2201',
    footerTelegramLink : 'https://t.me/TajanSecurity'
  };
  // ============================================

  // Apply footer links
  function applyFooterLinks() {
    const footerBaleLink = document.getElementById('footerBaleLink');
    const footerDonationLink = document.getElementById('footerDonationLink');
    const footerGitHubLink = document.getElementById('footerGitHubLink');
    const footerTelegramLink = document.getElementById('footerTelegramLink');
    
    if (footerBaleLink) footerBaleLink.setAttribute('href', LINKS.footerBale);
    if (footerGitHubLink) footerGitHubLink.setAttribute('href', LINKS.footerGitHubLink);
    if (footerDonationLink) footerDonationLink.setAttribute('href', LINKS.footerDonationLink);
    if (footerTelegramLink) footerTelegramLink.setAttribute('href', LINKS.footerTelegramLink);
  }

  // Navbar scroll effect
  function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  // Mobile menu toggle
  function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      menuToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
      }
    });
  }

  // Smooth scroll for anchor links
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
      anchor.addEventListener('click', function(event) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      });
    });
  }

  // Intersection Observer for scroll animations
  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Animate score bars when they become visible
          if (entry.target.classList.contains('why-us-visual')) {
            animateScoreBars();
          }
        }
      });
    }, observerOptions);

    // Observe feature cards
    document.querySelectorAll('.feature-card').forEach(function(card) {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
      
      // Add visible class handler
      card.addEventListener('transitionend', function() {
        // Cleanup
      });
    });

    // Observe why-us visual
    const whyUsVisual = document.querySelector('.why-us-visual');
    if (whyUsVisual) {
      observer.observe(whyUsVisual);
    }

    // Observe mockup
    const mockup = document.querySelector('.showcase-mockup');
    if (mockup) {
      mockup.style.opacity = '0';
      mockup.style.transform = 'translateY(30px)';
      mockup.style.transition = 'opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s';
      observer.observe(mockup);
    }

    // Global visible class handler
    document.addEventListener('scroll', function() {
      document.querySelectorAll('.feature-card, .showcase-mockup').forEach(function(el) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.85) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    });
  }

  // Animate score bars
  function animateScoreBars() {
    const scoreFills = document.querySelectorAll('.score-fill');
    scoreFills.forEach(function(fill) {
      const targetWidth = fill.style.width;
      fill.style.width = '0%';
      setTimeout(function() {
        fill.style.width = targetWidth;
      }, 200);
    });
  }

  // Parallax effect for hero shapes
  function setupParallax() {
    const shapes = document.querySelectorAll('.hero-shape');
    if (shapes.length === 0) return;

    window.addEventListener('mousemove', function(event) {
      const mouseX = event.clientX / window.innerWidth;
      const mouseY = event.clientY / window.innerHeight;

      shapes.forEach(function(shape, index) {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
      });
    });
  }

  // Initialize everything
  function init() {
    applyFooterLinks();
    handleNavbarScroll();
    setupMobileMenu();
    setupSmoothScroll();
    setupScrollAnimations();
    setupParallax();
    
    // Trigger initial scroll check
    window.dispatchEvent(new Event('scroll'));
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();