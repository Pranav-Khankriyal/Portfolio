/**
 * script.js — Pranav Khankriyal Portfolio v3
 * Premium tech interactions:
 *   Page loader, theme toggle, scroll reveals, card spotlights,
 *   magnetic buttons, parallax orbs, marquee, navbar effects
 */

(function () {
  'use strict';

  /* --------------------------------------------------------
     PAGE LOADER
  -------------------------------------------------------- */
  var loader = document.getElementById('pageLoader');
  if (loader) {
    window.addEventListener('load', function () {
      setTimeout(function () { loader.classList.add('loaded'); }, 900);
    });
    setTimeout(function () { if (loader) loader.classList.add('loaded'); }, 2200);
  }

  /* --------------------------------------------------------
     THEME TOGGLE — dark default
  -------------------------------------------------------- */
  var THEME_KEY = 'pk-theme';
  var htmlEl = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'light') {
      htmlEl.setAttribute('data-theme', 'light');
    } else {
      htmlEl.removeAttribute('data-theme');
    }
    document.querySelectorAll('.theme-toggle').forEach(function (btn) {
      btn.textContent = theme === 'light' ? '🌙' : '☀️';
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  applyTheme(localStorage.getItem(THEME_KEY) || 'dark');

  document.addEventListener('click', function (e) {
    if (e.target.closest('.theme-toggle')) {
      var current = htmlEl.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      var next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    }
  });

  /* --------------------------------------------------------
     NAVBAR: scroll class + mobile toggle
  -------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen.toString());
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('click', function (e) {
      if (navbar && !navbar.contains(e.target)) {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* --------------------------------------------------------
     CONTACT BUTTON — scroll to footer
  -------------------------------------------------------- */
  var contactBtn = document.getElementById('contactBtn');
  if (contactBtn) {
    contactBtn.addEventListener('click', function () {
      var footer = document.getElementById('footer');
      if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* --------------------------------------------------------
     SMOOTH SCROLL for anchor links
  -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href').slice(1);
      var target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  /* --------------------------------------------------------
     BLOG FILTER (blogs.html only)
  -------------------------------------------------------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var blogCards = document.querySelectorAll('.blog-card');
  var emptyState = document.getElementById('emptyState');

  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var filter = this.dataset.filter;
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        this.classList.add('active');
        var visible = 0;
        blogCards.forEach(function (card) {
          var match = filter === 'all' || card.dataset.category === filter;
          if (match) { card.style.display = ''; card.style.animation = 'fadeUp 0.4s ease both'; visible++; }
          else { card.style.display = 'none'; }
        });
        if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
      });
    });
  }

  /* --------------------------------------------------------
     SCROLL REVEAL — IntersectionObserver
  -------------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }

  /* Legacy observe-fade for about/blog detail pages */
  var legacyEls = document.querySelectorAll(
    '.service-card, .blog-card, .stat-item, .about-block, .interest-item, .cta-inner, .experience-card'
  );
  if (legacyEls.length) {
    var legacyObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          legacyObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
    legacyEls.forEach(function (el, i) {
      el.classList.add('observe-fade');
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      legacyObs.observe(el);
    });
  }

  /* --------------------------------------------------------
     BENTO CARD SPOTLIGHT — glow follows cursor
  -------------------------------------------------------- */
  document.querySelectorAll('.bento-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left - 125;
      var y = e.clientY - rect.top - 125;
      var glow = this.querySelector('.bento-card-glow');
      if (glow) {
        glow.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      }
    });
  });

  /* --------------------------------------------------------
     MAGNETIC BUTTONS — subtle cursor follow
  -------------------------------------------------------- */
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var dx = (x - cx) / cx;
      var dy = (y - cy) / cy;
      this.style.transform = 'translate(' + (dx * 4) + 'px, ' + (dy * 3) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = '';
    });
  });

  /* --------------------------------------------------------
     PROFILE IMAGE FALLBACK
  -------------------------------------------------------- */
  document.querySelectorAll('.profile-img').forEach(function (img) {
    img.addEventListener('error', function () {
      this.style.display = 'none';
      var ph = this.nextElementSibling;
      if (ph) ph.style.display = 'flex';
    });
  });

  /* --------------------------------------------------------
     HERO TILT on profile ring (about page)
  -------------------------------------------------------- */
  var heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    heroVisual.addEventListener('mousemove', function (e) {
      var rect = this.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = (e.clientX - cx) / (rect.width / 2);
      var dy = (e.clientY - cy) / (rect.height / 2);
      var ring = this.querySelector('.profile-ring');
      if (ring) {
        ring.style.transform = 'perspective(600px) rotateY(' + (dx * 8) + 'deg) rotateX(' + (-dy * 8) + 'deg)';
        ring.style.transition = 'transform 0.1s ease';
      }
    });
    heroVisual.addEventListener('mouseleave', function () {
      var ring = this.querySelector('.profile-ring');
      if (ring) { ring.style.transform = ''; ring.style.transition = 'transform 0.5s ease'; }
    });
  }

  /* --------------------------------------------------------
     PARALLAX GRID — subtle scroll movement
  -------------------------------------------------------- */
  var grid = document.querySelector('.hero-grid-bg');
  if (grid) {
    window.addEventListener('scroll', function () {
      grid.style.transform = 'translateY(' + (window.scrollY * 0.25) + 'px)';
    }, { passive: true });
  }

  /* --------------------------------------------------------
     SCROLL CUE — fade out on scroll
  -------------------------------------------------------- */
  var scrollCue = document.querySelector('.scroll-cue');
  if (scrollCue) {
    window.addEventListener('scroll', function () {
      scrollCue.style.opacity = window.scrollY > 100 ? '0' : '';
      scrollCue.style.pointerEvents = window.scrollY > 100 ? 'none' : '';
    }, { passive: true });
  }

})();
