/**
 * script.js — Pranav Khankriyal Portfolio
 * Features: mobile menu, scroll effects, blog filtering, entrance animations
 */

(function () {
  'use strict';

  /* --------------------------------------------------------
     THEME TOGGLE — dark ↔ light, persisted in localStorage
  -------------------------------------------------------- */
  const THEME_KEY = 'pk-theme';
  const htmlEl    = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      htmlEl.setAttribute('data-theme', 'dark');
    } else {
      htmlEl.removeAttribute('data-theme');
    }
    // Update every toggle button on the page
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title',       theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // Apply saved theme immediately (before paint); default is light
  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);

  // Wire up toggle button(s)
  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle')) {
      const current = htmlEl.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next    = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    }
  });

  /* --------------------------------------------------------
     NAVBAR: scroll class + mobile toggle
  -------------------------------------------------------- */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  // Scroll shadow
  function handleScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
    });

    // Close menu when a nav link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------------
     CONTACT BUTTON — smooth scroll to footer
  -------------------------------------------------------- */
  const contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function () {
      const footer = document.getElementById('footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* --------------------------------------------------------
     SMOOTH SCROLL for anchor links
  -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-h')) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------
     BLOG FILTER (blogs.html only)
  -------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards  = document.querySelectorAll('.blog-card');
  const emptyState = document.getElementById('emptyState');

  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const filter = this.dataset.filter;

        // Update active state
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');

        // Filter cards
        let visible = 0;
        blogCards.forEach(function (card) {
          const match = filter === 'all' || card.dataset.category === filter;
          if (match) {
            card.style.display = '';
            card.style.animation = 'fadeUp 0.4s ease both';
            visible++;
          } else {
            card.style.display = 'none';
          }
        });

        // Empty state
        if (emptyState) {
          emptyState.style.display = visible === 0 ? 'block' : 'none';
        }
      });
    });
  }

  /* --------------------------------------------------------
     INTERSECTION OBSERVER — entrance animations
  -------------------------------------------------------- */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add CSS for observed elements (injected once)
  const style = document.createElement('style');
  style.textContent = `
    .observe-fade {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.55s cubic-bezier(0.4,0,0.2,1),
                  transform 0.55s cubic-bezier(0.4,0,0.2,1);
    }
    .observe-fade.in-view {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  // Observe cards, sections, blocks
  const animatables = document.querySelectorAll(
    '.service-card, .blog-card, .stat-item, .about-block, .interest-item, .cta-inner'
  );

  animatables.forEach(function (el, i) {
    el.classList.add('observe-fade');
    el.style.transitionDelay = (i % 4) * 0.07 + 's';
    observer.observe(el);
  });

  /* --------------------------------------------------------
     PROFILE IMAGE FALLBACK (ensure placeholder shows)
  -------------------------------------------------------- */
  document.querySelectorAll('.profile-img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      const placeholder = this.nextElementSibling;
      if (placeholder) placeholder.style.display = 'flex';
    });
  });

  /* --------------------------------------------------------
     HOVER TILT on hero profile ring (subtle)
  -------------------------------------------------------- */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', function (e) {
      const rect   = this.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const ring   = this.querySelector('.profile-ring');
      if (ring) {
        ring.style.transform = `perspective(600px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
        ring.style.transition = 'transform 0.15s ease';
      }
    });

    heroVisual.addEventListener('mouseleave', function () {
      const ring = this.querySelector('.profile-ring');
      if (ring) {
        ring.style.transform = '';
        ring.style.transition = 'transform 0.5s ease';
      }
    });
  }

})();
